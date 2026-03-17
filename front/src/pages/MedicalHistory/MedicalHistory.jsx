import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Procedures from "../../components/ui/Procedures/Procedures";
import Menu from "../../components/menu/Menu";

import { getEvents } from "../../api/events";
import ModalOverlay from "../../components/modal_overlay/ModalOverlay";
import { EVENT_STATUSES } from "../../constants/eventConstants";

const MedicalHistory = () => {
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
      getEvents(
        parseInt(petId, 10),
        [
          EVENT_STATUSES.INDEFINITE,
          EVENT_STATUSES.COMPLETED,
          EVENT_STATUSES.CANCELLED
        ]
      )
        .then((events) => {
          setProcedures(events);
        })
        .catch((err) => {
          setProcedures([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [petId]);

  const handleProcedureAdded = () => {
    if (petId) {
      getEvents(
        parseInt(petId, 10),
        [
          EVENT_STATUSES.INDEFINITE,
          EVENT_STATUSES.COMPLETED,
          EVENT_STATUSES.CANCELLED
        ]
      )
        .then((events) => {
          setProcedures(events);
        })
        .catch((err) => {
          console.error("Ошибка загрузки истории:", err);
        });
    }
  };

  return (
    <div>
      <section className="container">
        <Menu />
      </section>

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
          upcomingEvents={procedures}
          navigate={navigate}
          search={search}
          message="В истории пока нет процедур"
          isNotificationImageHidden={true}
        />
      </section>

      <ModalOverlay
        modalName="AddProcedureModal"
        isOpen={isAddProcedureModalOpen}
        onClose={() => setIsAddProcedureModalOpen(false)}
        petId={petId ? parseInt(petId, 10) : null}
        onSuccess={handleProcedureAdded}
      />
    </div>
  );
};

export default MedicalHistory;