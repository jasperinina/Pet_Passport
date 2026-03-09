import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ModalOverlay from "../../components/layout/ModalOverlay/ModalOverlay";
import AddProcedureModal from "../../components/ui/modals/AddProcedureModal/AddProcedureModal";
import Procedures from "../../components/ui/Procedures/Procedures";
import Menu from "../../components/layout/Menu/Menu";

import { getUpcomingEvents } from "../../api/events";

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
      getUpcomingEvents(parseInt(petId, 10))
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
      getUpcomingEvents(parseInt(petId, 10))
        .then((events) => {
          setProcedures(events);
        })
        .catch((err) => {
          console.error("Ошибка загрузки процедур:", err);
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
          <h2 className="section__title h1">Предстоящие процедуры</h2>
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
          message="Нет предстоящих процедур"
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

export default UpcomingProcedures;