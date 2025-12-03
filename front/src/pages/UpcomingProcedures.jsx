import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/upcoming-procedures.css";
import { getUpcomingEvents } from "../api/events";
import ProcedureCard from "../components/ui/ProcedureCard";
import AddProcedureModal from "../components/AddProcedureModal/AddProcedureModal";

const UpcomingProcedures = () => {
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

  // Загрузка предстоящих процедур
  useEffect(() => {
    if (petId) {
      setLoading(true);
      getUpcomingEvents(parseInt(petId, 10))
        .then((events) => {
          setProcedures(events);
        })
        .catch((err) => {
          console.error("Ошибка загрузки процедур:", err);
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
    <main className="main-page upcoming-procedures-page">
      <div className="container">
        {/* Шапка страницы */}
        <section className="upcoming-header">
          <h1 className="h1 upcoming-header__title">Предстоящие процедуры</h1>

          <button
            type="button"
            className="btn btn-primary upcoming-header__button"
            onClick={() => setIsAddProcedureModalOpen(true)}
          >
            Добавить
          </button>
        </section>

        {/* Список процедур */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p className="txt1">Загрузка процедур...</p>
          </div>
        ) : procedures.length === 0 ? (
          <div className="procedures__card">
            <p className="txt1 procedures__empty-text">
              Нет предстоящих процедур
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

export default UpcomingProcedures;
