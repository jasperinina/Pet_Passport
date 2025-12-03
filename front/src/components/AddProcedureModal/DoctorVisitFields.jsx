const DoctorVisitFields = ({
  loading,
  title,
  setTitle,
  eventDate,
  setEventDate,
  eventTime,
  setEventTime,
  clinic,
  setClinic,
  doctor,
  setDoctor,
  diagnosis,
  setDiagnosis,
  recommendations,
  setRecommendations,
  referrals,
  setReferrals,
  reminderEnabled,
  setReminderEnabled,
  reminderValue,
  reminderUnit,
  reminderOptions,
  onReminderOptionClick,
}) => {
  return (
    <div className="procedure-section procedure-section--doctor">
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
          placeholder="Приём#"
          disabled={loading}
        />
      </div>

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
            placeholder="Введите имя"
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
            {reminderOptions.map((option) => (
              <button
                key={`${option.value}-${option.unit}`}
                type="button"
                className={`form-button-option ${
                  reminderValue === option.value && reminderUnit === option.unit
                    ? "form-button-option--active"
                    : ""
                }`}
                onClick={() =>
                  onReminderOptionClick(option.value, option.unit)
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
  );
};

export default DoctorVisitFields;
