import { useState, useEffect, useCallback } from 'react';
import { getPet } from '../api/pets';

export const usePetData = (petId) => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPet = useCallback(async () => {
    if (!petId) {
      setError('ID питомца не указан');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const petData = await getPet(petId);
      setPet(petData);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки данных о питомце');
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    loadPet();
  }, [loadPet]);

  return { pet, loading, error, reload: loadPet };
};

