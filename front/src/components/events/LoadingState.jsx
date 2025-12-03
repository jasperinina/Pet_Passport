/**
 * Состояние загрузки для страницы события
 */
const LoadingState = ({ message = "Загрузка данных..." }) => {
  return (
    <main className="main-page doctor-visit-page">
      <div className="container">
        <p className="txt1" style={{ padding: "40px", textAlign: "center" }}>
          {message}
        </p>
      </div>
    </main>
  );
};

export default LoadingState;

