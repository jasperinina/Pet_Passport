import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import styles from "./Landing.module.scss";

import Header from "../../components/landing/header/Header";

import PaymentType from "../../components/landing/payment_type/PaymentType";
import ProblemCard from "../../components/landing/problem_card/ProblemCard";

import ProblemCardIcon1 from "../../assets/icons/landing/problem_card/problem-card-1.svg?react";
import ProblemCardIcon2 from "../../assets/icons/landing/problem_card/problem-card-2.svg?react";
import ProblemCardIcon3 from "../../assets/icons/landing/problem_card/problem-card-3.svg?react";
import ProblemCardIcon4 from "../../assets/icons/landing/problem_card/problem-card-4.svg?react";

import FeatureImage1 from "../../assets/images/landing/features-1.png";
import FeatureImage2 from "../../assets/images/landing/features-2.png";
import FeatureImage3 from "../../assets/images/landing/features-3.png";

import InstructionImage from "../../assets/images/landing/instruction-image.png";
import FloatingTextarea from "../../components/landing/floating_textarea/FloatingTextarea";

import NotificationService from "../../services/notificationService";
import { FILE_UPLOAD } from "../../constants/config";
import FeatureCard from "../../components/landing/feature_card/FeatureCard";
import FeedbackForm from "../../components/landing/feedback_form/FeedbackForm";
import Footer from "../../components/landing/footer/Footer";

const YANDEX_METRIKA_COUNTER_ID = 109026665;
const YANDEX_METRIKA_SCRIPT_ID = "yandex-metrika-counter";
const YANDEX_METRIKA_NOSCRIPT_ID = "yandex-metrika-noscript";

