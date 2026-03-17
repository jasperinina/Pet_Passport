import styles from "./NotificationBanner.module.scss";

import { useEffect, useState } from "react";

import CrossButton from "../cross_button/CrossButton";
import { useNotification } from "../../context/NotificationContext";

const NotificationBanner = () => {
  const { notification, isVisible, hideNotification } = useNotification();

  useEffect(() => {
    if (!notification || !isVisible) return;
  }, [notification, isVisible]);

  if (!notification || !isVisible) return null;

  const handleClose = () => {
    hideNotification();
  };

  const typeClass =
    styles[`notification-banner--${notification.type}`] || 
    styles['notification-banner--error'];

  return (
    <div className={`${styles["notification-banner"]} ${typeClass}`}>
      <div className={styles["notification-banner__inner"]}>
        <header className={styles["notification-banner__header"]}>
          {notification.title && (
            <h3 className={`${styles["notification-banner__title"]} h3`}>{notification.title}</h3>
          )}
          <CrossButton
            className={styles["notification-banner__cross-button"]}
            handleClose={handleClose}
          />
        </header>
        <p className={styles["notification-banner__message"]}>{notification.message}</p>
      </div>
    </div>
  );
};

export default NotificationBanner;