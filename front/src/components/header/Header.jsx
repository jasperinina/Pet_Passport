import styles from "./Header.module.scss";

import { useNavigate, useLocation } from "react-router-dom";

import Menu from "../menu/Menu";

import Logo from "../../assets/icons/logo.svg";
import PetIcon from "../../assets/icons/cat.svg";

const Header = ({ petName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.search || ""; // содержит ?id=...

  const petIcon = PetIcon;

  const goTo = (path) => {
    navigate(`${path}${search}`);
  };

  const goBack = () => {
    navigate(-1);
  };

  const isHomePage = location.pathname === "/";

  return (
    <header className="section container">
      <div className={styles.header__inner}>
        <div className={styles.header__info}>
          {isHomePage ? (
            <button
              className={`${styles.header__logo} logo`}
              type="button"
              aria-label="Перейти на главную страницу"
              title="Перейти на главную страницу"
              onClick={() => goTo("/")}
            >
              <img
                className="logo__image"
                src={Logo}
                alt=""
                width="42" height="32"
              />
              <span className="logo__text h3">PetPassport</span>
            </button>
          ) : (
            <button
              className={styles["header__back-button"]}
              type="button"
              onClick={goBack}
            >
              <svg
                className={styles["header__back-button-icon"]}
                width="16" height="16" viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M10.0002 12.4004L6.00024 8.40039L10.0002 4.40039"
                  stroke="#36187D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
              <div className={styles["header__back-button-text"]}>
                Назад
              </div>
            </button>
          )}
          <span className={`${styles.header__separator} hidden-mobile`}></span>
          <div className={styles.header__pet}>
            <img
              className={`${styles['header__pet-image']}`}
              src={petIcon}
              alt={petName}
              width="20" height="20"
            />
            <span className={`${styles['header__pet-name']}`}>{petName}</span>
          </div>
        </div>
        <Menu isMobileHidden={true} />
      </div>
    </header>
  );
};

export default Header;