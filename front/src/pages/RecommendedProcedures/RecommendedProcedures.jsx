import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Procedures from "../../components/ui/Procedures/Procedures";
import ModalOverlay from "../../components/modal_overlay/ModalOverlay";
import LoadingState from "../../components/events/LoadingState/LoadingState";
import AddProcedureModal from "../../components/ui/modals/AddProcedureModal/AddProcedureModal";

import { getEventTemplates } from "../../api/events";
import { useProceduresLoader } from "../../hooks/useProceduresLoader";

const RecommendedProcedures = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.search || "";
  const urlParams = new URLSearchParams(location.search);
  const petId = urlParams.get("id") || urlParams.get("Id");

  const [isAddProcedureModalOpen, setIsAddProcedureModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const loadRecommendedProcedures = useCallback(() => getEventTemplates(), []);
  const { procedures, loading, reload } = useProceduresLoader({
    petId,
    load: loadRecommendedProcedures,
    noPetError: true,
  });

  const handleRecommendationClick = (event) => {
    setEditingEvent(event);
    setIsAddProcedureModalOpen(true);
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
          <h2 className="section__title h1">Рекомендуемые процедуры</h2>
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
        isOpen={isAddProcedureModalOpen}
        onClose={() => setIsAddProcedureModalOpen(false)}
      >
        {({ isOpen, isClosing, onClose }) => (
          <AddProcedureModal
            isOpen={isOpen}
            onClose={onClose}
            isClosing={isClosing}
            petId={petId ? parseInt(petId, 10) : null}
            onSuccess={reload}
            event={editingEvent}
          />
        )}
      </ModalOverlay>
    </div>
  );
};

export default RecommendedProcedures;
