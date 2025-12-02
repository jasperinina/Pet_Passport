import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/header.css";
import Logo from "../../assets/icons/Logo.svg";
import PetIcon from "../../assets/icons/icon-cats.svg";
import ProcedureIcon from "../../assets/icons/icons-procedures.svg";
import HistoryIcon from "../../assets/icons/icons-history.svg";

const Header = ({ petName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.search || ""; // содержит ?id=...

  const petIcon = PetIcon;

  const goTo = (path) => {
    navigate(`${path}${search}`);
  };

  return (
    <header className="page-header">
      <div className="container">
        <div className="page-header__inner">
          {/* ЛЕВАЯ ЧАСТЬ */}
          <div className="page-header__left">
            <img
              src={Logo}
              alt="PetPassport"
              className="page-header__logo"
              onClick={() => goTo("/")}
              style={{ cursor: "pointer" }}
            />

            <div className="page-header__divider" />

            {petName && (
              <div className="page-header__pet">
                <img
                  src={petIcon}
                  alt={petName}
                  className="page-header__pet-icon"
                />
                <span className="txt2 page-header__pet-name">{petName}</span>
              </div>
            )}
          </div>

          {/* ПРАВАЯ ЧАСТЬ */}
          <nav className="page-header__nav">
            {/* Предстоящие процедуры */}
            <button
              className="page-header__nav-item"
              type="button"
              onClick={() => goTo("/upcoming")}
            >
              <img
                src={ProcedureIcon}
                className="page-header__nav-icon"
                alt=""
              />
              <span className="txt2 page-header__nav-label">
                Предстоящие процедуры
              </span>
            </button>

            {/* Медицинская история */}
            <button
              className="page-header__nav-item"
              type="button"
              onClick={() => goTo("/history")}
            >
              <img src={HistoryIcon} className="page-header__nav-icon" alt="" />
              <span className="txt2 page-header__nav-label">
                Медицинская история
              </span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;