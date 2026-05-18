import React from 'react';

import styles from "./HeaderAction.module.scss";

const HeaderAction = ({ icon, text, onClick, hasSecondIcon = false }) => {
  return (
    <button
      className={`${styles["header-action"]} button button--gray`}
      type="button"
      onClick={onClick}
    >
      {icon && React.createElement(icon, {
        className: styles["header-action__icon"],
        "aria-hidden": true,
        width: "16",
        height: "16"
      })}
      <div className={`${styles["header-action__text"]} hidden-mobile`}>{text}</div>
      {hasSecondIcon && (
        <svg
          className={styles["header-action__icon"]}
          width="6" height="10" viewBox="0 0 6 10"
          fill="none"
        >
          <path
            d="M0.799988 0.800003L4.79999 4.8L0.799988 8.8"
            stroke="#8B90A6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
};

export default HeaderAction;