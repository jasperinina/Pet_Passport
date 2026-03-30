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
import LoadingState from "../../components/events/LoadingState/LoadingState";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.search || "";

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddProcedureModalOpen, setIsAddProcedureModalOpen] = useState(false);

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

      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const petData = await getPet(parseInt(petId, 10));
      setPet(petData);
    } catch (err) {
      NotificationService.showError?.(
        err.message || "Ошибка загрузки данных о питомце",
        ERROR_MESSAGES.ERROR_TITLE
      );
    } finally {
      setLoading(false);
    }
  };

  const loadUpcomingEvents = async () => {
    const petId = getPetIdFromUrl();
    if (!petId) return;

    try {
      const events = await getEvents(parseInt(petId, 10), [EVENT_STATUSES.UPCOMING]);
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

  if (loading) {
    return (
      <section className="section container">
        <LoadingState message="Загрузка данных питомца..." />
      </section>
    );
  }

  if (!pet) {
    return null;
  }

  // TODO: Как открывается ProcedureDetailsModal?
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
          <div className="section__actions">
            <button
              className="section__action hidden-mobile"
              type="button"
              onClick={() => navigate(`/upcoming${search}`)}
            >
              Посмотреть все
            </button>
            <button
              className="section__action hidden-mobile"
              type="button"
              onClick={() => navigate(`/recommendations${search}`)}
            >
              Рекомендации
            </button>
          </div>
        </header>
        <Procedures
          events={upcomingEvents}
          navigate={navigate}
          search={search}
          message="Нет предстоящих процедур"
        />
        <div className="section__actions section__actions--rows section__actions--margin">
          <button
            className="section__action visible-mobile"
            type="button"
            onClick={() => navigate(`/upcoming${search}`)}
          >
            Посмотреть все
          </button>
          <button
            className="button button--outlined visible-mobile"
            type="button"
            onClick={() => navigate(`/recommendations${search}`)}
          >
            Рекомендации
          </button>
        </div>
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