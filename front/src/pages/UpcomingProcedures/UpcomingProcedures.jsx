import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ModalOverlay from "../../components/modal_overlay/ModalOverlay";
import Procedures from "../../components/ui/Procedures/Procedures";
import LoadingState from "../../components/events/LoadingState/LoadingState";
import AddProcedureModal from "../../components/ui/modals/AddProcedureModal/AddProcedureModal";

import PlusIcon from "../../assets/icons/plus.svg?react";

import { getEvents } from "../../api/events";
import { EVENT_STATUSES } from "../../constants/eventConstants";
import MobileButton from "../../components/mobile_button/MobileButton";
import { useProceduresLoader } from "../../hooks/useProceduresLoader";

const UpcomingProcedures = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.search || "";
  const urlParams = new URLSearchParams(location.search);
  const petId = urlParams.get("id") || urlParams.get("Id");

  const [isAddProcedureModalOpen, setIsAddProcedureModalOpen] = useState(false);
  const loadUpcomingProcedures = useCallback(
    (currentPetId) => getEvents(currentPetId, [EVENT_STATUSES.UPCOMING]),
    []
  );
  const { procedures, loading, reload } = useProceduresLoader({
    petId,
    load: loadUpcomingProcedures,
    noPetError: true,
  });

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
            onSuccess={reload}
          />
        )}
      </ModalOverlay>
    </div>
  );
};

export default UpcomingProcedures;
