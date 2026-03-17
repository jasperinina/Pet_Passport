import styles from "./Menu.module.scss";

import MenuButton from "./MenuButton";

import ProcedureIcon from "../../assets/icons/procedures.svg";
import HistoryIcon from "../../assets/icons/history.svg";

const Menu = ({ isMobileHidden = false }) => {
  return (
    <nav className={`${styles.menu} ${isMobileHidden ? "hidden-mobile" : "visible-mobile"}`}>
      <ul className={styles.menu__list}>
        <li className={styles.menu__item}>
          <MenuButton
            route="upcoming"
            icon={ProcedureIcon}
            text="Предстоящие процедуры"
          />
        </li>
        <span className={`${styles.menu__separator} visible-mobile`}></span>
        <li className={styles.menu__item}>
          <MenuButton
            route="history"
            icon={HistoryIcon}
            text="Медицинская история"
          />
        </li>
      </ul>
    </nav>
  );
}

export default Menu;