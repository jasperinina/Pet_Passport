/**
 * Секция события (диагноз, рекомендации и т.д.)
 */
const EventSection = ({ title, value, isEditing, onChange, rows = 4 }) => {
  return (
    <section className="doctor-visit-section">
      <h2 className="h1 doctor-visit-section__title">{title}</h2>
      <div className="doctor-visit-section__card">
        {isEditing ? (
          <textarea
            className="txt1 doctor-visit-section__text doctor-visit-section__textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
          />
        ) : (
          <p className="txt1 doctor-visit-section__text">{value}</p>
        )}
      </div>
    </section>
  );
};

export default EventSection;

