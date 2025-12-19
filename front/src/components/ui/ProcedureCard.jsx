import "../../styles/procedure-card.css";

import BellOnIcon from "../../assets/icons/icon-notifications-on.svg";
import BellOffIcon from "../../assets/icons/icon-notifications-off.svg";

import DateIcon from "../../assets/icons/icons-date.svg";
import { EVENT_TYPES } from "../../constants/eventConstants";

// Функция для получения эмодзи и цвета маркера по типу события
const getEventMarker = (eventType) => {
  switch (eventType) {
    case EVENT_TYPES.DOCTOR_VISIT:
      return { emoji: "🩺", color: "#4A90E2" }; // Синий для приема врача
    case EVENT_TYPES.VACCINE:
      return { emoji: "💉", color: "#50C878" }; // Зеленый для вакцинации
    case EVENT_TYPES.TREATMENT:
      return { emoji: "🧪", color: "#FF6B6B" }; // Красный для обработки
    default:
      return { emoji: "📋", color: "#9B9B9B" }; // Серый по умолчанию
  }
};

const ProcedureCard = ({
  title,
  date,
  time,
  fullDate,
  typeName,
  eventType,
  reminderEnabled,
  onClick,
}) => {
  const dateText = fullDate || date || "";
  const timeText = time || "";

  const bellIcon = reminderEnabled ? BellOnIcon : BellOffIcon;
  const bellAlt = reminderEnabled
    ? "Напоминание включено"
    : "Напоминание выключено";

  const marker = getEventMarker(eventType);

  return (
    <div className="procedure-card" onClick={onClick}>
      <div className="procedure-card__left">
        <div className="procedure-card__top">
          {/* Визуальный маркер типа события */}
          <div 
            className="procedure-card__type-marker"
            style={{ backgroundColor: marker.color }}
            title={typeName}
          >
            <span className="procedure-card__type-emoji">{marker.emoji}</span>
          </div>

          <img
            src={bellIcon}
            alt={bellAlt}
            className="procedure-card__bell"
          />

          <div className="procedure-card__meta">
            <div className="procedure-card__pill procedure-card__pill--datetime">
              <img
                src={DateIcon}
                alt=""
                aria-hidden="true"
                className="procedure-card__meta-icon"
              />

              {dateText && (
                <span className="procedure-card__date-text">
                  {dateText}
                </span>
              )}

              {dateText && timeText && (
                <span className="procedure-card__separator" />
              )}

              {timeText && (
                <span className="procedure-card__time-text">
                  {timeText}
                </span>
              )}
            </div>

            <div className="procedure-card__pill procedure-card__pill--type">
              <span className="procedure-card__type">
                {typeName}
              </span>
            </div>
          </div>
        </div>

        <h3 className="procedure-card__title">
          {title || "Процедура"}
        </h3>
      </div>
    </div>
  );
};

export default ProcedureCard;
