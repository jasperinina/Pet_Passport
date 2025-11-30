import "../../styles/header.css";
import Logo from "../../assets/icons/Logo.svg";
import PetIcon from "../../assets/icons/icon-cats.svg";
import ProcedureIcon from "../../assets/icons/icons-procedures.svg";
import HistoryIcon from "../../assets/icons/icons-history.svg";

const Header = ({ petName }) => {
  const petIcon = PetIcon;

  return (
    <header className="page-header">
      <div className="container">
        <div className="page-header__inner">

          {/* ЛЕВАЯ ЧАСТЬ */}
          <div className="page-header__left">
            <img src={Logo} alt="PetPassport" className="page-header__logo" />

            <div className="page-header__divider" />

            {petName && (
              <div className="page-header__pet">
                <img src={petIcon} alt={petName} className="page-header__pet-icon" />
                <span className="txt2 page-header__pet-name">{petName}</span>
              </div>
            )}
          </div>

          {/* ПРАВАЯ ЧАСТЬ */}
          <nav className="page-header__nav">

            <button className="page-header__nav-item" type="button">
              <img src={ProcedureIcon} className="page-header__nav-icon" alt="" />
              <span className="txt2 page-header__nav-label">Предстоящие процедуры</span>
            </button>

            <button className="page-header__nav-item" type="button">
              <img src={HistoryIcon} className="page-header__nav-icon" alt="" />
              <span className="txt2 page-header__nav-label">Медицинская история</span>
            </button>

          </nav>

        </div>
      </div>
    </header>
  );
};

export default Header;