// Моковые функции API для разработки без бекенда
import { mockEvents, mockEventTemplates, mockPet } from './mockData.js';

// Включить/выключить моковый режим через переменную окружения
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

export const mockGetPet = async (id) => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 500));
  return { ...mockPet, id };
};

export const mockGetCurrentUserPet = async (telegramId) => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 500));

  if (!telegramId || import.meta.env.VITE_MOCK_AUTHENTICATED === 'false') {
    const error = new Error('Unauthorized');
    error.status = 401;
    throw error;
  }

  return mockPet;
};

export const mockGetEvents = async (petId, statuses) => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockEvents.filter(e => statuses.includes(e.status));
};

export const mockGetEventTemplates = async () => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockEventTemplates;
};

export { USE_MOCK_API };
