import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import EventPageHeader from "../../components/events/EventPageHeader";
import EventCard from "../../components/events/EventCard/EventCard";
import EventSection from "../../components/events/EventSection/EventSection";
import ReminderSection from "../../components/events/ReminderSection";
import LoadingState from "../../components/events/LoadingState/LoadingState";

import { getTreatment, updateTreatment, deleteTreatment, updateEventStatus } from "../../api/events";
import { EVENT_STATUSES, PAST_EVENT_STATUS_OPTIONS, PERIOD_UNITS, PERIOD_OPTIONS } from "../../constants/eventConstants";
import { formatEventDateTime, formatDateForInput, formatTimeForInput, combineDateTimeToISO } from "../../utils/dateUtils";
import NotificationService from "../../services/notificationService";
import { ERROR_MESSAGES } from "../../constants/config";
import { logger } from "../../utils/logger";

const TreatmentPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [treatmentTitle, setTreatmentTitle] = useState("");
  const [eventDateRaw, setEventDateRaw] = useState(null);
  const [eventStatus, setEventStatus] = useState(null);
  const [initialEventStatus, setInitialEventStatus] = useState(null);

  const [cardsData, setCardsData] = useState({
    date: "",
    time: "",
    remedy: "",
    parasite: "",
    periodUnit: PERIOD_UNITS.MONTH,
  });

  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderValue, setReminderValue] = useState(5);
  const [reminderUnit, setReminderUnit] = useState(PERIOD_UNITS.DAY);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadTreatment = async () => {
      if (!eventId) return;

      try {
        setLoading(true);

        const treatment = await getTreatment(parseInt(eventId, 10));

        const status = treatment.status ?? treatment.Status ?? null;

        setTreatmentTitle(treatment.title || "Обработка");
        setEventDateRaw(treatment.eventDate);
        setEventStatus(status);
        setInitialEventStatus(status);

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
        setReminderUnit(treatment.reminderUnit ?? PERIOD_UNITS.DAY);
      } catch (err) {
        logger.error("Ошибка загрузки обработки:", err);

        NotificationService.showError?.(
          err.message || "Не удалось загрузить данные об обработке. Попробуйте позже.",
          ERROR_MESSAGES.ERROR_TITLE
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

      if (eventStatus !== null && eventStatus !== initialEventStatus) {
        await updateEventStatus(parseInt(eventId, 10), eventStatus);
        setInitialEventStatus(eventStatus);
      }
      
      // Обновляем отображаемые дату и время после сохранения
      const { date, time } = formatEventDateTime(eventDateRaw);
      setCardsData((prev) => ({
        ...prev,
        date,
        time,
      }));
      
      setIsEditing(false);
    } catch (err) {
      logger.error("Ошибка сохранения обработки:", err);

      NotificationService.showError?.(
        err.message || "Не удалось сохранить изменения.",
        ERROR_MESSAGES.ERROR_TITLE
      );
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
      logger.error("Ошибка удаления обработки:", err);

      NotificationService.showError?.(
        err.message || "Не удалось удалить обработку.",
        ERROR_MESSAGES.ERROR_TITLE
      );
    }
  };

  if (loading && !cardsData.date) {
    return <LoadingState message="Загрузка данных об обработке..." />;
  }

  const isPastProcedure = eventStatus !== null && eventStatus !== EVENT_STATUSES.UPCOMING;

  return (
    <div>
      <section className="section container">
        <div className="section__grid">
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
          {isPastProcedure && (
            <EventCard
              label="Статус"
              value={eventStatus}
              isEditing={isEditing}
              onChange={setEventStatus}
              type="select"
              options={PAST_EVENT_STATUS_OPTIONS}
            />
          )}
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
        </div>
        <div className="section__body">
          <EventSection
            title="Периодичность"
            value={cardsData.periodUnit}
            isEditing={isEditing}
            onChange={(e) => handleCardFieldChange("periodUnit", parseInt(e.target.value, 10))}
            type="select"
          />
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
      </section>
    </div>
  );
};

export default TreatmentPage;
