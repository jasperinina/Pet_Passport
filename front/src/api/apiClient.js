import { ERROR_MESSAGES } from '../constants/config';
import NotificationService from '../services/notificationService';
import API_BASE_URL from './config';

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
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const settings = { ...this.config, ...requestOptions };

    try {
      const response = await fetch(url, config);

      return await this.handleResponse(response, settings);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(ERROR_MESSAGES.GLOBAL.NETWORK);
      }
      throw error;
    }
  }

  async handleResponse(response, settings) {
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
    if (contentType?.includes('application/json')) {
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    }
    
    return response.body;
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
    return await this.request(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      requestOptions
    );
  }

  async put(endpoint, data, requestOptions = {}) {
    return await this.request(
      endpoint,
      {
        method: 'PUT',
        body: JSON.stringify(data),
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
}

export const apiClient = new ApiClient(API_BASE_URL);

export default ApiClient;