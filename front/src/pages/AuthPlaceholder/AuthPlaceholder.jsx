import styles from "./AuthPlaceholder.module.scss";

import Logo from "../../components/logo/Logo"

const AuthPlaceholder = () => {
  const tgBotUrl = import.meta.env.VITE_TG_BOT_URL || "";

  return (
    <section className={`${styles["auth-placeholder"]} container`}>
      <div className={styles["auth-placeholder__content"]}>
        <Logo />
        <h1 className={`${styles["auth-placeholder__title"]} h1`}>
          Нужна авторизация
        </h1>
        <p className={styles["auth-placeholder__text"]}>
          Сейчас через браузер открыть паспорт не получится. Мы уже работаем над этим. А пока вы можете зайти через бота
        </p>
        {tgBotUrl && (
          <a
            className={`${styles["auth-placeholder__link"]} button button--filled`}
            href={tgBotUrl}
            target="_blank"
          >
            <svg
              className={styles["landing__action-icon"]}
              width="20" height="20" viewBox="0 0 20 20"
              fill="none"
            >
              <g clipPath="url(#clip0_72_183)">
                <path d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z" fill="url(#paint0_linear_72_183)"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M4.52655 9.89446C7.44174 8.62435 9.38569 7.787 10.3583 7.38247C13.1354 6.22739 13.7125 6.02673 14.0886 6.02009C14.1713 6.01864 14.3563 6.03915 14.4761 6.13638C14.6538 6.2806 14.6548 6.59364 14.6351 6.80083C14.4846 8.38208 13.8334 12.2193 13.5021 13.9903C13.3619 14.7397 13.0859 14.991 12.8187 15.0156C12.238 15.069 11.7971 14.6318 11.2346 14.2631C10.3545 13.6861 9.85725 13.327 9.00291 12.764C8.01561 12.1134 8.65565 11.7558 9.2183 11.1714C9.36557 11.0185 11.9242 8.69118 11.9737 8.48005C11.9799 8.45364 11.9857 8.35521 11.9272 8.30325C11.8687 8.2513 11.7824 8.26903 11.7202 8.28318C11.6319 8.30321 10.2259 9.23255 7.50213 11.0711C7.10303 11.3452 6.74155 11.4787 6.41768 11.4717C6.06061 11.464 5.37381 11.2699 4.86323 11.1039C4.23698 10.9003 3.73924 10.7927 3.7826 10.447C3.80518 10.2668 4.05315 10.0827 4.52655 9.89446Z" fill="white"/>
              </g>
              <defs>
                <linearGradient id="paint0_linear_72_183" x1="10" y1="0" x2="10" y2="19.8438" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2AABEE"/>
                  <stop offset="1" stopColor="#229ED9"/>
                </linearGradient>
                <clipPath id="clip0_72_183">
                  <rect width="20" height="20" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <div className={styles["landing__action-text"]}>Telegram Bot</div>
          </a>
        )}
      </div>
    </section>
  );
};

export default AuthPlaceholder;
