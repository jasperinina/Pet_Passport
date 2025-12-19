import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/doctor-visit.css";
import "../styles/procedure-modal.css";
import { getVaccine, deleteVaccine } from "../api/events";
import { formatEventDateTime, formatDateForInput, formatTimeForInput } from "../utils/dateUtils";
import { PERIOD_UNITS, PERIOD_OPTIONS } from "../constants/eventConstants";
import EventPageHeader from "../components/events/EventPageHeader";
import EventCard from "../components/events/EventCard";
import ReminderSection from "../components/events/ReminderSection";
import LoadingState from "../components/events/LoadingState";
import ErrorState from "../components/events/ErrorState";
import AddProcedureModal from "../components/AddProcedureModal/AddProcedureModal";

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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [eventData, setEventData] = useState(null);

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

        // Сохраняем данные события для редактирования с добавлением типа события
        setEventData({
          ...vaccine,
          eventType: "Vaccine",
          id: vaccine.id || parseInt(eventId, 10),
        });
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
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = async (updatedEvent) => {
    // Перезагружаем данные после успешного редактирования
    try {
      setLoading(true);
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
      setEventData({
        ...vaccine,
        eventType: "Vaccine",
        id: vaccine.id || parseInt(eventId, 10),
      });
    } catch (err) {
      console.error("Ошибка обновления данных:", err);
    } finally {
      setLoading(false);
    }
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
            value={cardsData.medicine}
          />

          <EventCard
            label="Периодичность"
            value={PERIOD_OPTIONS.find((opt) => opt.value === cardsData.periodUnit)?.label || "Раз в месяц"}
          />
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

export default VaccinePage;
