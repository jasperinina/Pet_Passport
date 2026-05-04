import { ERROR_MESSAGES } from '../constants/config';
import API_BASE_URL from './config';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './tokenStorage';

class ApiClient {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.config = {
      useNotifications: false,
      showSuccessNotifications: false,
      defaultErrorMessage: ERROR_MESSAGES.GLOBAL.DEFAULT,
      ...options
    };
  }

  async request(endpoint, options = {}, requestOptions = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const isFormData = options.body instanceof FormData;
    const accessToken = getAccessToken();
    const config = {
      credentials: 'same-origin',
      headers: isFormData
        ? { ...options.headers }
        : {
            'Content-Type': 'application/json',
            ...options.headers,
          },
      ...options,
    };

    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    const settings = { ...this.config, ...requestOptions };

    try {
      const response = await fetch(url, config);

      if (
        response.status === 401 &&
        !settings.skipAuthRefresh &&
        !endpoint.startsWith('/api/v2/auth/')
      ) {
        const refreshed = await this.refreshAccessToken();

        if (refreshed) {
          const retryConfig = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${refreshed.accessToken}`,
            },
          };

          const retryResponse = await fetch(url, retryConfig);
          return await this.handleResponse(retryResponse, settings);
        }
      }

      return await this.handleResponse(response, settings);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(ERROR_MESSAGES.GLOBAL.NETWORK);
      }
      throw error;
    }
  }

  async handleResponse(response) {
    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
      } catch {
        errorText = '';
      }

      const errorMessage = errorText || `HTTP Error: ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;

      // TODO: Временно, чтобы узнать статусы ошибок
      console.error(error);

      throw error;
    }

    const contentType = response.headers.get('content-type');
    const text = await response.text();

    if (!text) {
      return {};
    }

    if (contentType?.includes('application/json')) {
      return text ? JSON.parse(text) : {};
    }

    if (contentType?.includes('text/plain')) {
      const numericValue = Number(text);
      return Number.isNaN(numericValue) ? text : numericValue;
    }

    return text;
  }

  async get(endpoint, requestOptions = {}) {
    return await this.request(
      endpoint,
      {
        method: 'GET'
      },
      requestOptions);
  }

  async post(endpoint, data, requestOptions = {}) {
    const isFormData = data instanceof FormData;

    return await this.request(
      endpoint,
      {
        method: 'POST',
        body: isFormData ? data : JSON.stringify(data),
      },
      requestOptions
    );
  }

  async put(endpoint, data, requestOptions = {}) {
    const isFormData = data instanceof FormData;

    return await this.request(
      endpoint,
      {
        method: 'PUT',
        body: isFormData ? data : JSON.stringify(data),
      },
      requestOptions
    );
  }

  async patch(endpoint, data, requestOptions = {}) {
    return await this.request(
      endpoint,
      {
        method: 'PATCH',
        body: JSON.stringify(data)
      },
      requestOptions
    );
  }

  async delete(endpoint, requestOptions = {}) {
    return await this.request(
      endpoint,
      {
        method: 'DELETE'
      },
      requestOptions
    );
  }

  async upload(endpoint, formData, requestOptions = {}) {
    return await this.request(
      endpoint,
      {
        method: 'POST',
        body: formData,
        headers: {},
      },
      requestOptions
    );
  }

  async refreshAccessToken() {
    const refreshToken = getRefreshToken();

    if (!refreshToken) return null;

    try {
      const response = await fetch(`${this.baseURL}/api/v2/auth/refresh`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        clearTokens();
        window.dispatchEvent(new Event('auth-expired'));
        return null;
      }

      const tokens = await response.json();
      setTokens(tokens);
      return tokens;
    } catch {
      clearTokens();
      window.dispatchEvent(new Event('auth-expired'));
      return null;
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

export default ApiClient;
