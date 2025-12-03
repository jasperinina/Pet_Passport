import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useUrlParams = () => {
  const location = useLocation();

  return useMemo(() => {
    const params = new URLSearchParams(location.search);
    const petId = params.get('id') || params.get('Id');
    
    return {
      petId: petId ? parseInt(petId, 10) : null,
      search: location.search || '',
    };
  }, [location.search]);
};

