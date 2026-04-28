import { apiClient } from './apiClient.js';
import { USE_MOCK_API, mockGetCurrentUserPet } from './mockApi.js';

const TELEGRAM_OWNER_ENDPOINT = '/api/Owners/by-telegram';
const OWNER_ID_STORAGE_KEY = 'petPassportOwnerId';

export const isUnauthorizedError = (error) =>
  error?.status === 401 || error?.status === 403;

export const getTelegramUserId = () => {
  const telegramUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

  return telegramUserId ?? import.meta.env.VITE_MOCK_TELEGRAM_ID ?? null;
};

export const getStoredOwnerId = () => {
  const ownerId = window.localStorage.getItem(OWNER_ID_STORAGE_KEY);
  return ownerId ? Number(ownerId) : null;
};

export const setStoredOwnerId = (ownerId) => {
  if (!ownerId) return;
  window.localStorage.setItem(OWNER_ID_STORAGE_KEY, String(ownerId));
};

export const clearStoredOwnerId = () => {
  window.localStorage.removeItem(OWNER_ID_STORAGE_KEY);
};

const normalizeOwnerId = (result) => {
  if (typeof result === 'number') return result;
  return result?.ownerId ?? result?.OwnerId ?? null;
};

const getTelegramUser = () => window.Telegram?.WebApp?.initDataUnsafe?.user ?? null;

export async function loginOwner(credentials) {
  const result = await apiClient.post('/api/Owners/login', credentials);
  const ownerId = normalizeOwnerId(result);

  if (!ownerId) {
    throw new Error('Сервер не вернул ID владельца');
  }

  setStoredOwnerId(ownerId);
  return ownerId;
}

export async function registerOwner(credentials) {
  const result = await apiClient.post('/api/Owners/register-login', credentials);
  const ownerId = normalizeOwnerId(result);

  if (!ownerId) {
    throw new Error('Сервер не вернул ID владельца');
  }

  setStoredOwnerId(ownerId);
  return ownerId;
}

export async function getOwnerPets(ownerId = getStoredOwnerId()) {
  if (!ownerId) {
    const error = new Error('Пользователь не авторизован');
    error.status = 401;
    throw error;
  }

  return await apiClient.get(`/api/Owners/${ownerId}/pets`);
}

export async function registerTelegramOwner(telegramUser = getTelegramUser()) {
  const telegramId = telegramUser?.id ?? getTelegramUserId();

  if (!telegramId) {
    const error = new Error('Telegram пользователь не найден');
    error.status = 401;
    throw error;
  }

  const ownerId = await apiClient.post('/api/Owners/register', {
    telegramId,
    telegramNick: telegramUser?.username ?? telegramUser?.first_name ?? null,
  });

  if (!ownerId) {
    throw new Error('Сервер не вернул ID владельца');
  }

  setStoredOwnerId(ownerId);
  return ownerId;
}

export async function getCurrentUserPet(telegramId = getTelegramUserId()) {
  const ownerId = getStoredOwnerId();

  if (ownerId) {
    const pets = await getOwnerPets(ownerId);
    const pet = pets?.[0] ?? null;

    if (!pet?.id && !pet?.Id) {
      throw new Error('У пользователя не найден питомец');
    }

    return pet;
  }

  if (!telegramId) {
    const error = new Error('Telegram пользователь не найден');
    error.status = 401;
    throw error;
  }

  if (USE_MOCK_API) {
    return await mockGetCurrentUserPet(telegramId);
  }

  let owner;

  try {
    owner = await apiClient.get(`${TELEGRAM_OWNER_ENDPOINT}/${telegramId}`);
  } catch (error) {
    if (error.status !== 404) {
      throw error;
    }

    const registeredOwnerId = await registerTelegramOwner();
    const noPetError = new Error('У пользователя не найден питомец');
    noPetError.ownerId = registeredOwnerId;
    throw noPetError;
  }

  if (owner?.ownerId || owner?.OwnerId) {
    setStoredOwnerId(owner.ownerId ?? owner.OwnerId);
  }

  const pet = owner?.pets?.[0] ?? null;

  if (!pet?.id && !pet?.Id) {
    throw new Error('У Telegram пользователя не найден питомец');
  }

  return pet;
}
