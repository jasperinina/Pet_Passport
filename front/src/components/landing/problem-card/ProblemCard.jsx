import styles from "./ProblemCard.module.scss";

const ProblemCard = ({ title, description, icon }) => {
  return (
    <article className={styles["problem-card"]}>
      <div className={`${styles["problem-card__inner"]}`}>
        <div className={styles["problem-card__icon-wrapper"]}>{icon}</div>
        <div className={styles["problem-card__content"]}>
          <h3 className={`${styles["problem-card__title"]} h3`}>{title}</h3>
          <div className={styles["problem-card__description"]}>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProblemCard;