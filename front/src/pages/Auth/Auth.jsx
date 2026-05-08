import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Auth.module.scss";

import Logo from "../../components/logo/Logo";

import CatIcon from "../../assets/icons/pets/cat.svg?react";
import DogIcon from "../../assets/icons/pets/dog.svg?react";
import RatIcon from "../../assets/icons/pets/rat.svg?react";
import LizardIcon from "../../assets/icons/pets/lizard.svg?react";
import ParrotIcon from "../../assets/icons/pets/parrot.svg?react";
import OwlIcon from "../../assets/icons/pets/owl.svg?react";
import SnailIcon from "../../assets/icons/pets/snail.svg?react";
import HedgehogIcon from "../../assets/icons/pets/hedgehog.svg?react";
import ButterflyIcon from "../../assets/icons/pets/butterfly.svg?react";
import SnakeIcon from "../../assets/icons/pets/snake.svg?react";
import FrogIcon from "../../assets/icons/pets/frog.svg?react";
import RoosterIcon from "../../assets/icons/pets/rooster.svg?react";
import CrabIcon from "../../assets/icons/pets/crab.svg?react";
import FishIcon from "../../assets/icons/pets/fish.svg?react";
import RabbitIcon from "../../assets/icons/pets/rabbit.svg?react";
import HamsterIcon from "../../assets/icons/pets/hamster.svg?react";
import SheepIcon from "../../assets/icons/pets/sheep.svg?react";
import PigIcon from "../../assets/icons/pets/pig.svg?react";

import { loginOwner, registerOwner } from "../../api/auth";
import { notifyError, notifySuccess } from "../../services/notificationService";
import PrivacyPolicyCheckbox from "../../components/privacy_policy_checkbox/PrivacyPolicyCheckbox";

const petIconRows = [
  [
    FishIcon,
    RatIcon,
    SheepIcon,
    FrogIcon,
    DogIcon,
    CatIcon,
    FishIcon,
    ParrotIcon,
    SheepIcon,
    LizardIcon,
    FishIcon,
    RatIcon,
    SheepIcon,
    FrogIcon,
    DogIcon,
    CatIcon,
    LizardIcon,
    FishIcon,
    RatIcon,
    SheepIcon,
    ParrotIcon,
    SheepIcon,
    LizardIcon,
    FishIcon,
    RatIcon,
    SheepIcon,
    ParrotIcon,
    DogIcon,
    FrogIcon,
    CatIcon
  ],
  [
    CatIcon,
    SheepIcon,
    LizardIcon,
    ParrotIcon,
    RatIcon,
    SheepIcon,
    FishIcon,
    DogIcon,
    CatIcon,
    FrogIcon,
    SheepIcon,
    LizardIcon,
    ParrotIcon,
    RatIcon,
    SheepIcon,
    FishIcon,
    DogIcon,
    FrogIcon,
    CatIcon,
    FrogIcon,
    SheepIcon,
    LizardIcon,
    ParrotIcon,
    RatIcon,
    SheepIcon,
    FishIcon,
    DogIcon,
    FrogIcon,
    CatIcon,
    ParrotIcon
  ],
  [
    ParrotIcon,
    SheepIcon,
    LizardIcon,
    FishIcon,
    RatIcon,
    SheepIcon,
    ParrotIcon,
    DogIcon,
    FrogIcon,
    CatIcon
  ]
];

