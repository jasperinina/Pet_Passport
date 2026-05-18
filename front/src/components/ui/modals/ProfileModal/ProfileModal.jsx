import styles from "./ProfileModal.module.scss";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { deleteAccount, getAccount, logoutOwner } from "../../../../api/auth";
import { notifyError } from "../../../../services/notificationService";
import { clearSelectedPet } from "../../../../utils/selectedPetStorage";

const ProfileModal = ({
  isOpen,
  isClosing,
  onClose
}) => {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const loadAccount = async () => {
      setLoading(true);

      try {
        const accountData = await getAccount();
        if (isMounted) {
          setAccount(accountData);
        }
      } catch (error) {
        notifyError(error.message || "Не удалось загрузить профиль");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAccount();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const handleLogout = async () => {
    if (actionLoading) return;

    setActionLoading(true);

    try {
      await logoutOwner();
      clearSelectedPet();
      onClose();
      navigate("/", { replace: true });
    } catch (error) {
      notifyError(error.message || "Не удалось выйти из аккаунта");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (actionLoading) return;

    const confirmed = window.confirm("Удалить аккаунт и все связанные данные?");
    if (!confirmed) return;

    setActionLoading(true);

    try {
      await deleteAccount();
      clearSelectedPet();
      onClose();
      navigate("/", { replace: true });
    } catch (error) {
      notifyError(error.message || "Не удалось удалить аккаунт");
    } finally {
      setActionLoading(false);
    }
  };

  if (!isOpen) return null;

  const login = account?.login || account?.Login || account?.telegramNick || account?.TelegramNick || "Не указан";

  return (
    <section className={`form ${isClosing ? "form--closing" : ""}`}>
      <div className="form__inner">
        <header className="form__header">
          <h2 className="form__title h1">Профиль</h2>
          <div className="form__close-button-wrapper">
            <button
              className="form__close-button cross-button"
              type="button"
              disabled={actionLoading}
              onClick={onClose}
            >
              <span className="visually-hidden">Закрыть профиль</span>
            </button>
          </div>
        </header>
        <div className={styles["profile-modal__body"]}>
          <div className={styles["profile-modal__field"]}>
            <h3 className={`${styles["profile-modal__label"]} h3`}>Логин</h3>
            <div className={styles["profile-modal__value"]}>
              {loading ? "Загрузка..." : login}
            </div>
          </div>
        </div>
        <footer className={styles["profile-modal__footer"]}>
          <button
            className="button button--filled"
            type="button"
            disabled={actionLoading}
            onClick={handleLogout}
          >
            {actionLoading ? "Выходим..." : "Выйти"}
          </button>
          <button
            className={styles["profile-modal__delete-button"]}
            type="button"
            title="Удалить аккаунт"
            disabled={actionLoading}
            onClick={handleDeleteAccount}
          >
            <span className="visually-hidden">Удалить аккаунт</span>
            <svg
              width="20" height="20" viewBox="0 0 20 20"
              fill="none"
            >
              <g clipPath="url(#profile_delete_icon)">
                <path d="M11.6453 0.363281C11.8528 0.363147 12.049 0.362695 12.2361 0.392578C12.9671 0.509399 13.6001 0.96551 13.9421 1.62207C14.0296 1.79019 14.0905 1.97679 14.156 2.17383L14.2654 2.5C14.2835 2.55426 14.2881 2.5687 14.2917 2.5791L14.3582 2.72754C14.5384 3.05781 14.8833 3.27248 15.2673 3.28223H18.2703C18.756 3.28223 19.15 3.67638 19.1501 4.16211C19.1501 4.64797 18.7561 5.04199 18.2703 5.04199H1.72925C1.2435 5.04186 0.849365 4.64789 0.849365 4.16211C0.849516 3.67646 1.24359 3.28236 1.72925 3.28223H4.73218C5.17114 3.2711 5.55838 2.992 5.70776 2.5791L5.73511 2.5L5.84351 2.17383L5.94214 1.8877C5.97671 1.79535 6.0145 1.70629 6.05835 1.62207C6.40039 0.965568 7.03338 0.509315 7.7644 0.392578C7.95152 0.362744 8.14768 0.363147 8.35522 0.363281H11.6453ZM8.04175 2.13086C7.86054 2.1598 7.70365 2.27279 7.6189 2.43555C7.6056 2.46114 7.58916 2.50133 7.49878 2.77246L7.40112 3.06348C7.38667 3.10685 7.37541 3.14353 7.36304 3.17773C7.35023 3.21314 7.33516 3.24757 7.32104 3.28223H12.6794C12.6653 3.24755 12.6503 3.21315 12.6375 3.17773L12.6365 3.1748L12.5984 3.06445V3.06348L12.5017 2.77246H12.5007C12.4108 2.50247 12.3949 2.46117 12.3816 2.43555C12.2969 2.27291 12.1397 2.15992 11.9587 2.13086C11.9303 2.12631 11.8871 2.12305 11.6003 2.12305H8.39917C8.11331 2.12305 8.07024 2.12633 8.04175 2.13086Z" fill="currentColor" stroke="currentColor" strokeWidth="0.3"/>
                <path d="M16.7074 5.7168C17.192 5.74922 17.5589 6.16871 17.5267 6.65332L17.0756 13.417C16.9926 14.6614 16.925 15.6815 16.765 16.4844C16.598 17.3227 16.3098 18.0441 15.7025 18.6123C15.0951 19.1806 14.3558 19.4203 13.5082 19.5312C12.6964 19.6374 11.6742 19.6367 10.4271 19.6367H9.57263C8.32553 19.6367 7.30329 19.6374 6.49158 19.5312C5.64392 19.4203 4.90464 19.1806 4.29724 18.6123C3.68999 18.0441 3.40177 17.3227 3.23474 16.4844C3.0748 15.6815 3.00713 14.6614 2.92419 13.417L2.47302 6.65332C2.44084 6.16873 2.80781 5.74927 3.29236 5.7168C3.77703 5.68449 4.19639 6.05151 4.22888 6.53613L4.67615 13.249C4.76386 14.5647 4.82593 15.466 4.96033 16.1406C5.0897 16.79 5.26535 17.108 5.49939 17.3271C5.73365 17.5462 6.06318 17.7002 6.72009 17.7861C7.40217 17.8753 8.30509 17.8779 9.62341 17.8779H10.3763C11.6947 17.8779 12.5976 17.8753 13.2797 17.7861C13.9366 17.7002 14.2661 17.5462 14.5004 17.3271C14.7344 17.108 14.91 16.79 15.0394 16.1406C15.1739 15.466 15.236 14.5647 15.3236 13.249L15.7709 6.53613C15.8033 6.05149 16.2227 5.68449 16.7074 5.7168Z" fill="currentColor" stroke="currentColor" strokeWidth="0.3"/>
                <path d="M7.47998 8.15137C7.9633 8.10322 8.39455 8.45605 8.44287 8.93945L8.9292 13.8037C8.97753 14.2871 8.62462 14.7183 8.14111 14.7666C7.65782 14.8149 7.22676 14.4628 7.17822 13.9795L6.69189 9.11426C6.64356 8.63087 6.99652 8.1997 7.47998 8.15137Z" fill="currentColor" stroke="currentColor" strokeWidth="0.3"/>
                <path d="M12.5195 8.15137C13.003 8.19969 13.3559 8.63087 13.3076 9.11426L12.8213 13.9795C12.7728 14.4627 12.3416 14.8148 11.8584 14.7666C11.3749 14.7183 11.022 14.2871 11.0703 13.8037L11.5566 8.93945C11.605 8.45597 12.0362 8.10309 12.5195 8.15137Z" fill="currentColor" stroke="currentColor" strokeWidth="0.3"/>
              </g>
              <defs>
                <clipPath id="profile_delete_icon">
                  <rect width="20" height="20" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </button>
        </footer>
      </div>
    </section>
  );
};

export default ProfileModal;
