import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/doctor-visit.css";
import "../styles/procedure-modal.css";
import { getVaccine, updateVaccine, deleteVaccine } from "../api/events";

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

const VaccinePage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.search || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [vaccineTitle, setVaccineTitle] = useState("");
  const [eventDateRaw, setEventDateRaw] = useState(null);

  const [cardsData, setCardsData] = useState({
    date: "",
    time: "",
    medicine: "",
    periodUnit: PERIOD_UNITS.MONTH,
  });

  // Напоминания
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderValue, setReminderValue] = useState(5);
  const [reminderUnit, setReminderUnit] = useState(PERIOD_UNITS.MINUTE);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadVaccine = async () => {
      if (!eventId) return;

      try {
        setLoading(true);
        setError(null);

        const vaccine = await getVaccine(parseInt(eventId, 10));

        setVaccineTitle(vaccine.title || "Вакцинация");
        setEventDateRaw(vaccine.eventDate);

        const dateObj = new Date(vaccine.eventDate);
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
          medicine: vaccine.medicine || "",
          periodUnit: vaccine.periodUnit ?? PERIOD_UNITS.MONTH,
        });

        // Напоминания
        setReminderEnabled(vaccine.reminderEnabled || false);
        setReminderValue(vaccine.reminderValue ?? 5);
        setReminderUnit(vaccine.reminderUnit ?? PERIOD_UNITS.MINUTE);
      } catch (err) {
        console.error("Ошибка загрузки вакцинации:", err);
        setError(
          err.message ||
            "Не удалось загрузить данные о вакцинации. Попробуйте позже."
        );
      } finally {
        setLoading(false);
      }
    };

    loadVaccine();
  }, [eventId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (!eventId) return;

    try {
      setLoading(true);

      await updateVaccine(parseInt(eventId, 10), {
        title: vaccineTitle || "Вакцинация",
        eventDate: eventDateRaw,
        medicine: cardsData.medicine,
        periodUnit: cardsData.periodUnit,
        reminderEnabled,
        reminderValue: reminderEnabled ? reminderValue : 0,
        reminderUnit: reminderEnabled ? reminderUnit : PERIOD_UNITS.MINUTE,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Ошибка сохранения вакцинации:", err);
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
    const confirmed = window.confirm("Точно удалить эту вакцинацию?");
    if (!confirmed) return;

    try {
      await deleteVaccine(parseInt(eventId, 10));
      navigate(-1);
    } catch (err) {
      console.error("Ошибка удаления вакцинации:", err);
      alert(err.message || "Не удалось удалить вакцинацию.");
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
            Загрузка данных о вакцинации...
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
              value={vaccineTitle}
              onChange={(e) => setVaccineTitle(e.target.value)}
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
              {vaccineTitle || "Вакцинация"} {eventId ? `#${eventId}` : ""}
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
                value={cardsData.medicine}
                onChange={(e) =>
                  handleCardFieldChange("medicine", e.target.value)
                }
              />
            ) : (
              <span className="h2 visit-card__value">
                {cardsData.medicine}
              </span>
            )}
          </div>

          {/* Периодичность */}
          <div className="visit-card">
            <span className="txt2 visit-card__label">Периодичность</span>

            {isEditing ? (
              <select
                className="h2 visit-card__value visit-card__input"
                value={cardsData.periodUnit}
                onChange={(e) =>
                  handleCardFieldChange("periodUnit", parseInt(e.target.value, 10))
                }
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  font: "inherit",
                  color: "var(--black)",
                }}
              >
                {PERIOD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <span className="h2 visit-card__value">
                {PERIOD_OPTIONS.find((opt) => opt.value === cardsData.periodUnit)?.label || "Раз в месяц"}
              </span>
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

export default VaccinePage;

