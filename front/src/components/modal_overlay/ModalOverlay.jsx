import styles from "./ModalOverlay.module.scss";

import AddProcedureModal from "../ui/modals/AddProcedureModal/AddProcedureModal";
import EditPetModal from "../ui/modals/EditPetModal/EditPetModal";

const ModalOverlay = ({
  modalName,
  isOpen,
  onClose,
  onSuccess = null,
  pet = null,
  petId = null,
  event = null
}) => {
  if (!isOpen) return null;

  document.documentElement.classList.add("modal-open");

  return (
    <div className={styles["modal-overlay"]}>
      {modalName === "AddProcedureModal" ? (
        <AddProcedureModal
          isOpen={isOpen}
          onClose={onClose}
          petId={petId}
          onSuccess={onSuccess}
          event={event}
        />
      ) : modalName === "EditPetModal" ? (
        <EditPetModal
          isOpen={isOpen}
          onClose={onClose}
          pet={pet}
          onSuccess={onSuccess}
        />
      ) : (
        <div></div>
      )}
      <div className={styles["modal-overlay__background"]} onClick={onClose}></div>  
    </div>
  );
};

export default ModalOverlay;