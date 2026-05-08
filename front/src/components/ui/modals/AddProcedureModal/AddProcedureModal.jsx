import { useEffect, useReducer, useState } from "react";

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

const getDefaultDate = () => new Date().toISOString().split("T")[0];

const getProcedureTypeByEventType = (eventType) => {
  switch (eventType) {
    case 2:
      return PROCEDURE_TYPES.DOCTOR_VISIT;
    case 0:
      return PROCEDURE_TYPES.VACCINE;
    case 1:
      return PROCEDURE_TYPES.TREATMENT;
    default:
      return PROCEDURE_TYPES.DOCTOR_VISIT;
  }
};

const getEventDateFields = (eventDate) => {
  if (!eventDate) {
    return {
      eventDate: getDefaultDate(),
      eventTime: "10:00",
    };
  }

  const eventDateTime = new Date(eventDate);

  if (Number.isNaN(eventDateTime.getTime())) {
    return {
      eventDate: getDefaultDate(),
      eventTime: "10:00",
    };
  }

  return {
    eventDate: eventDateTime.toISOString().split("T")[0],
    eventTime: eventDateTime.toTimeString().slice(0, 5),
  };
};

const getInitialFormState = (event = null) => ({
  procedureType: event
    ? getProcedureTypeByEventType(event.eventType)
    : PROCEDURE_TYPES.DOCTOR_VISIT,
  title: event?.title || "",
  ...getEventDateFields(event?.eventDate),
  reminderEnabled: event?.reminderEnabled ?? false,
  reminderValue: event?.reminderValue ?? 5,
  reminderUnit: event?.reminderUnit ?? PERIOD_UNITS.DAY,
  clinic: event?.clinic ?? "",
  doctor: event?.doctor ?? "",
  diagnosis: event?.diagnosis ?? "",
  recommendations: event?.recommendations ?? "",
  referrals: event?.referrals ?? "",
  medicine: event?.medicine ?? "",
  periodUnit: event?.periodUnit ?? PERIOD_UNITS.MONTH,
  remedy: event?.remedy ?? "",
  parasite: event?.parasite ?? "",
});

const formReducer = (state, action) => {
  switch (action.type) {
    case "reset":
      return action.payload;
    case "field":
      return {
        ...state,
        [action.name]: action.value,
      };
    case "procedureType":
      return {
        ...state,
        procedureType: action.value,
        title: "",
      };
    case "reminderOption":
      return {
        ...state,
        reminderValue: action.value,
        reminderUnit: action.unit,
      };
    default:
      return state;
  }
};

