import { NOTIFICATION_TITLES } from "../constants/config";

export const notifySuccess = (message) => {
  NotificationService.showSuccess?.(
    message,
    NOTIFICATION_TITLES.SUCCESS
  );
};

export const notifyError = (message) => {
  NotificationService.showError?.(
    message,
    NOTIFICATION_TITLES.ERROR
  );
};

class NotificationService {
  static showError = null;
  static showSuccess = null;
  static showWarning = null;
  static showInfo = null;

  static init(showError, showSuccess, showWarning, showInfo) {
    this.showError = showError;
    this.showSuccess = showSuccess;
    this.showWarning = showWarning;
    this.showInfo = showInfo;
  }
}

export default NotificationService;