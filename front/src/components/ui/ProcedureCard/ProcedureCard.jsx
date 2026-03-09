import styles from "./ProcedureCard.module.scss";

import BellOnIcon from "../../../assets/icons/notifications-on.svg";
import BellOffIcon from "../../../assets/icons/notifications-off.svg";
import DateIcon from "../../../assets/icons/date.svg";

const ProcedureCard = ({
  title,
  unformattedDateTime,
  date,
  time,
  fullDate,
  typeName,
  reminderEnabled,
  isNotificationImageHidden,
  onClick
}) => {
  const dateText = fullDate || date || "";
  const timeText = time || "";

  const bellIcon = reminderEnabled ? BellOnIcon : BellOffIcon;
  const bellAlt = reminderEnabled
    ? "Напоминание включено"
    : "Напоминание выключено";

  return (
    <article className={styles["procedure-card"]} onClick={onClick}>
      <header className={styles["procedure-card__header"]}>
        <img
          className=
            {`${styles["procedure-card__notification-image"]} 
            ${isNotificationImageHidden ? "visually-hidden" : ""}`}
          src={bellIcon}
          alt={bellAlt}
          width="20" height="20"
        />
        <div className={styles["procedure-card__datetime"]}>
          <div className={styles["procedure-card__date"]}>
            <img
              className={styles["procedure-card__date-image"]}
              src={DateIcon}
              alt=""
            />
            <div className={styles["procedure-card__date-text"]}>
              {dateText && (
                <time dateTime={unformattedDateTime.split('T')[0]}>{dateText}</time>
              )}
            </div>
          </div>
          <div className={styles["procedure-card__time"]}>
            {timeText && (
              <time dateTime={timeText}>{timeText}</time>
            )}
          </div>
        </div>
        <div className={styles["procedure-card__type"]}>
          <div className={styles["procedure-card__type-inner"]}>
            {typeName}
          </div>
        </div>
      </header>
      <div className={styles["procedure-card__body"]}>
        <h2 className={styles["procedure-card__title"]}>{title || "Процедура"}</h2>
      </div>
    </article>
  );
};

export default ProcedureCard;