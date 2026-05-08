import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import PetCard from "../../components/ui/PetCard/PetCard";
import Procedures from "../../components/ui/Procedures/Procedures";
import ModalOverlay from "../../components/modal_overlay/ModalOverlay";
import AddProcedureModal from "../../components/ui/modals/AddProcedureModal/AddProcedureModal";
import EditPetModal from "../../components/ui/modals/EditPetModal/EditPetModal";

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

  const getPetIdFromUrl = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return params.get("id") || params.get("Id");
  }, [location.search]);

  const loadPet = useCallback(async ({ showLoading = true } = {}) => {
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
      if (showLoading) {
        setLoading(true);
      }

      const petData = await getPet(parseInt(petId, 10));
      setPet(petData);
    } catch (err) {
      NotificationService.showError?.(
        err.message || "Ошибка загрузки данных о питомце",
        ERROR_MESSAGES.ERROR_TITLE
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [getPetIdFromUrl]);

  const loadUpcomingEvents = useCallback(async () => {
    const petId = getPetIdFromUrl();
    if (!petId) return;

    try {
      const events = await getEvents(parseInt(petId, 10), [EVENT_STATUSES.UPCOMING]);
      setUpcomingEvents(events.slice(0, 3));
    } catch {
      setUpcomingEvents([]);
    }
  }, [getPetIdFromUrl]);

  useEffect(() => {
    queueMicrotask(() => {
      loadPet();
      loadUpcomingEvents();
    });
  }, [loadPet, loadUpcomingEvents]);

  const handleProcedureAdded = () => loadUpcomingEvents();

  const handleUpdateSuccess = () => {
    loadPet({ showLoading: false });
    window.dispatchEvent(new CustomEvent("petUpdated"));
  };

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

  return (
    <div>
      <section className="section container">
        <PetCard
          setIsAddProcedureModalOpen={setIsAddProcedureModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          pet={pet}
        />
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

      <ModalOverlay
        isOpen={isAddProcedureModalOpen}
        onClose={() => setIsAddProcedureModalOpen(false)}
      >
        {({ isOpen, isClosing, onClose }) => (
          <AddProcedureModal
            isOpen={isOpen}
            onClose={onClose}
            isClosing={isClosing}
            petId={pet?.id}
            onSuccess={handleProcedureAdded}
          />
        )}
      </ModalOverlay>
      <ModalOverlay
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      >
        {({ isOpen, isClosing, onClose }) => (
          <EditPetModal
            isOpen={isOpen}
            onClose={onClose}
            isClosing={isClosing}
            pet={pet}
            onSuccess={handleUpdateSuccess}
          />
        )}
      </ModalOverlay>
    </div>
  );
};

export default Home;
