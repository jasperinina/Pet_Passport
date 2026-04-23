import styles from "./Menu.module.scss";

import Logo from "../../logo/Logo";

const Menu = ({ items }) => {
  return (
    <nav className={styles.menu}>
      <Logo path="/landing" />
      <ul className={styles.menu__list}>
        {items.map((item, index) => (
          <li
            className={styles.menu__item}
            key={index}
          >
            <a
              className={styles.menu__link}
              href={item.link}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;