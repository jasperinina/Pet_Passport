import { useRef } from "react";

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
    <ul className="form__list">
      <li className="form__item">
        <label className="form__item-label h3" htmlFor="doctor-visit-title-field">Название</label>
        <input
          className="form__item-input input"
          id="doctor-visit-title-field"
          name="doctor-visit-title-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите название"
          disabled={loading}
        />
      </li>
      <li className="form__two-columns">
        <div className="form__item">
          <label className="form__item-label h3" htmlFor="doctor-visit-clinic-field">Клиника</label>
          <input
            className="form__item-input input"
            id="doctor-visit-clinic-field"
            name="doctor-visit-clinic-field"
            value={clinic}
            onChange={(e) => setClinic(e.target.value)}
            placeholder="Введите клинику"
            disabled={loading}
          />
        </div>
        <div className="form__item">
          <label className="form__item-label h3" htmlFor="doctor-visit-doctor-field">Врач</label>
          <input
            className="form__item-input input"
            id="doctor-visit-doctor-field"
            name="doctor-visit-doctor-field"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            placeholder="Введите врача"
            disabled={loading}
          />
        </div>
      </li>
      <li className="form__two-columns">
        <div className="form__item">
          <label className="form__item-label h3" htmlFor="doctor-visit-date-field">Дата</label>
          <input
            className="form__item-input input"
            id="doctor-visit-date-field"
            name="doctor-visit-date-field"
            type="date"
            ref={dateRef}
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div className="form__item">
          <label className="form__item-label h3" htmlFor="doctor-visit-time-field">Время</label>
          <input
            className="form__item-input input"
            id="doctor-visit-time-field"
            name="doctor-visit-time-field"
            type="time"
            ref={timeRef}
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            disabled={loading}
            required
          />
        </div>
      </li>
      <li className="form__two-columns">
        <div className="form__item">
          <label className="form__item-label h3" htmlFor="doctor-visit-diagnosis-field">Диагноз</label>
          <textarea
            className="form__item-input textarea"
            id="doctor-visit-diagnosis-field"
            name="doctor-visit-diagnosis-field"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Введите диагноз"
            disabled={loading}
            rows="4"
          />
        </div>
        <div className="form__item">
          <label className="form__item-label h3" htmlFor="doctor-visit-recommendations-field">Рекомендации</label>
          <textarea
            className="form__item-input textarea"
            id="doctor-visit-recommendations-field"
            name="doctor-visit-recommendations-field"
            value={recommendations}
            onChange={(e) => setRecommendations(e.target.value)}
            placeholder="Введите рекомендации"
            disabled={loading}
            rows="4"
          />
        </div>
      </li>
      <li className="form__item">
        <label className="form__item-label h3" htmlFor="doctor-visit-referrals-field">Направления</label>
        <textarea
          className="form__item-input textarea"
          id="doctor-visit-referrals-field"
          name="doctor-visit-referrals-field"
          value={referrals}
          onChange={(e) => setReferrals(e.target.value)}
          placeholder="Введите направления"
          disabled={loading}
          rows="3"
        />
      </li>
    </ul>
  );
};

export default DoctorVisitFields;