import { useNavigate } from "react-router-dom";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import Footer from "../../components/landing/footer/Footer";
import Header from "../../components/landing/header/Header";
import styles from "./PrivacyPolicy.module.scss";

import policyText from "../../docs/privacy-policy.md?raw";

const parsePrivacyPolicySections = (markdownText) => {
  const lines = markdownText.split("\n");
  const intro = [];
  const sections = [];
  let currentSection = null;
  let currentContent = [];

  lines.forEach((line) => {
    if (/^#\s/.test(line)) {
      return;
    }

    if (/^##\s/.test(line)) {
      if (currentSection) {
        sections.push({
          title: currentSection,
          content: currentContent.join("\n").trim(),
        });
      }

      currentSection = line.replace(/^##\s/, "").trim();
      currentContent = [];
      return;
    }

    if (currentSection) {
      currentContent.push(line);
    } else {
      intro.push(line);
    }
  });

  if (currentSection) {
    sections.push({
      title: currentSection,
      content: currentContent.join("\n").trim(),
    });
  }

  return {
    intro: intro.join("\n").trim(),
    sections,
  };
};

const withoutMarkdownNode = ({ node, ...props }) => {
  void node;
  return props;
};

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const gitHubUrl = import.meta.env.VITE_GITHUB_URL || "";
  const webUrl = "/";
  const privacyPolicyUrl = "/privacy-policy";

  const { intro, sections } = parsePrivacyPolicySections(policyText);

  const markdownComponents = {
    h1: (props) => (
      <h2
        className={`${styles["privacy-policy__section-title"]} h2`}
        {...withoutMarkdownNode(props)}
      />
    ),
    h2: (props) => (
      <h3
        className={`${styles["privacy-policy__section-subtitle"]} h3`}
        {...withoutMarkdownNode(props)}
      />
    ),
    h3: (props) => (
      <h3
        className={`${styles["privacy-policy__section-subtitle"]} h3`}
        {...withoutMarkdownNode(props)}
      />
    ),
    p: (props) => (
      <div className={styles["privacy-policy__section-paragraph"]}>
        <p {...withoutMarkdownNode(props)} />
      </div>
    ),
    ul: (props) => (
      <ul
        className={styles["privacy-policy__section-list"]}
        {...withoutMarkdownNode(props)}
      />
    ),
    ol: (props) => (
      <ol
        className={styles["privacy-policy__section-list"]}
        {...withoutMarkdownNode(props)}
      />
    ),
    hr: () => null,
    a: ({ node, href, children, ...props }) => {
      void node;
      let mailtoTelProps = {};

      if (href?.startsWith("mailto:")) {
        mailtoTelProps = { href, target: "_self" };
      } else if (href?.startsWith("tel:")) {
        mailtoTelProps = { href, target: "_self" };
      } else {
        mailtoTelProps = { href, target: "_blank", rel: "noopener noreferrer" };
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
    },
  };

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
        {intro && (
          <article className={styles["privacy-policy__section"]}>
            <div className={styles["privacy-policy__section-body"]}>
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={markdownComponents}
              >
                {intro}
              </Markdown>
            </div>
          </article>
        )}
        {sections.map((section, index) => (
          <article
            className={styles["privacy-policy__section"]}
            key={section.title || index}
          >
            <h2 className={`${styles["privacy-policy__section-title"]} h2`}>
              {section.title}
            </h2>
            <div className={styles["privacy-policy__section-body"]}>
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={markdownComponents}
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
