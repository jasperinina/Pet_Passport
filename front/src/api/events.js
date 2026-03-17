import { ERROR_MESSAGES } from '../constants/config.js';
import NotificationService from '../services/notificationService.js';
import { apiClient } from './apiClient.js';
import API_BASE_URL from './config.js';
import { USE_MOCK_API, mockGetUpcomingEvents } from './mockApi.js';

// ========== Doctor Visit ==========
export async function createDoctorVisit(data) {
  try {
    const response = await apiClient.post('/api/doctor-visit', data);

    NotificationService.showSuccess?.(
      'Посещение успешно добавлено',
      'Success!'
    );

    return response;
  } catch {

  }
}

export async function getDoctorVisit(id) {
  try {
    return await apiClient.get(`/api/doctor-visit/${id}`);
  } catch {

  }
}

export async function updateDoctorVisit(id, data) {
  try {
    return await apiClient.put(`/api/doctor-visit/${id}`, data);
  } catch {

  }
}

export async function deleteDoctorVisit(id) {
  try {
    return await apiClient.delete(`/api/doctor-visit/${id}`);
  } catch {

  }
}

// ========== Vaccine ==========
export async function createVaccine(data) {
  try {
    return await apiClient.post(`/api/vaccine`, data);
  } catch {

  }
}

export async function getVaccine(id) {
  try {
    return await apiClient.get(`/api/vaccine/${id}`);
  } catch {

  }
}

export async function updateVaccine(id, data) {
  try {
    return await apiClient.put(`/api/vaccine/${id}`, data);
  } catch {

  }
}

export async function deleteVaccine(id) {
  try {
    return await apiClient.delete(`/api/vaccine/${id}`);
  } catch {

  }
}

// ========== Treatment ==========
export async function createTreatment(data) {
  try {
    return await apiClient.post(`/api/treatment`, data);
  } catch {

  }
}

export async function getTreatment(id) {
  try {
    return await apiClient.get(`/api/treatment/${id}`);
  } catch {

  }
}

export async function updateTreatment(id, data) {
  try {
    return await apiClient.put(`/api/treatment/${id}`, data);
  } catch {

  }
}

export async function deleteTreatment(id) {
  try {
    return await apiClient.delete(`/api/treatment/${id}`);
  } catch {

  }
}

// ========== Events Lists ==========
export async function getUpcomingEvents(petId) {  
  try {
    if (USE_MOCK_API) {
      return await mockGetUpcomingEvents(petId);
    }

    const response = await apiClient.get(`/api/events/${petId}`);

    if (response.status === 404) {
      NotificationService.showWarning?.(
        'Процедуры не найдены',
        'Warning'
      );

      return [];
    }

    return response;
  } catch {

  }
}

export async function getPastEvents(petId) {
  try {
    if (USE_MOCK_API) {
      // В моковом режиме истории нет — возвращаем пустой список
      return [];
    }

    const response = await apiClient.get(`/api/events/${petId}`);

    if (response.status === 404) {
      NotificationService.showWarning?.(
        'Прошедшие процедуры не найдены',
        'Warning'
      );
    }

    return response;
  } catch {

  }
}
