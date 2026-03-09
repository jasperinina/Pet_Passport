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
    <div className="section__grid--first-child">
      {isEditing ? (
        <header className="section__header section__header--filled">
          <label className="visually-hidden" htmlFor="procedure-page-title">
            {title}
          </label>
          <input
            className="input"
            id="procedure-page-title"
            name="procedure-page-title"
            value={title}
            onChange={(e) => onTitleChange?.(e.target.value)}
          />
          <div className="section__actions">
            <button
              className="button button--filled"
              type="button"
              disabled={loading}
              onClick={onSave}
            >
              Сохранить
            </button>
            <button
              className="button button--transparent"
              type="button"
              disabled={loading}
              onClick={onDelete}
            >
              Удалить
            </button>
          </div>
        </header>
      ) : (
        <header className="section__header section__header--filled">
          <h1 className="section__title h1">
            {title}
          </h1>
          <div className="section__actions">
            <button
              className="button button--filled"
              type="button"
              disabled={loading}
              onClick={onEdit}
            >
              Редактировать
            </button>
            <button
              className="button button--outlined"
              type="button"
              disabled={loading}
              onClick={() => navigate(-1)}
            >
              Назад
            </button>
            <button
              className="button button--transparent"
              type="button"
              disabled={loading}
              onClick={onDelete}
            >
              Удалить
            </button>
          </div>
        </header>
      )}
    </div>
  );
};

export default EventPageHeader;