/**
 * Состояние ошибки для страницы события
 */
const ErrorState = ({ error }) => {
  return (
    <main className="main-page doctor-visit-page">
      <div className="container">
        <p
          className="txt1"
          style={{
            padding: "40px",
            textAlign: "center",
            color: "var(--error, #d32f2f)",
          }}
        >
          {error}
        </p>
      </div>
    </main>
  );
};

export default ErrorState;

