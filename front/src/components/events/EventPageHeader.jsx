import { useNavigate } from "react-router-dom";

const EventPageHeader = ({
  title,
  eventId,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  onTitleChange,
  loading = false,
}) => {
  const navigate = useNavigate();

  return (
    <section className="doctor-visit-header">
      {isEditing ? (
        <input
          className="h1 doctor-visit__title"
          value={title}
          onChange={(e) => onTitleChange?.(e.target.value)}
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            font: "inherit",
            color: "var(--black)",
            padding: 0,
            width: "100%",
            maxWidth: "600px",
          }}
        />
      ) : (
        <h1 className="h1 doctor-visit__title">
          {title} {eventId ? `#${eventId}` : ""}
        </h1>
      )}

      <div className="doctor-visit-header__actions">
        {isEditing ? (
          <>
            <button
              className="btn btn-primary"
              onClick={onSave}
              disabled={loading}
            >
              Сохранить
            </button>
            <button
              className="doctor-visit__btn-delete"
              type="button"
              onClick={onDelete}
              disabled={loading}
            >
              Удалить
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-primary"
              onClick={onEdit}
              disabled={loading}
            >
              Редактировать
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Назад
            </button>
            <button
              className="doctor-visit__btn-delete"
              type="button"
              onClick={onDelete}
              disabled={loading}
            >
              Удалить
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default EventPageHeader;

