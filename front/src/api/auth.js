import { apiClient } from './apiClient.js';
import { USE_MOCK_API, mockGetCurrentUserPet } from './mockApi.js';

const TELEGRAM_OWNER_ENDPOINT = '/api/Owners/by-telegram';

export const isUnauthorizedError = (error) =>
  error?.status === 401 || error?.status === 403;

export const getTelegramUserId = () => {
  const telegramUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

  return telegramUserId ?? import.meta.env.VITE_MOCK_TELEGRAM_ID ?? null;
};

export async function getCurrentUserPet(telegramId = getTelegramUserId()) {
  if (!telegramId) {
    const error = new Error('Telegram пользователь не найден');
    error.status = 401;
    throw error;
  }

  if (USE_MOCK_API) {
    return await mockGetCurrentUserPet(telegramId);
  }

  const owner = await apiClient.get(`${TELEGRAM_OWNER_ENDPOINT}/${telegramId}`);
  const pet = owner?.pets?.[0] ?? null;

  if (!pet?.id && !pet?.Id) {
    throw new Error('У Telegram пользователя не найден питомец');
  }

  return pet;
}
