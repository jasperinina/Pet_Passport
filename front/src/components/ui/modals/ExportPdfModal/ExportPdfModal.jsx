import { useState } from "react";

import { downloadPetPassportPdf } from "../../../../api/pets";
import { notifyError } from "../../../../services/notificationService";

import styles from "./ExportPdfModal.module.scss";

const SECTIONS = [
  { key: "includeVaccines",   label: "Прививки" },
  { key: "includeTreatments", label: "Обработки от паразитов" },
  { key: "includeVisits",     label: "Визиты к врачу" },
];

const INITIAL_SECTIONS = {
  includeVaccines:   false,
  includeTreatments: false,
  includeVisits:     false,
};

const ExportPdfModal = ({ isOpen, onClose, isClosing, petId, petName }) => {
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleToggle = (key) =>
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleClose = () => {
    if (loading) return;
    setSections(INITIAL_SECTIONS);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await downloadPetPassportPdf(petId, sections, petName);
      handleClose();
    } catch {
      notifyError("Не удалось сгенерировать PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={`form ${isClosing ? "form--closing" : ""}`}
      onSubmit={handleSubmit}
    >
      <div className="form__inner">
        <header className="form__header">
          <h2 className="form__title h1">Экспорт в PDF</h2>
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
          <div className={styles["passport-badge"]}>
            <span className={styles["passport-badge__icon"]}>📄</span>
            <div>
              <div className={styles["passport-badge__title"]}>Паспорт питомца</div>
              <div className={styles["passport-badge__sub"]}>Включается всегда</div>
            </div>
          </div>

          <p className={styles["hint"]}>
            Выберите дополнительные разделы — каждый будет добавлен как отдельная страница:
          </p>

          <ul className={styles["sections"]}>
            {SECTIONS.map(({ key, label }) => (
              <li key={key} className={styles["section"]}>
                <label
                  className={`toggle ${styles["section__toggle"]}`}
                  htmlFor={`pdf-${key}`}
                >
                  <span className="toggle__label">{label}</span>
                  <input
                    className="toggle__input"
                    id={`pdf-${key}`}
                    type="checkbox"
                    checked={sections[key]}
                    onChange={() => handleToggle(key)}
                    disabled={loading}
                  />
                </label>
              </li>
            ))}
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
            {loading ? "Генерация..." : "Скачать PDF"}
          </button>
        </footer>
      </div>
    </form>
  );
};

export default ExportPdfModal;
