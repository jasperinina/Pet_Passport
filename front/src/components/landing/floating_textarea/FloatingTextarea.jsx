import { useState } from "react";

import styles from "./FloatingTextarea.module.scss";

const FloatingTextarea = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  required = true
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.trim().length > 0;

  return (
    <div className={styles["floating-textarea__wrapper"]}>
      <label
        className={styles["floating-textarea__label"]}
        htmlFor={name}
      >
        {label}
      </label>
      <textarea
        className={styles["floating-textarea__input"]}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
};

export default FloatingTextarea;