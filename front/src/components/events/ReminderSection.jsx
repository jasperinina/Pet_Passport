import { REMINDER_OPTIONS } from "../../constants/eventConstants";

/**
 * Секция напоминаний
 */
const ReminderSection = ({
  reminderEnabled,
  reminderValue,
  reminderUnit,
  isEditing,
  onToggle,
  onOptionClick,
}) => {
  return (
    <section className="doctor-visit-section">
      <h2 className="h1 doctor-visit-section__title">Напоминание в Telegram</h2>
      <div className="doctor-visit-section__card">
        {isEditing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="form-toggle-group">
              <label className="txt2" style={{ margin: 0 }}>
                Включить напоминание
              </label>
              <label className="form-toggle">
                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(e) => onToggle(e.target.checked)}
                />
                <span className="form-toggle-slider"></span>
              </label>
            </div>

            {reminderEnabled && (
              <div>
                <label
                  className="txt2"
                  style={{ display: "block", marginBottom: "12px" }}
                >
                  Напоминать за
                </label>
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
                      onClick={() => onOptionClick(option.value, option.unit)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p className="txt1 doctor-visit-section__text">
              Напоминание: {reminderEnabled ? "Включено" : "Выключено"}
            </p>
            {reminderEnabled && (
              <p className="txt1 doctor-visit-section__text">
                Напоминать за:{" "}
                {REMINDER_OPTIONS.find(
                  (opt) => opt.value === reminderValue && opt.unit === reminderUnit
                )?.label || "5 минут"}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReminderSection;

