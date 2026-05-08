import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Procedures from "../../components/ui/Procedures/Procedures";
import LoadingState from "../../components/events/LoadingState/LoadingState";
import ModalOverlay from "../../components/modal_overlay/ModalOverlay";
import AddProcedureModal from "../../components/ui/modals/AddProcedureModal/AddProcedureModal";

import { getEvents } from "../../api/events";
import { EVENT_STATUSES } from "../../constants/eventConstants";
import { useProceduresLoader } from "../../hooks/useProceduresLoader";

const MedicalHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.search || "";
  const urlParams = new URLSearchParams(location.search);
  const petId = urlParams.get("id") || urlParams.get("Id");

  const [isAddProcedureModalOpen, setIsAddProcedureModalOpen] = useState(false);
  const loadHistoryProcedures = useCallback(
    (currentPetId) =>
      getEvents(
        currentPetId,
        [
          EVENT_STATUSES.INDEFINITE,
          EVENT_STATUSES.COMPLETED,
          EVENT_STATUSES.CANCELLED,
        ]
      ),
    []
  );
  const { procedures, loading, reload } = useProceduresLoader({
    petId,
    load: loadHistoryProcedures,
  });

  if (loading) {
    return (
      <section className="section container">
        <LoadingState message="Загрузка истории..." />
      </section>
    );
  }

  return (
    <div>
      <section className="section container">
        <header className="section__header section__header--filled">
          <h2 className="section__title h1">Медицинская история</h2>
          <button
            className="button button--filled"
            type="button"
            onClick={() => setIsAddProcedureModalOpen(true)}
          >
            Добавить
          </button>
        </header>
        <Procedures
          events={procedures}
          navigate={navigate}
          search={search}
          message="В истории пока нет процедур"
          isNotificationImageHidden={true}
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
          />
        )}
      </ModalOverlay>
    </div>
  );
};

export default MedicalHistory;
