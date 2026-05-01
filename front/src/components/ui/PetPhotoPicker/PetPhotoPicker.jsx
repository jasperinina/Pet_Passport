import { useRef } from "react";

import styles from "./PetPhotoPicker.module.scss";

import { ERROR_MESSAGES, FILE_UPLOAD } from "../../../constants/config";
import NotificationService from "../../../services/notificationService";

const PetPhotoPicker = ({
  inputId,
  selectedPhotos,
  setSelectedPhotos,
  currentPhotoCount = 0,
  loading = false,
  onError,
}) => {
  const fileInputRef = useRef(null);
  const selectedCount = currentPhotoCount + selectedPhotos.length;

  const showError = (message) => {
    if (onError) {
      onError(message);
      return;
    }

    NotificationService.showError?.(
      message,
      ERROR_MESSAGES.ERROR_TITLE
    );
  };

  const resetInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const availableSlots =
      FILE_UPLOAD.MAX_PHOTOS - currentPhotoCount - selectedPhotos.length;

    if (availableSlots <= 0 || files.length > availableSlots) {
      showError(ERROR_MESSAGES.FILE.LIMIT_EXCEEDED);
      resetInput();
      return;
    }

    const invalidFile = files.find(
      (file) =>
        !FILE_UPLOAD.ACCEPTED_TYPES.includes(file.type) ||
        !file.type.startsWith("image/")
    );

    if (invalidFile) {
      showError(ERROR_MESSAGES.FILE.INVALID_TYPE);
      resetInput();
      return;
    }

    const oversizedFile = files.find((file) => file.size > FILE_UPLOAD.MAX_SIZE);

    if (oversizedFile) {
      showError(ERROR_MESSAGES.FILE.TOO_LARGE);
      resetInput();
      return;
    }

    const photos = files.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setSelectedPhotos((prev) => [...prev, ...photos]);
    resetInput();
  };

  const handlePhotoRemove = (photoId) => {
    if (loading) return;

    setSelectedPhotos((prev) => {
      const photoToRemove = prev.find((photo) => photo.id === photoId);
      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.previewUrl);
      }

      return prev.filter((photo) => photo.id !== photoId);
    });
  };

  return (
    <div className={styles["pet-photo-picker"]}>
      {selectedPhotos.length > 0 && (
        <ul className={styles["pet-photo-picker__list"]}>
          {selectedPhotos.map((photo) => (
            <li className={styles["pet-photo-picker__item"]} key={photo.id}>
              <img
                className={`${styles["pet-photo-picker__image"]} ${loading ? styles["pet-photo-picker__image--opacity"] : ""}`}
                src={photo.previewUrl}
                alt="Фото питомца"
                width="100"
                height="100"
              />
              <button
                className={`${styles["pet-photo-picker__remove-button"]} ${loading ? styles["pet-photo-picker__remove-button--disabled"] : ""}`}
                type="button"
                title="Убрать фото"
                onClick={() => handlePhotoRemove(photo.id)}
                disabled={loading}
              >
                &#65794;
              </button>
            </li>
          ))}
        </ul>
      )}
      {selectedCount < FILE_UPLOAD.MAX_PHOTOS && (
        <div>
          <label
            className={`${styles["pet-photo-picker__label"]} ${loading ? styles["pet-photo-picker__label--disabled"] : ""}`}
            htmlFor={inputId}
          >
            Выбрать фото
          </label>
          <input
            className={styles["pet-photo-picker__input"]}
            id={inputId}
            ref={fileInputRef}
            type="file"
            accept={FILE_UPLOAD.ACCEPTED_TYPES.join(",")}
            multiple
            onChange={handlePhotoSelect}
            disabled={loading}
          />
          <p className={styles["pet-photo-picker__caption"]}>
            Загружено: {selectedCount} / {FILE_UPLOAD.MAX_PHOTOS}
          </p>
        </div>
      )}
      {selectedCount >= FILE_UPLOAD.MAX_PHOTOS && (
        <p className={styles["pet-photo-picker__caption"]}>
          Достигнут лимит фотографий (максимум {FILE_UPLOAD.MAX_PHOTOS})
        </p>
      )}
    </div>
  );
};

export default PetPhotoPicker;
