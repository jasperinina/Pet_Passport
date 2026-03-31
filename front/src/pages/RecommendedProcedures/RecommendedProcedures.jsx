import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Menu from "../../components/menu/Menu";
import Procedures from "../../components/ui/Procedures/Procedures";
import ModalOverlay from "../../components/modal_overlay/ModalOverlay";
import LoadingState from "../../components/events/LoadingState/LoadingState";

import { getEventTemplates } from "../../api/events";

const RecommendedProcedures = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.search || "";
  const urlParams = new URLSearchParams(location.search);
  const petId = urlParams.get("id") || urlParams.get("Id");

  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddProcedureModalOpen, setIsAddProcedureModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    if (petId) {
      setLoading(true);
      getEventTemplates()
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
      getEventTemplates()
        .then((events) => {
          setProcedures(events);
        })
        .catch((err) => {
          console.error("Ошибка загрузки процедур:", err);
        });
    }
  };

  const handleRecommendationClick = (event) => {
    setEditingEvent(event);
    setIsAddProcedureModalOpen(true);
  };

  if (!isAddProcedureModalOpen) {
    document.documentElement.classList.remove("modal-open");
  }

  if (loading) {
    return (
      <section className="section container">
        <LoadingState message="Загрузка процедур..." />
      </section>
    );
  }

  return (
    <div>
      <div className="container">
        <Menu />
      </div>

      <section className="section container">
        <header className="section__header section__header--filled">
          <h2 className="section__title h1">Рекомендуемые процедуры</h2>
          <div className="section__actions">
            <button
              className="button button--outlined"
              type="button"
              disabled={loading}
              onClick={() => navigate(-1)}
            >
              Назад
            </button>
          </div>
        </header>

        <Procedures
          events={procedures}
          navigate={navigate}
          search={search}
          message="Для вас сейчас нет рекомендаций"
          isNotificationImageHidden={true}
          isRecommendation={true}
          onRecommendationClick={handleRecommendationClick}
        />
      </section>

      <ModalOverlay
        modalName="AddProcedureModal"
        isOpen={isAddProcedureModalOpen}
        onClose={() => setIsAddProcedureModalOpen(false)}
        petId={petId ? parseInt(petId, 10) : null}
        onSuccess={handleProcedureAdded}
        event={editingEvent}
      />
    </div>
  );
};

export default RecommendedProcedures;