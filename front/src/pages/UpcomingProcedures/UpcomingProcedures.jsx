import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ModalOverlay from "../../components/modal_overlay/ModalOverlay";
import Procedures from "../../components/ui/Procedures/Procedures";
import LoadingState from "../../components/events/LoadingState/LoadingState";
import AddProcedureModal from "../../components/ui/modals/AddProcedureModal/AddProcedureModal";

import PlusIcon from "../../assets/icons/plus.svg?react";

import { getEvents } from "../../api/events";
import NotificationService from "../../services/notificationService";
import { ERROR_MESSAGES } from "../../constants/config";
import { EVENT_STATUSES } from "../../constants/eventConstants";
import MobileButton from "../../components/mobile_button/MobileButton";

const UpcomingProcedures = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.search || "";
  const urlParams = new URLSearchParams(location.search);
  const petId = urlParams.get("id") || urlParams.get("Id");

  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddProcedureModalOpen, setIsAddProcedureModalOpen] = useState(false);

  useEffect(() => {
    if (petId) {
      setLoading(true);
      getEvents(parseInt(petId, 10), [EVENT_STATUSES.UPCOMING])
        .then((events) => {
          setProcedures(events);
        })
        .catch((err) => {
          setProcedures([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      NotificationService.showError?.(
        ERROR_MESSAGES.PET.NO_ID,
        ERROR_MESSAGES.ERROR_TITLE
      );
    }
  }, [petId]);

  const handleProcedureAdded = () => {
    if (petId) {
      getEvents(parseInt(petId, 10), [EVENT_STATUSES.UPCOMING])
        .then((events) => {
          setProcedures(events);
        })
        .catch((err) => {
          console.error("Ошибка загрузки процедур:", err);
        });
    }
  };

  if (loading) {
    return (
      <section className="section container">
        <LoadingState message="Загрузка процедур..." />
      </section>
    );
  }

  return (
    <div>
      <section className="section container">
        <header className="section__header section__header--filled">
          <h2 className="section__title h1">Предстоящие процедуры</h2>
          <div className="section__actions">
            <button
              className="button button--filled hidden-mobile"
              type="button"
              onClick={() => setIsAddProcedureModalOpen(true)}
            >
              Добавить
            </button>
            <button
              className="button button--outlined"
              type="button"
              onClick={() => navigate(`/recommendations${search}`)}
            >
              Рекомендации
            </button> 
          </div>
        </header>
        <Procedures
          events={procedures}
          navigate={navigate}
          search={search}
          message="Нет предстоящих процедур"
        />
      <MobileButton
        color="dark"
        fixed
        icon={<PlusIcon />}
        ariaLabel="Добавить процедуру"
        onClick={() => setIsAddProcedureModalOpen(true)}
      />
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
            petId={petId ? parseInt(petId, 10) : null}
            onSuccess={handleProcedureAdded}
          />
        )}
      </ModalOverlay>
    </div>
  );
};

export default UpcomingProcedures;
