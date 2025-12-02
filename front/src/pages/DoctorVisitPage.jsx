import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/doctor-visit.css";

const DoctorVisitPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Фейковые данные верхних карточек
  const [cardsData, setCardsData] = useState({
    date: "5 апреля 2025",
    time: "13:00",
    clinic: "Ветеринарная клиника доктора Глушкова В.Г.",
    doctor: "Кравцов Виталий Юрьевич",
  });

  // Фейковые данные нижних блоков
  const [visitData, setVisitData] = useState({
    diagnosis: `Разнообразный и богатый опыт говорит нам, что понимание сути ресурсосберегающих
технологий требует определения и уточнения глубококомысленных рассуждений!
Но предприниматели в сети интернет функционально разнесены на независимые элементы.`,

    recommendations: `Разнообразный и богатый опыт говорит нам, что понимание сути ресурсосберегающих технологий
требует определения и уточнения глубококомысленных рассуждений!
Лишь независимые государства набирают популярность среди определённых слоёв населения,
а значит, могут быть функционально разнесены на независимые элементы.`,

    directions: `Разнообразный и богатый опыт говорит нам, что понимание сути ресурсосберегающих технологий
требует определения и уточнения глубококомысленных рассуждений!
Принимая во внимание показатели успешности, новая модель организующей деятельности обеспечивает
круговорот полезности и реализацию экономической целесообразности принимаемых решений.`,
  });

  // Режим редактирования
  const [isEditing, setIsEditing] = useState(false);
  // Какая верхняя карточка редактируется: 'datetime' | 'clinic' | 'doctor' | null
  const [editingCard, setEditingCard] = useState(null);
  // Какой нижний блок редактируется: 'diagnosis' | 'recommendations' | 'directions' | null
  const [editingSection, setEditingSection] = useState(null);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditingCard(null);
    setEditingSection(null);
  };

  const handleSaveClick = () => {
    // здесь потом можно будет вызвать API для сохранения
    setIsEditing(false);
    setEditingCard(null);
    setEditingSection(null);
  };

  const handleCardFieldChange = (field, value) => {
    setCardsData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSectionChange = (field, value) => {
    setVisitData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleEditingCard = (cardKey) => {
    setEditingCard((prev) => (prev === cardKey ? null : cardKey));
  };

  const toggleEditingSection = (sectionKey) => {
    setEditingSection((prev) => (prev === sectionKey ? null : sectionKey));
  };

  // маленький компонент иконки карандаша (берёт цвет из color)
  const PenIcon = () => (
    <svg
      className="edit-icon"
      width="20"
      height="24"
      viewBox="0 0 20 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.2634 6L2.90212 14.3617C2.8282 14.4356 2.77847 14.5297 2.75738 14.6311L2.01029 18.3682C1.97546 18.5414 2.03041 18.72 2.15502 18.8458C2.25545 18.9462 2.3907 19 2.52925 19C2.56292 19 2.59794 18.9969 2.63277 18.9896L6.36844 18.2424C6.47196 18.2211 6.566 18.1716 6.63895 18.0975L15 9.73577L11.2634 6Z"
        fill="currentColor"
      />
      <path
        d="M17.2227 3.77655C16.1877 2.74115 14.5037 2.74115 13.4694 3.77655L12 5.24613L15.7534 9L17.2227 7.53022C17.7239 7.03012 18 6.36319 18 5.65387C18 4.94455 17.7239 4.27762 17.2227 3.77655Z"
        fill="currentColor"
      />
    </svg>
  );

  return (
    <main className="main-page doctor-visit-page">
      <div className="container">
        {/* ---------- Шапка ---------- */}
        <section className="doctor-visit-header">
          <h1 className="h1 doctor-visit__title">
            Прием {eventId ? eventId : ""}
          </h1>

          <div className="doctor-visit-header__actions">
            {isEditing ? (
              <>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveClick}
                >
                  Сохранить
                </button>

                <button className="doctor-visit__btn-delete">
                  Удалить
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-primary"
                  onClick={handleEditClick}
                >
                  Редактировать
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(-1)}
                >
                  Назад
                </button>

                <button className="doctor-visit__btn-delete">
                  Удалить
                </button>
              </>
            )}
          </div>
        </section>

        {/* ---------- Верхние карточки ---------- */}
        <section className="doctor-visit-cards">
          {/* Дата и время */}
          <div className="visit-card">
            <span className="txt2 visit-card__label">Дата и время</span>

            {isEditing && (
              <button
                type="button"
                className={`visit-card__edit-btn ${
                  editingCard === "datetime" ? "active" : ""
                }`}
                onClick={() => toggleEditingCard("datetime")}
              >
                <PenIcon />
              </button>
            )}

            <div className="visit-card__value-row">
              {isEditing && editingCard === "datetime" ? (
                <>
                  <input
                    className="h2 visit-card__value visit-card__input"
                    value={cardsData.date}
                    onChange={(e) =>
                      handleCardFieldChange("date", e.target.value)
                    }
                  />
                  <span className="visit-card__divider"></span>
                  <input
                    className="h2 visit-card__value visit-card__input visit-card__input--time"
                    value={cardsData.time}
                    onChange={(e) =>
                      handleCardFieldChange("time", e.target.value)
                    }
                  />
                </>
              ) : (
                <>
                  <span className="h2 visit-card__value">
                    {cardsData.date}
                  </span>
                  <span className="visit-card__divider"></span>
                  <span className="h2 visit-card__value">
                    {cardsData.time}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Клиника */}
          <div className="visit-card">
            <span className="txt2 visit-card__label">Клиника</span>

            {isEditing && (
              <button
                type="button"
                className={`visit-card__edit-btn ${
                  editingCard === "clinic" ? "active" : ""
                }`}
                onClick={() => toggleEditingCard("clinic")}
              >
                <PenIcon />
              </button>
            )}

            {isEditing && editingCard === "clinic" ? (
              <textarea
                className="h2 visit-card__value visit-card__textarea"
                value={cardsData.clinic}
                onChange={(e) =>
                  handleCardFieldChange("clinic", e.target.value)
                }
                rows={2}
              />
            ) : (
              <span className="h2 visit-card__value">
                {cardsData.clinic}
              </span>
            )}
          </div>

          {/* Врач */}
          <div className="visit-card">
            <span className="txt2 visit-card__label">Врач</span>

            {isEditing && (
              <button
                type="button"
                className={`visit-card__edit-btn ${
                  editingCard === "doctor" ? "active" : ""
                }`}
                onClick={() => toggleEditingCard("doctor")}
              >
                <PenIcon />
              </button>
            )}

            {isEditing && editingCard === "doctor" ? (
              <input
                className="h2 visit-card__value visit-card__input"
                value={cardsData.doctor}
                onChange={(e) =>
                  handleCardFieldChange("doctor", e.target.value)
                }
              />
            ) : (
              <span className="h2 visit-card__value">
                {cardsData.doctor}
              </span>
            )}
          </div>
        </section>

        {/* ---------- Диагноз ---------- */}
        <section className="doctor-visit-section">
          <h2 className="h1 doctor-visit-section__title">Диагноз</h2>
          <div className="doctor-visit-section__card">
            {isEditing && (
              <button
                type="button"
                className={`doctor-visit-section__edit-btn ${
                  editingSection === "diagnosis" ? "active" : ""
                }`}
                onClick={() => toggleEditingSection("diagnosis")}
              >
                <PenIcon />
              </button>
            )}

            {isEditing && editingSection === "diagnosis" ? (
              <textarea
                className="txt1 doctor-visit-section__text doctor-visit-section__textarea"
                value={visitData.diagnosis}
                onChange={(e) =>
                  handleSectionChange("diagnosis", e.target.value)
                }
                rows={4}
              />
            ) : (
              <p className="txt1 doctor-visit-section__text">
                {visitData.diagnosis}
              </p>
            )}
          </div>
        </section>

        {/* ---------- Рекомендации ---------- */}
        <section className="doctor-visit-section">
          <h2 className="h1 doctor-visit-section__title">Рекомендации</h2>
          <div className="doctor-visit-section__card">
            {isEditing && (
              <button
                type="button"
                className={`doctor-visit-section__edit-btn ${
                  editingSection === "recommendations" ? "active" : ""
                }`}
                onClick={() => toggleEditingSection("recommendations")}
              >
                <PenIcon />
              </button>
            )}

            {isEditing && editingSection === "recommendations" ? (
              <textarea
                className="txt1 doctor-visit-section__text doctor-visit-section__textarea"
                value={visitData.recommendations}
                onChange={(e) =>
                  handleSectionChange("recommendations", e.target.value)
                }
                rows={4}
              />
            ) : (
              <p className="txt1 doctor-visit-section__text">
                {visitData.recommendations}
              </p>
            )}
          </div>
        </section>

        {/* ---------- Направления ---------- */}
        <section className="doctor-visit-section">
          <h2 className="h1 doctor-visit-section__title">Направления</h2>
          <div className="doctor-visit-section__card">
            {isEditing && (
              <button
                type="button"
                className={`doctor-visit-section__edit-btn ${
                  editingSection === "directions" ? "active" : ""
                }`}
                onClick={() => toggleEditingSection("directions")}
              >
                <PenIcon />
              </button>
            )}

            {isEditing && editingSection === "directions" ? (
              <textarea
                className="txt1 doctor-visit-section__text doctor-visit-section__textarea"
                value={visitData.directions}
                onChange={(e) =>
                  handleSectionChange("directions", e.target.value)
                }
                rows={4}
              />
            ) : (
              <p className="txt1 doctor-visit-section__text">
                {visitData.directions}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default DoctorVisitPage;
