import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Pets.module.scss";

import Logo from "../../components/logo/Logo";
import PetPhotoEmpty from "../../assets/images/pet-photo-empty.png";
import ModalOverlay from "../../components/modal_overlay/ModalOverlay";
import { getOwnerPets, getStoredOwnerId, isUnauthorizedError } from "../../api/auth";

const Pets = () => {
  const navigate = useNavigate();

  const [ownerId] = useState(() => getStoredOwnerId());
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);

  const loadPets = useCallback(async () => {
    if (!ownerId) {
      navigate("/", { replace: true });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const petsData = await getOwnerPets(ownerId);
      setPets(Array.isArray(petsData) ? petsData : []);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        navigate("/", { replace: true });
        return;
      }

      setError(err.message || "Не удалось загрузить питомцев");
    } finally {
      setLoading(false);
    }
  }, [navigate, ownerId]);

  useEffect(() => {
    queueMicrotask(loadPets);
  }, [loadPets]);

  const handlePetAdded = (pet) => {
    if (!pet) return;
    setPets((prevPets) => [...prevPets, pet]);
  };

  return (
    <div>
      <section className={`${styles.pets} section container`}>
        <header className={styles.pets__header}>
          <Logo />
        </header>
        {loading ? (
          <div className={`${styles.pets__body} ${styles["pets__body--empty"]}`}>
            <div className={styles.pets__empty}>
              <h3 className={`${styles["pets__empty-title"]} h3`}>Загружаем питомцев...</h3>
            </div>
          </div>
        ) : error ? (
          <div className={`${styles.pets__body} ${styles["pets__body--empty"]}`}>
            <div className={styles.pets__empty}>
              <h3 className={`${styles["pets__empty-title"]} h3`}>{error}</h3>
            </div>
          </div>
        ) : pets.length === 0 ? (
          <div className={`${styles.pets__body} ${styles["pets__body--empty"]}`}>
            <div className={styles.pets__empty}>
              <div className={styles["pets__empty-image"]}>
                <img
                  src={PetPhotoEmpty}
                  alt=""
                  width="143" height="143" loading="lazy"
                />
                <svg
                  className={styles["pets__empty-image-cross"]}
                  width="28" height="28" viewBox="0 0 28 28"
                  fill="none"
                >
                  <path
                    d="M21.2373 5.95312C21.4514 5.95312 21.6572 6.03809 21.8086 6.18945C21.9597 6.34068 22.0448 6.54597 22.0449 6.75977C22.0449 6.97373 21.9598 7.17971 21.8086 7.33105L15.1406 13.999L21.8105 20.667C21.9619 20.8183 22.0468 21.0233 22.0469 21.2373C22.0469 21.4514 21.9619 21.6572 21.8105 21.8086C21.6592 21.9597 21.4541 22.0449 21.2402 22.0449C21.0264 22.0449 20.8212 21.9597 20.6699 21.8086L14 15.1406L7.33398 21.8086C7.25915 21.8835 7.17005 21.9428 7.07227 21.9834C6.97432 22.024 6.86872 22.0449 6.7627 22.0449C6.6568 22.0449 6.55193 22.0239 6.4541 21.9834C6.35632 21.9429 6.26724 21.8834 6.19238 21.8086L6.19141 21.8076C6.04132 21.6565 5.95712 21.4522 5.95703 21.2393C5.95703 21.0261 6.04115 20.8211 6.19141 20.6699H6.19238L12.8584 14L6.19238 7.33105L6.18555 7.32422L6.17871 7.31641C6.04676 7.16212 5.97752 6.96362 5.98535 6.76074C5.99322 6.55773 6.07802 6.36534 6.22168 6.22168C6.36536 6.07803 6.55772 5.99319 6.76074 5.98535C6.96379 5.97751 7.16207 6.04751 7.31641 6.17969L7.32422 6.18555L7.33105 6.19238L13.999 12.8584L20.667 6.18945C20.8183 6.03823 21.0234 5.95315 21.2373 5.95312Z"
                    fill="white" stroke="white" strokeWidth="0.5"
                  />
                </svg>
              </div>
              <div className={styles["pets__empty-info"]}>
                <h3 className={`${styles["pets__empty-title"]} h3`}>У Вас пока нет питомцев</h3>
                <div className={styles["pets__empty-description"]}>
                  <p>
                    Добавьте первого питомца,<br/>чтобы создать его паспорт
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.pets__body}>
            <h3 className={`${styles.pets__title} h3`}>Ваши питомцы</h3>
            <ul className={styles.pets__list}>
              {pets.map((pet, index) => (
                <li
                  className={styles.pets__item}
                  key={pet.id ?? index}
                  onClick={() => navigate(`/?id=${pet.id}`)}
                >
                  <img
                    className={styles["pets__item-image"]}
                    src={PetPhotoEmpty}
                    alt=""
                    width="70" height="70" loading="lazy"
                  />
                  <div className={styles["pets__item-info"]}>
                    <div className={styles["pets__item-name"]}>{pet.name}</div>
                    <div className={styles["pets__item-breed"]}>{pet.breed}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          className={styles["pets__add-button"]}
          type="button"
          onClick={() => setIsAddPetModalOpen(true)}
        >
          <svg
            className={styles["pets__add-button-icon"]}
            width="28" height="28" viewBox="0 0 28 28"
            fill="none"
          >
            <path
              d="M21.2373 5.95312C21.4514 5.95312 21.6572 6.03809 21.8086 6.18945C21.9597 6.34068 22.0448 6.54597 22.0449 6.75977C22.0449 6.97373 21.9598 7.17971 21.8086 7.33105L15.1406 13.999L21.8105 20.667C21.9619 20.8183 22.0468 21.0233 22.0469 21.2373C22.0469 21.4514 21.9619 21.6572 21.8105 21.8086C21.6592 21.9597 21.4541 22.0449 21.2402 22.0449C21.0264 22.0449 20.8212 21.9597 20.6699 21.8086L14 15.1406L7.33398 21.8086C7.25915 21.8835 7.17005 21.9428 7.07227 21.9834C6.97432 22.024 6.86872 22.0449 6.7627 22.0449C6.6568 22.0449 6.55193 22.0239 6.4541 21.9834C6.35632 21.9429 6.26724 21.8834 6.19238 21.8086L6.19141 21.8076C6.04132 21.6565 5.95712 21.4522 5.95703 21.2393C5.95703 21.0261 6.04115 20.8211 6.19141 20.6699H6.19238L12.8584 14L6.19238 7.33105L6.18555 7.32422L6.17871 7.31641C6.04676 7.16212 5.97752 6.96362 5.98535 6.76074C5.99322 6.55773 6.07802 6.36534 6.22168 6.22168C6.36536 6.07803 6.55772 5.99319 6.76074 5.98535C6.96379 5.97751 7.16207 6.04751 7.31641 6.17969L7.32422 6.18555L7.33105 6.19238L13.999 12.8584L20.667 6.18945C20.8183 6.03823 21.0234 5.95315 21.2373 5.95312Z"
              fill="white" stroke="white" strokeWidth="0.5"
            />
          </svg>
        </button>
      </section>
      <ModalOverlay
        modalName="AddPetModal"
        isOpen={isAddPetModalOpen}
        onClose={() => setIsAddPetModalOpen(false)}
        onSuccess={handlePetAdded}
        ownerId={ownerId}
      />
    </div>
  );
};

export default Pets;
