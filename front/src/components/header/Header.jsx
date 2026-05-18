import styles from "./Header.module.scss";

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Logo from "../logo/Logo";
import Menu from "../menu/Menu";
import ModalOverlay from "../modal_overlay/ModalOverlay";
import HeaderAction from "./action/HeaderAction";
import ProfileModal from "../ui/modals/ProfileModal/ProfileModal";
import { getPetSpeciesIcon } from "../../utils/petIcons";
import { getSelectedPet } from "../../utils/selectedPetStorage";

import ProfileIcon from "../../assets/icons/profile.svg?react";

const Header = ({
  petName,
  petId,
  petSpecies,
  hideMenu = false,
  className = "section container",
  innerClassName = styles.header__inner
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const goBack = () => {
    navigate(-1);
  };

  const isHomePage = location.pathname === "/" || location.pathname === "/pets";
  const storedPet = getSelectedPet();
  const selectedPetId = petId || storedPet.id;
  const selectedPetName = petName || storedPet.name || "Выберите питомца";
  const selectedPetSpecies = petSpecies ?? storedPet.species;
  const selectedPetIcon = getPetSpeciesIcon(selectedPetSpecies);

  return (
    <>
      <header className={className}>
        <div className={innerClassName}>
          <div className={styles.header__info}>
            {isHomePage ? (
              <Logo />
            ) : (
              <button
                className={styles["header__back-button"]}
                type="button"
                onClick={goBack}
              >
                <svg
                  className={styles["header__back-button-icon"]}
                  width="16" height="16" viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M10.0002 12.4004L6.00024 8.40039L10.0002 4.40039"
                    stroke="#36187D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
                <div className={styles["header__back-button-text"]}>
                  Назад
                </div>
              </button>
            )}
            <span className={`${styles.header__separator} hidden-mobile`}></span>
            <div className={styles["header__actions"]}>
              <HeaderAction
                icon={selectedPetIcon}
                text={selectedPetName}
                onClick={() => selectedPetId && navigate(`/?id=${selectedPetId}`)}
                hasSecondIcon
              />
              <HeaderAction
                icon={ProfileIcon}
                text="Профиль"
                onClick={() => setIsProfileModalOpen(true)}
              />
            </div>
          </div>
          {!hideMenu && (
            <>
              <Menu isTabletHidden={true} />
              <Menu />
            </>
          )}
        </div>
      </header>
      <ModalOverlay
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      >
        {({ isOpen, isClosing, onClose }) => (
          <ProfileModal
            isOpen={isOpen}
            isClosing={isClosing}
            onClose={onClose}
          />
        )}
      </ModalOverlay>
    </>
  );
};

export default Header;
