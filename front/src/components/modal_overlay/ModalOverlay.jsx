import { useState, useEffect } from "react";

import styles from "./ModalOverlay.module.scss";

const ModalOverlay = ({
  isOpen,
  onClose,
  children
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("modal-open");
    } else {
      document.documentElement.classList.remove("modal-open");
    }
    return () => document.documentElement.classList.remove("modal-open");
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`${styles["modal-overlay"]} ${isClosing ? styles["modal-overlay--closing"] : ""}`}>
      <div className={styles["modal-overlay__background"]} onClick={handleClose}></div>
      {typeof children === "function"
        ? children({ isOpen, isClosing, onClose: handleClose })
        : children}
    </div>
  );
};

export default ModalOverlay;
