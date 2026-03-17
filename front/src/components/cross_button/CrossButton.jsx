import styles from "./CrossButton.module.scss";

const CrossButton = ({ handleClose, loading = false }) => {
  return (
    <div className={styles["cross-button"]}>
      <button
        className={styles["cross-button__button"]}
        type="button"
        disabled={loading}
        onClick={handleClose}
      >
        <span className="visually-hidden">Закрыть</span>
      </button>
    </div>
  );
};

export default CrossButton;