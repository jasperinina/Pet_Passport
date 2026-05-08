import { useNavigate } from "react-router-dom";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import Footer from "../../components/landing/footer/Footer";
import Header from "../../components/landing/header/Header";
import styles from "./PrivacyPolicy.module.scss";

import policyText from "../../docs/privacy-policy.md?raw";

import { parseSections } from "../../utils/markdownUtils";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const tgBotUrl = import.meta.env.VITE_TG_BOT_URL || "";
  const gitHubUrl = import.meta.env.VITE_GITHUB_URL || "";
  const webUrl = "/";
  const privacyPolicyUrl = "/privacy-policy";

  const sections = parseSections(policyText);

  return (
    <div className={styles["privacy-policy"]}>
      <Header
        webUrl={webUrl}
        gitHubUrl={gitHubUrl}
        privacyPolicyOpened
      />
      <header className={`${styles["privacy-policy__header"]} container`}>
        <div className={styles["privacy-policy__tabs"]}>
          <button
            className={styles["privacy-policy__tabs-item"]}
            type="button"
            onClick={() => navigate(-1)}
          >
            Главная
          </button>
          <div className={`${styles["privacy-policy__tabs-item"]} ${styles["privacy-policy__tabs-item--selected"]}`}>
            Политика конфиденциальности
          </div>
        </div>
        <h1 className={`${styles["privacy-policy__title"]} h1`}>
          Политика конфиденциальности
        </h1>
      </header>
      <div className={`${styles["privacy-policy__content"]} container`}>
        {sections.map((section, index) => (
          <article
            className={styles["privacy-policy__section"]}
            key={index}
          >
            <h2 className={`${styles["privacy-policy__section-title"]}`}>
              {section.title}
            </h2>
            <div className={styles["privacy-policy__section-body"]}>
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h2
                      className={`${styles["privacy-policy__section-title"]} h2`}
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h3
                      className={`${styles["privacy-policy__section-subtitle"]} h3`}
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <div className={styles["privacy-policy__section-paragraph"]}>
                      <p {...props} />
                    </div>
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className={styles["privacy-policy__section-list"]}
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className={styles["privacy-policy__section-list"]}
                      {...props}
                    />
                  ),
                  a: ({ href, children, ...props }) => {
                    let mailtoTelProps = {};

                    if (href?.startsWith('mailto:')) {
                      mailtoTelProps = { href, target: '_self' };
                    } else if (href?.startsWith('tel:')) {
                      mailtoTelProps = { href, target: '_self' };
                    } else {
                      mailtoTelProps = { href, target: '_blank', rel: 'noopener noreferrer' };
                    }

                    return (
                      <a
                        className={styles["privacy-policy__section-link"]}
                        {...mailtoTelProps}
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  }
                }}
              >
                {section.content}
              </Markdown>
            </div>
          </article>
        ))}
      </div>
      <Footer privacyPolicyUrl={privacyPolicyUrl} />
    </div>
  );
};

export default PrivacyPolicy;