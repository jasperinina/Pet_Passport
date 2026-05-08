import styles from './EventCard.module.scss';

import { memo } from "react";

const EventCard = memo(({ label, value, isEditing, onChange, type = "text", options = null }) => {
  if (type === "datetime") {
    const displayDate = value?.displayDate || value?.date || "";
    const displayTime = value?.displayTime || value?.time || "";
    const dateInput = value?.dateInput || "";
    const timeInput = value?.timeInput || "";

    return (
      <div className={styles["event-card"]}>
        <h2 className={styles["event-card__label"]}>{label}</h2>
        <div className={styles["event-card__body"]}>
          {isEditing ? (
            <div className={styles["event-card__content"]}>
              <div className={styles["event-card__input"]}>
                <label className="visually-hidden" htmlFor="date-input">Дата</label>
                <input
                  className="input"
                  id="date-input"
                  name="date-input"
                  type="date"
                  value={dateInput}
                  onChange={(e) => onChange({
                    dateInput: e.target.value,
                    timeInput,
                    displayDate: value?.displayDate || "",
                    displayTime: value?.displayTime || ""
                  })}
                />
              </div>
              <div className={styles["event-card__input"]}>
                <label className="visually-hidden" htmlFor="time-input">Время</label>
                <input
                  className="input"
                  id="time-input"
                  name="time-input"
                  type="time"
                  value={timeInput}
                  onChange={(e) => onChange({
                    dateInput,
                    timeInput: e.target.value,
                    displayDate: value?.displayDate || "",
                    displayTime: value?.displayTime || ""
                  })}
                />
              </div>
            </div>
          ) : (
            <div className={styles["event-card__content"]}>
              <time className="h2" dateTime={displayDate}>{displayDate}</time>
              {displayDate && displayTime && (
                <span className={`${styles["event-card__separator"]}`}></span>
              )}
              <time className="h2" dateTime={displayTime}>{displayTime}</time>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className={styles["event-card"]}>
        <h2 className={styles["event-card__label"]}>{label}</h2>
        <div className={styles["event-card__body"]}>
          {isEditing ? (
            <div className={styles["event-card__content"]}>
              <div className={styles["event-card__input"]}>
                <label className="visually-hidden" htmlFor="clinic-input">{label}</label>
                <textarea
                  className="textarea"
                  id="clinic-input"
                  name="clinic-input"
                  rows={3}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className={styles["event-card__content"]}>
              <div className="h2">{value}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (type === "select" && options) {
    const selectId =
      label === "Статус" ? "event-status-input" :
      label === "Периодичность" ? "period-unit-input" :
      "event-select-input";

    return (
      <div className={styles["event-card"]}>
        <h2 className={styles["event-card__label"]}>{label}</h2>
        <div className={styles["event-card__body"]}>
          {isEditing ? (
            <div className={styles["event-card__content"]}>
              <div className={`${styles["event-card__input"]} select`}>
                <label className="visually-hidden" htmlFor={selectId}>{label}</label>
                <select
                  className="select__field"
                  name={selectId}
                  id={selectId}
                  value={value}
                  onChange={(e) => onChange(parseInt(e.target.value, 10))}
                >
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className={styles["event-card__content"]}>
              <div className="h2">
                {options.find((opt) => opt.value === value)?.label || value}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const inputId =
    label === "Врач" ? "doctor-input" :
    label === "Препарат" ? "remedy-input" :
    label === "Паразит" ? "parasite-input" :
    "event-input"

  return (
    <div className={styles["event-card"]}>
      <h2 className={styles["event-card__label"]}>{label}</h2>
      <div className={styles["event-card__body"]}>
        {isEditing ? (
          <div className={styles["event-card__content"]}>
            <div className={styles["event-card__input"]}>
              <label className="visually-hidden" htmlFor={inputId}>{label}</label>
              <input
                className="input"
                id={inputId}
                name={inputId}
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className={styles["event-card__content"]}>
            <div className="h2">{value}</div>
          </div>
        )}
      </div>
    </div>
  );
});

EventCard.displayName = 'EventCard';

export default EventCard;
