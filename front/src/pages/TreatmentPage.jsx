import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/doctor-visit.css";
import "../styles/procedure-modal.css";
import { getTreatment, deleteTreatment } from "../api/events";
import { PERIOD_UNITS, PERIOD_OPTIONS } from "../constants/eventConstants";
import { formatEventDateTime, formatDateForInput, formatTimeForInput } from "../utils/dateUtils";
import EventPageHeader from "../components/events/EventPageHeader";
import EventCard from "../components/events/EventCard";
import ReminderSection from "../components/events/ReminderSection";
import LoadingState from "../components/events/LoadingState";
import ErrorState from "../components/events/ErrorState";
import AddProcedureModal from "../components/AddProcedureModal/AddProcedureModal";

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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [eventData, setEventData] = useState(null);

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

        // Сохраняем данные события для редактирования с добавлением типа события
        setEventData({
          ...treatment,
          eventType: "Treatment",
          id: treatment.id || parseInt(eventId, 10),
        });
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
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = async (updatedEvent) => {
    // Перезагружаем данные после успешного редактирования
    try {
      setLoading(true);
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
      setEventData({
        ...treatment,
        eventType: "Treatment",
        id: treatment.id || parseInt(eventId, 10),
      });
    } catch (err) {
      console.error("Ошибка обновления данных:", err);
    } finally {
      setLoading(false);
    }
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
            label="Препарат"
            value={cardsData.remedy}
          />

          <EventCard
            label="Паразит"
            value={cardsData.parasite}
          />
        </section>

        {/* Периодичность */}
        <section className="doctor-visit-section">
          <h2 className="h1 doctor-visit-section__title">Периодичность</h2>
          <div className="doctor-visit-section__card">
            <p className="txt1 doctor-visit-section__text">
              {PERIOD_OPTIONS.find((opt) => opt.value === cardsData.periodUnit)?.label || "Раз в месяц"}
            </p>
          </div>
        </section>

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

export default TreatmentPage;
