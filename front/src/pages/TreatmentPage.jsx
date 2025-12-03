import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/doctor-visit.css";
import "../styles/procedure-modal.css";
import { getTreatment, updateTreatment, deleteTreatment } from "../api/events";
import { PERIOD_UNITS, PERIOD_OPTIONS, REMINDER_OPTIONS } from "../constants/eventConstants";
import { formatEventDateTime, formatDateForInput, formatTimeForInput, combineDateTimeToISO } from "../utils/dateUtils";
import EventPageHeader from "../components/events/EventPageHeader";
import EventCard from "../components/events/EventCard";
import EventSection from "../components/events/EventSection";
import ReminderSection from "../components/events/ReminderSection";
import LoadingState from "../components/events/LoadingState";
import ErrorState from "../components/events/ErrorState";

const TreatmentPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

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

        const { date, time } = formatEventDateTime(treatment.eventDate);
        const dateInput = formatDateForInput(treatment.eventDate);
        const timeInput = formatTimeForInput(treatment.eventDate);

        setCardsData({
          date,
          time,
          dateInput,
          timeInput,
          remedy: treatment.remedy || "",
          parasite: treatment.parasite || "",
          periodUnit: treatment.periodUnit ?? PERIOD_UNITS.MONTH,
        });

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
        reminderUnit: reminderEnabled ? reminderUnit : PERIOD_UNITS.MONTH,
      });
      
      // Обновляем отображаемые дату и время после сохранения
      const { date, time } = formatEventDateTime(eventDateRaw);
      setCardsData((prev) => ({
        ...prev,
        date,
        time,
      }));
      
      setIsEditing(false);
    } catch (err) {
      console.error("Ошибка сохранения обработки:", err);
      alert(err.message || "Не удалось сохранить изменения.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardFieldChange = (field, value) => {
    setCardsData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };
      
      // Если изменяется дата или время, обновляем eventDateRaw
      if (field === "dateInput" || field === "timeInput") {
        const dateInput = field === "dateInput" ? value : prev.dateInput;
        const timeInput = field === "timeInput" ? value : prev.timeInput;
        const newEventDate = combineDateTimeToISO(dateInput, timeInput);
        if (newEventDate) {
          setEventDateRaw(newEventDate);
        }
      }
      
      return updated;
    });
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
    return <LoadingState message="Загрузка данных об обработке..." />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <main className="main-page doctor-visit-page">
      <div className="container">
        <EventPageHeader
          title={treatmentTitle}
          eventId={eventId}
          isEditing={isEditing}
          onEdit={handleEditClick}
          onSave={handleSaveClick}
          onDelete={handleDelete}
          onTitleChange={setTreatmentTitle}
          loading={loading}
        />

        {/* Верхние карточки */}
        <section className="doctor-visit-cards">
          <EventCard
            label="Дата и время"
            value={{
              displayDate: cardsData.date,
              displayTime: cardsData.time,
              dateInput: cardsData.dateInput,
              timeInput: cardsData.timeInput,
            }}
            isEditing={isEditing}
            onChange={(value) => {
              if (value.dateInput) {
                handleCardFieldChange("dateInput", value.dateInput);
              }
              if (value.timeInput) {
                handleCardFieldChange("timeInput", value.timeInput);
              }
            }}
            type="datetime"
          />

          <EventCard
            label="Препарат"
            value={cardsData.remedy}
            isEditing={isEditing}
            onChange={(value) => handleCardFieldChange("remedy", value)}
          />

          <EventCard
            label="Паразит"
            value={cardsData.parasite}
            isEditing={isEditing}
            onChange={(value) => handleCardFieldChange("parasite", value)}
          />
        </section>

        {/* Периодичность */}
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

        {/* Напоминания */}
        <ReminderSection
          reminderEnabled={reminderEnabled}
          reminderValue={reminderValue}
          reminderUnit={reminderUnit}
          isEditing={isEditing}
          onToggle={setReminderEnabled}
          onOptionClick={(value, unit) => {
            setReminderValue(value);
            setReminderUnit(unit);
          }}
        />
      </div>
    </main>
  );
};

export default TreatmentPage;
