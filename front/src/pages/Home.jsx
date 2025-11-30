import { useState, useEffect } from "react";
import "../styles/home.css";
import PetPhoto from "../assets/images/pet-photo.png";
import { getPet } from "../api/pets";
import API_BASE_URL from "../api/config";

const Home = () => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Получаем ID питомца из параметров URL
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get("id") || urlParams.get("Id");

    if (!petId) {
      setError("ID питомца не указан в URL");
      setLoading(false);
      return;
    }

    // Загружаем данные о питомце
    const loadPet = async () => {
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

    loadPet();
  }, []);

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
              <button className="btn btn-primary">
                Добавить процедуру
              </button>
              <button className="btn btn-secondary">
                Изменить данные
              </button>
            </div>
          </div>
        </section>
        <section className="procedures">
          <h2 className="h1 procedures__title">Предстоящие процедуры</h2>

          <div className="procedures__card">
            <p className="txt1 procedures__empty-text">
              Нет предстоящих процедур
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
