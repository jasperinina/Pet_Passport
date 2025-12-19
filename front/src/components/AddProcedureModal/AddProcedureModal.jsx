import { useState, useEffect } from "react";
import CrossIcon from "../../assets/icons/icon-cross.svg";
import ArrowIcon from "../../assets/icons/icon-arrow.svg";

// общие стили модалок и процедур
import "../../styles/modal.css";
import "../../styles/procedure-modal.css";

// стили по типам процедур
import "../../styles/procedure-doctor.css";
import "../../styles/procedure-vaccine.css";
import "../../styles/procedure-treatment.css";

import {
  createDoctorVisit,
  createVaccine,
  createTreatment,
  updateDoctorVisit,
  updateVaccine,
  updateTreatment,
} from "../../api/events";

import DoctorVisitFields from "./DoctorVisitFields";
import VaccineFields from "./VaccineFields";
import TreatmentFields from "./TreatmentFields";
import {
  EVENT_TYPES,
  PERIOD_UNITS,
  PERIOD_OPTIONS,
  REMINDER_OPTIONS,
} from "../../constants/eventConstants";
import { formatDateForInput, formatTimeForInput } from "../../utils/dateUtils";

const PROCEDURE_TYPES = EVENT_TYPES;

const AddProcedureModal = ({ isOpen, onClose, petId, onSuccess, editEvent = null }) => {
  const [procedureType, setProcedureType] = useState(
    PROCEDURE_TYPES.DOCTOR_VISIT
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Общие поля
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("13:00");
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

  // Сброс формы при открытии или предзаполнение при редактировании
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setLoading(false);

      if (editEvent) {
        // Режим редактирования - предзаполняем поля
        const eventDateStr = formatDateForInput(editEvent.eventDate);
        const eventTimeStr = formatTimeForInput(editEvent.eventDate);

        // Определяем тип события
        if (editEvent.eventType === "DoctorVisit" || editEvent.eventType === "doctor-visit") {
          setProcedureType(PROCEDURE_TYPES.DOCTOR_VISIT);
          setClinic(editEvent.clinic || "");
          setDoctor(editEvent.doctor || "");
          setDiagnosis(editEvent.diagnosis || "");
          setRecommendations(editEvent.recommendations || "");
          setReferrals(editEvent.referrals || "");
        } else if (editEvent.eventType === "Vaccine" || editEvent.eventType === "vaccine") {
          setProcedureType(PROCEDURE_TYPES.VACCINE);
          setMedicine(editEvent.medicine || "");
          setPeriodUnit(editEvent.periodUnit ?? PERIOD_UNITS.MONTH);
        } else if (editEvent.eventType === "Treatment" || editEvent.eventType === "treatment") {
          setProcedureType(PROCEDURE_TYPES.TREATMENT);
          setRemedy(editEvent.remedy || "");
          setParasite(editEvent.parasite || "");
          setPeriodUnit(editEvent.periodUnit ?? PERIOD_UNITS.MONTH);
        }

        // Общие поля
        setTitle(editEvent.title || "");
        setEventDate(eventDateStr);
        setEventTime(eventTimeStr);
        setReminderEnabled(editEvent.reminderEnabled || false);
        setReminderValue(editEvent.reminderValue ?? 5);
        setReminderUnit(editEvent.reminderUnit ?? PERIOD_UNITS.MINUTE);
      } else {
        // Режим создания - сбрасываем форму
        const now = new Date();
        const dateStr = now.toISOString().split("T")[0];

        setProcedureType(PROCEDURE_TYPES.DOCTOR_VISIT);

        // Общие
        setTitle("");
        setEventDate(dateStr);
        setEventTime("13:00");
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
    }
  }, [isOpen, editEvent]);

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
    setReminderValue(value);
    setReminderUnit(unit);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const eventDateTime = new Date(`${eventDate}T${eventTime}`);
      const eventDateISO = eventDateTime.toISOString();

      const baseData = {
        title: title || getDefaultTitle(),
        eventDate: eventDateISO,
        reminderEnabled,
        reminderValue: reminderEnabled ? reminderValue : 0,
        reminderUnit: reminderEnabled ? reminderUnit : PERIOD_UNITS.MINUTE,
      };

      let result;

      if (editEvent) {
        // Режим редактирования
        const eventId = editEvent.id || editEvent.eventId;

        switch (procedureType) {
          case PROCEDURE_TYPES.DOCTOR_VISIT: {
            result = await updateDoctorVisit(eventId, {
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

            result = await updateVaccine(eventId, {
              ...baseData,
              medicine: medicine || null,
              periodUnit: periodUnit !== null ? periodUnit : null,
            });
            break;
          }

          case PROCEDURE_TYPES.TREATMENT: {
            result = await updateTreatment(eventId, {
              ...baseData,
              remedy: remedy || null,
              parasite: parasite || null,
              periodUnit: periodUnit !== null ? periodUnit : null,
            });
            break;
          }

          default:
            throw new Error("Неизвестный тип процедуры");
        }
      } else {
        // Режим создания
        const createData = {
          ...baseData,
          petId: parseInt(petId, 10),
        };

        switch (procedureType) {
          case PROCEDURE_TYPES.DOCTOR_VISIT: {
            result = await createDoctorVisit({
              ...createData,
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
              ...createData,
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
              ...createData,
              remedy: remedy || null,
              parasite: parasite || null,
              periodValue: treatmentPeriodValue,
              periodUnit: periodUnit !== null ? periodUnit : null,
              nextTreatmentDate: nextTreatmentDate?.toISOString() || null,
            });
            break;
          }

          default:
            throw new Error("Неизвестный тип процедуры");
        }
      }

      if (onSuccess) onSuccess(result);
      onClose();
    } catch (err) {
      console.error("Ошибка сохранения процедуры:", err);
      setError(err.message || `Ошибка при ${editEvent ? "сохранении" : "создании"} процедуры`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content modal-content--wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h1 className="h1 modal-title">{editEvent ? "Редактировать процедуру" : "Добавить процедуру"}</h1>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={loading}
            type="button"
            aria-label="Закрыть"
          >
            <img src={CrossIcon} alt="Закрыть" />
          </button>

          <div className="modal-divider" />
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {error && (
            <div className="modal-error">
              <p className="txt2">{error}</p>
            </div>
          )}

          <div className="modal-body">
            <div className="modal-fields">
              {/* Тип процедуры */}
              <div className="form-field">
                <label className="form-label h3" htmlFor="procedureType">
                  Выберите тип
                </label>

                {/* ВАЖНО: wrapper для позиционирования иконки */}
                <div className="select-wrapper">
                  <select
                    id="procedureType"
                    className="form-input form-select"
                    value={procedureType}
                    onChange={(e) => {
                      setProcedureType(e.target.value);
                      setTitle("");
                    }}
                    disabled={loading || !!editEvent}
                  >
                    <option value={PROCEDURE_TYPES.DOCTOR_VISIT}>Прием</option>
                    <option value={PROCEDURE_TYPES.VACCINE}>Вакцинация</option>
                    <option value={PROCEDURE_TYPES.TREATMENT}>Обработка</option>
                  </select>

                  <img
                    className="select-arrow"
                    src={ArrowIcon}
                    alt=""
                    aria-hidden="true"
                  />
                </div>
              </div>

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
            </div>

            {/* Напоминания (внутри scroll) */}
            <div className="modal-reminder">
              <div className="form-field">
                <div className="form-toggle-group">
                  <label className="form-label h3">
                    Напоминание в Telegram
                  </label>
                  <label className="form-toggle">
                    <input
                      type="checkbox"
                      checked={reminderEnabled}
                      onChange={(e) => setReminderEnabled(e.target.checked)}
                      disabled={loading}
                    />
                    <span className="form-toggle-slider"></span>
                  </label>
                </div>
              </div>

              {reminderEnabled && (
                <div className="form-field">
                  <label className="form-label h3">Напоминать за</label>
                  <div className="form-button-group">
                    {REMINDER_OPTIONS.map((option) => (
                      <button
                        key={`${option.value}-${option.unit}`}
                        type="button"
                        className={`form-button-option ${
                          reminderValue === option.value &&
                          reminderUnit === option.unit
                            ? "form-button-option--active"
                            : ""
                        }`}
                        onClick={() =>
                          handleReminderOptionClick(option.value, option.unit)
                        }
                        disabled={loading}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Кнопки (sticky в CSS) */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Отмена
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (editEvent ? "Сохранение..." : "Добавление...") : (editEvent ? "Сохранить" : "Добавить")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProcedureModal;
