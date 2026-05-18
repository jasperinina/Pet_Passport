import { useEffect, useMemo, useRef, useState } from "react";

import { deletePetPhoto, updatePet, uploadPetPhoto } from "../../../../api/pets";
import API_BASE_URL from "../../../../api/config";
import { ERROR_MESSAGES } from "../../../../constants/config";
import { PET_GENDER_OPTIONS, PET_SPECIES_OPTIONS } from "../../../../constants/petOptions";
import NotificationService from "../../../../services/notificationService";
import { logger } from "../../../../utils/logger";
import PetPhotoPicker from "../../PetPhotoPicker/PetPhotoPicker";
import styles from "./PetPassportModal.module.scss";

const EMPTY_FORM_DATA = {
  name: "",
  species: "",
  gender: "",
  breed: "",
  color: "",
  microchipNumber: "",
  weightKg: "",
  birthDate: "",
  isNeutered: "",
  bloodType: "",
  allergies: "",
  chronicConditions: "",
};

const getOptionLabel = (options, value) => {
  const numericValue = typeof value === "string" ? Number(value) : value;
  return options.find((option) => option.value === numericValue)?.label || "Не указано";
};

const getBoolLabel = (value) => {
  if (value === true) return "Да";
  if (value === false) return "Нет";
  return "Не указано";
};

const formatValue = (value, suffix = "") => {
  if (value === null || value === undefined || value === "") return "Не указано";
  return `${value}${suffix}`;
};

const normalizeSelectValue = (value) => {
  if (value === null || value === undefined) return "";
  return String(value);
};

const buildFormData = (pet) => ({
  name: pet?.name || "",
  species: normalizeSelectValue(pet?.species),
  gender: normalizeSelectValue(pet?.gender),
  breed: pet?.breed || "",
  color: pet?.color || "",
  microchipNumber: pet?.microchipNumber || "",
  weightKg: pet?.weightKg ?? "",
  birthDate: pet?.birthDate || "",
  isNeutered:
    pet?.isNeutered === true ? "true" : pet?.isNeutered === false ? "false" : "",
  bloodType: pet?.bloodType || "",
  allergies: pet?.allergies || "",
  chronicConditions: pet?.chronicConditions || "",
});

