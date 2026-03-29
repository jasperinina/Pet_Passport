import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/config.js';
import NotificationService, { notifyError, notifySuccess } from '../services/notificationService.js';
import { apiClient } from './apiClient.js';
import { USE_MOCK_API, mockGetPet } from './mockApi.js';

export async function createPet(petData) {
  try {
    const response = await apiClient.post('/api/Pets', petData);
    
    notifySuccess(SUCCESS_MESSAGES.PET.CREATED);
    
    return response;
  } catch (error) {
    switch (error.status) {
      case 400:
        notifyError(ERROR_MESSAGES.PET.BAD_REQUEST);
        break;
      default:
        notifyError(ERROR_MESSAGES.GLOBAL.DEFAULT);
        break;
    }
  }
}

export async function getPet(id) {
  try {
    if (USE_MOCK_API) {
      return await mockGetPet(id);
    }

    const response = await apiClient.get(`/api/Pets/${id}`);
    
    return response;
  } catch (error) {
    switch (error.status) {
      case 400:
        notifyError(ERROR_MESSAGES.PET.BAD_REQUEST);
        break;
      case 404:
        notifyError(ERROR_MESSAGES.PET.NOT_FOUND);
        break;
      default:
        notifyError(ERROR_MESSAGES.PET.NO_GET);
        break;
    }
  }
}

export async function updatePet(id, petData) {
  try {
    const response = await apiClient.put(`/api/Pets/${id}`, petData);

    notifySuccess(SUCCESS_MESSAGES.PET.UPDATED);

    return response;
  } catch (error) {
    switch (error.status) {
      case 400:
        notifyError(ERROR_MESSAGES.PET.BAD_REQUEST);
        break;
      case 404:
        notifyError(ERROR_MESSAGES.PET.NOT_FOUND);
        break;
      default:
        notifyError(ERROR_MESSAGES.PET.NO_UPDATED);
        break;
    }
  }
}

export async function uploadPetPhoto(petId, file, telegramFileId = null) {
  if (!file) {
    notifyError(ERROR_MESSAGES.FILE.NO_SPECIFIED);
  }

  if (!petId) {
    notifyError(ERROR_MESSAGES.PET.NO_ID);
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const url =
      `/api/pets/${petId}/upload${telegramFileId ? `?telegramFileId=${encodeURIComponent(telegramFileId)}` : ''}`;
    
    const response = await apiClient.upload(url, formData);
    
    if (!response.photoUrl || !response.url) {
      notifyError(ERROR_MESSAGES.FILE.RESPONSE_NO_CONTAINS_URL);
      return null;
    }

    if (!response.Id && !response.id) {
      notifyError(ERROR_MESSAGES.FILE.RESPONSE_NO_CONTAINS_ID);
      return null;
    }

    return response;
  } catch (error) {
    switch (error.status) {
      case 400:
        notifyError(ERROR_MESSAGES.FILE.LIMIT_EXCEEDED);
        break;
      case 404:
        notifyError(ERROR_MESSAGES.PET.NOT_FOUND);
        break;
      default:
        notifyError(ERROR_MESSAGES.FILE.DEFAULT);
        break;
    }
  }
}

export async function updatePetPhotos(petId, options = {}) {
  const { newFiles = [], deletePhotoIds = [] } = options;
  const formData = new FormData();

  newFiles.forEach(file => formData.append('newFiles', file));
  deletePhotoIds.forEach(id => formData.append('deletePhotoIds', id.toString()));

  try {
    const response = await apiClient.put(`/api/Pets/${petId}/photos`, formData);

    notifySuccess(SUCCESS_MESSAGES.FILE.UPDATED);

    return response;
  } catch (error) {
    switch (error.status) {
      case 400:
        notifyError(ERROR_MESSAGES.FILE.NO_UPDATED);
        break;
      case 404:
        notifyError(ERROR_MESSAGES.PET.NOT_FOUND);
        break;
      default:
        notifyError(ERROR_MESSAGES.FILE.DEFAULT);
        break;
    }
  }
}

export async function deletePetPhoto(petId, photoId) {
  try {
    const response = await apiClient.delete(`/api/Pets/${petId}/photos/${photoId}`);

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const text = await response.text();
      if (text) return JSON.parse(text);
    }

    notifySuccess(SUCCESS_MESSAGES.FILE.DELETED);

    return response;
  } catch (error) {
    switch (error.status) {
      case 404:
        notifyError(ERROR_MESSAGES.FILE.NOT_FOUND);
        break;
      default:
        notifyError(ERROR_MESSAGES.FILE.NO_DELETED);
        break;
    }
  }
}
