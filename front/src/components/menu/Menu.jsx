import styles from "./Menu.module.scss";

import MenuButton from "./MenuButton";

import ProcedureIcon from "../../assets/icons/procedures.svg";
import HistoryIcon from "../../assets/icons/history.svg";

const Menu = ({ isTabletHidden = false }) => {
  return (
    <nav className={`${styles.menu} ${isTabletHidden ? "hidden-tablet" : "visible-tablet"}`}>
      <ul className={styles.menu__list}>
        <li className={styles.menu__item}>
          <MenuButton
            route="upcoming"
            icon={ProcedureIcon}
            text="Предстоящие процедуры"
          />
        </li>
        <span className={`${styles.menu__separator} visible-tablet`}></span>
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
