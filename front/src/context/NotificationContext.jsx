import { createContext, useCallback, useContext, useState } from "react";

import { NOTIFICATION_TYPES } from "../constants/config";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used within an NotificationProvider");
  }

  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const showNotification = useCallback(({
    message,
    title = null,
    type = NOTIFICATION_TYPES.ERROR,
    autoCloseTime = 5000
  }) => {
    setNotification({ message, title, type });
    setIsVisible(true);

    if (autoCloseTime > 0) {
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setNotification(null), 300);
      }, autoCloseTime);
    }
  }, []);

  const hideNotification = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setNotification(null), 300);
  }, []);

  const showError = useCallback((message, title = null, autoCloseTime = 5000) => {
    showNotification({ message, title, type: NOTIFICATION_TYPES.ERROR, autoCloseTime });
  }, [showNotification]);

  const showSuccess = useCallback((message, title = null, autoCloseTime = 5000) => {
    showNotification({ message, title, type: NOTIFICATION_TYPES.SUCCESS, autoCloseTime });
  }, [showNotification]);

  const showWarning = useCallback((message, title = null, autoCloseTime = 5000) => {
    showNotification({ message, title, type: NOTIFICATION_TYPES.WARNING, autoCloseTime });
  }, [showNotification]);

  const showInfo = useCallback((message, title = null, autoCloseTime = 5000) => {
    showNotification({ message, title, type: NOTIFICATION_TYPES.INFO, autoCloseTime });
  }, [showNotification]);

  return (
    <NotificationContext.Provider value={{
      notification,
      isVisible,
      showError,
      showSuccess,
      showWarning,
      showInfo,
      hideNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};