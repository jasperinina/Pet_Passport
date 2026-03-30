import styles from "./Procedures.module.scss";

import ProcedureCard from "../ProcedureCard/ProcedureCard";

import { formatEventDateTime } from "../../../utils/dateUtils";
import { getEventPath, getEventTypeName } from "../../../utils/eventUtils";

const Procedures = ({
  events,
  navigate,
  search,
  message,
  isNotificationImageHidden = false,
  isRecommendation = false,
  onRecommendationClick = () => {}
}) => {
  const hasProcedures = events.length > 0;

  return (
    <div className={styles.procedures}>
      {!hasProcedures ? (
        <div className={styles["procedures__empty"]}>
          {message}
        </div>
      ) : (
        <ul className={styles["procedures__list"]}>
          {events.map((event) => {
            const { date, time, fullDate } = formatEventDateTime(
              event.eventDate
            );

            return (
              <li className={styles["procedures__item"]} key={event.id}>
                <ProcedureCard
                  title={event.title}
                  unformattedDateTime={event.eventDate}
                  date={date}
                  time={time}
                  fullDate={fullDate}
                  typeName={getEventTypeName(event.type)}
                  reminderEnabled={event.reminderEnabled === undefined ? false : event.reminderEnabled}
                  isNotificationImageHidden={isNotificationImageHidden}
                  isRecommendation={isRecommendation}
                  onClick={() => {
                    if (isRecommendation) {
                      onRecommendationClick?.(event);
                    } else {
                      const eventPath = getEventPath(event.type, event.id, search);
                      if (eventPath) {
                        navigate(eventPath);
                      }
                    }
                  }}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Procedures;