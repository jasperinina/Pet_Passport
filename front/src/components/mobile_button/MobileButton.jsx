import styles from "./MobileButton.module.scss";

const MobileButton = ({
  color = "dark",
  icon,
  fixed = false,
  className = "",
  ariaLabel,
  onClick,
}) => {
  const buttonClassName = [
    styles["mobile-button"],
    styles[`mobile-button--${color}`],
    fixed ? styles["mobile-button--fixed"] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const Icon = typeof icon === "function" ? icon : null;

  return (
    <button
      className={buttonClassName}
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {Icon ? <Icon /> : icon}
    </button>
  );
};

export default MobileButton;
