import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/doctor-visit.css";
import "../styles/procedure-modal.css";
import {
  getDoctorVisit,
  deleteDoctorVisit,
} from "../api/events";
import { PERIOD_UNITS } from "../constants/eventConstants";
import { formatEventDateTime, formatDateForInput, formatTimeForInput } from "../utils/dateUtils";
import EventPageHeader from "../components/events/EventPageHeader";
import EventCard from "../components/events/EventCard";
import EventSection from "../components/events/EventSection";
import ReminderSection from "../components/events/ReminderSection";
import LoadingState from "../components/events/LoadingState";
import ErrorState from "../components/events/ErrorState";
import AddProcedureModal from "../components/AddProcedureModal/AddProcedureModal";

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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [eventData, setEventData] = useState(null);

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

        // Сохраняем данные события для редактирования с добавлением типа события
        setEventData({
          ...visit,
          eventType: "DoctorVisit",
          id: visit.id || parseInt(eventId, 10),
        });
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
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = async (updatedEvent) => {
    // Перезагружаем данные после успешного редактирования
    try {
      setLoading(true);
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
      setEventData({
        ...visit,
        eventType: "DoctorVisit",
        id: visit.id || parseInt(eventId, 10),
      });
    } catch (err) {
      console.error("Ошибка обновления данных:", err);
    } finally {
      setLoading(false);
    }
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
          onEdit={handleEditClick}
          onDelete={handleDelete}
          loading={loading}
        />

        {/* Верхние карточки */}
        <section className="doctor-visit-cards">
          <EventCard
            label="Дата и время"
            value={{
              displayDate: cardsData.date,
              displayTime: cardsData.time,
            }}
            type="datetime"
          />

          <EventCard
            label="Клиника"
            value={cardsData.clinic}
          />

          <EventCard
            label="Врач"
            value={cardsData.doctor}
          />
        </section>

        {/* Секции */}
        <EventSection
          title="Диагноз"
          value={visitData.diagnosis}
        />

        <EventSection
          title="Рекомендации"
          value={visitData.recommendations}
        />

        <EventSection
          title="Направления"
          value={visitData.directions}
        />

        {/* Напоминания */}
        <ReminderSection
          reminderEnabled={reminderEnabled}
          reminderValue={reminderValue}
          reminderUnit={reminderUnit}
        />
      </div>

      {/* Модальное окно редактирования */}
      {eventData && (
        <AddProcedureModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          petId={eventData.petId}
          onSuccess={handleEditSuccess}
          editEvent={eventData}
        />
      )}
    </main>
  );
};

export default DoctorVisitPage;
