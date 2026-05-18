import { useState, useEffect, useRef } from "react";

import { createPet } from "../../../../api/pets";
import { getStoredOwnerId } from "../../../../api/auth";
import { PET_GENDER_OPTIONS, PET_SPECIES_OPTIONS } from "../../../../constants/petOptions";
import PetPhotoPicker from "../../PetPhotoPicker/PetPhotoPicker";

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

const AddPetModal = ({
  isOpen,
  onClose,
  isClosing,
  onSuccess,
  ownerId
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM_DATA);
  const [error, setError] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState([]);
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
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const resetForm = () => {
    setFormData(EMPTY_FORM_DATA);
    selectedPhotosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    setSelectedPhotos([]);
    setError("");
  };

  const handleClose = () => {
    if (loading) return;

    resetForm();
    onClose();
  };

  const handleChange = (e) => {
    setError("");

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const breed = formData.breed.trim();
    const weight = formData.weightKg ? parseFloat(formData.weightKg) : null;
    const resolvedOwnerId = ownerId || getStoredOwnerId();

    if (!name) {
      setError("Введите имя питомца");
      return;
    }

    if (!resolvedOwnerId) {
      setError("Не найден владелец питомца. Войдите в аккаунт еще раз");
      return;
    }

    if (formData.weightKg && (Number.isNaN(weight) || weight <= 0)) {
      setError("Введите корректный вес питомца");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        species: formData.species === "" ? null : Number(formData.species),
        gender: formData.gender === "" ? null : Number(formData.gender),
        breed: breed || null,
        color: formData.color.trim() || null,
        microchipNumber: formData.microchipNumber.trim() || null,
        weightKg: weight,
        birthDate: formData.birthDate || null,
        isNeutered: formData.isNeutered === "" ? null : formData.isNeutered === "true",
        bloodType: formData.bloodType.trim() || null,
        allergies: formData.allergies.trim() || null,
        chronicConditions: formData.chronicConditions.trim() || null,
        ownerId: resolvedOwnerId,
        photos: selectedPhotos.map((photo) => photo.file),
      };

      const createdPetId = await createPet(payload);
      const createdPet = {
        id: createdPetId,
        ...payload,
        birthDate: payload.birthDate || "",
        photos: [],
      };

      onSuccess?.(createdPet);
      resetForm();
      onClose();
    } catch (err) {
      setError(err.message || "Не удалось создать питомца");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <form className={`form ${isClosing ? "form--closing" : ""}`} onSubmit={handleSubmit}>
      <div className="form__inner">
        <header className="form__header">
          <h2 className="form__title h1">Добавить питомца</h2>
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
          {error && <div className="form__error">{error}</div>}
          <ul className="form__list">
            <li className="form__item">
              <label
                className="form__item-label h3"
                htmlFor="add-pet-name-input"
              >
                Имя *
              </label>
              <input
                className="form__item-input input"
                id="add-pet-name-input"
                name="name"
                type="text"
                placeholder="Введите имя"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                required
                autoComplete="off"
              />
            </li>
            <li className="form__item">
              <label
                className="form__item-label h3"
                htmlFor="add-pet-breed-input"
              >
                Порода
              </label>
              <input
                className="form__item-input input"
                id="add-pet-breed-input"
                name="breed"
                type="text"
                placeholder="Введите породу"
                value={formData.breed}
                onChange={handleChange}
                disabled={loading}
                autoComplete="off"
              />
            </li>
            <div className="form__two-columns">
              <li className="form__item">
                <label
                  className="form__item-label h3"
                  htmlFor="add-pet-species-select"
                >
                  Вид
                </label>
                <div className="select form__item-input">
                  <select
                    className="select__field"
                    id="add-pet-species-select"
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">Не указано</option>
                    {PET_SPECIES_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </li>
              <li className="form__item">
                <label
                  className="form__item-label h3"
                  htmlFor="add-pet-gender-select"
                >
                  Пол
                </label>
                <div className="select form__item-input">
                  <select
                    className="select__field"
                    id="add-pet-gender-select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">Не указано</option>
                    {PET_GENDER_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </li>
            </div>
            <li className="form__item">
              <label
                className="form__item-label h3"
                htmlFor="add-pet-color-input"
              >
                Окрас
              </label>
              <input
                className="form__item-input input"
                id="add-pet-color-input"
                name="color"
                type="text"
                placeholder="Введите окрас"
                value={formData.color}
                onChange={handleChange}
                disabled={loading}
                autoComplete="off"
              />
            </li>
            <li className="form__item">
              <label
                className="form__item-label h3"
                htmlFor="add-pet-weight-input"
              >
                Вес (кг)
              </label>
              <input
                className="form__item-input input"
                id="add-pet-weight-input"
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
              <label
                className="form__item-label h3"
                htmlFor="add-pet-birth-date-input"
              >
                Дата рождения
              </label>
              <input
                className="form__item-input input"
                id="add-pet-birth-date-input"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                disabled={loading}
              />
            </li>
            <div className="form__two-columns">
              <li className="form__item">
                <label
                  className="form__item-label h3"
                  htmlFor="add-pet-microchip-input"
                >
                  Номер микрочипа
                </label>
                <input
                  className="form__item-input input"
                  id="add-pet-microchip-input"
                  name="microchipNumber"
                  type="text"
                  placeholder="Введите номер"
                  value={formData.microchipNumber}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="off"
                />
              </li>
              <li className="form__item">
                <label
                  className="form__item-label h3"
                  htmlFor="add-pet-neutered-select"
                >
                  Стерилизован / кастрирован
                </label>
                <div className="select form__item-input">
                  <select
                    className="select__field"
                    id="add-pet-neutered-select"
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
              <label
                className="form__item-label h3"
                htmlFor="add-pet-blood-type-input"
              >
                Группа крови
              </label>
              <input
                className="form__item-input input"
                id="add-pet-blood-type-input"
                name="bloodType"
                type="text"
                placeholder="Введите группу крови"
                value={formData.bloodType}
                onChange={handleChange}
                disabled={loading}
                autoComplete="off"
              />
            </li>
            <li className="form__item">
              <label
                className="form__item-label h3"
                htmlFor="add-pet-allergies-textarea"
              >
                Аллергии
              </label>
              <textarea
                className="form__item-input textarea"
                id="add-pet-allergies-textarea"
                name="allergies"
                rows="3"
                placeholder="Введите аллергии"
                value={formData.allergies}
                onChange={handleChange}
                disabled={loading}
              />
            </li>
            <li className="form__item">
              <label
                className="form__item-label h3"
                htmlFor="add-pet-chronic-textarea"
              >
                Хронические заболевания
              </label>
              <textarea
                className="form__item-input textarea"
                id="add-pet-chronic-textarea"
                name="chronicConditions"
                rows="3"
                placeholder="Введите заболевания"
                value={formData.chronicConditions}
                onChange={handleChange}
                disabled={loading}
              />
            </li>
            <li className="form__item">
              <div className="form__item-label h3">Фотографии</div>
              <PetPhotoPicker
                inputId="add-pet-photo-input"
                selectedPhotos={selectedPhotos}
                setSelectedPhotos={setSelectedPhotos}
                loading={loading}
                onError={setError}
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
            {loading ? "Создание..." : "Создать"}
          </button>
        </footer>
      </div>
    </form>
  );
};

export default AddPetModal;
