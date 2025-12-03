import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/medical-history.css";
import { getPastEvents } from "../api/events";
import ProcedureCard from "../components/ui/ProcedureCard";
import AddProcedureModal from "../components/AddProcedureModal/AddProcedureModal";

const MedicalHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.search || "";
  const urlParams = new URLSearchParams(location.search);
  const petId = urlParams.get("id") || urlParams.get("Id");

  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddProcedureModalOpen, setIsAddProcedureModalOpen] = useState(false);

  // Форматирование даты/времени процедуры
  const formatEventDateTime = (dateString) => {
    if (!dateString) return { date: "", time: "", fullDate: "" };

    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString("ru-RU", { month: "long" });
      const year = date.getFullYear();
      const time = date.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        date: `${day} ${month}`,
        time,
        fullDate: `${day} ${month} ${year}`,
      };
    } catch {
      return { date: "", time: "", fullDate: "" };
    }
  };

  const getEventTypeName = (type) => {
    switch (type) {
      case "doctor-visit":
        return "Прием";
      case "vaccine":
        return "Вакцинация";
      case "treatment":
        return "Обработка";
      default:
        return "Процедура";
    }
  };

  // Загрузка прошедших процедур
  useEffect(() => {
    if (petId) {
      setLoading(true);
      getPastEvents(parseInt(petId, 10))
        .then((events) => {
          setProcedures(events);
        })
        .catch((err) => {
          console.error("Ошибка загрузки истории:", err);
          setProcedures([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [petId]);

  // После добавления процедуры перезагружаем список
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
    <main className="main-page medical-history-page">
      <div className="container">
        {/* Шапка страницы */}
        <section className="medical-history-header">
          <h1 className="h1 medical-history__title">Медицинская история</h1>

          <button
            type="button"
            className="btn btn-primary medical-history__button"
            onClick={() => setIsAddProcedureModalOpen(true)}
          >
            Добавить
          </button>
        </section>

        {/* Список процедур */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p className="txt1">Загрузка истории...</p>
          </div>
        ) : procedures.length === 0 ? (
          <div className="procedures__card">
            <p className="txt1 procedures__empty-text">
              В истории пока нет процедур
            </p>
          </div>
        ) : (
          <div className="procedures__list">
            {procedures.map((event) => {
              const { date, time, fullDate } = formatEventDateTime(
                event.eventDate
              );
              return (
                <ProcedureCard
                  key={event.id}
                  title={event.title}
                  date={date}
                  time={time}
                  fullDate={fullDate}
                  typeName={getEventTypeName(event.type)}
                  reminderEnabled={event.reminderEnabled}
                  onClick={() => {
                    if (event.type === "doctor-visit") {
                      navigate(`/doctor-visit/${event.id}${search}`);
                    } else if (event.type === "vaccine") {
                      navigate(`/vaccine/${event.id}${search}`);
                    } else if (event.type === "treatment") {
                      navigate(`/treatment/${event.id}${search}`);
                    }
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Модалка добавления процедуры */}
      <AddProcedureModal
        isOpen={isAddProcedureModalOpen}
        onClose={() => setIsAddProcedureModalOpen(false)}
        petId={petId ? parseInt(petId, 10) : null}
        onSuccess={handleProcedureAdded}
      />
    </main>
  );
};

export default MedicalHistory;
