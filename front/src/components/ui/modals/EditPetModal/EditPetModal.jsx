import styles from "./EditPetModal.module.scss";

import { useState, useEffect, useRef } from "react";

import { updatePet, uploadPetPhoto, deletePetPhoto } from "../../../../api/pets";
import API_BASE_URL from "../../../../api/config";
import { ERROR_MESSAGES } from "../../../../constants/config";
import NotificationService from "../../../../services/notificationService";
import PetPhotoPicker from "../../PetPhotoPicker/PetPhotoPicker";
import { logger } from "../../../../utils/logger";

const EditPetModal = ({
  isOpen,
  onClose,
  isClosing,
  pet,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    weightKg: "",
    birthDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [petPhotos, setPetPhotos] = useState([]);
  const selectedPhotosRef = useRef([]);

  useEffect(() => {
    selectedPhotosRef.current = selectedPhotos;
  }, [selectedPhotos]);

  useEffect(() => {
    return () => {
      selectedPhotosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !pet) return;

    let isMounted = true;

    queueMicrotask(() => {
      if (!isMounted) return;

      setFormData({
        name: pet.name || "",
        breed: pet.breed || "",
        weightKg: pet.weightKg || "",
        birthDate: pet.birthDate || "",
      });
      setPetPhotos(pet.photos || []);
      selectedPhotosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
      setSelectedPhotos([]);
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, pet]);

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const clearSelectedPhotos = () => {
    selectedPhotosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    setSelectedPhotos([]);
  };

  const handleClose = () => {
    if (!loading) {
      clearSelectedPhotos();
      onClose();
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getPhotoUrl = (photoUrl) => {
    if (!photoUrl) return null;
    return photoUrl.startsWith("http") ? photoUrl : `${API_BASE_URL}${photoUrl}`;
  };

  const handleDeletePhoto = async (photoId) => {
    if (!pet?.id) return;

    const confirmed = window.confirm("Точно удалить эту фотографию?");
    if (!confirmed) return;

    try {
      setLoading(true);

      const numericPhotoId =
        typeof photoId === "string" ? parseInt(photoId, 10) : photoId;

      if (isNaN(numericPhotoId)) {
        throw new Error(`Неверный ID фотографии: ${photoId}`);
      }

      await deletePetPhoto(pet.id, numericPhotoId);

      setPetPhotos((prev) =>
        prev.filter((photo) => {
          const photoIdNum =
            typeof photo.id === "string" ? parseInt(photo.id, 10) : photo.id;
          return photoIdNum !== numericPhotoId;
        })
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err.message || "Ошибка удаления фотографии";

      NotificationService.showError?.(
        errorMessage,
        ERROR_MESSAGES.ERROR_TITLE
      );

      logger.error("Ошибка удаления фото:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (selectedPhotos.length > 0) {
        try {
          const uploadedPhotos = [];

          for (const photo of selectedPhotos) {
            const result = await uploadPetPhoto(pet.id, photo.file);

            if (!result) {
              onClose();
              setLoading(false);
              return;
            }

            const photoUrl = result.photoUrl || result.url;
            const photoId = result.Id || result.id || result.photoId;

            if (!photoUrl || !photoId) {
              throw new Error("Неверный формат ответа от сервера");
            }

            uploadedPhotos.push({
              id: photoId,
              url: photoUrl,
            });
          }

          setPetPhotos((prev) => [...prev, ...uploadedPhotos]);
          clearSelectedPhotos();
        } catch (photoError) {
          NotificationService.showError?.(
            photoError.message || "Ошибка загрузки фотографии",
            ERROR_MESSAGES.ERROR_TITLE
          );

          logger.error("Ошибка загрузки фото:", photoError);

          setLoading(false);
          return;
        }
      }

      const updateData = {};

      if (formData.name.trim()) {
        updateData.name = formData.name.trim();
      }

      if (formData.breed.trim()) {
        updateData.breed = formData.breed.trim();
      }

      if (formData.weightKg) {
        const weight = parseFloat(formData.weightKg);
        if (!isNaN(weight) && weight > 0) {
          updateData.weightKg = weight;
        }
      }

      if (formData.birthDate) {
        updateData.birthDate = formData.birthDate;
      }

      await updatePet(pet.id, updateData);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err) {
      NotificationService.showError?.(
        err.message || "Ошибка при обновлении данных питомца",
        ERROR_MESSAGES.ERROR_TITLE
      );

      logger.error("Ошибка обновления питомца:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <form className={`form ${isClosing ? "form--closing" : ""}`} onSubmit={handleSubmit}>
      <div className="form__inner">
        <header className="form__header">
          <h2 className="form__title h1">Изменить данные</h2>
          <div className="form__close-button-wrapper">
            <button
              className="form__close-button cross-button"
              type="button"
              disabled={loading}
              onClick={handleClose}
            >
              <span className="visually-hidden">Закрыть форму</span>
            </button>
          </div>
        </header>
        <div className="form__body">
          <ul className="form__list">
            <li className="form__item">
              <label className="form__item-label h3" htmlFor="edit-pet-name-input">Имя</label>
              <input
                className="form__item-input input"
                id="edit-pet-name-input"
                name="name"
                type="text"
                placeholder="Введите имя"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </li>
            <li className="form__item">
              <label className="form__item-label h3" htmlFor="edit-pet-breed-input">Порода</label>
              <input
                className="form__item-input input"
                id="edit-pet-breed-input"
                name="breed"
                type="text"
                placeholder="Введите породу"
                value={formData.breed}
                onChange={handleChange}
                disabled={loading}
              />
            </li>
            <li className="form__item">
              <label className="form__item-label h3" htmlFor="edit-pet-weight-input">Вес (кг)</label>
              <input
                className="form__item-input input"
                id="edit-pet-weight-input"
                name="weightKg"
                type="number"
                step="0.1"
                min="0"
                placeholder="Введите вес"
                value={formData.weightKg}
                onChange={handleChange}
                disabled={loading}
              />
            </li>
            <li className="form__item">
              <label className="form__item-label h3" htmlFor="edit-pet-birth-date-input">Дата рождения</label>
              <input
                className="form__item-input input"
                id="edit-pet-birth-date-input"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                disabled={loading}
              />
            </li>
            <li className="form__item">
              <div className="form__item-label h3">Фотографии</div>
              {petPhotos.length > 0 && (
                <ul className={styles["edit-pet-modal__photos-list"]}>
                  {petPhotos.map((photo) => (
                    <li className={styles["edit-pet-modal__photos-item"]} key={photo.id}>
                      <img
                        className={`${styles["edit-pet-modal__photos-image"]} ${loading ? styles["edit-pet-modal__photos-image--opacity"] : ""}`}
                        src={getPhotoUrl(photo.url)}
                        alt="Фото питомца"
                        width="100" height="100" loading="lazy"
                      />
                      <button
                        className={`${styles["edit-pet-modal__photos-remove-button"]} ${loading ? `${styles["edit-pet-modal__photos-remove-button--not-allowed"]} ${styles["edit-pet-modal__photos-remove-button--opacity"]}` : ""}`}
                        type="button"
                        title="Удалить фото"
                        onClick={() => handleDeletePhoto(photo.id)}
                      >
                        &#65794;
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <PetPhotoPicker
                inputId="edit-pet-photo-input"
                selectedPhotos={selectedPhotos}
                setSelectedPhotos={setSelectedPhotos}
                currentPhotoCount={petPhotos.length}
                loading={loading}
              />
            </li>
          </ul>
        </div>
        <footer className="form__footer">
          <button
            className="button button--outlined"
            type="button"
            onClick={handleClose}
            disabled={loading}
          >
            Отменить
          </button>
          <button
            className="button button--filled"
            type="submit"
            disabled={loading}
          >
            {loading ? "Сохранение..." : "Сохранить"}
          </button>
        </footer>
      </div>
    </form>
  );
};

export default EditPetModal;
