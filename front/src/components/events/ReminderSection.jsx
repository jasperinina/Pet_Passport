import styles from "./EventSection/EventSection.module.scss";

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
    <div className={styles["event-section"]}>
      <h2 className={styles["event-section__title"]}>Напоминание в Telegram</h2>
      <div className={styles["event-section__body"]}>
        {isEditing ? (
          <div className={styles["event-section__content"]}>
            <div className="toggle">
              <label className="toggle__label" htmlFor="telegram-notification-input">Включить напоминание</label>
              <input
                className="toggle__input"
                id="telegram-notification-input"
                name="telegram-notification-input"
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => onToggle(e.target.checked)}
              />
            </div>
            {reminderEnabled && (
              <div className={styles["event-section__options"]}>
                <div className={styles["event-section__options-text"]}>Напоминать за</div>
                <div className={styles["event-section__options-list"]}>
                  {REMINDER_OPTIONS.map((option) => (
                    <button
                      className={`${styles["event-section__options-item"]} ${
                        reminderValue === option.value &&
                        reminderUnit === option.unit
                          ? `${styles["event-section__options-item--active"]}`
                          : ""
                      }`}
                      key={`${option.value}-${option.unit}`}
                      type="button"
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
          <div className={styles["event-section__content"]}>
            <p>Напоминание: {reminderEnabled ? "Включено" : "Выключено"}</p>
            {reminderEnabled && (
              <p>
                Напоминать за: {REMINDER_OPTIONS.find(
                  (opt) => opt.value === reminderValue && opt.unit === reminderUnit
                )?.label || "5 минут"}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReminderSection;