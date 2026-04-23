import styles from "./Menu.module.scss";

import Logo from "../../logo/Logo";

const Menu = () => {
  return (
    <nav className={styles.menu}>
      <Logo path="/landing" />
      <ul className={styles.menu__list}>
        <li className={styles.menu__item}>
          <a
            className={styles.menu__link}
            href="#problems"
          >
              Проблема
          </a>
        </li>
        <li className={styles.menu__item}>
          <a
            className={styles.menu__link}
            href="#features"
          >
            Функции
          </a>
        </li>
        <li className={styles.menu__item}>
          <a
            className={styles.menu__link}
            href="#instruction"
          >
            Как работает?
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;