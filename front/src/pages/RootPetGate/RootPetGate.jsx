import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import LoadingState from "../../components/events/LoadingState/LoadingState";
import { getCurrentUserPet, isUnauthorizedError } from "../../api/auth";
import AuthPlaceholder from "../AuthPlaceholder/AuthPlaceholder";
import Home from "../Home/Home";

const RootPetGate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking");

  const petId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("id") || params.get("Id");
  }, [location.search]);

  useEffect(() => {
    let isMounted = true;

    const resolveCurrentPet = async () => {
      if (petId) {
        setStatus("ready");
        return;
      }

      try {
        setStatus("checking");
        const pet = await getCurrentUserPet();
        if (!isMounted) return;

        const resolvedPetId = pet.id ?? pet.Id;
        const params = new URLSearchParams(location.search);
        params.set("id", resolvedPetId);
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
      } catch (error) {
        if (!isMounted) return;

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
  }, [location.pathname, location.search, navigate, petId]);

  if (petId) {
    return <Home />;
  }

  if (status === "auth-required") {
    return <AuthPlaceholder />;
  }

  return (
    <section className="section container">
      <LoadingState message="Проверяем авторизацию..." />
    </section>
  );
};

export default RootPetGate;
