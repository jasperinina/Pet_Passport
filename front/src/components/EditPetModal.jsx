import { useState, useEffect, useRef } from "react";
import "../styles/modal.css";
import { updatePet, uploadPetPhoto, deletePetPhoto } from "../api/pets";
import API_BASE_URL from "../api/config";
import { FILE_UPLOAD, ERROR_MESSAGES } from "../constants/config";
import CrossIcon from "../assets/icons/icon-cross.svg";
import CalendarIcon from "../assets/icons/icon-calendar.svg";
import ArrowIcon from "../assets/icons/icon-arrow.svg";


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

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h1 className="h1 modal-title">Изменить данные</h1>

          <button
            className="modal-close"
            onClick={handleClose}
            disabled={loading}
            type="button"
            aria-label="Закрыть"
          >
            <img src={CrossIcon} alt="Закрыть" />
          </button>

          <div className="modal-divider" />
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {error && (
            <div className="modal-error">
              <p className="txt2">{error}</p>
            </div>
          )}

          <div className="modal-body">
            <div className="modal-fields">
              <div className="form-field">
                <label className="form-label h3" htmlFor="name">
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
                <label className="form-label h3" htmlFor="breed">
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
                <label className="form-label h3" htmlFor="weightKg">
                  Вес (кг)
                </label>

                <div className="number-input-wrapper">
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

                  <div className="number-arrows">
                    {/* Вверх */}
                    <button
                      type="button"
                      className="number-arrow number-arrow--up"
                      disabled={loading}
                      onClick={() => {
                        const step = 0.1;
                        const current = parseFloat(formData.weightKg) || 0;
                        setFormData((prev) => ({
                          ...prev,
                          weightKg: (current + step).toFixed(1),
                        }));
                      }}
                    >
                      <img src={ArrowIcon} alt="" aria-hidden="true" />
                    </button>

                    {/* Вниз */}
                    <button
                      type="button"
                      className="number-arrow number-arrow--down"
                      disabled={loading}
                      onClick={() => {
                        const step = 0.1;
                        const current = parseFloat(formData.weightKg) || 0;
                        const next = Math.max(0, current - step);
                        setFormData((prev) => ({
                          ...prev,
                          weightKg: next.toFixed(1),
                        }));
                      }}
                    >
                      <img src={ArrowIcon} alt="" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>


              <div className="form-field">
                <label className="form-label h3" htmlFor="birthDate">
                  Дата рождения
                </label>

                <div className="input-with-icon">
                  <input
                    ref={birthDateRef}
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    className="form-input"
                    value={formData.birthDate}
                    onChange={handleChange}
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="input-icon-btn"
                    aria-label="Выбрать дату рождения"
                    disabled={loading}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      openPicker(birthDateRef);
                    }}
                  >
                    <img
                      src={CalendarIcon}
                      className="input-icon"
                      alt=""
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>

              {/* Загрузка фото */}
              <div className="form-field">
                <label className="form-label h3">Фотографии</label>

                {petPhotos.length > 0 && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(100px, 1fr))",
                      gap: "12px",
                      marginBottom: "16px",
                    }}
                  >
                    {petPhotos.map((photo) => (
                      <div key={photo.id} style={{ position: "relative" }}>
                        <img
                          src={getPhotoUrl(photo.url)}
                          alt="Фото питомца"
                          style={{
                            width: "100%",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid var(--divider)",
                            opacity: loading ? 0.6 : 1,
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(photo.id)}
                          disabled={loading}
                          style={{
                            position: "absolute",
                            top: "4px",
                            right: "4px",
                            backgroundColor: "rgba(211, 47, 47, 0.9)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "24px",
                            height: "24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.6 : 1,
                            fontSize: "18px",
                            lineHeight: "1",
                            padding: 0,
                            fontWeight: "bold",
                          }}
                          title="Удалить фото"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {petPhotos.length < 4 && (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={loading || uploadingPhoto}
                      style={{ display: "none" }}
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      style={{
                        display: "inline-block",
                        padding: "8px 16px",
                        backgroundColor: "var(--grey)",
                        borderRadius: "8px",
                        cursor:
                          loading || uploadingPhoto ? "not-allowed" : "pointer",
                        opacity: loading || uploadingPhoto ? 0.6 : 1,
                        fontSize: "14px",
                        color: "var(--black)",
                      }}
                    >
                      {selectedFile ? selectedFile.name : "Выбрать фото"}
                    </label>

                    {selectedFile && (
                      <div style={{ marginTop: "12px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "8px",
                          }}
                        >
                          <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="Предпросмотр"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid var(--divider)",
                            }}
                          />
                          <span
                            style={{
                              fontSize: "14px",
                              color: "var(--txt)",
                            }}
                          >
                            {selectedFile.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                            disabled={loading || uploadingPhoto}
                            style={{
                              padding: "8px 16px",
                              backgroundColor: "transparent",
                              color: "var(--txt)",
                              border: "1px solid var(--divider)",
                              borderRadius: "8px",
                              cursor:
                                loading || uploadingPhoto
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                          >
                            Убрать
                          </button>
                        </div>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "var(--txt)",
                            marginTop: "4px",
                          }}
                        >
                          Фото будет загружено при нажатии кнопки "Сохранить"
                        </p>
                      </div>
                    )}

                    {petPhotos.length > 0 && (
                      <p
                        style={{
                          fontSize: "12px",
                          color: "var(--txt)",
                          marginTop: "8px",
                        }}
                      >
                        Загружено: {petPhotos.length} / 4
                      </p>
                    )}
                  </div>
                )}

                {petPhotos.length >= 4 && (
                  <p style={{ fontSize: "14px", color: "var(--txt)" }}>
                    Достигнут лимит фотографий (максимум 4)
                  </p>
                )}
              </div>
            </div>
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
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPetModal;
