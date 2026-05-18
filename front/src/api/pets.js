import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/config.js';
import { notifyError, notifySuccess } from '../services/notificationService.js';
import { apiClient } from './apiClient.js';
import { USE_MOCK_API, mockGetPet } from './mockApi.js';
import API_BASE_URL from './config.js';
import { getAccessToken } from './tokenStorage.js';

const appendIfPresent = (formData, key, value) => {
  if (value !== undefined && value !== null && value !== '') {
    formData.append(key, value);
  }
};

const buildPetCreateFormData = (petData) => {
  const formData = new FormData();

  appendIfPresent(formData, 'name', petData.name);
  appendIfPresent(formData, 'species', petData.species);
  appendIfPresent(formData, 'gender', petData.gender);
  appendIfPresent(formData, 'breed', petData.breed);
  appendIfPresent(formData, 'color', petData.color);
  appendIfPresent(formData, 'microchipNumber', petData.microchipNumber);
  appendIfPresent(formData, 'weightKg', petData.weightKg);
  appendIfPresent(formData, 'birthDate', petData.birthDate);
  appendIfPresent(formData, 'isNeutered', petData.isNeutered);
  appendIfPresent(formData, 'allergies', petData.allergies);
  appendIfPresent(formData, 'chronicConditions', petData.chronicConditions);
  appendIfPresent(formData, 'bloodType', petData.bloodType);

  petData.photos?.forEach((photo) => {
    formData.append('photos', photo);
  });

  return formData;
};

export async function createPet(petData) {
  try {
    const response = await apiClient.post('/api/v2/pets', buildPetCreateFormData(petData));
    
    notifySuccess(SUCCESS_MESSAGES.PET.CREATED);
    
    return response;
  } catch (error) {
    let message = ERROR_MESSAGES.GLOBAL.DEFAULT;

    switch (error.status) {
      case 400:
        message = ERROR_MESSAGES.PET.BAD_REQUEST;
        break;
      default:
        break;
    }

    notifyError(message);
    throw new Error(message);
  }
}

export async function getPet(id) {
  try {
    if (USE_MOCK_API) {
      return await mockGetPet(id);
    }

    const response = await apiClient.get(`/api/v2/pets/${id}`);
    
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
    if (USE_MOCK_API) {
      notifySuccess(SUCCESS_MESSAGES.PET.UPDATED);
      return null;
    }

    const response = await apiClient.put(`/api/v2/pets/${id}`, petData);

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

export async function deletePet(id) {
  try {
    if (USE_MOCK_API) {
      notifySuccess(SUCCESS_MESSAGES.PET.DELETED);
      return null;
    }

    const response = await apiClient.delete(`/api/v2/pets/${id}`);

    notifySuccess(SUCCESS_MESSAGES.PET.DELETED);

    return response;
  } catch (error) {
    switch (error.status) {
      case 404:
        notifyError(ERROR_MESSAGES.PET.NOT_FOUND);
        break;
      default:
        notifyError(ERROR_MESSAGES.PET.NO_DELETED);
        break;
    }

    throw error;
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
    if (USE_MOCK_API) {
      notifySuccess(SUCCESS_MESSAGES.PET.UPDATED);
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);

    const url =
      `/api/v2/pets/${petId}/upload${telegramFileId ? `?telegramFileId=${encodeURIComponent(telegramFileId)}` : ''}`;
    
    const response = await apiClient.upload(url, formData);
    
    if (!response) return null;

    if (!response.photoUrl && !response.url) {
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
    const response = await apiClient.put(`/api/v2/pets/${petId}/photos`, formData);

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

export async function downloadPetPassportPdf(petId, sections = {}, petName = 'pet') {
  const { includeVaccines = false, includeTreatments = false, includeVisits = false } = sections;

  const params = new URLSearchParams({ includeVaccines, includeTreatments, includeVisits });
  const token = getAccessToken();

  const response = await fetch(
    `${API_BASE_URL}/api/v2/pets/${petId}/passport/pdf?${params}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.ok) {
    throw new Error('PDF generation failed');
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `passport-${petName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function deletePetPhoto(petId, photoId) {
  try {
    if (USE_MOCK_API) {
      notifySuccess(SUCCESS_MESSAGES.FILE.DELETED);
      return null;
    }

    const response = await apiClient.delete(`/api/v2/pets/${petId}/photos/${photoId}`);

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
