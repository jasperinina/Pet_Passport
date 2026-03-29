import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/config.js';
import NotificationService from '../services/notificationService.js';
import { apiClient } from './apiClient.js';
import { USE_MOCK_API, mockGetEvents } from './mockApi.js';
import { notifyError, notifySuccess } from '../services/notificationService.js';

// ========== Doctor Visit ==========
export async function createDoctorVisit(data) {
  try {
    const response = await apiClient.post('/api/doctor-visit', data);

    notifySuccess(SUCCESS_MESSAGES.EVENT.CREATED);

    return response;
  } catch (error) {
    switch (error.status) {
      case 400:
        notifyError(ERROR_MESSAGES.EVENT.BAD_REQUEST);
        break;
      case 404:
        notifyError(ERROR_MESSAGES.GLOBAL.NOT_FOUND);
        break;
      default:
        notifyError(ERROR_MESSAGES.GLOBAL.DEFAULT);
        break;
    }
  }
}

export async function getDoctorVisit(id) {
  try {
    return await apiClient.get(`/api/doctor-visit/${id}`);
  } catch (error) {
    switch (error.status) {
      case 400:
        notifyError(ERROR_MESSAGES.EVENT.BAD_REQUEST);
        break;
      case 404:
        notifyError(ERROR_MESSAGES.GLOBAL.NOT_FOUND);
        break;
      default:
        notifyError(ERROR_MESSAGES.GLOBAL.DEFAULT);
        break;
    }
  }
}

export async function updateDoctorVisit(id, data) {
  try {
    const response = await apiClient.put(`/api/doctor-visit/${id}`, data);
    
    notifySuccess(SUCCESS_MESSAGES.EVENT.UPDATED);
    
    return response;
  } catch (error) {
    switch (error.status) {
      case 400:
        notifyError(ERROR_MESSAGES.EVENT.BAD_REQUEST);
        break;
      case 404:
        notifyError(ERROR_MESSAGES.GLOBAL.NOT_FOUND);
        break;
      default:
        notifyError(ERROR_MESSAGES.GLOBAL.DEFAULT);
        break;
    }
  }
}

export async function deleteDoctorVisit(id) {
  try {
    const response = await apiClient.delete(`/api/doctor-visit/${id}`);

    notifySuccess(SUCCESS_MESSAGES.EVENT.DELETED);

    return await apiClient.delete(`/api/doctor-visit/${id}`);
  } catch (error) {
    switch (error.status) {
      case 400:
        notifyError(ERROR_MESSAGES.EVENT.BAD_REQUEST);
        break;
      case 404:
        notifyError(ERROR_MESSAGES.GLOBAL.NOT_FOUND);
        break;
      default:
        notifyError(ERROR_MESSAGES.GLOBAL.DEFAULT);
        break;
    }
  }
}

// ========== Vaccine ==========
export async function createVaccine(data) {
  try {
    const response = await apiClient.post(`/api/vaccine`, data);

    notifySuccess(SUCCESS_MESSAGES.EVENT.CREATED);

    return response;
  } catch (error) {
    switch (error.status) {
      case 400:
        notifyError(ERROR_MESSAGES.EVENT.BAD_REQUEST);
        break;
      case 404:
        notifyError(ERROR_MESSAGES.GLOBAL.NOT_FOUND);
        break;
      default:
        notifyError(ERROR_MESSAGES.GLOBAL.DEFAULT);
        break;
    }
  }
}

export async function getVaccine(id) {
  try {
    return await apiClient.get(`/api/vaccine/${id}`);
  } catch (error) {
    switch (error.status) {
      case 400:
        notifyError(ERROR_MESSAGES.EVENT.BAD_REQUEST);
        break;
      case 404:
        notifyError(ERROR_MESSAGES.GLOBAL.NOT_FOUND);
        break;
      default:
        notifyError(ERROR_MESSAGES.GLOBAL.DEFAULT);
        break;
    }
  }
}

