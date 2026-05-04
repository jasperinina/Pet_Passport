import styles from "./FloatingTextarea.module.scss";

const FloatingTextarea = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  required = true
}) => {
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
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
};

export default FloatingTextarea;
