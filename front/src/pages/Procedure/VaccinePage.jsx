import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import EventPageHeader from "../../components/events/EventPageHeader";
import EventCard from "../../components/events/EventCard/EventCard";
import ReminderSection from "../../components/events/ReminderSection";
import LoadingState from "../../components/events/LoadingState/LoadingState";

import { getVaccine, updateVaccine, deleteVaccine } from "../../api/events";
import { PERIOD_UNITS, PERIOD_OPTIONS } from "../../constants/eventConstants";
import { formatEventDateTime, formatDateForInput, formatTimeForInput, combineDateTimeToISO } from "../../utils/dateUtils";
import NotificationService from "../../services/notificationService";
import { ERROR_MESSAGES } from "../../constants/config";
import { logger } from "../../utils/logger";

const VaccinePage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

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
  const [reminderUnit, setReminderUnit] = useState(PERIOD_UNITS.DAY);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadVaccine = async () => {
      if (!eventId) return;

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
        setReminderUnit(vaccine.reminderUnit ?? PERIOD_UNITS.DAY);
      } catch (err) {
        logger.error("Ошибка загрузки вакцинации:", err);

        NotificationService.showError?.(
          err.message || "Не удалось загрузить данные о вакцинации. Попробуйте позже.",
          ERROR_MESSAGES.ERROR_TITLE
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
        reminderUnit: reminderEnabled ? reminderUnit : PERIOD_UNITS.DAY,
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
      logger.error("Ошибка сохранения вакцинации:", err);

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
    const confirmed = window.confirm("Точно удалить эту вакцинацию?");
    if (!confirmed) return;

    try {
      await deleteVaccine(parseInt(eventId, 10));
      navigate(-1);
    } catch (err) {
      logger.error("Ошибка удаления вакцинации:", err);

      NotificationService.showError?.(
        err.message || "Не удалось удалить вакцинацию.",
        ERROR_MESSAGES.ERROR_TITLE
      );
    }
  };

  if (loading && !cardsData.date) {
    return <LoadingState message="Загрузка данных о вакцинации..." />;
  }

  return (
    <div>
      <section className="section container">
        <div className="section__grid">
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
        </div>
        <div className="section__body">
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

export default VaccinePage;
