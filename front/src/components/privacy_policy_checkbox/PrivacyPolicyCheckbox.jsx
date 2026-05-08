import { useState } from "react";

import styles from "./PrivacyPolicyCheckbox.module.scss";

const PrivacyPolicyCheckbox = ({ url, loading }) => {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className={styles["privacy-policy-checkbox"]}>
      <input
        className={styles["privacy-policy-checkbox__input"]}
        id="privacy-policy-checkbox"
        type="checkbox"
        checked={accepted}
        onChange={(e) => setAccepted(e.target.checked)}
        disabled={loading}
        required
      />
      <div
        className={styles["privacy-policy-checkbox__text"]}
      >
        Я соглашаюсь с обработкой <a href={url} target="_blank">персональных данных</a>
      </div>
    </div>
  );
};

export default PrivacyPolicyCheckbox;