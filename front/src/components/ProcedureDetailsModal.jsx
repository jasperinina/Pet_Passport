import { useEffect } from "react";
import "../styles/modal.css";
import CrossIcon from "../assets/icons/icon-cross.svg";

const getTypeLabel = (type) => {
  switch (type) {
    case "doctor-visit":
      return "Прием";
    case "vaccine":
      return "Вакцинация";
    case "treatment":
      return "Обработка";
    default:
      return "Процедура";
  }
};

const ProcedureDetailsModal = ({ isOpen, onClose, event }) => {
  // блокируем скролл страницы, пока модалка открыта
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleOverlayClick = () => {
    handleClose();
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  const title = event?.title || "Без названия";
  const typeLabel = getTypeLabel(event?.type);
  const dateTime = event?.eventDate
    ? new Date(event.eventDate).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Дата не указана";

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={handleContentClick}>
        <div className="modal-header">
          {/* ✅ Заголовок должен быть h1 */}
          <h1 className="h1 modal-title">Детали процедуры</h1>

          <button
            className="modal-close"
            type="button"
            onClick={handleClose}
            aria-label="Закрыть"
          >
            <img src={CrossIcon} alt="Закрыть" />
          </button>

          {/* ✅ Линия после заголовка */}
          <div className="modal-divider" />
        </div>

        <div className="modal-form">
          {/* ✅ СКРОЛЛ ТОЛЬКО ЗДЕСЬ */}
          <div className="modal-body">
            {/* ✅ ВСЕ ПОЛЯ В ОБЕРТКЕ */}
            <div className="modal-fields">
              <div className="form-field">
                <span className="h3">Тип</span>
                <p className="h2">{typeLabel}</p>
              </div>

              <div className="form-field">
                <span className="h3">Название</span>
                <p className="h2">{title}</p>
              </div>

              <div className="form-field">
                <span className="h3">Дата и время</span>
                <p className="h2">{dateTime}</p>
              </div>

              <div className="form-field">
                <span className="h3">Описание</span>
                <p className="txt1">
                  Здесь позже появится подробная информация о вакцинации или
                  обработке. Пока это заглушка для верстки и логики.
                </p>
              </div>
            </div>
          </div>

          {/* ✅ КНОПКИ ОТДЕЛЬНО (STICKY В CSS) */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcedureDetailsModal;