const PetPassportModal = ({
  isOpen,
  isClosing,
  onClose,
  pet,
  onSuccess,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [petPhotos, setPetPhotos] = useState([]);
  const selectedPhotosRef = useRef([]);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    selectedPhotosRef.current = selectedPhotos;
  }, [selectedPhotos]);

  useEffect(() => {
    return () => {
      selectedPhotosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      wasOpenRef.current = false;
      return;
    }

    if (!pet) return;

    const shouldResetMode = !wasOpenRef.current;
    wasOpenRef.current = true;

    let isMounted = true;

    queueMicrotask(() => {
      if (!isMounted) return;

      if (shouldResetMode) {
        setIsEditing(false);
      }

      setFormData(buildFormData(pet));
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

  const passportRows = useMemo(() => ([
    { label: "Имя", value: formatValue(pet?.name) },
    { label: "Вид", value: getOptionLabel(PET_SPECIES_OPTIONS, pet?.species) },
    { label: "Пол", value: getOptionLabel(PET_GENDER_OPTIONS, pet?.gender) },
    { label: "Порода", value: formatValue(pet?.breed) },
    { label: "Окрас", value: formatValue(pet?.color) },
    { label: "Номер микрочипа", value: formatValue(pet?.microchipNumber) },
    { label: "Вес", value: formatValue(pet?.weightKg, pet?.weightKg ? " кг" : "") },
    { label: "Дата рождения", value: formatValue(pet?.birthDate) },
    { label: "Стерилизован / кастрирован", value: getBoolLabel(pet?.isNeutered) },
    { label: "Группа крови", value: formatValue(pet?.bloodType) },
    { label: "Аллергии", value: formatValue(pet?.allergies) },
    { label: "Хронические заболевания", value: formatValue(pet?.chronicConditions) },
  ]), [pet]);

  const handleClose = () => {
    if (loading) return;
    clearSelectedPhotos();
    onClose();
  };

  const clearSelectedPhotos = () => {
    selectedPhotosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    setSelectedPhotos([]);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setFormData(buildFormData(pet));
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData(buildFormData(pet));
    clearSelectedPhotos();
    setIsEditing(false);
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

      if (Number.isNaN(numericPhotoId)) {
        throw new Error(`Неверный ID фотографии: ${photoId}`);
      }

      await deletePetPhoto(pet.id, numericPhotoId);

      setPetPhotos((prev) =>
        prev.filter((photo) => {
          const currentPhotoId =
            typeof photo.id === "string" ? parseInt(photo.id, 10) : photo.id;

          return currentPhotoId !== numericPhotoId;
        })
      );

      onSuccess?.();
    } catch (err) {
      NotificationService.showError?.(
        err.message || "Ошибка удаления фотографии",
        ERROR_MESSAGES.ERROR_TITLE
      );

      logger.error("Ошибка удаления фото:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();

    if (!name) {
      NotificationService.showError?.("Введите имя питомца", ERROR_MESSAGES.ERROR_TITLE);
      return;
    }

    const weight = formData.weightKg === "" ? null : Number(formData.weightKg);

    if (formData.weightKg !== "" && (Number.isNaN(weight) || weight <= 0)) {
      NotificationService.showError?.("Введите корректный вес питомца", ERROR_MESSAGES.ERROR_TITLE);
      return;
    }

    const payload = {
      name,
      species: formData.species === "" ? null : Number(formData.species),
      gender: formData.gender === "" ? null : Number(formData.gender),
      breed: formData.breed.trim() || null,
      color: formData.color.trim() || null,
      microchipNumber: formData.microchipNumber.trim() || null,
      weightKg: weight,
      birthDate: formData.birthDate || null,
      isNeutered: formData.isNeutered === "" ? null : formData.isNeutered === "true",
      bloodType: formData.bloodType.trim() || null,
      allergies: formData.allergies.trim() || null,
      chronicConditions: formData.chronicConditions.trim() || null,
    };

    try {
      setLoading(true);

      if (selectedPhotos.length > 0) {
        const uploadedPhotos = [];

        for (const photo of selectedPhotos) {
          const result = await uploadPetPhoto(pet.id, photo.file);
          const photoUrl = result?.photoUrl || result?.url;
          const photoId = result?.Id || result?.id || result?.photoId;

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
      }

      await updatePet(pet.id, payload);
      onSuccess?.();
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
    <div
      className={`form ${isClosing ? "form--closing" : ""}`}
    >
      <div className="form__inner">
        <header className="form__header">
          <h2 className="form__title h1">
            {isEditing ? "Изменить данные" : "Паспорт питомца"}
          </h2>
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
          {isEditing ? (
            <form
              id="pet-passport-edit-form"
              className={styles["pet-passport-modal__edit-form"]}
              onSubmit={handleSubmit}
            >
              <ul className="form__list">
              <li className="form__item">
                <label className="form__item-label h3" htmlFor="passport-pet-name-input">Имя</label>
                <input
                  className="form__item-input input"
                  id="passport-pet-name-input"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </li>

              <div className="form__two-columns">
                <li className="form__item">
                  <label className="form__item-label h3" htmlFor="passport-pet-species-select">Вид</label>
                  <div className="select form__item-input">
                    <select
                      className="select__field"
                      id="passport-pet-species-select"
                      name="species"
                      value={formData.species}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="">Не указано</option>
                      {PET_SPECIES_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </li>
                <li className="form__item">
                  <label className="form__item-label h3" htmlFor="passport-pet-gender-select">Пол</label>
                  <div className="select form__item-input">
                    <select
                      className="select__field"
                      id="passport-pet-gender-select"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="">Не указано</option>
                      {PET_GENDER_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </li>
              </div>

              <div className="form__two-columns">
                <li className="form__item">
                  <label className="form__item-label h3" htmlFor="passport-pet-breed-input">Порода</label>
                  <input
                    className="form__item-input input"
                    id="passport-pet-breed-input"
                    name="breed"
                    type="text"
                    value={formData.breed}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </li>
                <li className="form__item">
                  <label className="form__item-label h3" htmlFor="passport-pet-color-input">Окрас</label>
                  <input
                    className="form__item-input input"
                    id="passport-pet-color-input"
                    name="color"
                    type="text"
                    value={formData.color}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </li>
              </div>

              <div className="form__two-columns">
                <li className="form__item">
                  <label className="form__item-label h3" htmlFor="passport-pet-weight-input">Вес (кг)</label>
                  <input
                    className="form__item-input input"
                    id="passport-pet-weight-input"
                    name="weightKg"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.weightKg}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </li>
                <li className="form__item">
                  <label className="form__item-label h3" htmlFor="passport-pet-birth-date-input">Дата рождения</label>
                  <input
                    className="form__item-input input"
                    id="passport-pet-birth-date-input"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </li>
              </div>

              <div className="form__two-columns">
                <li className="form__item">
                  <label className="form__item-label h3" htmlFor="passport-pet-microchip-input">Номер микрочипа</label>
                  <input
                    className="form__item-input input"
                    id="passport-pet-microchip-input"
                    name="microchipNumber"
                    type="text"
                    value={formData.microchipNumber}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </li>
                <li className="form__item">
                  <label className="form__item-label h3" htmlFor="passport-pet-neutered-select">Стерилизован / кастрирован</label>
                  <div className="select form__item-input">
                    <select
                      className="select__field"
                      id="passport-pet-neutered-select"
                      name="isNeutered"
                      value={formData.isNeutered}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="">Не указано</option>
                      <option value="true">Да</option>
                      <option value="false">Нет</option>
                    </select>
                  </div>
                </li>
              </div>

              <li className="form__item">
                <label className="form__item-label h3" htmlFor="passport-pet-blood-type-input">Группа крови</label>
                <input
                  className="form__item-input input"
                  id="passport-pet-blood-type-input"
                  name="bloodType"
                  type="text"
                  value={formData.bloodType}
                  onChange={handleChange}
                  disabled={loading}
                />
              </li>

              <li className="form__item">
                <label className="form__item-label h3" htmlFor="passport-pet-allergies-textarea">Аллергии</label>
                <textarea
                  className="form__item-input textarea"
                  id="passport-pet-allergies-textarea"
                  name="allergies"
                  rows="3"
                  value={formData.allergies}
                  onChange={handleChange}
                  disabled={loading}
                />
              </li>

              <li className="form__item">
                <label className="form__item-label h3" htmlFor="passport-pet-chronic-textarea">Хронические заболевания</label>
                <textarea
                  className="form__item-input textarea"
                  id="passport-pet-chronic-textarea"
                  name="chronicConditions"
                  rows="3"
                  value={formData.chronicConditions}
                  onChange={handleChange}
                  disabled={loading}
                />
              </li>

              <li className="form__item">
                <div className="form__item-label h3">Фотографии</div>
                {petPhotos.length > 0 && (
                  <ul className={styles["pet-passport-modal__photos-list"]}>
                    {petPhotos.map((photo) => (
                      <li className={styles["pet-passport-modal__photos-item"]} key={photo.id}>
                        <img
                          className={`${styles["pet-passport-modal__photos-image"]} ${loading ? styles["pet-passport-modal__photos-image--opacity"] : ""}`}
                          src={getPhotoUrl(photo.url)}
                          alt="Фото питомца"
                          width="100"
                          height="100"
                          loading="lazy"
                        />
                        <button
                          className={`${styles["pet-passport-modal__photos-remove-button"]} ${loading ? `${styles["pet-passport-modal__photos-remove-button--not-allowed"]} ${styles["pet-passport-modal__photos-remove-button--opacity"]}` : ""}`}
                          type="button"
                          title="Удалить фото"
                          onClick={() => handleDeletePhoto(photo.id)}
                          disabled={loading}
                        >
                          &#65794;
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <PetPhotoPicker
                  inputId="passport-pet-photo-input"
                  selectedPhotos={selectedPhotos}
                  setSelectedPhotos={setSelectedPhotos}
                  currentPhotoCount={petPhotos.length}
                  loading={loading}
                />
              </li>
              </ul>
            </form>
          ) : (
            <dl className={styles["passport"]}>
              {passportRows.map((row) => (
                <div className={styles["passport__row"]} key={row.label}>
                  <dt className={styles["passport__label"]}>{row.label}</dt>
                  <dd className={styles["passport__value"]}>{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <footer className="form__footer">
          {isEditing ? (
            <>
              <button
                className="button button--outlined"
                type="button"
                onClick={handleCancelEdit}
                disabled={loading}
              >
                Отменить
              </button>
              <button
                className="button button--filled"
                type="submit"
                form="pet-passport-edit-form"
                disabled={loading}
              >
                {loading ? "Сохранение..." : "Сохранить"}
              </button>
            </>
          ) : (
            <>
              <button
                className="button button--outlined"
                type="button"
                onClick={handleClose}
              >
                Закрыть
              </button>
              <button
                className="button button--filled"
                type="button"
                onClick={handleEditClick}
              >
                Изменить данные
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
};

export default PetPassportModal;
