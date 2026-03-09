import { useRef } from "react";

const TreatmentFields = ({
  loading,
  title,
  setTitle,
  remedy,
  setRemedy,
  parasite,
  setParasite,
  eventDate,
  setEventDate,
  eventTime,
  setEventTime,
  periodUnit,
  setPeriodUnit,
  periodOptions,
}) => {
  const dateRef = useRef(null);
  const timeRef = useRef(null);

  const openPicker = (ref) => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    el.showPicker?.(); // Chrome/Edge
    el.click();        // fallback
  };

  return (
    <ul className="form__list">
      <li className="form__item">
        <label className="form__item-label h3" htmlFor="treatment-title-field">Название</label>
        <input
          className="form__item-input input"
          id="treatment-title-field"
          name="treatment-title-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите название"
          disabled={loading}
        />
      </li>
      <li className="form__two-columns">
        <div className="form__item">
          <label className="form__item-label h3" htmlFor="treatment-remedy-field">Препарат</label>
          <input
            className="form__item-input input"
            id="treatment-remedy-field"
            name="treatment-remedy-field"
            value={remedy}
            onChange={(e) => setRemedy(e.target.value)}
            placeholder="Введите препарат"
            disabled={loading}
          />
        </div>
        <div className="form__item">
          <label className="form__item-label h3" htmlFor="treatment-parasite-field">Паразит</label>
          <input
            className="form__item-input input"
            id="treatment-parasite-field"
            name="treatment-parasite-field"
            value={parasite}
            onChange={(e) => setParasite(e.target.value)}
            placeholder="Введите название паразита"
            disabled={loading}
          />
        </div>
      </li>
      <li className="form__two-columns">
        <div className="form__item">
          <label className="form__item-label h3" htmlFor="treatment-date-field">Дата</label>
          <input
            className="form__item-input input"
            id="treatment-date-field"
            name="treatment-date-field"
            type="date"
            ref={dateRef}
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div className="form__item">
          <label className="form__item-label h3" htmlFor="treatment-time-field">Время</label>
          <input
            className="form__item-input input"
            id="treatment-time-field"
            name="treatment-time-field"
            type="time"
            ref={timeRef}
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            disabled={loading}
            required
          />
        </div>
      </li>
      <li className="form__item">
        <label className="form__item-label h3" htmlFor="treatment-period-unit-field">Периодичность</label>
        <div className="form__item-input select">
          <select
            className="select__field"
            id="treatment-period-unit-field"
            name="treatment-period-unit-field"
            value={periodUnit}
            onChange={(e) => setPeriodUnit(parseInt(e.target.value, 10))}
            disabled={loading}
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </li>
    </ul>
  );
};

export default TreatmentFields;
