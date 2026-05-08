import { useRef } from "react";

const VaccineFields = ({
  loading,
  title,
  setTitle,
  medicine,
  setMedicine,
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

  return (
    <ul className="form__list">
      <li className="form__item">
        <label className="form__item-label h3" htmlFor="vaccine-title-field">Название</label>
        <input
          className="form__item-input input"
          id="vaccine-title-field"
          name="vaccine-title-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите название"
          disabled={loading}
        />
      </li>
      <li className="form__item">
        <label className="form__item-label h3" htmlFor="vaccine-medicine-field">Препарат</label>
        <input
          className="form__item-input input"
          id="vaccine-medicine-field"
          name="vaccine-medicine-field"
          value={medicine}
          onChange={(e) => setMedicine(e.target.value)}
          placeholder="Введите препарат"
          disabled={loading}
        />
      </li>
      <li className="form__two-columns">
        <div className="form__item">
          <label className="form__item-label h3" htmlFor="vaccine-date-field">Дата</label>
          <input
            className="form__item-input input"
            id="vaccine-date-field"
            name="vaccine-date-field"
            type="date"
            ref={dateRef}
            value={eventDate ?? ""}
            onChange={(e) => setEventDate(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div className="form__item">
          <label className="form__item-label h3" htmlFor="vaccine-time-field">Время</label>
          <input
            className="form__item-input input"
            id="vaccine-time-field"
            name="vaccine-time-field"
            type="time"
            ref={timeRef}
            value={eventTime ?? ""}
            onChange={(e) => setEventTime(e.target.value)}
            disabled={loading}
            required
          />
        </div>
      </li>
      <li className="form__item">
        <label className="form__item-label h3" htmlFor="vaccine-period-unit-field">Периодичность</label>
        <div className="form__item-input select">
          <select
            className="select__field"
            id="vaccine-period-unit-field"
            name="vaccine-period-unit-field"
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

export default VaccineFields;
