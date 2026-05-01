const ACCESS_TOKEN_STORAGE_KEY = 'petPassportAccessToken';
const REFRESH_TOKEN_STORAGE_KEY = 'petPassportRefreshToken';

export const getAccessToken = () =>
  window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

export const getRefreshToken = () =>
  window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);

export const setTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) {
    window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
  }

  if (refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  }
};

export const clearTokens = () => {
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
};
