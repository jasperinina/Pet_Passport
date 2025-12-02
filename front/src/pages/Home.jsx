import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "../styles/home.css";
import PetPhoto from "../assets/images/pet-photo.png";
import { getPet } from "../api/pets";
import { getUpcomingEvents } from "../api/events";
import API_BASE_URL from "../api/config";
import EditPetModal from "../components/EditPetModal";
import AddProcedureModal from "../components/AddProcedureModal/AddProcedureModal";
import ProcedureDetailsModal from "../components/ProcedureDetailsModal";
import ProcedureCard from "../components/ui/ProcedureCard";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.search || "";

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddProcedureModalOpen, setIsAddProcedureModalOpen] =
    useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // загрузка питомца
  const loadPet = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get("id") || urlParams.get("Id");

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
      console.error("Ошибка загрузки питомца:", err);
    } finally {
      setLoading(false);
    }
  };

  // загрузка ближайших процедур (3 шт.)
  const loadUpcomingEvents = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get("id") || urlParams.get("Id");

    if (!petId) return;

    try {
      const events = await getUpcomingEvents(parseInt(petId, 10));
      setUpcomingEvents(events.slice(0, 3));
    } catch (err) {
      console.error("Ошибка загрузки процедур:", err);
      setUpcomingEvents([]);
    }
  };

  useEffect(() => {
    loadPet();
    loadUpcomingEvents();
  }, []);

  // после добавления процедуры перезагружаем список
  const handleProcedureAdded = () => {
    loadUpcomingEvents();
  };

  // после изменения данных питомца перезагружаем + дергаем header
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

  // фото питомца
  const getPetPhotoUrl = () => {
    if (pet?.photos && pet.photos.length > 0) {
      const photoUrl = pet.photos[0].url;
      if (photoUrl.startsWith("http")) return photoUrl;
      return `${API_BASE_URL}${photoUrl}`;
    }
    return PetPhoto;
  };

  // формат даты/времени процедуры
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
            <img
              src={getPetPhotoUrl()}
              alt={pet.name}
              className="pet-block__photo"
            />
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
                  <span className="txt2 pet-block__label">Пол</span>
                  <span className="h2 pet-block__value">
                    {pet.gender === "female" ? "Женский" : "Мужской"}
                  </span>
                </div>
              )}

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
                    reminderEnabled={event.reminderEnabled}
                    onClick={() => {
                      if (event.type === "doctor-visit") {
                        // переход на страницу приёма
                        navigate(`/doctor-visit/${event.id}${search}`);
                      } else {
                        // открываем модальное окно с деталями
                        setSelectedEvent(event);
                        setIsDetailsModalOpen(true);
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