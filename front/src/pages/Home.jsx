import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "../styles/home.css";
import { getPet } from "../api/pets";
import { getUpcomingEvents } from "../api/events";
import EditPetModal from "../components/EditPetModal";
import AddProcedureModal from "../components/AddProcedureModal/AddProcedureModal";
import ProcedureDetailsModal from "../components/ProcedureDetailsModal";
import ProcedureCard from "../components/ui/ProcedureCard";
import { formatEventDateTime } from "../utils/dateUtils";
import { getEventTypeName, getEventPath } from "../utils/eventUtils";
import PetPhotosGrid from "../components/ui/PetPhotosGrid";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.search || "";

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddProcedureModalOpen, setIsAddProcedureModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const getPetIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || params.get("Id");
  };

  const loadPet = async () => {
    const petId = getPetIdFromUrl();

    if (!petId) {
      setError("ID питомца не указан в URL");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const petData = await getPet(parseInt(petId, 10));
      setPet(petData);
    } catch (err) {
      setError(err.message || "Ошибка загрузки данных о питомце");
    } finally {
      setLoading(false);
    }
  };

  const loadUpcomingEvents = async () => {
    const petId = getPetIdFromUrl();
    if (!petId) return;

    try {
      const events = await getUpcomingEvents(parseInt(petId, 10));
      setUpcomingEvents(events.slice(0, 3));
    } catch (err) {
      setUpcomingEvents([]);
    }
  };

  useEffect(() => {
    loadPet();
    loadUpcomingEvents();
  }, []);

  const handleProcedureAdded = () => loadUpcomingEvents();

  const handleUpdateSuccess = () => {
    loadPet();
    window.dispatchEvent(new CustomEvent("petUpdated"));
  };

  // формат даты рождения (с возрастом)
  const formatDate = (dateString) => {
    if (!dateString) return "Не указана";

    try {
      const [year, month, day] = dateString.split("-").map(Number);
      const date = new Date(year, month - 1, day);

      const formattedDay = day.toString().padStart(2, "0");
      const formattedMonth = date.toLocaleString("ru-RU", {
        month: "long",
      });
      const formattedYear = year;

      const today = new Date();
      const age =
        today.getFullYear() -
        year -
        (today.getMonth() < month - 1 ||
        (today.getMonth() === month - 1 && today.getDate() < day)
          ? 1
          : 0);

      return `${formattedDay} ${formattedMonth} ${formattedYear} (${age} ${getAgeWord(
        age
      )})`;
    } catch {
      return dateString;
    }
  };

  const getAgeWord = (age) => {
    const lastDigit = age % 10;
    const lastTwoDigits = age % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "лет";
    if (lastDigit === 1) return "год";
    if (lastDigit >= 2 && lastDigit <= 4) return "года";
    return "лет";
  };

  const hasProcedures = upcomingEvents.length > 0;

  // состояния загрузки / ошибки
  if (loading) {
    return (
      <main className="main-page">
        <div className="container">
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p className="txt1">Загрузка данных о питомце.</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="main-page">
        <div className="container">
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p className="txt1" style={{ color: "var(--error, #d32f2f)" }}>
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!pet) {
    return null;
  }

  return (
    <main className="main-page">
      <div className="container">
        {/* Блок питомца */}
        <section className="pet-block">
          <div className="pet-block__photo-wrapper">
            <PetPhotosGrid photos={pet.photos} petName={pet.name} />
          </div>

          <div className="pet-block__info">
            <div className="pet-block__top-row">
              <h1 className="h1 pet-block__name">
                {pet.name || "Не указано"}
              </h1>
            </div>

            <div className="pet-block__divider" />

            {pet.breed && (
              <div className="pet-block__section pet-block__section--full">
                <span className="txt2 pet-block__label">Порода</span>
                <span className="h2 pet-block__value">{pet.breed}</span>
              </div>
            )}

            <div className="pet-block__section pet-block__section--grid">
              {pet.weightKg && (
                <div className="pet-block__field">
                  <span className="txt2 pet-block__label">Вес</span>
                  <span className="h2 pet-block__value">
                    {pet.weightKg} кг
                  </span>
                </div>
              )}

              {pet.birthDate && (
                <div className="pet-block__field">
                  <span className="txt2 pet-block__label">Дата рождения</span>
                  <span className="h2 pet-block__value">
                    {formatDate(pet.birthDate)}
                  </span>
                </div>
              )}
            </div>

            {/* Кнопки */}
            <div className="pet-block__actions">
              <button
                className="btn btn-primary"
                onClick={() => setIsAddProcedureModalOpen(true)}
              >
                Добавить процедуру
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setIsEditModalOpen(true)}
              >
                Изменить данные
              </button>
            </div>
          </div>
        </section>

        {/* Предстоящие процедуры */}
        <section className="procedures">
          <div className="procedures__header">
            <h2 className="h1 procedures__title">Предстоящие процедуры</h2>

            <button
              type="button"
              className="txt2 procedures__link"
              onClick={() => navigate(`/upcoming${search}`)}
            >
              Посмотреть все
            </button>
          </div>

          {!hasProcedures ? (
            <div className="procedures__card">
              <p className="txt1 procedures__empty-text">
                Нет предстоящих процедур
              </p>
            </div>
          ) : (
            <div className="procedures__list">
              {upcomingEvents.map((event) => {
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
                    eventType={event.type}
                    reminderEnabled={event.reminderEnabled}
                    onClick={() => {
                      const eventPath = getEventPath(event.type, event.id, search);
                      if (eventPath) {
                        navigate(eventPath);
                      }
                    }}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Модалка редактирования питомца */}
      <EditPetModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        pet={pet}
        onSuccess={handleUpdateSuccess}
      />

      {/* Модалка добавления процедуры */}
      <AddProcedureModal
        isOpen={isAddProcedureModalOpen}
        onClose={() => setIsAddProcedureModalOpen(false)}
        petId={pet?.id}
        onSuccess={handleProcedureAdded}
      />

      {/* Модалка деталей (вакцинация / обработка) */}
      <ProcedureDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        event={selectedEvent}
      />
    </main>
  );
};

export default Home;