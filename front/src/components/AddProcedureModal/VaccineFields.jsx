import { useRef } from "react";
import ArrowIcon from "../../assets/icons/icon-arrow.svg";
import CalendarIcon from "../../assets/icons/icon-calendar.svg";
import TimeIcon from "../../assets/icons/icon-time.svg";

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

  const openPicker = (ref) => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    el.showPicker?.(); // Chrome/Edge
    el.click();        // fallback
  };

  return (
    <div className="procedure-section procedure-section--vaccine">
      <div className="form-field">
        <label className="form-label h3" htmlFor="vaccine-title">
          Название
        </label>
        <input
          type="text"
          id="vaccine-title"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите название"
          disabled={loading}
        />
      </div>

      <div className="form-field">
        <label className="form-label h3" htmlFor="vaccine-medicine">
          Препарат
        </label>
        <input
          type="text"
          id="vaccine-medicine"
          className="form-input"
          value={medicine}
          onChange={(e) => setMedicine(e.target.value)}
          placeholder="Введите препарат"
          disabled={loading}
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label h3" htmlFor="vaccine-eventDate">
            Дата
          </label>

          <div className="input-with-icon">
            <input
              ref={dateRef}
              type="date"
              id="vaccine-eventDate"
              className="form-input"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              disabled={loading}
              required
            />

            <button
              type="button"
              className="input-icon-btn"
              aria-label="Выбрать дату"
              disabled={loading}
              onMouseDown={(e) => {
                e.preventDefault();
                openPicker(dateRef);
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

        <div className="form-field">
          <label className="form-label h3" htmlFor="vaccine-eventTime">
            Время
          </label>

          <div className="input-with-icon">
            <input
              ref={timeRef}
              type="time"
              id="vaccine-eventTime"
              className="form-input"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              disabled={loading}
              required
            />

            <button
              type="button"
              className="input-icon-btn"
              aria-label="Выбрать время"
              disabled={loading}
              onMouseDown={(e) => {
                e.preventDefault();
                openPicker(timeRef);
              }}
            >
              <img
                src={TimeIcon}
                className="input-icon"
                alt=""
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="form-field">
        <label className="form-label h3" htmlFor="vaccine-periodUnit">
          Периодичность
        </label>

        <div className="select-wrapper">
          <select
            id="vaccine-periodUnit"
            className="form-input form-select"
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

          <img className="select-arrow" src={ArrowIcon} alt="" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default VaccineFields;
