import { useState, useEffect } from "react";

import {
  createDoctorVisit,
  createVaccine,
  createTreatment,
} from "../../../../api/events";

import DoctorVisitFields from "./DoctorVisitFields";
import VaccineFields from "./VaccineFields";
import TreatmentFields from "./TreatmentFields";
import {
  EVENT_TYPES,
  PERIOD_UNITS,
  PERIOD_OPTIONS,
  REMINDER_OPTIONS,
} from "../../../../constants/eventConstants";
import NotificationService, { notifyError } from "../../../../services/notificationService";
import { NOTIFICATION_TITLES } from "../../../../constants/config";

const PROCEDURE_TYPES = EVENT_TYPES;

const AddProcedureModal = ({
  isOpen,
  onClose,
  isClosing,
  petId,
  onSuccess,
  event = null
}) => {
  const [procedureType, setProcedureType] = useState("");
  const [loading, setLoading] = useState(false);

  // Общие поля
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("10:00");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderValue, setReminderValue] = useState(5);
  const [reminderUnit, setReminderUnit] = useState(PERIOD_UNITS.MINUTE);

  // Поля для посещения врача
  const [clinic, setClinic] = useState("");
  const [doctor, setDoctor] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [referrals, setReferrals] = useState("");

  // Поля для вакцинации
  const [medicine, setMedicine] = useState("");
  const [periodUnit, setPeriodUnit] = useState(PERIOD_UNITS.MONTH);

  // Поля для обработки
  const [remedy, setRemedy] = useState("");
  const [parasite, setParasite] = useState("");

  // Сброс формы при открытии
  useEffect(() => {
    if (!isOpen) return;

    if (event) {
      switch (event.eventType) {
        case 2:
          setProcedureType(PROCEDURE_TYPES.DOCTOR_VISIT);
          break;
        case 0:
          setProcedureType(PROCEDURE_TYPES.VACCINE);
          break;
        case 1:
          setProcedureType(PROCEDURE_TYPES.TREATMENT);
          break;
      }

      setTitle(event.title || "");

      let dateStr;
      let timeStr;
      if (event.eventDate) {
        const eventDateTime = new Date(event.eventDate);
        if (!isNaN(eventDateTime.getTime())) {
          dateStr = eventDateTime.toISOString().split("T")[0];
          timeStr = eventDateTime.toTimeString().slice(0, 5);
        } else {
          const now = new Date();
          dateStr = now.toISOString().split("T")[0];
          timeStr = "10:00";
        }
      }
      
      setEventDate(dateStr);
      setEventTime(timeStr);

      setReminderEnabled(event.reminderEnabled ??false);
      setReminderValue(event.reminderValue ?? 5);
      setReminderUnit(event.reminderUnit ?? PERIOD_UNITS.MINUTE);

      switch (event.eventType) {
        case 2:
          setClinic(event.clinic ?? "");
          setDoctor(event.doctor ?? "");
          setDiagnosis(event.diagnosis ?? "");
          setRecommendations(event.recommendations ?? "");
          setReferrals(event.referrals ?? "");
          break;
        case 0:
          setMedicine(event.medicine ?? "");
          setPeriodUnit(event.periodUnit ?? PERIOD_UNITS.MONTH);
          break;
        case 1:
          setRemedy(event.remedy ?? "");
          setParasite(event.parasite ?? "");
          setPeriodUnit(event.periodUnit ?? PERIOD_UNITS.MONTH);
          break;
        default:
          break;
      }
    } else {
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0];

      setProcedureType(PROCEDURE_TYPES.DOCTOR_VISIT);
      setLoading(false);

      // Общие
      setTitle("");
      setEventDate(dateStr);
      setEventTime("10:00");
      setReminderEnabled(false);
      setReminderValue(5);
      setReminderUnit(PERIOD_UNITS.MINUTE);

      // Доктор
      setClinic("");
      setDoctor("");
      setDiagnosis("");
      setRecommendations("");
      setReferrals("");

      // Вакцина
      setMedicine("");
      setPeriodUnit(PERIOD_UNITS.MONTH);

      // Обработка
      setRemedy("");
      setParasite("");
    }
  }, [isOpen, event]);

  // Блокируем скролл body, пока модалка открыта
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    if (!loading) onClose();
  };

  const calculateNextDate = (startDate, value, unit) => {
    const nextDate = new Date(startDate);
    switch (unit) {
      case PERIOD_UNITS.DAY:
        nextDate.setDate(nextDate.getDate() + value);
        break;
      case PERIOD_UNITS.WEEK:
        nextDate.setDate(nextDate.getDate() + value * 7);
        break;
      case PERIOD_UNITS.MONTH:
        nextDate.setMonth(nextDate.getMonth() + value);
        break;
      case PERIOD_UNITS.YEAR:
        nextDate.setFullYear(nextDate.getFullYear() + value);
        break;
      default:
        break;
    }
    return nextDate;
  };

  const getDefaultTitle = () => {
    switch (procedureType) {
      case PROCEDURE_TYPES.DOCTOR_VISIT || 2:
        return "Посещение врача";
      case PROCEDURE_TYPES.VACCINE || 0:
        return "Вакцинация";
      case PROCEDURE_TYPES.TREATMENT || 1:
        return "Обработка";
      default:
        return "Процедура";
    }
  };

  const handleReminderOptionClick = (value, unit) => {
    setReminderValue(value);
    setReminderUnit(unit);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventDateTime = new Date(`${eventDate}T${eventTime}`);
      const eventDateISO = eventDateTime.toISOString();

      const baseData = {
        petId: parseInt(petId, 10),
        title: title || getDefaultTitle(),
        eventDate: eventDateISO,
        reminderEnabled,
        reminderValue: reminderEnabled ? reminderValue : 0,
        reminderUnit: reminderEnabled ? reminderUnit : PERIOD_UNITS.MINUTE,
      };

      let result;

      switch (procedureType) {
        case PROCEDURE_TYPES.DOCTOR_VISIT: {
          result = await createDoctorVisit({
            ...baseData,
            clinic: clinic || null,
            doctor: doctor || null,
            diagnosis: diagnosis || null,
            recommendations: recommendations || null,
            referrals: referrals || null,
          });
          break;
        }

        case PROCEDURE_TYPES.VACCINE: {
          const vaccinePeriodValue = periodUnit !== null ? 1 : null;
          const nextVaccinationDate =
            vaccinePeriodValue && periodUnit !== null
              ? calculateNextDate(eventDateTime, vaccinePeriodValue, periodUnit)
              : null;

          result = await createVaccine({
            ...baseData,
            medicine: medicine || null,
            periodValue: vaccinePeriodValue,
            periodUnit: periodUnit !== null ? periodUnit : null,
            nextVaccinationDate: nextVaccinationDate?.toISOString() || null,
          });
          break;
        }

        case PROCEDURE_TYPES.TREATMENT: {
          const treatmentPeriodValue = periodUnit !== null ? 1 : null;
          const nextTreatmentDate =
            treatmentPeriodValue && periodUnit !== null
              ? calculateNextDate(eventDateTime, treatmentPeriodValue, periodUnit)
              : null;

          result = await createTreatment({
            ...baseData,
            remedy: remedy || null,
            parasite: parasite || null,
            periodValue: treatmentPeriodValue,
            periodUnit: periodUnit !== null ? periodUnit : null,
            nextTreatmentDate: nextTreatmentDate?.toISOString() || null,
          });
          break;
        }

        default:
          NotificationService.showWarning?.(
            "Неизвестный тип процедуры",
            NOTIFICATION_TITLES.WARNING
          );
      }

      if (onSuccess) onSuccess(result);
      onClose();
    } catch (err) {
      console.log(err);
      notifyError(`При создании процедуры произошла ошибка`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <form className={`form ${isClosing ? "form--closing" : ""}`} onSubmit={handleSubmit}>
      <div className="form__inner">
        <header className="form__header">
          <h2 className="form__title h1">Добавить процедуру</h2>
          <div className="form__close-button-wrapper">
            <button
              className="form__close-button cross-button"
              type="button"
              disabled={loading}
              onClick={handleClose}
            >
              <span className="visually-hidden">Закрыть форму</span>
            </button>
          </div>
        </header>
        <div className="form__body">
          <ul className="form__list">
            <li className="form__item">
              <label
                className="form__item-label h3"
                htmlFor="add-procedure-type-select"
              >
                Выберите тип
              </label>
              <div className="form__item-input select">
                <select
                  className="select__field"
                  id="add-procedure-type-select"
                  name="add-procedure-type-select"
                  value={procedureType}
                  onChange={(e) => {
                    setProcedureType(e.target.value);
                    setTitle("");
                  }}
                  disabled={loading}
                >
                  <option value={PROCEDURE_TYPES.DOCTOR_VISIT}>Прием</option>
                  <option value={PROCEDURE_TYPES.VACCINE}>Вакцинация</option>
                  <option value={PROCEDURE_TYPES.TREATMENT}>Обработка</option>
                </select>
              </div>
            </li>
            {procedureType === PROCEDURE_TYPES.DOCTOR_VISIT && (
              <DoctorVisitFields
                loading={loading}
                title={title}
                setTitle={setTitle}
                eventDate={eventDate}
                setEventDate={setEventDate}
                eventTime={eventTime}
                setEventTime={setEventTime}
                clinic={clinic}
                setClinic={setClinic}
                doctor={doctor}
                setDoctor={setDoctor}
                diagnosis={diagnosis}
                setDiagnosis={setDiagnosis}
                recommendations={recommendations}
                setRecommendations={setRecommendations}
                referrals={referrals}
                setReferrals={setReferrals}
              />
            )}
            {procedureType === PROCEDURE_TYPES.VACCINE && (
              <VaccineFields
                loading={loading}
                title={title}
                setTitle={setTitle}
                medicine={medicine}
                setMedicine={setMedicine}
                eventDate={eventDate}
                setEventDate={setEventDate}
                eventTime={eventTime}
                setEventTime={setEventTime}
                periodUnit={periodUnit}
                setPeriodUnit={setPeriodUnit}
                periodOptions={PERIOD_OPTIONS}
              />
            )}
            {procedureType === PROCEDURE_TYPES.TREATMENT && (
              <TreatmentFields
                loading={loading}
                title={title}
                setTitle={setTitle}
                remedy={remedy}
                setRemedy={setRemedy}
                parasite={parasite}
                setParasite={setParasite}
                eventDate={eventDate}
                setEventDate={setEventDate}
                eventTime={eventTime}
                setEventTime={setEventTime}
                periodUnit={periodUnit}
                setPeriodUnit={setPeriodUnit}
                periodOptions={PERIOD_OPTIONS}
              />
            )}
            <li className="form__item form__item--row">
              <label
                className="form__item-label h3 toggle__label"
                htmlFor="add-procedure-telegram-notification-input"
              >
                Напоминание в Telegram
              </label>
              <div className="toggle">
                <input
                  className="toggle__input"
                  id="add-procedure-telegram-notification-input"
                  name="add-procedure-telegram-notification-input"
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  disabled={loading}
                />
              </div>
            </li>
            {reminderEnabled && (
              <li className="form__item form__item--row">
                <label
                  className="form__item-label h3 toggle__label"
                  htmlFor="add-procedure-telegram-notification-time-choice"
                >
                  Напоминать за
                </label>
                <ul className="toggle toggle__list">
                  {REMINDER_OPTIONS.map((option) => (
                    <li className="toggle__item" key={`${option.value}-${option.unit}`}>
                      <button
                        className={`toggle__button ${
                          reminderValue === option.value && 
                          reminderUnit === option.unit 
                            ? "toggle__button--active" 
                            : ""
                        }`}
                        type="button"
                        onClick={() =>
                          handleReminderOptionClick(option.value, option.unit)
                        }
                        disabled={loading}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </div>
        <footer className="form__footer">
          <button
            className="button button--outlined"
            type="button"
            onClick={handleClose}
            disabled={loading}
          >
            Отменить
          </button>
          <button
            className="button button--filled"
            type="submit"
            disabled={loading}
          >
            {loading ? "Добавление..." : "Добавить"}
          </button>
        </footer>
      </div>
    </form>
  );
};

export default AddProcedureModal;