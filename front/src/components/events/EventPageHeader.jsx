import { useNavigate } from "react-router-dom";

const EventPageHeader = ({
  title,
  eventId,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const navigate = useNavigate();

  return (
    <section className="doctor-visit-header">
      <h1 className="h1 doctor-visit__title">
        {title} {eventId ? `#${eventId}` : ""}
      </h1>

      <div className="doctor-visit-header__actions">
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
      </div>
    </section>
  );
};

export default EventPageHeader;

