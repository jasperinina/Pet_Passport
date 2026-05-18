import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import styles from "./PetCard.module.scss";

import PetPhotos from "../PetPhotos/PetPhotos";
import ModalOverlay from "../../modal_overlay/ModalOverlay";
import ExportPdfModal from "../modals/ExportPdfModal/ExportPdfModal";

const PetCard = ({setIsAddProcedureModalOpen, setIsEditModalOpen, pet}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.search || "";

  const [isExportPdfOpen, setIsExportPdfOpen] = useState(false);

  const getAgeWord = (age) => {
    const lastDigit = age % 10;
    const lastTwoDigits = age % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "лет";
    if (lastDigit === 1) return "год";
    if (lastDigit >= 2 && lastDigit <= 4) return "года";
    return "лет";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Не указана";

    try {
      const [year, month, day] = dateString.split("-").map(Number);
      const date = new Date(year, month - 1, day);

      const formattedDay = day.toString().padStart(2, "0");
      const formattedMonth = date.toLocaleString("ru-RU", {
        month: "long",
      });
      const formattedYear = year;

      const today = new Date();
      const age =
        today.getFullYear() -
        year -
        (today.getMonth() < month - 1 ||
        (today.getMonth() === month - 1 && today.getDate() < day)
          ? 1
          : 0);
      
      return `${formattedDay} ${formattedMonth} ${formattedYear} (${age} ${getAgeWord(age)})`;
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <article className={styles["pet-card"]}>
        <PetPhotos
          photos={pet.photos}
          petName={pet.name}
        />
        <div className={styles["pet-card__content"]}>
          <header className={styles["pet-card__header"]}>
            <h1 className={styles["pet-card__name"]}>{pet.name || "Не указано"}</h1>
          </header>
          <div className={styles["pet-card__body"]}>
            <div className={styles["pet-card__data"]}>
              <div className={styles["pet-card__data-label"]}>Порода</div>
              <h2 className={styles["pet-card__data-text"]}>{pet.breed}</h2>
            </div>
            <div className={styles["pet-card__row"]}>
              <div className={styles["pet-card__data"]}>
                <div className={styles["pet-card__data-label"]}>Вес</div>
                <h2 className={styles["pet-card__data-text"]}>{pet.weightKg} кг</h2>
              </div>
              <div className={styles["pet-card__data"]}>
                <div className={styles["pet-card__data-label"]}>Дата рождения</div>
                <h2 className={styles["pet-card__data-text"]}>{formatDate(pet.birthDate)}</h2>
              </div>
            </div>
          </div>
          <footer className={styles["pet-card__footer"]}>
            <button
              className="button button--filled"
              type="button"
              onClick={() => setIsAddProcedureModalOpen(true)}
            >
              Добавить процедуру
            </button>
            <button
              className="button button--outlined hidden-mobile"
              type="button"
              onClick={() => navigate(`/recommendations${search}`)}
            >
              Рекомендуемые процедуры
            </button>
            <button
              className="button button--transparent"
              type="button"
              onClick={() => setIsEditModalOpen(true)}
            >
              Изменить данные
            </button>
            <button
              className="button button--outlined"
              type="button"
              onClick={() => setIsExportPdfOpen(true)}
            >
              Скачать PDF
            </button>
          </footer>
        </div>
      </article>

      <ModalOverlay isOpen={isExportPdfOpen} onClose={() => setIsExportPdfOpen(false)}>
        {({ isOpen, isClosing, onClose }) => (
          <ExportPdfModal
            isOpen={isOpen}
            isClosing={isClosing}
            onClose={onClose}
            petId={pet.id}
            petName={pet.name}
          />
        )}
      </ModalOverlay>
    </>
  );
};

export default PetCard;