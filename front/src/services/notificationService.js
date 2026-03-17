class NotificationService {
  static showError = null;
  static showSuccess = null;
  static showWarning = null;
  static showInfo = null;

  static lastError = {
    message: null,
    time: 0
  };

  static init(showError, showSuccess, showWarning, showInfo) {
    this.showError = showError;
    this.showSuccess = showSuccess;
    this.showWarning = showWarning;
    this.showInfo = showInfo;
  }

  static safeShowError(message, title, options = {}) {
    const { force = false, throttleTime = 3000 } = options;

    if (!this.showError) return;

    if (!force) {
      const now = Date.now();
      if (this.lastError.message === message && now - this.lastError.time < throttleTime) {
        return;
      }

      this.lastError = {
        message,
        time: now
      };
    }

    this.showError(message, title);
  }

  static safeShowSuccess(message, title) {
    if (this.showSuccess) {
      this.showSuccess(message, title);
    }
  }

  static safeShowWarning(message, title) {
    if (this.showWarning) {
      this.showWarning(message, title);
    }
  }

  static safeShowInfo(message, title) {
    if (this.showInfo) {
      this.showInfo(message, title);
    }
  }
}

export default NotificationService;