const Auth = () => {
  const navigate = useNavigate();
  const privacyPolicyUrl = "/privacy-policy";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isFirstScreenOpen, setIsFirstScreenOpen] = useState(true);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const [signInData, setSignInData] = useState({
    login: "",
    password: "",
  });
  const [signUpData, setSignUpData] = useState({
    login: "",
    password: "",
  });

  useEffect(() => {
    document.documentElement.classList.add("auth-page");

    return () => {
      document.documentElement.classList.remove("auth-page");
    };
  }, []);

  const handleFirstScreenClose = (isSignUp) => {
    setIsFirstScreenOpen(false);
    if (isSignUp) {
      setIsSignUpOpen(true);
    }
  };

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
    <section className={`${styles.auth}`}>
      <header className={`${styles.auth__header} container`}>
        <Logo />
      </header>
        {isFirstScreenOpen ? (
          <div className={`${styles["auth__first-screen"]} ${styles["auth__content"]}`}>
            <div className={`${styles["auth__first-screen-content"]}`}>
              <header className={`${styles["auth__first-screen-header"]}`}>
                <div className={`${styles.auth__title} h1`}>Привет!</div>
                <div className={styles["auth__first-screen-description"]}>
                  <p>
                    Рады видеть Вас в PetPassport! Позаботьтесь о своём любимом питомце.
                  </p>
                </div>
              </header>
              <div className={styles["auth__first-screen-pets"]}>
                {petIconRows.map((icons, rowIndex) => (
                  <ul
                    className={styles["auth__first-screen-pets-list"]}
                    key={rowIndex}
                  >
                    {icons.map((Icon, iconIndex) => (
                      <li
                        className={styles["auth__first-screen-pets-item"]}
                        key={`${rowIndex}-${iconIndex}`}
                      >
                        <Icon
                          className={styles["auth__first-screen-pets-icon"]}
                          aria-hidden="true"
                          focusable="false"
                        />
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
              <footer className={styles["auth__first-screen-footer"]}>
                <button
                  className={`${styles["auth__first-screen-button"]} button button--filled`}
                  type="button"
                  onClick={() => handleFirstScreenClose(false)}
                >
                  Войти
                </button>
                <div className={`${styles["auth__account"]} hidden-mobile`}>
                  Нет аккаунта?&nbsp;
                  <span>
                    <button
                      className={styles["auth__account-button"]}
                      type="button"
                      onClick={() => handleFirstScreenClose(true)}
                    >
                      Зарегистрироваться
                    </button>
                  </span>
                </div>
              </footer>
            </div>
            <div className={`${styles["auth__account"]} ${styles["auth__account--bottom"]} visible-mobile`}>
              Нет аккаунта?&nbsp;
              <span>
                <button
                  className={styles["auth__account-button"]}
                  type="button"
                  onClick={() => handleFirstScreenClose(true)}
                >
                  Зарегистрироваться
                </button>
              </span>
            </div>
          </div>
        ) : !isSignUpOpen ? (
          <div className={`${styles.auth__body} ${styles.auth__content} container`}>
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
            </form>
            <div className={`${styles["auth__account"]} hidden-mobile`}>
              Нет аккаунта?&nbsp;
              <span>
                <button
                  className={styles["auth__account-button"]}
                  type="button"
                  onClick={() => setIsSignUpOpen(true)}
                >
                  Зарегистрироваться
                </button>
              </span>
            </div>
            <div className={`${styles["auth__account"]} ${styles["auth__account--bottom"]} visible-mobile`}>
              Нет аккаунта?&nbsp;
              <span>
                <button
                  className={styles["auth__account-button"]}
                  type="button"
                  onClick={() => setIsSignUpOpen(true)}
                >
                  Зарегистрироваться
                </button>
              </span>
            </div>
          </div>
        ) : (
          <div className={`${styles.auth__body} ${styles.auth__content} container`}>
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
              <PrivacyPolicyCheckbox
                url={privacyPolicyUrl}
                loading={loading}
              />
              <button
                className={`${styles["auth__form-button"]} button button--filled`}
                type="submit"
                disabled={loading}
              >
                {loading ? "Создание..." : "Создать аккаунт"}
              </button>
            </form>
            <div className={`${styles["auth__account"]} hidden-mobile`}>
              Уже есть аккаунт?&nbsp;
              <span>
                <button
                  className={styles["auth__account-button"]}
                  type="button"
                  onClick={() => setIsSignUpOpen(false)}
                >
                  Войти
                </button>
              </span>
            </div>
            <div className={`${styles["auth__account"]} ${styles["auth__account--bottom"]} visible-mobile`}>
              Уже есть аккаунт?&nbsp;
              <span>
                <button
                  className={styles["auth__account-button"]}
                  type="button"
                  onClick={() => setIsSignUpOpen(false)}
                >
                  Войти
                </button>
              </span>
            </div>
          </div>
        )}
    </section>
  );
};

export default Auth;
