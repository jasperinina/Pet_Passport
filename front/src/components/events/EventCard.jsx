import { memo } from "react";

const EventCard = memo(({ label, value, isEditing, onChange, type = "text", options = null }) => {
  if (type === "datetime") {
    const displayDate = value?.displayDate || value?.date || "";
    const displayTime = value?.displayTime || value?.time || "";
    const dateInput = value?.dateInput || "";
    const timeInput = value?.timeInput || "";
    
    return (
      <div className="visit-card">
        <span className="txt2 visit-card__label">{label}</span>
        <div className="visit-card__value-row">
          {isEditing ? (
            <>
              <input
                type="date"
                className="h2 visit-card__value visit-card__input"
                value={dateInput}
                onChange={(e) => onChange({ 
                  dateInput: e.target.value, 
                  timeInput,
                  displayDate: value?.displayDate || "",
                  displayTime: value?.displayTime || "",
                })}
              />
              <span className="visit-card__divider"></span>
              <input
                type="time"
                className="h2 visit-card__value visit-card__input visit-card__input--time"
                value={timeInput}
                onChange={(e) => onChange({ 
                  dateInput, 
                  timeInput: e.target.value,
                  displayDate: value?.displayDate || "",
                  displayTime: value?.displayTime || "",
                })}
              />
            </>
          ) : (
            <>
              <span className="h2 visit-card__value">{displayDate}</span>
              <span className="visit-card__divider"></span>
              <span className="h2 visit-card__value">{displayTime}</span>
            </>
          )}
        </div>
      </div>
    );
  }

  if (type === "select" && options) {
    return (
      <div className="visit-card">
        <span className="txt2 visit-card__label">{label}</span>
        {isEditing ? (
          <select
            className="h2 visit-card__value visit-card__input"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              font: "inherit",
              color: "var(--black)",
            }}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <span className="h2 visit-card__value">
            {options.find((opt) => opt.value === value)?.label || value}
          </span>
        )}
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className="visit-card">
        <span className="txt2 visit-card__label">{label}</span>
        {isEditing ? (
          <textarea
            className="h2 visit-card__value visit-card__textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={2}
          />
        ) : (
          <span className="h2 visit-card__value">{value}</span>
        )}
      </div>
    );
  }

  // Обычный input
  return (
    <div className="visit-card">
      <span className="txt2 visit-card__label">{label}</span>
      {isEditing ? (
        <input
          className="h2 visit-card__value visit-card__input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <span className="h2 visit-card__value">{value}</span>
      )}
    </div>
  );
});

EventCard.displayName = 'EventCard';

export default EventCard;

