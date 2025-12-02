import { useState, useEffect } from "react";

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
} from "../../api/events";

import DoctorVisitFields from "./DoctorVisitFields";
import VaccineFields from "./VaccineFields";
import TreatmentFields from "./TreatmentFields";

const PROCEDURE_TYPES = {
  DOCTOR_VISIT: "doctor-visit",
  VACCINE: "vaccine",
  TREATMENT: "treatment",
};

const PERIOD_UNITS = {
  MINUTE: 0,
  HOUR: 1,
  DAY: 2,
  WEEK: 3,
  MONTH: 4,
  YEAR: 5,
};

const PERIOD_OPTIONS = [
  { value: PERIOD_UNITS.DAY, label: "Раз в день" },
  { value: PERIOD_UNITS.WEEK, label: "Раз в неделю" },
  { value: PERIOD_UNITS.MONTH, label: "Раз в месяц" },
  { value: PERIOD_UNITS.YEAR, label: "Раз в год" },
];

const REMINDER_OPTIONS = [
  { value: 5, unit: PERIOD_UNITS.MINUTE, label: "5 минут" },
  { value: 1, unit: PERIOD_UNITS.HOUR, label: "1 час" },
  { value: 1, unit: PERIOD_UNITS.DAY, label: "1 день" },
];

const AddProcedureModal = ({ isOpen, onClose, petId, onSuccess }) => {
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

  // Сброс формы при открытии
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0];

      setProcedureType(PROCEDURE_TYPES.DOCTOR_VISIT);
      setError(null);
      setLoading(false);

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
  }, [isOpen]);

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
    if (!loading) {
      onClose();
    }
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
          throw new Error("Неизвестный тип процедуры");
      }

      if (onSuccess) {
        onSuccess(result);
      }
      onClose();
    } catch (err) {
      console.error("Ошибка создания процедуры:", err);
      setError(err.message || "Ошибка при создании процедуры");
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
          <h2 className="h2 modal-title">Добавить процедуру</h2>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={loading}
            type="button"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {error && (
            <div className="modal-error">
              <p className="txt2">{error}</p>
            </div>
          )}

          {/* Тип процедуры */}
          <div className="form-field">
            <label className="form-label txt2" htmlFor="procedureType">
              Выберите тип
            </label>
            <select
              id="procedureType"
              className="form-input form-select"
              value={procedureType}
              onChange={(e) => setProcedureType(e.target.value)}
              disabled={loading}
            >
              <option value={PROCEDURE_TYPES.DOCTOR_VISIT}>Прием</option>
              <option value={PROCEDURE_TYPES.VACCINE}>Вакцинация</option>
              <option value={PROCEDURE_TYPES.TREATMENT}>Обработка</option>
            </select>
          </div>

          {procedureType === PROCEDURE_TYPES.DOCTOR_VISIT && (
            <DoctorVisitFields
              loading={loading}
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
              reminderEnabled={reminderEnabled}
              setReminderEnabled={setReminderEnabled}
              reminderValue={reminderValue}
              reminderUnit={reminderUnit}
              reminderOptions={REMINDER_OPTIONS}
              onReminderOptionClick={handleReminderOptionClick}
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
              reminderEnabled={reminderEnabled}
              setReminderEnabled={setReminderEnabled}
              reminderValue={reminderValue}
              reminderUnit={reminderUnit}
              reminderOptions={REMINDER_OPTIONS}
              onReminderOptionClick={handleReminderOptionClick}
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
              reminderEnabled={reminderEnabled}
              setReminderEnabled={setReminderEnabled}
              reminderValue={reminderValue}
              reminderUnit={reminderUnit}
              reminderOptions={REMINDER_OPTIONS}
              onReminderOptionClick={handleReminderOptionClick}
            />
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Добавление..." : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProcedureModal;
