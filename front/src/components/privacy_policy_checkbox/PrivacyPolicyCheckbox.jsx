import { useState } from "react";

import styles from "./PrivacyPolicyCheckbox.module.scss";

const PrivacyPolicyCheckbox = ({ url, loading, storageKey }) => {
  const [accepted, setAccepted] = useState(() => {
    if (!storageKey) return false;

    return sessionStorage.getItem(storageKey) === "true";
  });

  const handleChange = (event) => {
    const checked = event.target.checked;

    setAccepted(checked);
    if (storageKey) {
      sessionStorage.setItem(storageKey, String(checked));
    }
  };

  return (
    <div className={styles["privacy-policy-checkbox"]}>
      <input
        className={styles["privacy-policy-checkbox__input"]}
        id="privacy-policy-checkbox"
        type="checkbox"
        checked={accepted}
        onChange={handleChange}
        disabled={loading}
        required
      />
      <div
        className={styles["privacy-policy-checkbox__text"]}
      >
        Я соглашаюсь с обработкой <a href={url}>персональных данных</a>
      </div>
    </div>
  );
};

export default PrivacyPolicyCheckbox;
