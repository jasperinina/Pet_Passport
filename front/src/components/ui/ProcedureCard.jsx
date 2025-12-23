import "../../styles/procedure-card.css";

import BellOnIcon from "../../assets/icons/icon-notifications-on.svg";
import BellOffIcon from "../../assets/icons/icon-notifications-off.svg";

import DateIcon from "../../assets/icons/icons-date.svg";

const ProcedureCard = ({
  title,
  date,
  time,
  fullDate,
  typeName,
  reminderEnabled,
  onClick,
}) => {
  const dateText = fullDate || date || "";
  const timeText = time || "";

  const bellIcon = reminderEnabled ? BellOnIcon : BellOffIcon;
  const bellAlt = reminderEnabled
    ? "Напоминание включено"
    : "Напоминание выключено";


  return (
    <div className="procedure-card" onClick={onClick}>
      <div className="procedure-card__left">
        <div className="procedure-card__top">
        
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
