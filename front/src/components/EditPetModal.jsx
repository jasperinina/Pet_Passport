import { useState, useEffect } from "react";
import "../styles/modal.css";
import { updatePet } from "../api/pets";

const EditPetModal = ({ isOpen, onClose, pet, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    weightKg: "",
    birthDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Заполняем форму данными питомца при открытии
  useEffect(() => {
    if (isOpen && pet) {
      setFormData({
        name: pet.name || "",
        breed: pet.breed || "",
        weightKg: pet.weightKg || "",
        birthDate: pet.birthDate || "",
      });
      setError(null);
    }
  }, [isOpen, pet]);

  // Блокируем прокрутку body, пока модалка открыта
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Обработка закрытия модального окна
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  // Обработка изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
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

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="h2 modal-title">Изменить данные</h2>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={loading}
            type="button"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {error && (
            <div className="modal-error">
              <p className="txt2">{error}</p>
            </div>
          )}

          <div className="form-field">
            <label className="form-label txt2" htmlFor="name">
              Имя
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите имя"
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label className="form-label txt2" htmlFor="breed">
              Порода
            </label>
            <input
              type="text"
              id="breed"
              name="breed"
              className="form-input"
              value={formData.breed}
              onChange={handleChange}
              placeholder="Введите породу"
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label className="form-label txt2" htmlFor="weightKg">
              Вес (кг)
            </label>
            <input
              type="number"
              id="weightKg"
              name="weightKg"
              className="form-input"
              value={formData.weightKg}
              onChange={handleChange}
              placeholder="Введите вес"
              step="0.1"
              min="0"
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label className="form-label txt2" htmlFor="birthDate">
              Дата рождения
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              className="form-input"
              value={formData.birthDate}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPetModal;
