import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Auth.module.scss";

import Logo from "../../components/logo/Logo";
import { loginOwner, registerOwner } from "../../api/auth";
import { notifyError, notifySuccess } from "../../services/notificationService";

const Auth = () => {
  const navigate = useNavigate();
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signInData, setSignInData] = useState({
    login: "",
    password: "",
  });
  const [signUpData, setSignUpData] = useState({
    login: "",
    password: "",
  });

  const handleModeChange = (isSignUp) => {
    setError("");
    setIsSignUpOpen(isSignUp);
  };

  const handleChange = (setter) => (event) => {
    setError("");
    setter((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const validateCredentials = ({ login, password }) => {
    if (!login.trim()) return "Введите логин";
    if (!password.trim()) return "Введите пароль";
    return "";
  };

  const handleSubmit = async (event, action, data, successMessage) => {
    event.preventDefault();

    const validationError = validateCredentials(data);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await action({
        login: data.login.trim(),
        password: data.password,
      });
      notifySuccess(successMessage);
      navigate("/pets", { replace: true });
    } catch (err) {
      const message = err.message || "Не удалось выполнить запрос";
      setError(message);
      notifyError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`${styles.auth} section container`}>
      <header className={styles.auth__header}>
        <Logo />
      </header>
        {!isSignUpOpen ? (
          <div className={styles.auth__body}>
            <h1 className={`${styles.auth__title} h1`}>Войти в аккаунт</h1>
            <form
              className={styles.auth__form}
              onSubmit={(event) =>
                handleSubmit(event, loginOwner, signInData, "Вы вошли в аккаунт")
              }
            >
              {error && <div className={styles.auth__error}>{error}</div>}
              <input
                className={`${styles["auth__form-input"]} input`}
                id="sign-in-login-input"
                name="login"
                type="text"
                placeholder="Логин"
                value={signInData.login}
                onChange={handleChange(setSignInData)}
                disabled={loading}
                autoComplete="username"
              />
              <input
                className={`${styles["auth__form-input"]} input`}
                id="sign-in-password-input"
                name="password"
                type="password"
                placeholder="Пароль"
                value={signInData.password}
                onChange={handleChange(setSignInData)}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                className={`${styles["auth__form-button"]} button button--filled`}
                type="submit"
                disabled={loading}
              >
                {loading ? "Вход..." : "Войти"}
              </button>
              <button
                className={styles["auth__form-link"]}
                type="button"
                disabled={loading}
                onClick={() => handleModeChange(true)}
              >
                Зарегистрироваться
              </button>
            </form>
          </div>
        ) : (
          <div className={styles.auth__body}>
            <h1 className={`${styles.auth__title} h1`}>Регистрация</h1>
            <form
              className={styles.auth__form}
              onSubmit={(event) =>
                handleSubmit(event, registerOwner, signUpData, "Аккаунт создан")
              }
            >
              {error && <div className={styles.auth__error}>{error}</div>}
              <input
                className={`${styles["auth__form-input"]} input`}
                id="sign-up-login-input"
                name="login"
                type="text"
                placeholder="Логин"
                value={signUpData.login}
                onChange={handleChange(setSignUpData)}
                disabled={loading}
                autoComplete="username"
              />
              <input
                className={`${styles["auth__form-input"]} input`}
                id="sign-up-password-input"
                name="password"
                type="password"
                placeholder="Пароль"
                value={signUpData.password}
                onChange={handleChange(setSignUpData)}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                className={`${styles["auth__form-button"]} button button--filled`}
                type="submit"
                disabled={loading}
              >
                {loading ? "Создание..." : "Создать аккаунт"}
              </button>
              <button
                className={styles["auth__form-link"]}
                type="button"
                disabled={loading}
                onClick={() => handleModeChange(false)}
              >
                Войти
              </button>
            </form>
          </div>
        )}
    </section>
  );
};

export default Auth;
