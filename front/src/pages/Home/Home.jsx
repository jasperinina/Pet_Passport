import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Menu from "../../components/menu/Menu";
import PetCard from "../../components/ui/PetCard/PetCard";
import Procedures from "../../components/ui/Procedures/Procedures";
import ModalOverlay from "../../components/modal_overlay/ModalOverlay";

import { getPet } from "../../api/pets";
import { getEvents } from "../../api/events";
import NotificationService from "../../services/notificationService";
import { ERROR_MESSAGES } from "../../constants/config";
import { EVENT_STATUSES } from "../../constants/eventConstants";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.search || "";

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddProcedureModalOpen, setIsAddProcedureModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const getPetIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || params.get("Id");
  };

  const loadPet = async () => {
    const petId = getPetIdFromUrl();

    if (!petId) {
      NotificationService.showError?.(
        "ID питомца не указан в URL",
        ERROR_MESSAGES.ERROR_TITLE
      );
      // setError("ID питомца не указан в URL");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const petData = await getPet(parseInt(petId, 10));
      setPet(petData);
    } catch (err) {
      setError(err.message || "Ошибка загрузки данных о питомце");
    } finally {
      setLoading(false);
    }
  };

  const loadUpcomingEvents = async () => {
    const petId = getPetIdFromUrl();
    if (!petId) return;

    try {
      const events = await getEvents(parseInt(petId, 10), EVENT_STATUSES.UPCOMING);
      setUpcomingEvents(events.slice(0, 3));
    } catch (err) {
      setUpcomingEvents([]);
    }
  };

  useEffect(() => {
    loadPet();
    loadUpcomingEvents();
  }, []);

  const handleProcedureAdded = () => loadUpcomingEvents();

  const handleUpdateSuccess = () => {
    loadPet();
    window.dispatchEvent(new CustomEvent("petUpdated"));
  };

  if (!isAddProcedureModalOpen || !isEditModalOpen) {
    document.documentElement.classList.remove("modal-open");
  }

  // состояния загрузки / ошибки
  if (loading) {
    return (
      <section className="main-page">
        <div className="container">
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p className="txt1">Загрузка данных о питомце.</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="main-page">
        <div className="container">
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p className="txt1" style={{ color: "var(--error, #d32f2f)" }}>
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!pet) {
    return null;
  }

  //? Как открывается ProcedureDetailsModal?
  return (
    <div>
      <section className="section container">
        <PetCard
          setIsAddProcedureModalOpen={setIsAddProcedureModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          pet={pet}
        />
      </section>

      <section className="container">
        <Menu />
      </section>

      <section className="section container">
        <header className="section__header">
          <h2 className="section__title h1">Предстоящие процедуры</h2>
          <button
            className="section__action hidden-mobile"
            type="button"
            onClick={() => navigate(`/upcoming${search}`)}
          >
            Посмотреть все
          </button>
        </header>
        <Procedures
          upcomingEvents={upcomingEvents}
          navigate={navigate}
          search={search}
        />
        <button
          className="section__action visible-mobile"
          type="button"
          onClick={() => navigate(`/upcoming${search}`)}
        >
          Посмотреть все
        </button>
      </section>

      {/* <ProcedureDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        event={selectedEvent}
      /> */}

      <ModalOverlay
        modalName="AddProcedureModal"
        isOpen={isAddProcedureModalOpen}
        onClose={() => setIsAddProcedureModalOpen(false)}
        petId={pet?.id}
        onSuccess={handleProcedureAdded}
      />
      <ModalOverlay
        modalName="EditPetModal"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        pet={pet}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default Home;