import { useState, useRef } from "react";

import styles from "./FeedbackForm.module.scss";

import FloatingTextarea from "../floating_textarea/FloatingTextarea";

import { sendFeedback } from "../../../api/feedback";
import { notifyError, notifySuccess } from "../../../services/notificationService";

import { ERROR_MESSAGES, FILE_UPLOAD } from "../../../constants/config";
import PrivacyPolicyCheckbox from "../../privacy_policy_checkbox/PrivacyPolicyCheckbox";

const FeedbackForm = ({
  type,
  title,
  description,
  labels,
  placeholders,
  fieldNames,
  buttonText,
  privacyPolicyUrl,
  allowScreenshot = false
}) => {
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState(
    Object.fromEntries(fieldNames.map((name) => [name, ""]))
  );

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notifyError(ERROR_MESSAGES.FILE.INVALID_TYPE);

      return;
    }

    if (file.size > FILE_UPLOAD.MAX_SIZE) {
      notifyError(ERROR_MESSAGES.FILE.TOO_LARGE);

      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const fields = labels.reduce((acc, label, index) => {
      acc[label] = values[fieldNames[index]].trim();
      return acc;
    }, {});

    if (selectedFile) {
      fields["Скриншот"] = selectedFile.name;
    }

    try {
      setLoading(true);
      await sendFeedback({ type, fields });

      setValues(Object.fromEntries(fieldNames.map((name) => [name, ""])));
      setSelectedFile(null);
      setAcceptedPolicy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      notifySuccess("Спасибо, сообщение отправлено");
    } catch {
      notifyError("Не удалось отправить сообщение. Попробуйте позже");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={`${styles["feedback-form"]} container`}
      onSubmit={handleSubmit}
    >
      <header className={styles["feedback-form__header"]}>
        <h3 className={`${styles["feedback-form__title"]} h3`}>
          {title}
        </h3>
        <div className={styles["feedback-form__description"]}>
          <p>{description}</p>
        </div>
      </header>
      <div className={styles["feedback-form__body"]}>
        <div className={styles["feedback-form__fields"]}>
          <div className={styles["feedback-form__textareas"]}>
            {fieldNames.map((name, index) => (
              <FloatingTextarea
                key={name}
                label={labels[index]}
                name={name}
                value={values[name] || ""}
                placeholder={placeholders[index]}
                onChange={(e) => handleChange(name, e.target.value)}
              />
            ))}                
          </div>
          {allowScreenshot && (
            <div className={styles["feedback-form__screenshot"]}>
              <label
                className={`${styles["feedback-form__screenshot-label"]} ${loading ? `${styles["feedback-form__screenshot-label--not-allowed"]} ${styles["feedback-form__screenshot-label--opacity"]}` : ""}`}
                htmlFor="screenshot-input"
              >
                <svg
                  className={styles["feedback-form__screenshot-label-icon"]}
                  width="20" height="20" viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clipPath="url(#clip0_60_256)">
                    <path d="M5.51531 15.6875H2.34375C1.05141 15.6875 0 14.6361 0 13.3438V3.96875C0 2.67641 1.05141 1.625 2.34375 1.625H6.07156C6.69754 1.625 7.28613 1.86879 7.72883 2.31145L8.60484 3.1875H12.9688C14.2611 3.1875 15.3125 4.23891 15.3125 5.53125V7.17223C15.3125 7.60371 14.9627 7.95348 14.5312 7.95348C14.0998 7.95348 13.75 7.60371 13.75 7.17223V5.53125C13.75 5.10047 13.3995 4.75 12.9688 4.75H8.28125C8.07402 4.75 7.87531 4.6677 7.72879 4.52117L6.62395 3.41633C6.47641 3.26879 6.2802 3.1875 6.07152 3.1875H2.34375C1.91297 3.1875 1.5625 3.53797 1.5625 3.96875V13.3438C1.5625 13.7745 1.91297 14.125 2.34375 14.125H5.51531C5.9468 14.125 6.29656 14.4748 6.29656 14.9062C6.29656 15.3377 5.9468 15.6875 5.51531 15.6875Z" fill="#36187D"/>
                    <path d="M19.2188 20.375C18.7873 20.375 18.4375 20.0252 18.4375 19.5938V18.8125C18.4375 17.5202 17.3861 16.4688 16.0938 16.4688H13.75V17.25C13.75 18.1116 13.0491 18.8125 12.1875 18.8125C11.7703 18.8125 11.3779 18.65 11.0828 18.3551L7.95758 15.2299C7.66246 14.9346 7.5 14.5423 7.5 14.125C7.5 13.7077 7.66246 13.3154 7.95746 13.0202L11.0826 9.89512C11.3779 9.59996 11.7703 9.4375 12.1875 9.4375C13.0491 9.4375 13.75 10.1384 13.75 11V11.7812H14.5312C17.5467 11.7812 20 14.2345 20 17.25V19.5938C20 20.0252 19.6502 20.375 19.2188 20.375ZM12.1875 11L9.06246 14.125L12.1875 17.25L12.1875 15.6875C12.1875 15.256 12.5373 14.9062 12.9688 14.9062H16.0938C16.7698 14.9062 17.4063 15.0789 17.9614 15.3823C17.298 14.1687 16.0092 13.3438 14.5312 13.3438H12.9688C12.5373 13.3438 12.1875 12.994 12.1875 12.5625V11Z" fill="#36187D"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_60_256">
                      <rect width="20" height="20" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <div className={styles["feedback-form__screenshot-label-text"]}>
                  {selectedFile ? selectedFile.name : "Загрузить скриншот"}
                </div>
              </label>
              {selectedFile && (
                <button
                  className={styles["feedback-form__screenshot-remove"]}
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  disabled={loading}
                >
                  <div className="visually-hidden">Убрать</div>
                  <svg
                    className={styles["feedback-form__screenshot-remove-icon"]}
                    width="16" height="16" viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M12.1357 4.34424C12.2732 4.34426 12.4048 4.39939 12.502 4.49658C12.5991 4.59379 12.6543 4.72534 12.6543 4.86279C12.6543 5.00025 12.5991 5.1318 12.502 5.229L8.73242 8.99951L12.5039 12.769C12.601 12.8662 12.6552 12.9979 12.6553 13.1353C12.6553 13.2727 12.6011 13.4052 12.5039 13.5024C12.4068 13.5995 12.275 13.6537 12.1377 13.6538C12.0003 13.6538 11.8677 13.5996 11.7705 13.5024L8 9.73291L4.23145 13.5024C4.18334 13.5506 4.12538 13.5887 4.0625 13.6147C3.99973 13.6407 3.93218 13.6538 3.86426 13.6538C3.79627 13.6538 3.72883 13.6408 3.66602 13.6147C3.60324 13.5887 3.54611 13.5505 3.49805 13.5024V13.5005C3.40174 13.4034 3.34668 13.273 3.34668 13.1362C3.3467 12.9994 3.40155 12.8681 3.49805 12.771L7.2666 8.99951L3.49805 5.229L3.49219 5.22412L3.4873 5.21826C3.40241 5.11913 3.35824 4.99125 3.36328 4.86084C3.36834 4.73046 3.42239 4.60642 3.51465 4.51416C3.60691 4.42198 3.731 4.36783 3.86133 4.36279C3.99165 4.35783 4.11871 4.40296 4.21777 4.48779L4.22949 4.49756L7.99902 8.26709L11.7695 4.49658C11.8667 4.3994 11.9983 4.34424 12.1357 4.34424Z"
                      fill="#36187D" stroke="#36187D" strokeWidth="0.4"
                    />
                  </svg>
                </button>
              )}
              <input
                className={styles["feedback-form__screenshot-input"]}
                id="screenshot-input"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={loading}
              />
            </div>
          )}
        </div>
        <PrivacyPolicyCheckbox
          url={privacyPolicyUrl}
          loading={loading}
        />
      </div>
      <footer className={styles["feedback-form__footer"]}>
        <button
          className={`${styles["feedback-form__button"]} button button--filled`}
          type="submit"
          disabled={loading}
        >
          <div className={styles["feedback-form__button-text"]}>
            {loading ? "Отправляем..." : buttonText}
          </div>
          <svg
            className={styles["feedback-form__button-icon"]}
            width="20" height="20" viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M8 5L13 10L8 15"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </footer>
    </form>
  );
};

export default FeedbackForm;
