const VaccineFields = ({
  loading,
  title,
  setTitle,
  medicine,
  setMedicine,
  eventDate,
  setEventDate,
  eventTime,
  setEventTime,
  periodUnit,
  setPeriodUnit,
  periodOptions,
  reminderEnabled,
  setReminderEnabled,
  reminderValue,
  reminderUnit,
  reminderOptions,
  onReminderOptionClick,
}) => {
  return (
    <div className="procedure-section procedure-section--vaccine">
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
          {periodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

export default VaccineFields;
