import styles from "./Footer.module.scss";

import Logo from "../../logo/Logo";

const Footer = ({ privacyPolicyUrl }) => {
  return (
    <footer className={`${styles.footer}`}>
      <div className={`${styles.footer__inner} container`}>
        <Logo
          light={true}
          path="/landing"
        />
        <div className={styles.footer__content}>
          <a
            className={styles.footer__link}
            href={privacyPolicyUrl}
          >
            Политика конфиденциальности
          </a>
          <div className={styles.footer__text}>
            Приложение не заменяет консультацию ветеринара
          </div>
          <div className={styles.footer__text}>
            © 2026 PetPassport
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
