// Моковые функции API для разработки без бекенда
import { mockPet, mockUpcomingEvents } from './mockData.js';

// Включить/выключить моковый режим через переменную окружения
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

export const mockGetPet = async (id) => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 500));
  return { ...mockPet, id };
};

export const mockGetUpcomingEvents = async (petId) => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockUpcomingEvents;
};

export { USE_MOCK_API };


