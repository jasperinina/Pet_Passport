import AddProcedureModal from "../../AddProcedureModal/AddProcedureModal";
import EditPetModal from "../../ui/EditPetModal/EditPetModal";
import styles from "./ModalOverlay.module.scss";

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

  // TODO: Перенести form в EditPetModal (и в другие)
  return (
    <div className={styles["modal-overlay"]}>
      {modalName === "AddProcedureModal" ? (
        <AddProcedureModal
          isOpen={isOpen}
          onClose={onClose}
          petId={petId}
          onSuccess={onSuccess}
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