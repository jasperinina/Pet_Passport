import styles from "./EditPetModal.module.scss";

import { useState, useEffect, useRef } from "react";
import { updatePet, uploadPetPhoto, deletePetPhoto } from "../../../api/pets";
import API_BASE_URL from "../../../api/config";
import { FILE_UPLOAD, ERROR_MESSAGES } from "../../../constants/config";

const EditPetModal = ({ isOpen, onClose, pet, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    weightKg: "",
    birthDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [petPhotos, setPetPhotos] = useState([]);
  const fileInputRef = useRef(null);

  // ✅ ref для date input
  const birthDateRef = useRef(null);

  const openPicker = (ref) => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    el.showPicker?.(); // Chrome/Edge
    el.click(); // fallback
  };

  useEffect(() => {
    if (!isOpen || !pet) return;

    setFormData({
      name: pet.name || "",
      breed: pet.breed || "",
      weightKg: pet.weightKg || "",
      birthDate: pet.birthDate || "",
    });
    setPetPhotos(pet.photos || []);
    setSelectedFile(null);
    setError(null);
  }, [isOpen, pet]);

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const handleClose = () => {
    if (!loading) onClose();
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(ERROR_MESSAGES.INVALID_FILE_TYPE);
      return;
    }

    if (file.size > FILE_UPLOAD.MAX_SIZE) {
      setError(ERROR_MESSAGES.FILE_TOO_LARGE);
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile || !pet?.id) {
      setError("Файл не выбран или питомец не найден");
      return;
    }

    try {
      setUploadingPhoto(true);
      setError(null);

      const result = await uploadPetPhoto(pet.id, selectedFile);

      const photoUrl = result.photoUrl || result.url;
      const photoId = result.id || result.photoId;

      if (!photoUrl || !photoId) {
        throw new Error("Неверный формат ответа от сервера");
      }

      setPetPhotos((prev) => [...prev, { id: photoId, url: photoUrl }]);
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err.message || "Ошибка загрузки фотографии";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setUploadingPhoto(false);
    }
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
      setError(null);

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
      setError(errorMessage);
      console.error("Ошибка удаления фото:", err);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (selectedFile) {
        try {
          setUploadingPhoto(true);

          const result = await uploadPetPhoto(pet.id, selectedFile);

          const photoUrl = result.photoUrl || result.url;
          const photoId = result.Id || result.id || result.photoId;

          if (!photoUrl || !photoId) {
            throw new Error("Неверный формат ответа от сервера");
          }

          const newPhoto = {
            id: photoId,
            url: photoUrl,
          };

          setPetPhotos((prev) => [...prev, newPhoto]);
          setSelectedFile(null);

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } catch (photoError) {
          console.error("Ошибка загрузки фото:", photoError);
          setError(photoError.message || "Ошибка загрузки фотографии");
          setLoading(false);
          setUploadingPhoto(false);
          return;
        } finally {
          setUploadingPhoto(false);
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
      setError(err.message || "Ошибка при обновлении данных питомца");
      console.error("Ошибка обновления питомца:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // TODO: Сделать вывод ошибки
  return (
    <form className="form" onSubmit={handleSubmit}>
      {/* {error && (
        <div className="form__error">
          <p>{error}</p>
        </div>
      )} */}

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
                name="edit-pet-name-input"
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
                name="edit-pet-breed-input"
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
                name="edit-pet-weight-input"
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
                name="edit-pet-birth-date-input"
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
                      >
                        &#65794;
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {petPhotos.length < 4 && (
                <div>
                  <label
                    className={`${styles["edit-pet-modal__photo-file-label"]} ${loading || uploadingPhoto ? `${styles["edit-pet-modal__photo-file-label--not-allowed"]} ${styles["edit-pet-modal__photo-file-label--opacity"]}` : ""}`}
                    htmlFor="edit-pet-photo-input"
                  >
                    {selectedFile ? selectedFile.name : "Выбрать фото"}
                  </label>
                  <input
                    className={styles["edit-pet-modal__photo-file-input"]}
                    id="edit-pet-photo-input"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={loading || uploadingPhoto}
                  />
                  {selectedFile && (
                    <div className={styles["edit-pet-modal__photo-file-preview"]}>
                      <div className={styles["edit-pet-modal__photo-file-preview-inner"]}>
                        <img
                          className={styles["edit-pet-modal__photo-file-preview-image"]}
                          src={URL.createObjectURL(selectedFile)}
                          alt="Предпросмотр"
                          width="80" height="80" loading="lazy"
                        />
                        <span className={styles["edit-pet-modal__photo-file-preview-name"]}>
                          {selectedFile.name}
                        </span>
                        <button
                          className={`${styles["edit-pet-modal__photo-file-preview-button"]} ${loading || uploadingPhoto ? styles["edit-pet-modal__photo-file-preview-button--not-allowed"] : ""} button button--outlined`}
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          disabled={loading || uploadingPhoto}
                        >
                          Убрать
                        </button>
                      </div>
                      <p>
                        Фото будет загружено при нажатии кнопки "Сохранить"
                      </p>
                    </div>
                  )}
                  {petPhotos.length > 0 && (
                    <p>Загружено: {petPhotos.length} / 4</p>
                  )}
                </div>
              )}
              {petPhotos.length >= 4 && (
                <p>Достигнут лимит фотографий (максимум 4)</p>
              )}
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