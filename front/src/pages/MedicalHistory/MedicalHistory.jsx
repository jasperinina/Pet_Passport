import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPastEvents } from "../../api/events";
import ProcedureCard from "../../components/ui/ProcedureCard/ProcedureCard";
import AddProcedureModal from "../../components/AddProcedureModal/AddProcedureModal";
import { formatEventDateTime } from "../../utils/dateUtils";
import { getEventTypeName, getEventPath } from "../../utils/eventUtils";
import Procedures from "../../components/ui/Procedures/Procedures";
import Menu from "../../components/layout/Menu/Menu";

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
      getPastEvents(parseInt(petId, 10))
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
      getPastEvents(parseInt(petId, 10))
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

      <AddProcedureModal
        isOpen={isAddProcedureModalOpen}
        onClose={() => setIsAddProcedureModalOpen(false)}
        petId={petId ? parseInt(petId, 10) : null}
        onSuccess={handleProcedureAdded}
      />
    </div>
  );
};

export default MedicalHistory;
