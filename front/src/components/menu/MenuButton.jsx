import styles from "./MenuButton.module.scss";

import { useLocation, useNavigate } from "react-router-dom";

const MenuButton = ({ route, icon, text }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.search || "";

  const goTo = (path) => {
    navigate(`${path}${search}`);
  };

  return (
    <button
      className={styles["menu-button"]}
      type="button"
      onClick={() => goTo(`/${route}`)}
    >
      <img
        className={styles["menu-button__image"]}
        src={icon}
        alt=""
        width="20" height="20"
      />
      <div
        className={styles["menu-button__text"]}
      >
        {text}
      </div>
    </button>
  );
};

export default MenuButton;