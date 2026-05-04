import { isTMA } from "@tma.js/sdk-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import LoadingState from "../../components/events/LoadingState/LoadingState";
import { getCurrentUserPet, getStoredOwnerId, hasStoredAuth, isUnauthorizedError, loginTelegramOwner } from "../../api/auth";
import Auth from "../Auth/Auth";
import Home from "../Home/Home";

const hasTelegramContext = () => { try { return isTMA(); } catch { return false; } };

const RootPetGate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking");
  const [authAttempt, setAuthAttempt] = useState(0);
  const handlingExpiry = useRef(false);

  const petId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("id") || params.get("Id");
  }, [location.search]);

  useEffect(() => {
    const handleAuthExpired = async () => {
      if (handlingExpiry.current) return;
      handlingExpiry.current = true;
      try {
        if (hasTelegramContext()) {
          await loginTelegramOwner();
        }
      } catch {
        // Telegram re-auth failed — let resolveCurrentPet handle it next run
      } finally {
        handlingExpiry.current = false;
        setAuthAttempt((n) => n + 1);
      }
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const resolveCurrentPet = async () => {
      if (!hasStoredAuth()) {
        if (hasTelegramContext()) {
          try {
            await loginTelegramOwner();
          } catch {
            if (isMounted) setStatus("auth-required");
            return;
          }
        } else {
          setStatus("auth-required");
          return;
        }
      }

      if (petId) {
        setStatus("ready");
        return;
      }

      try {
        setStatus("checking");

        navigate("/pets", { replace: true });
      } catch (error) {
        if (!isMounted) return;

        if (getStoredOwnerId() && !isUnauthorizedError(error)) {
          navigate("/pets", { replace: true });
          return;
        }

        if (!isUnauthorizedError(error)) {
          console.error("Ошибка проверки авторизации:", error);
        }

        setStatus("auth-required");
      }
    };

    resolveCurrentPet();

    return () => {
      isMounted = false;
    };
  }, [location.pathname, location.search, navigate, petId, authAttempt]);

  if (status === "auth-required") {
    return <Auth />;
  }

  if (status === "ready" && petId) {
    return <Home key={authAttempt} />;
  }

  return (
    <section className="section container">
      <LoadingState message="Проверяем авторизацию..." />
    </section>
  );
};

export default RootPetGate;
