import styles from "./FeatureCard.module.scss";

const FeatureCard = ({
  title,
  description,
  image
}) => {
  return (
    <article className={styles["feature-card"]}>
      <h3 className={`${styles["feature-card__title"]} h3`}>{title}</h3>
      <div className={`${styles["feature-card__description"]}`}>
        <p>{description}</p>
      </div>
      <img
        className={styles["feature-card__image"]}
        src={image}
        alt=""
        loading="lazy"
      />
    </article>
  );
};

export default FeatureCard;