import { apiClient } from './apiClient.js';
import { USE_MOCK_API, mockGetCurrentUserPet } from './mockApi.js';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './tokenStorage.js';

const OWNER_ID_STORAGE_KEY = 'petPassportOwnerId';

export const isUnauthorizedError = (error) =>
  error?.status === 401 || error?.status === 403;

export const hasStoredAuth = () => Boolean(getAccessToken());

export const getTelegramUserId = () => {
  const telegramUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

  return telegramUserId ?? import.meta.env.VITE_MOCK_TELEGRAM_ID ?? null;
};

export const getStoredOwnerId = () => {
  if (!getAccessToken()) return null;

  const ownerId = window.localStorage.getItem(OWNER_ID_STORAGE_KEY);
  return ownerId ? Number(ownerId) : null;
};

export const setStoredOwnerId = (ownerId) => {
  if (!ownerId) return;
  window.localStorage.setItem(OWNER_ID_STORAGE_KEY, String(ownerId));
};

export const clearStoredOwnerId = () => {
  window.localStorage.removeItem(OWNER_ID_STORAGE_KEY);
  clearTokens();
};

const normalizeOwnerId = (result) => {
  if (typeof result === 'number') return result;
  return result?.ownerId ?? result?.OwnerId ?? null;
};

const getTelegramInitData = () => window.Telegram?.WebApp?.initData ?? null;

const saveAuthResponse = (result) => {
  const ownerId = normalizeOwnerId(result);

  if (!result?.accessToken || !result?.refreshToken || !ownerId) {
    throw new Error('Сервер не вернул данные авторизации');
  }

  setTokens(result);
  setStoredOwnerId(ownerId);
  return ownerId;
};

export async function loginOwner(credentials) {
  const result = await apiClient.post('/api/v2/auth/login', credentials);
  return saveAuthResponse(result);
}

export async function registerOwner(credentials) {
  const result = await apiClient.post('/api/v2/auth/register', credentials);
  return saveAuthResponse(result);
}

export async function getOwnerPets() {
  if (!getAccessToken()) {
    const error = new Error('Пользователь не авторизован');
    error.status = 401;
    throw error;
  }

  return await apiClient.get('/api/v2/pets');
}

export async function loginTelegramOwner() {
  const initData = getTelegramInitData();

  if (!initData) {
    const error = new Error('Telegram пользователь не найден');
    error.status = 401;
    throw error;
  }

  const result = await apiClient.post('/api/v2/auth/telegram', { initData });
  return saveAuthResponse(result);
}

export async function logoutOwner() {
  const refreshToken = getRefreshToken();

  try {
    if (refreshToken) {
      await apiClient.post(
        '/api/v2/auth/logout',
        { refreshToken },
        { skipAuthRefresh: true }
      );
    }
  } finally {
    clearStoredOwnerId();
  }
}

export async function getCurrentUserPet(telegramId = getTelegramUserId()) {
  if (getAccessToken()) {
    const pets = await getOwnerPets();
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

  await loginTelegramOwner();
  const pets = await getOwnerPets();
  const pet = pets?.[0] ?? null;

  if (!pet?.id && !pet?.Id) {
    throw new Error('У Telegram пользователя не найден питомец');
  }

  return pet;
}
