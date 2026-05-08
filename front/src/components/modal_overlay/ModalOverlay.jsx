import { useState, useEffect } from "react";

import styles from "./ModalOverlay.module.scss";

const CLOSE_ANIMATION_MS = 300;

const ModalOverlay = ({
  isOpen,
  onClose,
  children
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen || isClosing) {
      document.documentElement.classList.add("modal-open");
      return () => document.documentElement.classList.remove("modal-open");
    }
  }, [isClosing, isOpen]);

  const handleClose = () => {
    if (isClosing) return;

    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, CLOSE_ANIMATION_MS);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`${styles["modal-overlay"]} ${isClosing ? styles["modal-overlay--closing"] : ""}`}>
      <div className={styles["modal-overlay__background"]} onClick={handleClose}></div>
      {typeof children === "function"
        ? children({ isOpen: isOpen || isClosing, isClosing, onClose: handleClose })
        : children}
    </div>
  );
};

export default ModalOverlay;
