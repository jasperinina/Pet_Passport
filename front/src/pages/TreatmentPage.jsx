import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/doctor-visit.css";
import "../styles/procedure-modal.css";
import { getTreatment, updateTreatment, deleteTreatment } from "../api/events";

const PERIOD_UNITS = {
  MINUTE: 0,
  HOUR: 1,
  DAY: 2,
  WEEK: 3,
  MONTH: 4,
  YEAR: 5,
};

const PERIOD_OPTIONS = [
  { value: PERIOD_UNITS.DAY, label: "Раз в день" },
  { value: PERIOD_UNITS.WEEK, label: "Раз в неделю" },
  { value: PERIOD_UNITS.MONTH, label: "Раз в месяц" },
  { value: PERIOD_UNITS.YEAR, label: "Раз в год" },
];

const REMINDER_OPTIONS = [
  { value: 5, unit: PERIOD_UNITS.MINUTE, label: "5 минут" },
  { value: 1, unit: PERIOD_UNITS.HOUR, label: "1 час" },
  { value: 1, unit: PERIOD_UNITS.DAY, label: "1 день" },
];

const TreatmentPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.search || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [treatmentTitle, setTreatmentTitle] = useState("");
  const [eventDateRaw, setEventDateRaw] = useState(null);

  const [cardsData, setCardsData] = useState({
    date: "",
    time: "",
    remedy: "",
    parasite: "",
    periodUnit: PERIOD_UNITS.MONTH,
  });

  // Напоминания
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderValue, setReminderValue] = useState(5);
  const [reminderUnit, setReminderUnit] = useState(PERIOD_UNITS.MINUTE);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadTreatment = async () => {
      if (!eventId) return;

      try {
        setLoading(true);
        setError(null);

        const treatment = await getTreatment(parseInt(eventId, 10));

        setTreatmentTitle(treatment.title || "Обработка");
        setEventDateRaw(treatment.eventDate);

        const dateObj = new Date(treatment.eventDate);
        const date = dateObj.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const time = dateObj.toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        });

        setCardsData({
          date,
          time,
          remedy: treatment.remedy || "",
          parasite: treatment.parasite || "",
          periodUnit: treatment.periodUnit ?? PERIOD_UNITS.MONTH,
        });

        // Напоминания
        setReminderEnabled(treatment.reminderEnabled || false);
        setReminderValue(treatment.reminderValue ?? 5);
        setReminderUnit(treatment.reminderUnit ?? PERIOD_UNITS.MINUTE);
      } catch (err) {
        console.error("Ошибка загрузки обработки:", err);
        setError(
          err.message ||
            "Не удалось загрузить данные об обработке. Попробуйте позже."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTreatment();
  }, [eventId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (!eventId) return;

    try {
      setLoading(true);

      await updateTreatment(parseInt(eventId, 10), {
        title: treatmentTitle || "Обработка",
        eventDate: eventDateRaw,
        remedy: cardsData.remedy,
        parasite: cardsData.parasite,
        periodUnit: cardsData.periodUnit,
        reminderEnabled,
        reminderValue: reminderEnabled ? reminderValue : 0,
        reminderUnit: reminderEnabled ? reminderUnit : PERIOD_UNITS.MINUTE,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Ошибка сохранения обработки:", err);
      alert(err.message || "Не удалось сохранить изменения.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardFieldChange = (field, value) => {
    setCardsData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDelete = async () => {
    if (!eventId) return;
    const confirmed = window.confirm("Точно удалить эту обработку?");
    if (!confirmed) return;

    try {
      await deleteTreatment(parseInt(eventId, 10));
      navigate(-1);
    } catch (err) {
      console.error("Ошибка удаления обработки:", err);
      alert(err.message || "Не удалось удалить обработку.");
    }
  };

  if (loading && !cardsData.date) {
    return (
      <main className="main-page doctor-visit-page">
        <div className="container">
          <p
            className="txt1"
            style={{ padding: "40px", textAlign: "center" }}
          >
            Загрузка данных об обработке...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="main-page doctor-visit-page">
        <div className="container">
          <p
            className="txt1"
            style={{
              padding: "40px",
              textAlign: "center",
              color: "var(--error, #d32f2f)",
            }}
          >
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="main-page doctor-visit-page">
      <div className="container">
        {/* ---------- Шапка ---------- */}
        <section className="doctor-visit-header">
          {isEditing ? (
            <input
              className="h1 doctor-visit__title"
              value={treatmentTitle}
              onChange={(e) => setTreatmentTitle(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                font: "inherit",
                color: "var(--black)",
                padding: 0,
                width: "100%",
                maxWidth: "600px",
              }}
            />
          ) : (
            <h1 className="h1 doctor-visit__title">
              {treatmentTitle || "Обработка"} {eventId ? `#${eventId}` : ""}
            </h1>
          )}

          <div className="doctor-visit-header__actions">
            {isEditing ? (
              <>
                <button className="btn btn-primary" onClick={handleSaveClick}>
                  Сохранить
                </button>

                <button
                  className="doctor-visit__btn-delete"
                  type="button"
                  onClick={handleDelete}
                >
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

                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                  Назад
                </button>

                <button
                  className="doctor-visit__btn-delete"
                  type="button"
                  onClick={handleDelete}
                >
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

            <div className="visit-card__value-row">
              {isEditing ? (
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

          {/* Препарат */}
          <div className="visit-card">
            <span className="txt2 visit-card__label">Препарат</span>

            {isEditing ? (
              <input
                className="h2 visit-card__value visit-card__input"
                value={cardsData.remedy}
                onChange={(e) =>
                  handleCardFieldChange("remedy", e.target.value)
                }
              />
            ) : (
              <span className="h2 visit-card__value">
                {cardsData.remedy}
              </span>
            )}
          </div>

          {/* Паразит */}
          <div className="visit-card">
            <span className="txt2 visit-card__label">Паразит</span>

            {isEditing ? (
              <input
                className="h2 visit-card__value visit-card__input"
                value={cardsData.parasite}
                onChange={(e) =>
                  handleCardFieldChange("parasite", e.target.value)
                }
              />
            ) : (
              <span className="h2 visit-card__value">
                {cardsData.parasite}
              </span>
            )}
          </div>
        </section>

        {/* ---------- Периодичность ---------- */}
        <section className="doctor-visit-section">
          <h2 className="h1 doctor-visit-section__title">Периодичность</h2>
          <div className="doctor-visit-section__card">
            {isEditing ? (
              <select
                className="txt1 doctor-visit-section__text doctor-visit-section__textarea"
                value={cardsData.periodUnit}
                onChange={(e) =>
                  handleCardFieldChange("periodUnit", parseInt(e.target.value, 10))
                }
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  font: "inherit",
                  color: "var(--txt)",
                  padding: 0,
                }}
              >
                {PERIOD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <p className="txt1 doctor-visit-section__text">
                {PERIOD_OPTIONS.find((opt) => opt.value === cardsData.periodUnit)?.label || "Раз в месяц"}
              </p>
            )}
          </div>
        </section>

        {/* ---------- Напоминания ---------- */}
        <section className="doctor-visit-section">
          <h2 className="h1 doctor-visit-section__title">Напоминание в Telegram</h2>
          <div className="doctor-visit-section__card">
            {isEditing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div className="form-toggle-group">
                  <label className="txt2" style={{ margin: 0 }}>
                    Включить напоминание
                  </label>
                  <label className="form-toggle">
                    <input
                      type="checkbox"
                      checked={reminderEnabled}
                      onChange={(e) => setReminderEnabled(e.target.checked)}
                    />
                    <span className="form-toggle-slider"></span>
                  </label>
                </div>

                {reminderEnabled && (
                  <div>
                    <label className="txt2" style={{ display: "block", marginBottom: "12px" }}>
                      Напоминать за
                    </label>
                    <div className="form-button-group">
                      {REMINDER_OPTIONS.map((option) => (
                        <button
                          key={`${option.value}-${option.unit}`}
                          type="button"
                          className={`form-button-option ${
                            reminderValue === option.value && reminderUnit === option.unit
                              ? "form-button-option--active"
                              : ""
                          }`}
                          onClick={() => {
                            setReminderValue(option.value);
                            setReminderUnit(option.unit);
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <p className="txt1 doctor-visit-section__text">
                  Напоминание: {reminderEnabled ? "Включено" : "Выключено"}
                </p>
                {reminderEnabled && (
                  <p className="txt1 doctor-visit-section__text">
                    Напоминать за:{" "}
                    {REMINDER_OPTIONS.find(
                      (opt) => opt.value === reminderValue && opt.unit === reminderUnit
                    )?.label || "5 минут"}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default TreatmentPage;

