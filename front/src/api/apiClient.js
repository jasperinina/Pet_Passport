import { ERROR_MESSAGES } from '../constants/config';
import NotificationService from '../services/notificationService';
import API_BASE_URL from './config';

class ApiClient {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.config = {
      useNotifications: false,
      showSuccessNotifications: false,
      defaultErrorMessage: ERROR_MESSAGES.GENERIC_ERROR || 'Произошла ошибка',
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
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
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

      throw error;
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    }
    
    return response.body;
  }

  async handleError(error, settings) {
    let finalError;
    if (error instanceof TypeError && error.message.includes('fetch')) {
      finalError = new Error(ERROR_MESSAGES.NETWORK_ERROR || 'Ошибка сети');
    } else {
      finalError = error;
    }

    if (settings.useNotifications && NotificationService.showError) {
      NotificationService.showError(
        finalError.message,
        'Ошибка запроса'
      );
    }

    throw finalError;
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