export async function updateVaccine(id, data) {
  try {
    const response = await apiClient.put(`/api/vaccine/${id}`, data);

    notifySuccess(SUCCESS_MESSAGES.EVENT.UPDATED);

    return response;
  } catch (error) {
    switch (error.status) {
      case 400:
        notifyError(ERROR_MESSAGES.EVENT.BAD_REQUEST);
        break;
      case 404:
        notifyError(ERROR_MESSAGES.GLOBAL.NOT_FOUND);
        break;
      default:
        notifyError(ERROR_MESSAGES.GLOBAL.DEFAULT);
        break;
    }
  }
}

export async function deleteVaccine(id) {
  try {
    const response = await apiClient.delete(`/api/vaccine/${id}`);

    notifySuccess(SUCCESS_MESSAGES.EVENT.DELETED);

    return response;
  } catch (error) {
    switch (error.status) {
      case 400:
        notifyError(ERROR_MESSAGES.EVENT.BAD_REQUEST);
        break;
      case 404:
        notifyError(ERROR_MESSAGES.GLOBAL.NOT_FOUND);
        break;
      default:
        notifyError(ERROR_MESSAGES.GLOBAL.DEFAULT);
        break;
    }
  }
}

// ========== Treatment ==========
export async function createTreatment(data) {
  try {
    const response = await apiClient.post(`/api/treatment`, data);

    notifySuccess(SUCCESS_MESSAGES.EVENT.CREATED);

    return response;
  } catch (error) {
    switch (error.status) {
      case 400:
        notifyError(ERROR_MESSAGES.EVENT.BAD_REQUEST);
        break;
      case 404:
        notifyError(ERROR_MESSAGES.GLOBAL.NOT_FOUND);
        break;
      default:
        notifyError(ERROR_MESSAGES.GLOBAL.DEFAULT);
        break;
    }
  }
}

export async function getTreatment(id) {
  try {
    return await apiClient.get(`/api/treatment/${id}`);
  } catch (error) {
    switch (error.status) {
      case 400:
        notifyError(ERROR_MESSAGES.EVENT.BAD_REQUEST);
        break;
      case 404:
        notifyError(ERROR_MESSAGES.GLOBAL.NOT_FOUND);
        break;
      default:
        notifyError(ERROR_MESSAGES.GLOBAL.DEFAULT);
        break;
    }
  }
}

export async function updateTreatment(id, data) {
  try {
    const response = await apiClient.put(`/api/treatment/${id}`, data);

    notifySuccess(SUCCESS_MESSAGES.EVENT.UPDATED);

    return response;
  } catch (error) {
    switch (error.status) {
      case 400:
        notifyError(ERROR_MESSAGES.EVENT.BAD_REQUEST);
        break;
      case 404:
        notifyError(ERROR_MESSAGES.GLOBAL.NOT_FOUND);
        break;
      default:
        notifyError(ERROR_MESSAGES.GLOBAL.DEFAULT);
        break;
    }
  }
}

export async function deleteTreatment(id) {
  try {
    const response = await apiClient.delete(`/api/treatment/${id}`);

    notifySuccess(SUCCESS_MESSAGES.EVENT.DELETED);

    return response;
  } catch (error) {
    switch (error.status) {
      case 400:
        notifyError(ERROR_MESSAGES.EVENT.BAD_REQUEST);
        break;
      case 404:
        notifyError(ERROR_MESSAGES.GLOBAL.NOT_FOUND);
        break;
      default:
        notifyError(ERROR_MESSAGES.GLOBAL.DEFAULT);
        break;
    }
  }
}

// TODO: Блок catch
// ========== Events Lists ==========
export async function getEvents(petId, statuses) {
  try {
    if (USE_MOCK_API) {
      return await mockGetEvents(petId, statuses);
    }

    let url = `/api/events/${petId}`;

    if (statuses && statuses.length > 0) {
      const queryParams = statuses.map(s => `status=${s}`).join('&');
      url += `?${queryParams}`;
    }

    const response = await apiClient.get(url);

    if (response.status === 404) {
      notifyError(ERROR_MESSAGES.EVENT.EVENTS_NOT_FOUND);
    }

    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function updateEventStatus(eventId, newStatus) {
  try {
    const response = await apiClient.patch(
      `/api/events/${eventId}/status`,
      { status: newStatus }
    );

    notifySuccess(SUCCESS_MESSAGES.EVENT.UPDATED);

    return response;
  } catch (error) {
    console.error(error);
  }
}
