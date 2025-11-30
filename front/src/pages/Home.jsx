import { useState, useEffect } from "react";
import "../styles/home.css";
import PetPhoto from "../assets/images/pet-photo.png";
import { getPet } from "../api/pets";
import { getUpcomingEvents } from "../api/events";
import API_BASE_URL from "../api/config";
import EditPetModal from "../components/EditPetModal";
import AddProcedureModal from "../components/AddProcedureModal";

const Home = () => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddProcedureModalOpen, setIsAddProcedureModalOpen] = useState(false);

  // Функция загрузки данных о питомце
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

  // Функция загрузки предстоящих процедур
  const loadUpcomingEvents = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get("id") || urlParams.get("Id");

    if (!petId) {
      return;
    }

    try {
      const events = await getUpcomingEvents(parseInt(petId, 10));
      // Берем только 3 ближайшие
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

  // Перезагружаем процедуры после добавления новой
  const handleProcedureAdded = () => {
    loadUpcomingEvents();
  };

  // Обработчик успешного обновления данных
  const handleUpdateSuccess = () => {
    // Перезагружаем данные питомца
    loadPet();
    // Уведомляем App о необходимости обновить данные в Header
    window.dispatchEvent(new CustomEvent('petUpdated'));
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return "Не указана";
    
    try {
      // Парсим дату в формате YYYY-MM-DD (DateOnly из C#)
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      
      const formattedDay = day.toString().padStart(2, "0");
      const formattedMonth = date.toLocaleString("ru-RU", { month: "long" });
      const formattedYear = year;
      
      // Вычисляем возраст
      const today = new Date();
      const age = today.getFullYear() - year - 
        (today.getMonth() < month - 1 || 
         (today.getMonth() === month - 1 && today.getDate() < day) ? 1 : 0);
      
      return `${formattedDay} ${formattedMonth} ${formattedYear} (${age} ${getAgeWord(age)})`;
    } catch (e) {
      return dateString;
    }
  };

  // Склонение слова "лет"
  const getAgeWord = (age) => {
    const lastDigit = age % 10;
    const lastTwoDigits = age % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return "лет";
    }
    if (lastDigit === 1) {
      return "год";
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return "года";
    }
    return "лет";
  };

  // Получение URL фотографии
  const getPetPhotoUrl = () => {
    if (pet?.photos && pet.photos.length > 0) {
      const photoUrl = pet.photos[0].url;
      // Если URL уже абсолютный (http/https), используем как есть
      if (photoUrl.startsWith("http")) {
        return photoUrl;
      }
      // Если относительный, добавляем базовый URL API
      return `${API_BASE_URL}${photoUrl}`;
    }
    return PetPhoto; // Дефолтная заглушка
  };

  // Форматирование даты и времени для процедуры
  const formatEventDateTime = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString("ru-RU", { month: "long" });
      const year = date.getFullYear();
      const time = date.toLocaleTimeString("ru-RU", { 
        hour: "2-digit", 
        minute: "2-digit" 
      });
      
      return { date: `${day} ${month}`, time, fullDate: `${day} ${month} ${year}` };
    } catch (e) {
      return { date: "", time: "", fullDate: "" };
    }
  };

  // Получение названия типа процедуры
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

  // Состояние загрузки
  if (loading) {
    return (
      <main className="main-page">
        <div className="container">
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p className="txt1">Загрузка данных о питомце...</p>
          </div>
        </div>
      </main>
    );
  }

  // Состояние ошибки
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

  // Если питомец не загружен
  if (!pet) {
    return null;
  }

  return (
    <main className="main-page">
      <div className="container">
        <section className="pet-block">
          {/* ЛЕВАЯ КАРТИНКА */}
          <div className="pet-block__photo-wrapper">
            <img
              src={getPetPhotoUrl()}
              alt={pet.name}
              className="pet-block__photo"
            />
          </div>

          {/* ПРАВЫЙ БЛОК С ИНФОЙ */}
          <div className="pet-block__info">
            {/* Заголовок: имя */}
            <div className="pet-block__top-row">
              <h1 className="h1 pet-block__name">{pet.name || "Не указано"}</h1>
            </div>

            {/* Линия-разделитель */}
            <div className="pet-block__divider" />

            {/* Порода (на всю ширину) */}
            {pet.breed && (
              <div className="pet-block__section pet-block__section--full">
                <span className="txt2 pet-block__label">Порода</span>
                <span className="h2 pet-block__value">{pet.breed}</span>
              </div>
            )}

            {/* Вес / Дата рождения */}
            <div className="pet-block__section pet-block__section--grid">
              {pet.weightKg && (
                <div className="pet-block__field">
                  <span className="txt2 pet-block__label">Вес</span>
                  <span className="h2 pet-block__value">{pet.weightKg} кг</span>
                </div>
              )}

              {pet.birthDate && (
                <div className="pet-block__field">
                  <span className="txt2 pet-block__label">Дата рождения</span>
                  <span className="h2 pet-block__value">{formatDate(pet.birthDate)}</span>
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
        <section className="procedures">
          <h2 className="h1 procedures__title">Предстоящие процедуры</h2>

          {upcomingEvents.length === 0 ? (
            <div className="procedures__card">
              <p className="txt1 procedures__empty-text">
                Нет предстоящих процедур
              </p>
            </div>
          ) : (
            <div className="procedures__list">
              {upcomingEvents.map((event) => {
                const { date, time, fullDate } = formatEventDateTime(event.eventDate);
                return (
                  <div 
                    key={event.id} 
                    className="procedure-card"
                    onClick={() => {
                      // TODO: Переход на страницу процедуры
                      console.log("Переход к процедуре", event.id);
                    }}
                  >
                    <div className="procedure-card__header">
                      <div className="procedure-card__tags">
                        <span className="procedure-card__tag">
                          <span className="procedure-card__tag-icon">📅</span>
                          {fullDate} | {time}
                        </span>
                        <span className="procedure-card__tag">
                          {getEventTypeName(event.type)}
                        </span>
                      </div>
                      {event.reminderEnabled && (
                        <span className="procedure-card__reminder-icon">🔔</span>
                      )}
                    </div>
                    <div className="procedure-card__content">
                      <div className="procedure-card__main">
                        <h3 className="procedure-card__title">{event.title || "Процедура"}</h3>
                        <div className="procedure-card__date-time">
                          <span className="procedure-card__date">{date}</span>
                          <span className="procedure-card__time">{time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Модальное окно редактирования */}
      <EditPetModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        pet={pet}
        onSuccess={handleUpdateSuccess}
      />

      {/* Модальное окно добавления процедуры */}
      <AddProcedureModal
        isOpen={isAddProcedureModalOpen}
        onClose={() => setIsAddProcedureModalOpen(false)}
        petId={pet?.id}
        onSuccess={handleProcedureAdded}
      />
    </main>
  );
};

export default Home;
