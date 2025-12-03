import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/doctor-visit.css";
import "../styles/procedure-modal.css";
import {
  getDoctorVisit,
  updateDoctorVisit,
  deleteDoctorVisit,
} from "../api/events";
import { PERIOD_UNITS, REMINDER_OPTIONS } from "../constants/eventConstants";
import { formatEventDateTime, formatDateForInput, formatTimeForInput, combineDateTimeToISO } from "../utils/dateUtils";
import EventPageHeader from "../components/events/EventPageHeader";
import EventCard from "../components/events/EventCard";
import EventSection from "../components/events/EventSection";
import ReminderSection from "../components/events/ReminderSection";
import LoadingState from "../components/events/LoadingState";
import ErrorState from "../components/events/ErrorState";

const DoctorVisitPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [visitTitle, setVisitTitle] = useState("");
  const [eventDateRaw, setEventDateRaw] = useState(null);

  const [cardsData, setCardsData] = useState({
    date: "",
    time: "",
    clinic: "",
    doctor: "",
  });

  const [visitData, setVisitData] = useState({
    diagnosis: "",
    recommendations: "",
    directions: "",
  });

  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderValue, setReminderValue] = useState(5);
  const [reminderUnit, setReminderUnit] = useState(PERIOD_UNITS.MINUTE);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadVisit = async () => {
      if (!eventId) return;

      try {
        setLoading(true);
        setError(null);

        const visit = await getDoctorVisit(parseInt(eventId, 10));

        setVisitTitle(visit.title || "Прием");
        setEventDateRaw(visit.eventDate);

        const { date, time } = formatEventDateTime(visit.eventDate);
        const dateInput = formatDateForInput(visit.eventDate);
        const timeInput = formatTimeForInput(visit.eventDate);

        setCardsData({
          date,
          time,
          dateInput,
          timeInput,
          clinic: visit.clinic || "",
          doctor: visit.doctor || "",
        });

        setVisitData({
          diagnosis: visit.diagnosis || "",
          recommendations: visit.recommendations || "",
          directions: visit.referrals || "",
        });

        setReminderEnabled(visit.reminderEnabled || false);
        setReminderValue(visit.reminderValue ?? 5);
        setReminderUnit(visit.reminderUnit ?? PERIOD_UNITS.MINUTE);
      } catch (err) {
        console.error("Ошибка загрузки приема:", err);
        setError(
          err.message ||
            "Не удалось загрузить данные о приеме. Попробуйте позже."
        );
      } finally {
        setLoading(false);
      }
    };

    loadVisit();
  }, [eventId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (!eventId) return;

    try {
      setLoading(true);

      await updateDoctorVisit(parseInt(eventId, 10), {
        title: visitTitle || "Прием",
        eventDate: eventDateRaw,
        clinic: cardsData.clinic,
        doctor: cardsData.doctor,
        diagnosis: visitData.diagnosis,
        recommendations: visitData.recommendations,
        referrals: visitData.directions,
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
      console.error("Ошибка сохранения приема:", err);
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

  const handleSectionChange = (field, value) => {
    setVisitData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDelete = async () => {
    if (!eventId) return;
    const confirmed = window.confirm("Точно удалить этот прием?");
    if (!confirmed) return;

    try {
      await deleteDoctorVisit(parseInt(eventId, 10));
      navigate(-1);
    } catch (err) {
      console.error("Ошибка удаления приема:", err);
      alert(err.message || "Не удалось удалить прием.");
    }
  };

  if (loading && !cardsData.date) {
    return <LoadingState message="Загрузка данных о приеме..." />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <main className="main-page doctor-visit-page">
      <div className="container">
        <EventPageHeader
          title={visitTitle}
          eventId={eventId}
          isEditing={isEditing}
          onEdit={handleEditClick}
          onSave={handleSaveClick}
          onDelete={handleDelete}
          onTitleChange={setVisitTitle}
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
            label="Клиника"
            value={cardsData.clinic}
            isEditing={isEditing}
            onChange={(value) => handleCardFieldChange("clinic", value)}
            type="textarea"
          />

          <EventCard
            label="Врач"
            value={cardsData.doctor}
            isEditing={isEditing}
            onChange={(value) => handleCardFieldChange("doctor", value)}
          />
        </section>

        {/* Секции */}
        <EventSection
          title="Диагноз"
          value={visitData.diagnosis}
          isEditing={isEditing}
          onChange={(value) => handleSectionChange("diagnosis", value)}
        />

        <EventSection
          title="Рекомендации"
          value={visitData.recommendations}
          isEditing={isEditing}
          onChange={(value) => handleSectionChange("recommendations", value)}
        />

        <EventSection
          title="Направления"
          value={visitData.directions}
          isEditing={isEditing}
          onChange={(value) => handleSectionChange("directions", value)}
        />

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

export default DoctorVisitPage;
