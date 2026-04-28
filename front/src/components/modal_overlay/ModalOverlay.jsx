import { useState, useEffect } from "react";

import styles from "./ModalOverlay.module.scss";

import AddProcedureModal from "../ui/modals/AddProcedureModal/AddProcedureModal";
import EditPetModal from "../ui/modals/EditPetModal/EditPetModal";
import AddPetModal from "../ui/modals/AddPetModal/AddPetModal";

const ModalOverlay = ({
  modalName,
  isOpen,
  onClose,
  onSuccess = null,
  ownerId = null,
  pet = null,
  petId = null,
  event = null
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
      {modalName === "AddProcedureModal" ? (
        <AddProcedureModal
          isOpen={isOpen}
          onClose={handleClose}
          isClosing={isClosing}
          petId={petId}
          onSuccess={onSuccess}
          event={event}
        />
      ) : modalName === "EditPetModal" ? (
        <EditPetModal
          isOpen={isOpen}
          onClose={handleClose}
          isClosing={isClosing}
          pet={pet}
          onSuccess={onSuccess}
        />
      ) : modalName === "AddPetModal" ? (
        <AddPetModal
          isOpen={isOpen}
          onClose={handleClose}
          isClosing={isClosing}
          onSuccess={onSuccess}
          ownerId={ownerId}
        />
      ) : null}
    </div>
  );
};

export default ModalOverlay;
