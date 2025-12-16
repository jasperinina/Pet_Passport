import { useRef } from "react";
import CalendarIcon from "../../assets/icons/icon-calendar.svg";
import TimeIcon from "../../assets/icons/icon-time.svg";

const DoctorVisitFields = ({
  loading,
  title,
  setTitle,
  eventDate,
  setEventDate,
  eventTime,
  setEventTime,
  clinic,
  setClinic,
  doctor,
  setDoctor,
  diagnosis,
  setDiagnosis,
  recommendations,
  setRecommendations,
  referrals,
  setReferrals,
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
    <div className="procedure-section procedure-section--doctor">
      <div className="form-field">
        <label className="form-label h3" htmlFor="doctorVisit-title">
          Название
        </label>
        <input
          type="text"
          id="doctorVisit-title"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите название"
          disabled={loading}
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label h3" htmlFor="doctorVisit-clinic">
            Клиника
          </label>
          <input
            type="text"
            id="doctorVisit-clinic"
            className="form-input"
            value={clinic}
            onChange={(e) => setClinic(e.target.value)}
            placeholder="Введите клинику"
            disabled={loading}
          />
        </div>

        <div className="form-field">
          <label className="form-label h3" htmlFor="doctorVisit-doctor">
            Врач
          </label>
          <input
            type="text"
            id="doctorVisit-doctor"
            className="form-input"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            placeholder="Введите врача"
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label h3" htmlFor="doctorVisit-eventDate">
            Дата
          </label>

          <div className="input-with-icon">
            <input
              ref={dateRef}
              type="date"
              id="doctorVisit-eventDate"
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
          <label className="form-label h3" htmlFor="doctorVisit-eventTime">
            Время
          </label>

          <div className="input-with-icon">
            <input
              ref={timeRef}
              type="time"
              id="doctorVisit-eventTime"
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

      <div className="form-row">
        <div className="form-field">
          <label className="form-label h3" htmlFor="doctorVisit-diagnosis">
            Диагноз
          </label>
          <textarea
            id="doctorVisit-diagnosis"
            className="form-input form-textarea"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Диагноз"
            disabled={loading}
            rows="4"
          />
        </div>

        <div className="form-field">
          <label
            className="form-label h3"
            htmlFor="doctorVisit-recommendations"
          >
            Рекомендации
          </label>
          <textarea
            id="doctorVisit-recommendations"
            className="form-input form-textarea"
            value={recommendations}
            onChange={(e) => setRecommendations(e.target.value)}
            placeholder="Рекомендации"
            disabled={loading}
            rows="4"
          />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label h3" htmlFor="doctorVisit-referrals">
          Направления
        </label>
        <textarea
          id="doctorVisit-referrals"
          className="form-input form-textarea"
          value={referrals}
          onChange={(e) => setReferrals(e.target.value)}
          placeholder="Направления"
          disabled={loading}
          rows="3"
        />
      </div>
    </div>
  );
};

export default DoctorVisitFields;
