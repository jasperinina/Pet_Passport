import styles from "./Menu.module.scss"

import { useLocation, useNavigate } from "react-router-dom";

import ProcedureIcon from "../../../assets/icons/procedures.svg";
import HistoryIcon from "../../../assets/icons/history.svg";

const Menu = ({ isMobileHidden = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.search || ""; // содержит ?id=...

  const goTo = (path) => {
    navigate(`${path}${search}`);
  };

  return (
    <nav className={`${styles.menu} ${isMobileHidden ? "hidden-mobile" : "visible-mobile"}`}>
      <ul className={styles.menu__list}>
        <li className={styles.menu__item}>
          <button
            className={styles.menu__link}
            type="button"
            onClick={() => goTo("/upcoming")}
          >
            <img
              className={styles.menu__image}
              src={ProcedureIcon}
              alt=""
              width="20" height="20"
            />
            <span className={styles.menu__text}>Предстоящие процедуры</span>
          </button>
        </li>
        <span className={`${styles.menu__separator} visible-mobile`}></span>
        <li className={styles.menu__item}>
          <button
            className={styles.menu__link}
            type="button"
            onClick={() => goTo("/history")}
          >
            <img
              className={styles.menu__image}
              src={HistoryIcon}
              alt=""
              width="20" height="20"
            />
            <span className={styles.menu__text}>Медицинская история</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Menu;