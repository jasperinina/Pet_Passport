import { useState, useEffect, useCallback } from 'react';
import { getUpcomingEvents, getPastEvents } from '../api/events';

export const useUpcomingEvents = (petId, limit = null) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadEvents = useCallback(async () => {
    if (!petId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getUpcomingEvents(petId);
      setEvents(limit ? data.slice(0, limit) : data);
    } catch (err) {
      setError(err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [petId, limit]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return { events, loading, error, reload: loadEvents };
};

export const usePastEvents = (petId) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadEvents = useCallback(async () => {
    if (!petId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getPastEvents(petId);
      setEvents(data);
    } catch (err) {
      setError(err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return { events, loading, error, reload: loadEvents };
};

