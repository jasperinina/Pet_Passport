import "../styles/medical-history.css";

const MedicalHistory = () => {
  return (
    <main className="main-page medical-history-page">
      <div className="container">

        {/* Шапка страницы */}
        <section className="medical-history-header">
          <h1 className="h1 medical-history__title">
            Медицинская история
          </h1>

          <button
            type="button"
            className="btn btn-primary medical-history__button"
          >
            Добавить
          </button>
        </section>

        {/* Здесь потом появится список записей истории */}
      </div>
    </main>
  );
};

export default MedicalHistory;