const Landing = () => {
  const tgBotUrl = import.meta.env.VITE_TG_BOT_URL || "";
  const gitHubUrl = import.meta.env.VITE_GITHUB_URL || "";
  const webUrl = "/";
  const privacyPolicyUrl = "/privacy-policy";

  const [loading, setLoading] = useState(false);

  const [whatHappened, setWhatHappened] = useState("");
  const [whereHappened, setWhereHappened] = useState("");
  const [whatExpected, setWhatExpected] = useState("");

  const [errorReportSelected, setErrorReportSelected] = useState(true);

  const location = useLocation();

  useEffect(() => {
    if (!document.getElementById(YANDEX_METRIKA_SCRIPT_ID)) {
      const script = document.createElement("script");

      script.id = YANDEX_METRIKA_SCRIPT_ID;
      script.type = "text/javascript";
      script.textContent = `
        (function(m,e,t,r,i,k,a){
          m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_COUNTER_ID}', 'ym');

        ym(${YANDEX_METRIKA_COUNTER_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
      `;

      document.head.insertBefore(script, document.head.firstChild);
    }

    return () => {
      document.getElementById(YANDEX_METRIKA_SCRIPT_ID)?.remove();
    };
  }, []);

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className={styles.landing}>
      <noscript id={YANDEX_METRIKA_NOSCRIPT_ID}>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_COUNTER_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
      <Header
        gitHubUrl={gitHubUrl}
        webUrl={webUrl}
      />
      <section className={styles.landing__hero}>
        <div className={`${styles["landing__section-inner"]} container`}>
          <PaymentType text="Бесплатно" />
          <div className={styles["landing__hero-body"]}>
            <h1 className={`${styles["landing__hero-title"]} h1`}>
              PetPassport — удобный паспорт<br/>питомца в вашем телефоне
            </h1>
            <div className={styles["landing__hero-description"]}>
              <p>
                Все данные, медицинская история и напоминания о процедурах —<br/>
                в одном месте. Больше не нужно держать всё в голове или искать записи.
              </p>
            </div>
          </div>
          <footer className={styles["landing__hero-footer"]}>
            <a
              className={`${styles.landing__action} button button--light`}
              href={webUrl}
            >
              <svg
                className={styles["landing__action-icon"]}
                width="20" height="20" viewBox="0 0 20 20"
                fill="none"
              >
                <g clipPath="url(#clip0_632_1843)">
                  <path d="M12.3032 10.3269C11.7378 10.1385 11.1248 10.283 10.7036 10.7043C10.2824 11.1255 10.1377 11.7385 10.3262 12.3039L12.5359 18.9332C12.612 19.1615 12.7425 19.3724 12.9133 19.5432C13.5226 20.1524 14.5137 20.1524 15.123 19.5432C15.3168 19.3494 15.4567 19.1073 15.5274 18.8433L15.9944 17.0999L18.4376 19.5432C18.7426 19.8483 19.2374 19.8483 19.5424 19.5432C19.8476 19.2381 19.8475 18.7434 19.5424 18.4383L17.0992 15.9951L18.8425 15.5282C19.1065 15.4574 19.3486 15.3176 19.5424 15.1237C20.1516 14.5145 20.1516 13.5233 19.5424 12.914C19.3715 12.7432 19.1606 12.6127 18.9323 12.5366L12.3032 10.3269ZM15.8229 14.7194C15.5588 14.7901 15.3168 14.9299 15.123 15.1238C14.9291 15.3176 14.7893 15.5596 14.7186 15.8237L14.0181 18.439L11.809 11.8092L18.4382 14.0189L15.8229 14.7194Z" fill="#36187D"/>
                  <path d="M10 0C4.39254 0 0 4.3925 0 10C0 15.6075 4.39254 20 10 20C10.1074 20 10.2162 19.9983 10.3232 19.995C10.7545 19.9814 11.0931 19.6209 11.0796 19.1896C11.0661 18.7583 10.7044 18.42 10.2743 18.4332C10.1835 18.4361 10.0912 18.4375 10 18.4375C5.26867 18.4375 1.5625 14.7313 1.5625 10C1.5625 5.26871 5.26867 1.5625 10 1.5625C14.8102 1.5625 18.4375 5.12266 18.4375 9.84375C18.4375 9.95562 18.4353 10.0685 18.4311 10.1792C18.4145 10.6104 18.7507 10.9733 19.1818 10.9898C19.6123 11.0062 19.9759 10.6703 19.9925 10.2391C19.9975 10.1085 20 9.97551 20 9.84375C20 7.13723 18.9689 4.63992 17.0968 2.81191C15.2398 0.998633 12.7194 0 10 0Z" fill="#36187D"/>
                  <path d="M9.3975 10.0002C9.3975 9.5687 9.04773 9.21894 8.61625 9.21894H7.68117C7.78039 7.63374 8.17898 5.99292 8.87031 4.32987C9.03594 3.93144 8.84723 3.47421 8.44879 3.30858C8.05035 3.14296 7.59312 3.33171 7.4275 3.73011C6.65539 5.58745 6.21543 7.43003 6.11574 9.21898H3.75C3.31852 9.21898 2.96875 9.56874 2.96875 10.0002C2.96875 10.4317 3.31852 10.7815 3.75 10.7815H6.11574C6.21547 12.5704 6.65539 14.413 7.4275 16.2703C7.59312 16.6688 8.05035 16.8575 8.44879 16.6919C8.84719 16.5262 9.03594 16.069 8.87031 15.6706C8.17898 14.0075 7.78039 12.3667 7.68117 10.7815H8.61625C9.04773 10.7814 9.3975 10.4317 9.3975 10.0002Z" fill="#36187D"/>
                  <path d="M13.1103 9.02627C13.5382 8.97064 13.84 8.57869 13.7844 8.15084C13.5954 6.69752 13.1877 5.21018 12.5724 3.7301C12.4069 3.33166 11.9496 3.14299 11.5512 3.30857C11.1528 3.4742 10.964 3.93143 11.1296 4.32986C11.6919 5.68248 12.0638 7.0358 12.2349 8.35228C12.2905 8.7801 12.6825 9.08197 13.1103 9.02627Z" fill="#36187D"/>
                </g>
                <defs>
                  <clipPath id="clip0_632_1843">
                    <rect width="20" height="20" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <div className={styles["landing__action-text"]}>Перейти на сайт</div>
            </a>
            <a
              className={`${styles.landing__action} button button--blured`}
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
          </footer>
        </div>
      </section>
      <section className={`${styles.problems} ${styles.landing__section}`} id="problems">
        <div className={`${styles["landing__section-inner"]} container`}>
          <h2 className={`${styles["landing__section-title"]} h2`}>Знакомые проблемы?</h2>
          <div className={`${styles.problems__body} ${styles["landing__section-body"]}`}>
            <ul className={styles.problems__list}>
              <li className={styles.problems__item}>
                <ProblemCard
                  title="Данные разбросаны"
                  description={`Вся информация о питомце хранится в разных местах —\nветпаспорт, заметки, память`}
                  icon={<ProblemCardIcon1 />}
                />
              </li>
              <li className={styles.problems__item}>
                <ProblemCard
                  title="Легко забыть процедуры"
                  description={`Прививки, обработки и приёмы у ветеринара легко\nупустить без напоминаний`}
                  icon={<ProblemCardIcon2 />}
                />
              </li>
              <li className={styles.problems__item}>
                <ProblemCard
                  title="Приходится держать всё в голове"
                  description="Нет удобного места, где собрана вся информация о питомце"
                  icon={<ProblemCardIcon3 />}
                />
              </li>
              <li className={styles.problems__item}>
                <ProblemCard
                  title="Сложно вспомнить важное"
                  description="Вы не уверены, когда была последняя прививка или обработка"
                  icon={<ProblemCardIcon4 />}
                />
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className={`${styles.features} ${styles.landing__section}`} id="features">
        <div className={`${styles["landing__section-inner"]} container`}>
          <h2 className={`${styles["landing__section-title"]} h2`}>
            Перестаньте забывать важное —<br/>
            держите всё о питомце <span>в одном месте</span>
          </h2>
          <div className={`${styles.features__body} ${styles["landing__section-body"]}`}>
            <ul className={styles.features__list}>
              <li className={styles.features__item}>
                <FeatureCard
                  title="Все данные под рукой"
                  description="Питомец и его история в одном месте"
                  image={FeatureImage1}
                />
              </li>
              <li className={styles.features__item}>
                <FeatureCard
                  title="История процедур"
                  description="Всегда видно, что и когда делали"
                  image={FeatureImage2}
                />
              </li>
              <li className={styles.features__item}>
                <FeatureCard
                  title="Напоминания"
                  description="Не пропустите важные процедуры"
                  image={FeatureImage3}
                />
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className={`${styles.instruction} ${styles.landing__section}`} id="instruction">
        <div className={`${styles.instruction__inner} ${styles["landing__section-inner"]} container`}>
          <img
            className={styles["instruction__card-image"]}
            src={InstructionImage}
            alt=""
            loading="lazy"
          />
          <div className={styles.instruction__body}>
            <h2 className={`${styles.instruction__title} ${styles["landing__section-title"]} h2`}>
              Начните заботиться о питомце<br/>проще уже сегодня
            </h2>
            <ol className={styles.instruction__list}>
              <li className={styles.instruction__item}>
                <div className={styles["instruction__item-text"]}>Добавьте питомца</div>
              </li>
              <li className={styles.instruction__item}>
                <div className={styles["instruction__item-text"]}>Заполните данные</div>
              </li>
              <li className={styles.instruction__item}>
                <div className={styles["instruction__item-text"]}>Добавьте процедуры</div>
              </li>
              <li className={styles.instruction__item}>
                <div className={styles["instruction__item-text"]}>Получайте напоминания</div>
              </li>
            </ol>
            <div className={styles.instruction__actions}>
              <a
                className={`${styles.landing__action} button button--light`}
                href={webUrl}
              >
                <svg
                  className={styles["landing__action-icon"]}
                  width="20" height="20" viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clipPath="url(#clip0_632_1843)">
                    <path d="M12.3032 10.3269C11.7378 10.1385 11.1248 10.283 10.7036 10.7043C10.2824 11.1255 10.1377 11.7385 10.3262 12.3039L12.5359 18.9332C12.612 19.1615 12.7425 19.3724 12.9133 19.5432C13.5226 20.1524 14.5137 20.1524 15.123 19.5432C15.3168 19.3494 15.4567 19.1073 15.5274 18.8433L15.9944 17.0999L18.4376 19.5432C18.7426 19.8483 19.2374 19.8483 19.5424 19.5432C19.8476 19.2381 19.8475 18.7434 19.5424 18.4383L17.0992 15.9951L18.8425 15.5282C19.1065 15.4574 19.3486 15.3176 19.5424 15.1237C20.1516 14.5145 20.1516 13.5233 19.5424 12.914C19.3715 12.7432 19.1606 12.6127 18.9323 12.5366L12.3032 10.3269ZM15.8229 14.7194C15.5588 14.7901 15.3168 14.9299 15.123 15.1238C14.9291 15.3176 14.7893 15.5596 14.7186 15.8237L14.0181 18.439L11.809 11.8092L18.4382 14.0189L15.8229 14.7194Z" fill="#36187D"/>
                    <path d="M10 0C4.39254 0 0 4.3925 0 10C0 15.6075 4.39254 20 10 20C10.1074 20 10.2162 19.9983 10.3232 19.995C10.7545 19.9814 11.0931 19.6209 11.0796 19.1896C11.0661 18.7583 10.7044 18.42 10.2743 18.4332C10.1835 18.4361 10.0912 18.4375 10 18.4375C5.26867 18.4375 1.5625 14.7313 1.5625 10C1.5625 5.26871 5.26867 1.5625 10 1.5625C14.8102 1.5625 18.4375 5.12266 18.4375 9.84375C18.4375 9.95562 18.4353 10.0685 18.4311 10.1792C18.4145 10.6104 18.7507 10.9733 19.1818 10.9898C19.6123 11.0062 19.9759 10.6703 19.9925 10.2391C19.9975 10.1085 20 9.97551 20 9.84375C20 7.13723 18.9689 4.63992 17.0968 2.81191C15.2398 0.998633 12.7194 0 10 0Z" fill="#36187D"/>
                    <path d="M9.3975 10.0002C9.3975 9.5687 9.04773 9.21894 8.61625 9.21894H7.68117C7.78039 7.63374 8.17898 5.99292 8.87031 4.32987C9.03594 3.93144 8.84723 3.47421 8.44879 3.30858C8.05035 3.14296 7.59312 3.33171 7.4275 3.73011C6.65539 5.58745 6.21543 7.43003 6.11574 9.21898H3.75C3.31852 9.21898 2.96875 9.56874 2.96875 10.0002C2.96875 10.4317 3.31852 10.7815 3.75 10.7815H6.11574C6.21547 12.5704 6.65539 14.413 7.4275 16.2703C7.59312 16.6688 8.05035 16.8575 8.44879 16.6919C8.84719 16.5262 9.03594 16.069 8.87031 15.6706C8.17898 14.0075 7.78039 12.3667 7.68117 10.7815H8.61625C9.04773 10.7814 9.3975 10.4317 9.3975 10.0002Z" fill="#36187D"/>
                    <path d="M13.1103 9.02627C13.5382 8.97064 13.84 8.57869 13.7844 8.15084C13.5954 6.69752 13.1877 5.21018 12.5724 3.7301C12.4069 3.33166 11.9496 3.14299 11.5512 3.30857C11.1528 3.4742 10.964 3.93143 11.1296 4.32986C11.6919 5.68248 12.0638 7.0358 12.2349 8.35228C12.2905 8.7801 12.6825 9.08197 13.1103 9.02627Z" fill="#36187D"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_632_1843">
                      <rect width="20" height="20" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <div className={styles["landing__action-text"]}>Перейти на сайт</div>
              </a>
              <a
                className={`${styles.landing__action} button button--blured`}
                href={gitHubUrl}
                target="_blank"
              >
                <svg
                  className={styles["landing__action-icon"]}
                  width="20" height="20" viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clipPath="url(#clip0_632_1871)">
                    <mask id="mask0_632_1871"  maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                      <path d="M20 0H0V20H20V0Z" fill="white"/>
                    </mask>
                    <g mask="url(#mask0_632_1871)">
                      <path d="M8.45704 14.4552C5.8789 14.1361 4.06249 12.242 4.06249 9.78963C4.06249 8.79273 4.41406 7.71606 5 6.99829C4.7461 6.34033 4.78516 4.94467 5.07812 4.36646C5.85937 4.26677 6.91406 4.68546 7.53906 5.26367C8.28125 5.02442 9.06249 4.90479 10.0195 4.90479C10.9766 4.90479 11.7578 5.02442 12.4609 5.24373C13.0664 4.68546 14.1406 4.26677 14.9219 4.36646C15.1953 4.90479 15.2344 6.30046 14.9805 6.97835C15.6055 7.736 15.9375 8.75285 15.9375 9.78963C15.9375 12.242 14.1211 14.0963 11.5039 14.4352C12.168 14.8739 12.6172 15.8309 12.6172 16.9275V19.0011C12.6172 19.5992 13.1055 19.9381 13.6914 19.6989C17.2266 18.3232 20 14.7144 20 10.2482C20 4.60571 15.5078 4.97165e-08 9.98047 0C4.45312 -4.97165e-08 4.8702e-08 4.60571 0 10.2482C-3.82043e-08 14.6745 2.7539 18.3431 6.46484 19.7188C6.99218 19.9182 7.5 19.5593 7.5 19.021V17.4259C7.22657 17.5456 6.875 17.6253 6.56249 17.6253C5.27343 17.6253 4.51171 16.9076 3.96484 15.5717C3.75 15.0334 3.51563 14.7144 3.06641 14.6545C2.83204 14.6346 2.7539 14.5349 2.7539 14.4153C2.7539 14.176 3.14453 13.9966 3.53516 13.9966C4.10157 13.9966 4.58984 14.3555 5.09765 15.0932C5.48829 15.6714 5.89843 15.9306 6.38671 15.9306C6.875 15.9306 7.18749 15.7511 7.63671 15.2926C7.96876 14.9536 8.22265 14.6545 8.45704 14.4552Z" fill="white"/>
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_632_1871">
                      <rect width="20" height="20" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <div className={styles["landing__action-text"]}>Смотреть на GitHub</div>
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className={`${styles.feedback} ${styles.landing__section}`}>
        <div className={`${styles["landing__section-inner"]}`}>
          <h2 className={`${styles["landing__section-title"]} h2`}>
            Помогите сделать PetPassport лучше
          </h2>
          <div className={styles.feedback__description}>
            <p>
              Нашли ошибку или не хватает функции?<br/>
              Расскажите — мы учитываем каждое мнение
            </p>
          </div>
          <nav className={styles.feedback__menu}>
            <ul className={styles["feedback__menu-list"]}>
              <li
                className={`${styles["feedback__menu-item"]} ${errorReportSelected ? styles["feedback__menu-item--selected"] : ""}`}
                onClick={() => setErrorReportSelected(true)}
              >
                <svg
                  className={styles["feedback__menu-item-icon"]}
                  width="20" height="20" viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clipPath="url(#clip0_45_1798)">
                    <path d="M16.536 19.0221H3.46408C2.20654 19.0221 1.08363 18.3719 0.460289 17.2829C-0.160239 16.1987 -0.152974 14.9083 0.479778 13.8311L7.02735 2.6837C7.65471 1.61554 8.77024 0.978027 10.0115 0.978027H10.0143C11.2568 0.978965 12.3724 1.61836 12.9986 2.68831L19.523 13.8357C20.1535 14.9129 20.1593 16.2024 19.5384 17.2852C18.9148 18.3728 17.7924 19.0221 16.536 19.0221ZM10.0116 2.54028C9.33015 2.54028 8.71822 2.88956 8.37444 3.4749L1.82683 14.6223C1.48138 15.2105 1.4774 15.9149 1.81617 16.5068C2.15776 17.1036 2.77379 17.4598 3.46408 17.4598H16.536C17.2257 17.4598 17.8414 17.104 18.1832 16.5081C18.5221 15.917 18.519 15.213 18.1747 14.6248L11.6504 3.47744C11.3072 2.89113 10.6952 2.54083 10.0131 2.54028C10.0126 2.54028 10.0121 2.54028 10.0116 2.54028Z" fill="#36187D"/>
                    <path d="M10 13.7543C10.5393 13.7543 10.9764 14.1914 10.9764 14.7307C10.9764 15.2699 10.5393 15.7071 10 15.7071C9.46078 15.7071 9.02362 15.2699 9.02362 14.7307C9.02362 14.1914 9.46078 13.7543 10 13.7543ZM10.7812 11.9149V7.02844C10.7812 6.59703 10.4314 6.24731 10 6.24731C9.56861 6.24731 9.2189 6.59703 9.2189 7.02844V11.9149C9.2189 12.3464 9.56861 12.6961 10 12.6961C10.4314 12.6961 10.7812 12.3464 10.7812 11.9149Z" fill="#36187D"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_45_1798">
                      <rect width="20" height="20" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <div className={styles["feedback__menu-item-text"]}>
                  Сообщить об ошибке
                </div>
              </li>
              <li
                className={`${styles["feedback__menu-item"]} ${!errorReportSelected ? styles["feedback__menu-item--selected"] : ""}`}
                onClick={() => setErrorReportSelected(false)}
              >
                <svg
                  className={styles["feedback__menu-item-icon"]}
                  width="20" height="20" viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clipPath="url(#clip0_45_1814)">
                    <path d="M13.9063 13.9054V12.7641C13.9063 12.0222 14.2944 11.4407 14.6201 11.0835C15.6711 9.93038 16.25 8.43545 16.25 6.87417C16.25 4.96116 15.3913 3.17924 13.8941 1.9853C12.3964 0.79104 10.4439 0.355688 8.53747 0.791001C6.23361 1.3169 4.38778 3.19729 3.89544 5.50858C3.464 7.53393 4.0004 9.56073 5.36708 11.0693C5.69857 11.4352 6.0938 12.0269 6.0938 12.7675V13.9055C6.0938 15.1978 7.14521 16.2492 8.43755 16.2492H11.5626C12.8549 16.2492 13.9063 15.1978 13.9063 13.9054ZM12.3438 13.9054C12.3438 14.3362 11.9933 14.6867 11.5625 14.6867H8.43751C8.00673 14.6867 7.65626 14.3362 7.65626 13.9054V12.7674C7.65626 11.787 7.26505 10.837 6.52501 10.0202C5.4995 8.88823 5.09806 7.36249 5.42368 5.83413C5.78923 4.11803 7.18036 2.7035 8.88525 2.31428C9.25325 2.23026 9.62321 2.18897 9.98888 2.18897C11.0544 2.18897 12.0833 2.53975 12.9199 3.20694C14.0433 4.10272 14.6875 5.43936 14.6875 6.87417C14.6875 8.04518 14.2535 9.16623 13.4653 10.0309C12.742 10.8242 12.3438 11.7949 12.3438 12.7641V13.9054Z" fill="#8B90A6"/>
                    <path d="M0 6.87427C0 7.30575 0.349766 7.65552 0.78125 7.65552H1.5625C1.99398 7.65552 2.34375 7.30575 2.34375 6.87427C2.34375 6.44278 1.99398 6.09302 1.5625 6.09302H0.78125C0.349766 6.09302 0 6.44278 0 6.87427Z" fill="#8B90A6"/>
                    <path d="M19.2188 6.09302H18.4375C18.006 6.09302 17.6562 6.44278 17.6562 6.87427C17.6562 7.30575 18.006 7.65552 18.4375 7.65552H19.2188C19.6502 7.65552 20 7.30575 20 6.87427C20 6.44278 19.6502 6.09302 19.2188 6.09302Z" fill="#8B90A6"/>
                    <path d="M2.3608 12.4933L2.91326 11.9409C3.21838 11.6358 3.21842 11.1411 2.9133 10.836C2.60814 10.5309 2.1135 10.5309 1.80846 10.836L1.25596 11.3884C0.95084 11.6935 0.950801 12.1882 1.25592 12.4932C1.56104 12.7983 2.05568 12.7984 2.3608 12.4933Z" fill="#8B90A6"/>
                    <path d="M18.1916 2.91246L18.744 2.36003C19.0492 2.05496 19.0492 1.56027 18.7441 1.25519C18.439 0.950112 17.9443 0.950073 17.6392 1.25519L17.0868 1.80761C16.7817 2.11269 16.7816 2.60738 17.0867 2.91246C17.3918 3.21749 17.8865 3.21757 18.1916 2.91246Z" fill="#8B90A6"/>
                    <path d="M2.36081 1.25519C2.05569 0.950073 1.56104 0.950112 1.25596 1.25519C0.950886 1.56027 0.950886 2.05496 1.256 2.36003L1.80846 2.91246C2.11358 3.21757 2.60823 3.21753 2.91331 2.91246C3.21843 2.60734 3.21839 2.11269 2.91327 1.80761L2.36081 1.25519Z" fill="#8B90A6"/>
                    <path d="M17.0868 11.9408L17.6393 12.4933C17.9444 12.7984 18.439 12.7983 18.7441 12.4933C19.0492 12.1882 19.0492 11.6935 18.7441 11.3884L18.1916 10.836C17.8865 10.5309 17.3919 10.5309 17.0868 10.836C16.7817 11.1411 16.7817 11.6357 17.0868 11.9408Z" fill="#8B90A6"/>
                    <path d="M8.4375 17.8118C8.00602 17.8118 7.65625 18.1615 7.65625 18.593C7.65625 19.0245 8.00602 19.3743 8.4375 19.3743H11.5625C11.994 19.3743 12.3438 19.0245 12.3438 18.593C12.3438 18.1615 11.994 17.8118 11.5625 17.8118H8.4375Z" fill="#8B90A6"/>
                    <path d="M7.88504 8.20795L9.21875 9.54166V10.7805C9.21875 11.212 9.56852 11.5618 10 11.5618C10.4315 11.5618 10.7812 11.212 10.7812 10.7805V9.54166L12.115 8.20795C12.4201 7.90283 12.4201 7.40818 12.115 7.10311C11.8098 6.79803 11.3152 6.79799 11.0101 7.10311L10 8.11318L8.98996 7.10311C8.68484 6.79799 8.19016 6.79799 7.88508 7.10311C7.58 7.40822 7.57996 7.90283 7.88504 8.20795Z" fill="#8B90A6"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_45_1814">
                      <rect width="20" height="20" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <div className={styles["feedback__menu-item-text"]}>
                  Предложить функцию
                </div>
              </li>
            </ul>
          </nav>
          {errorReportSelected ? (
            <FeedbackForm
              title="Сообщить об ошибке"
              description="Сообщите об ошибке — это поможет нам быстрее её исправить"
              labels={["Что произошло?", "Где это произошло?", "Что вы ожидали?"]}
              placeholders={["Опишите проблему", "Экран или действие", "Как должно было работать"]}
              fieldNames={["what-happened", "where-happened", "what-expected"]}
              buttonText="Отправить"
              privacyPolicyUrl={privacyPolicyUrl}
              allowScreenshot
            />
          ) : (
            <FeedbackForm
              title="Предложить функцию"
              description="Поделитесь идеей — мы развиваем приложение вместе с пользователями"
              labels={["Какой функции не хватает?", "Зачем она вам нужна?", "Как вы сейчас это делаете?"]}
              placeholders={["Кратко опишите", "Какую задачу решает", "Опишите текущий способ"]}
              fieldNames={["what-function-missed", "what-task-solves", "describe-current-method"]}
              buttonText="Отправить предложение"
              privacyPolicyUrl={privacyPolicyUrl}
            />
          )}
        </div>
      </section>
      <Footer privacyPolicyUrl={privacyPolicyUrl} />
    </div>
  );
};

export default Landing;
