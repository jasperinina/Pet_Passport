import "../styles/upcoming-procedures.css";

const UpcomingProcedures = ({ onNavigate }) => {
  return (
    <main className="main-page upcoming-procedures-page">
      <div className="container">

        {/* Шапка страницы */}
        <section className="upcoming-header">
          <h1 className="h1 upcoming-header__title">Предстоящие процедуры</h1>

          <button
            type="button"
            className="btn btn-primary upcoming-header__button"
          >
            Добавить
          </button>
        </section>

        {/* здесь появится список */}
      </div>
    </main>
  );
};

export default UpcomingProcedures;
