import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/doctor-visit.css";
import "../styles/procedure-modal.css";
import { getVaccine, updateVaccine, deleteVaccine } from "../api/events";
import { PERIOD_UNITS, PERIOD_OPTIONS, REMINDER_OPTIONS } from "../constants/eventConstants";
import { formatEventDateTime, formatDateForInput, formatTimeForInput, combineDateTimeToISO } from "../utils/dateUtils";
import EventPageHeader from "../components/events/EventPageHeader";
import EventCard from "../components/events/EventCard";
import ReminderSection from "../components/events/ReminderSection";
import LoadingState from "../components/events/LoadingState";
import ErrorState from "../components/events/ErrorState";

const VaccinePage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

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

        const { date, time } = formatEventDateTime(vaccine.eventDate);
        const dateInput = formatDateForInput(vaccine.eventDate);
        const timeInput = formatTimeForInput(vaccine.eventDate);

        setCardsData({
          date,
          time,
          dateInput,
          timeInput,
          medicine: vaccine.medicine || "",
          periodUnit: vaccine.periodUnit ?? PERIOD_UNITS.MONTH,
        });

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
      
      // Обновляем отображаемые дату и время после сохранения
      const { date, time } = formatEventDateTime(eventDateRaw);
      setCardsData((prev) => ({
        ...prev,
        date,
        time,
      }));
      
      setIsEditing(false);
    } catch (err) {
      console.error("Ошибка сохранения вакцинации:", err);
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
    return <LoadingState message="Загрузка данных о вакцинации..." />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <main className="main-page doctor-visit-page">
      <div className="container">
        <EventPageHeader
          title={vaccineTitle}
          eventId={eventId}
          isEditing={isEditing}
          onEdit={handleEditClick}
          onSave={handleSaveClick}
          onDelete={handleDelete}
          onTitleChange={setVaccineTitle}
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
            value={cardsData.medicine}
            isEditing={isEditing}
            onChange={(value) => handleCardFieldChange("medicine", value)}
          />

          <EventCard
            label="Периодичность"
            value={cardsData.periodUnit}
            isEditing={isEditing}
            onChange={(value) => handleCardFieldChange("periodUnit", value)}
            type="select"
            options={PERIOD_OPTIONS}
          />
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

export default VaccinePage;