const AddProcedureModal = ({
  isOpen,
  onClose,
  isClosing,
  petId,
  onSuccess,
  event = null
}) => {
  const [form, dispatch] = useReducer(formReducer, null, () =>
    getInitialFormState(event)
  );
  const [loading, setLoading] = useState(false);

  // Сброс формы при открытии
  useEffect(() => {
    if (!isOpen) return;

    queueMicrotask(() => {
      dispatch({
        type: "reset",
        payload: getInitialFormState(event),
      });
      setLoading(false);
    });
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
    switch (form.procedureType) {
      case PROCEDURE_TYPES.DOCTOR_VISIT:
        return "Посещение врача";
      case PROCEDURE_TYPES.VACCINE:
        return "Вакцинация";
      case PROCEDURE_TYPES.TREATMENT:
        return "Обработка";
      default:
        return "Процедура";
    }
  };

  const handleReminderOptionClick = (value, unit) => {
    dispatch({ type: "reminderOption", value, unit });
  };

  const setField = (name) => (value) => {
    dispatch({ type: "field", name, value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventDateTime = new Date(`${form.eventDate}T${form.eventTime}`);
      const eventDateISO = eventDateTime.toISOString();

      const baseData = {
        petId: parseInt(petId, 10),
        title: form.title || getDefaultTitle(),
        eventDate: eventDateISO,
        reminderEnabled: form.reminderEnabled,
        reminderValue: form.reminderEnabled ? form.reminderValue : 0,
        reminderUnit: form.reminderEnabled ? form.reminderUnit : PERIOD_UNITS.DAY,
      };

      let result;

      switch (form.procedureType) {
        case PROCEDURE_TYPES.DOCTOR_VISIT: {
          result = await createDoctorVisit({
            ...baseData,
            clinic: form.clinic || null,
            doctor: form.doctor || null,
            diagnosis: form.diagnosis || null,
            recommendations: form.recommendations || null,
            referrals: form.referrals || null,
          });
          break;
        }

        case PROCEDURE_TYPES.VACCINE: {
          const vaccinePeriodValue = form.periodUnit !== null ? 1 : null;
          const nextVaccinationDate =
            vaccinePeriodValue && form.periodUnit !== null
              ? calculateNextDate(eventDateTime, vaccinePeriodValue, form.periodUnit)
              : null;

          result = await createVaccine({
            ...baseData,
            medicine: form.medicine || null,
            periodValue: vaccinePeriodValue,
            periodUnit: form.periodUnit !== null ? form.periodUnit : null,
            nextVaccinationDate: nextVaccinationDate?.toISOString() || null,
          });
          break;
        }

        case PROCEDURE_TYPES.TREATMENT: {
          const treatmentPeriodValue = form.periodUnit !== null ? 1 : null;
          const nextTreatmentDate =
            treatmentPeriodValue && form.periodUnit !== null
              ? calculateNextDate(eventDateTime, treatmentPeriodValue, form.periodUnit)
              : null;

          result = await createTreatment({
            ...baseData,
            remedy: form.remedy || null,
            parasite: form.parasite || null,
            periodValue: treatmentPeriodValue,
            periodUnit: form.periodUnit !== null ? form.periodUnit : null,
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
    } catch {
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
                  value={form.procedureType}
                  onChange={(e) => {
                    dispatch({ type: "procedureType", value: e.target.value });
                  }}
                  disabled={loading}
                >
                  <option value={PROCEDURE_TYPES.DOCTOR_VISIT}>Прием</option>
                  <option value={PROCEDURE_TYPES.VACCINE}>Вакцинация</option>
                  <option value={PROCEDURE_TYPES.TREATMENT}>Обработка</option>
                </select>
              </div>
            </li>
            {form.procedureType === PROCEDURE_TYPES.DOCTOR_VISIT && (
              <DoctorVisitFields
                loading={loading}
                title={form.title}
                setTitle={setField("title")}
                eventDate={form.eventDate}
                setEventDate={setField("eventDate")}
                eventTime={form.eventTime}
                setEventTime={setField("eventTime")}
                clinic={form.clinic}
                setClinic={setField("clinic")}
                doctor={form.doctor}
                setDoctor={setField("doctor")}
                diagnosis={form.diagnosis}
                setDiagnosis={setField("diagnosis")}
                recommendations={form.recommendations}
                setRecommendations={setField("recommendations")}
                referrals={form.referrals}
                setReferrals={setField("referrals")}
              />
            )}
            {form.procedureType === PROCEDURE_TYPES.VACCINE && (
              <VaccineFields
                loading={loading}
                title={form.title}
                setTitle={setField("title")}
                medicine={form.medicine}
                setMedicine={setField("medicine")}
                eventDate={form.eventDate}
                setEventDate={setField("eventDate")}
                eventTime={form.eventTime}
                setEventTime={setField("eventTime")}
                periodUnit={form.periodUnit}
                setPeriodUnit={setField("periodUnit")}
                periodOptions={PERIOD_OPTIONS}
              />
            )}
            {form.procedureType === PROCEDURE_TYPES.TREATMENT && (
              <TreatmentFields
                loading={loading}
                title={form.title}
                setTitle={setField("title")}
                remedy={form.remedy}
                setRemedy={setField("remedy")}
                parasite={form.parasite}
                setParasite={setField("parasite")}
                eventDate={form.eventDate}
                setEventDate={setField("eventDate")}
                eventTime={form.eventTime}
                setEventTime={setField("eventTime")}
                periodUnit={form.periodUnit}
                setPeriodUnit={setField("periodUnit")}
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
                  checked={form.reminderEnabled}
                  onChange={(e) =>
                    dispatch({
                      type: "field",
                      name: "reminderEnabled",
                      value: e.target.checked,
                    })
                  }
                  disabled={loading}
                />
              </div>
            </li>
            {form.reminderEnabled && (
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
                          form.reminderValue === option.value && 
                          form.reminderUnit === option.unit 
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
