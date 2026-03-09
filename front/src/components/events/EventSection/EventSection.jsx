import styles from './EventSection.module.scss';

import { PERIOD_OPTIONS } from '../../../constants/eventConstants';

const EventSection = ({
  title,
  value,
  isEditing,
  onChange,
  rows = 4,
  type = "textarea"
}) => {
  if (type === "textarea") {
    const textareaId =
      title === "Диагноз" ? "diagnosis-section-input" :
      title === "Рекомендации" ? "recomendations-section-input" :
      title === "Направления" ? "appointments-section-input" :
      "event-section-input"

    return (
      <div className={styles["event-section"]}>
        <h2 className={styles["event-section__title"]}>{title}</h2>
        <div className={styles["event-section__body"]}>
          {isEditing ? (
            <div className={styles["event-section__input"]}>
              <label className="visually-hidden" htmlFor={textareaId}>{title}</label>
              <textarea
                className="textarea"
                id={textareaId}
                name={textareaId}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
              />
            </div>
          ) : (
            <p className={styles["event-section__text"]}>{value}</p>
          )}
        </div>
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className={styles["event-section"]}>
        <h2 className={styles["event-section__title"]}>{title}</h2>
        <div className={styles["event-section__body"]}>
          {isEditing ? (
            <div className={`${styles["event-card__input"]} select`}>
              <label className="visually-hidden" htmlFor="section-period-unit-input">{title}</label>
              <select
                className="select__field"
                id="section-period-unit-input"
                name="section-period-unit-input"
                value={value}
                onChange={onChange}
              >
                {PERIOD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className={styles["event-section__text"]}>
              {PERIOD_OPTIONS.find((opt) => opt.value === value)?.label || "Раз в месяц"}
            </p>
          )}
        </div>
      </div>
    );
  }
};

export default EventSection;