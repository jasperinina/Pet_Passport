import styles from "./LoadingState.module.scss";

const LoadingState = ({ message = "Загрузка данных..." }) => {  
  return (
    <div className={`${styles["loading-state"]}`}>
      <div className={styles["loading-state__spinner"]}></div>
      {message && (
        <div className={styles["loading-state__message"]}>{message}</div>
      )}
    </div>
  );
};

export default LoadingState;