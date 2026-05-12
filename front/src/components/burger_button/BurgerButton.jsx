import styles from "./BurgerButton.module.scss";

const BurgerButton = ({ isOpen = false, onClick }) => {
  return (
    <button
      aria-expanded={isOpen}
      aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
      className={`${styles["burger-button"]} ${isOpen ? styles["burger-button--open"] : ""} visible-tablet`}
      type="button"
      onClick={onClick}
    >
      <span className={`${styles["burger-button__line"]} ${styles["burger-button__line--short"]}`}></span>
      <span className={styles["burger-button__line"]}></span>
      <span className={`${styles["burger-button__line"]} ${styles["burger-button__line--short"]}`}></span>
    </button>
  );
};

export default BurgerButton;
