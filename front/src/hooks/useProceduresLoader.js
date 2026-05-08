import { useCallback, useEffect, useRef, useState } from "react";

import NotificationService from "../services/notificationService";
import { ERROR_MESSAGES } from "../constants/config";

export const useProceduresLoader = ({
  petId,
  load,
  noPetError = false,
}) => {
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadedPetIdRef = useRef(null);

  const reload = useCallback(async () => {
    if (!petId) {
      setLoading(false);
      loadedPetIdRef.current = null;

      if (noPetError) {
        NotificationService.showError?.(
          ERROR_MESSAGES.PET.NO_ID,
          ERROR_MESSAGES.ERROR_TITLE
        );
      }

      return;
    }

    try {
      if (loadedPetIdRef.current !== petId) {
        setLoading(true);
      }

      const loadedProcedures = await load(Number(petId));
      setProcedures(loadedProcedures || []);
    } catch {
      setProcedures([]);
    } finally {
      loadedPetIdRef.current = petId;
      setLoading(false);
    }
  }, [load, noPetError, petId]);

  useEffect(() => {
    queueMicrotask(reload);
  }, [reload]);

  return {
    procedures,
    loading,
    reload,
  };
};
