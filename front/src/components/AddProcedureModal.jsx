import { useState, useEffect } from "react";
import "../styles/modal.css";
import "../styles/procedure-modal.css";
import { createDoctorVisit, createVaccine, createTreatment } from "../api/events";

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
  const [procedureType, setProcedureType] = useState(PROCEDURE_TYPES.DOCTOR_VISIT);
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
      setEventDate(dateStr);
      setEventTime("13:00");
      setError(null);
      setProcedureType(PROCEDURE_TYPES.DOCTOR_VISIT);
      // Сброс всех полей
      setTitle("");
      setClinic("");
      setDoctor("");
      setDiagnosis("");
      setRecommendations("");
      setReferrals("");
      setMedicine("");
      setRemedy("");
      setParasite("");
      setPeriodUnit(PERIOD_UNITS.MONTH);
      setReminderEnabled(false);
      setReminderValue(5);
      setReminderUnit(PERIOD_UNITS.MINUTE);
    }
  }, [isOpen]);

  // Блокируем скролл страницы, пока модалка открыта
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Формируем дату и время
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
        case PROCEDURE_TYPES.DOCTOR_VISIT:
          result = await createDoctorVisit({
            ...baseData,
            clinic: clinic || null,
            doctor: doctor || null,
            diagnosis: diagnosis || null,
            recommendations: recommendations || null,
            referrals: referrals || null,
          });
          break;

        case PROCEDURE_TYPES.VACCINE:
          // Периодичность всегда 1 для предустановленных опций
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

        case PROCEDURE_TYPES.TREATMENT:
          // Периодичность всегда 1 для предустановленных опций
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

        default:
          throw new Error("Неизвестный тип процедуры");
      }

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      setError(err.message || "Ошибка при создании процедуры");
      console.error("Ошибка создания процедуры:", err);
    } finally {
      setLoading(false);
    }
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
    }
    return nextDate;
  };

  const handleReminderOptionClick = (value, unit) => {
    setReminderValue(value);
    setReminderUnit(unit);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
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

          {/* Выберите тип */}
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

          {/* Поля для посещения врача */}
          {procedureType === PROCEDURE_TYPES.DOCTOR_VISIT && (
            <>
              <div className="form-row">
                <div className="form-field form-field--half">
                  <label className="form-label txt2" htmlFor="clinic">
                    Клиника
                  </label>
                  <input
                    type="text"
                    id="clinic"
                    className="form-input"
                    value={clinic}
                    onChange={(e) => setClinic(e.target.value)}
                    placeholder="Введите название"
                    disabled={loading}
                  />
                </div>
                <div className="form-field form-field--half">
                  <label className="form-label txt2" htmlFor="doctor">
                    Врач
                  </label>
                  <input
                    type="text"
                    id="doctor"
                    className="form-input"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    placeholder="Введите название"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field form-field--half">
                  <label className="form-label txt2" htmlFor="eventDate">
                    Дата
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    className="form-input"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="form-field form-field--half">
                  <label className="form-label txt2" htmlFor="eventTime">
                    Время
                  </label>
                  <input
                    type="time"
                    id="eventTime"
                    className="form-input"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field form-field--half">
                  <label className="form-label txt2" htmlFor="diagnosis">
                    Диагноз
                  </label>
                  <textarea
                    id="diagnosis"
                    className="form-input form-textarea"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Диагноз"
                    disabled={loading}
                    rows="4"
                  />
                </div>
                <div className="form-field form-field--half">
                  <label className="form-label txt2" htmlFor="recommendations">
                    Рекомендации
                  </label>
                  <textarea
                    id="recommendations"
                    className="form-input form-textarea"
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                    placeholder="Рекомендации"
                    disabled={loading}
                    rows="4"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label txt2" htmlFor="referrals">
                  Направления
                </label>
                <textarea
                  id="referrals"
                  className="form-input form-textarea"
                  value={referrals}
                  onChange={(e) => setReferrals(e.target.value)}
                  placeholder="Направления"
                  disabled={loading}
                  rows="3"
                />
              </div>

              {/* Напоминание в Telegram */}
              <div className="form-field">
                <div className="form-toggle-group">
                  <label className="form-label txt2">Напоминание в Telegram</label>
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
                  <label className="form-label txt2">Напоминать за</label>
                  <div className="form-button-group">
                    {REMINDER_OPTIONS.map((option) => (
                      <button
                        key={`${option.value}-${option.unit}`}
                        type="button"
                        className={`form-button-option ${
                          reminderValue === option.value && reminderUnit === option.unit
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
            </>
          )}

          {/* Поля для вакцинации */}
          {procedureType === PROCEDURE_TYPES.VACCINE && (
            <>
              <div className="form-field">
                <label className="form-label txt2" htmlFor="title">
                  Название
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Введите название"
                  disabled={loading}
                />
              </div>

              <div className="form-field">
                <label className="form-label txt2" htmlFor="medicine">
                  Препарат
                </label>
                <input
                  type="text"
                  id="medicine"
                  className="form-input"
                  value={medicine}
                  onChange={(e) => setMedicine(e.target.value)}
                  placeholder="Введите название"
                  disabled={loading}
                />
              </div>

              <div className="form-row">
                <div className="form-field form-field--half">
                  <label className="form-label txt2" htmlFor="eventDate">
                    Дата
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    className="form-input"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="form-field form-field--half">
                  <label className="form-label txt2" htmlFor="eventTime">
                    Время
                  </label>
                  <input
                    type="time"
                    id="eventTime"
                    className="form-input"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label txt2" htmlFor="periodUnit">
                  Периодичность
                </label>
                <select
                  id="periodUnit"
                  className="form-input form-select"
                  value={periodUnit}
                  onChange={(e) => setPeriodUnit(parseInt(e.target.value, 10))}
                  disabled={loading}
                >
                  {PERIOD_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Напоминание в Telegram */}
              <div className="form-field">
                <div className="form-toggle-group">
                  <label className="form-label txt2">Напоминание в Telegram</label>
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
                  <label className="form-label txt2">Напоминать за</label>
                  <div className="form-button-group">
                    {REMINDER_OPTIONS.map((option) => (
                      <button
                        key={`${option.value}-${option.unit}`}
                        type="button"
                        className={`form-button-option ${
                          reminderValue === option.value && reminderUnit === option.unit
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
            </>
          )}

          {/* Поля для обработки */}
          {procedureType === PROCEDURE_TYPES.TREATMENT && (
            <>
              <div className="form-field">
                <label className="form-label txt2" htmlFor="title">
                  Название
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Введите название"
                  disabled={loading}
                />
              </div>

              <div className="form-row">
                <div className="form-field form-field--half">
                  <label className="form-label txt2" htmlFor="remedy">
                    Препарат
                  </label>
                  <input
                    type="text"
                    id="remedy"
                    className="form-input"
                    value={remedy}
                    onChange={(e) => setRemedy(e.target.value)}
                    placeholder="Введите название"
                    disabled={loading}
                  />
                </div>
                <div className="form-field form-field--half">
                  <label className="form-label txt2" htmlFor="parasite">
                    Паразит
                  </label>
                  <input
                    type="text"
                    id="parasite"
                    className="form-input"
                    value={parasite}
                    onChange={(e) => setParasite(e.target.value)}
                    placeholder="Введите название"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field form-field--half">
                  <label className="form-label txt2" htmlFor="eventDate">
                    Дата
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    className="form-input"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="form-field form-field--half">
                  <label className="form-label txt2" htmlFor="eventTime">
                    Время
                  </label>
                  <input
                    type="time"
                    id="eventTime"
                    className="form-input"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label txt2" htmlFor="periodUnit">
                  Периодичность
                </label>
                <select
                  id="periodUnit"
                  className="form-input form-select"
                  value={periodUnit}
                  onChange={(e) => setPeriodUnit(parseInt(e.target.value, 10))}
                  disabled={loading}
                >
                  {PERIOD_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Напоминание в Telegram */}
              <div className="form-field">
                <div className="form-toggle-group">
                  <label className="form-label txt2">Напоминание в Telegram</label>
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
                  <label className="form-label txt2">Напоминать за</label>
                  <div className="form-button-group">
                    {REMINDER_OPTIONS.map((option) => (
                      <button
                        key={`${option.value}-${option.unit}`}
                        type="button"
                        className={`form-button-option ${
                          reminderValue === option.value && reminderUnit === option.unit
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
            </>
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
