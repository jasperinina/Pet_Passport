import styles from "./Menu.module.scss";

import Logo from "../../logo/Logo";

const Menu = ({ items, logoPath = "/landing" }) => {
  return (
    <nav className={styles.menu}>
      <Logo path={logoPath} />
      <ul className={`${styles.menu__list} hidden-tablet`}>
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
