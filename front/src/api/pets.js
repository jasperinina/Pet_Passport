import { ERROR_MESSAGES } from '../constants/config.js';
import NotificationService from '../services/notificationService.js';
import { apiClient } from './apiClient.js';
import { USE_MOCK_API, mockGetPet } from './mockApi.js';

export async function createPet(petData) {
  try {
    const response = await apiClient.post('/api/Pets', petData);
    
    NotificationService.showSuccess?.('Питомец успешно создан', 'Success!');
    
    return response;
  } catch (error) {
    NotificationService.showError?.('Ошибка создания питомца', 'Error :(');
    
    return null;
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
    if (error.status === 404) {
      NotificationService.showError?.(
        ERROR_MESSAGES.PET_NOT_FOUND,
        ERROR_MESSAGES.ERROR_TITLE
      );
    } else {
      NotificationService.showError?.(
        'При загрузке данных питомца произошла ошибка',
        ERROR_MESSAGES.ERROR_TITLE
      );
    }
    
    return null;
  }
}

export async function updatePet(id, petData) {
  try {
    const response = await apiClient.put(`/api/Pets/${id}`, petData);

    NotificationService.showSuccess?.('Данные питомца обновлены', 'Success!');

    return response;
  } catch (error) {
    if (error.status === 404) {
      NotificationService.showError?.(
        ERROR_MESSAGES.PET_NOT_FOUND,
        ERROR_MESSAGES.ERROR_TITLE
      );
    } else {
      NotificationService.showError?.(
        'При обновлении данных питомца произошла ошибка',
        ERROR_MESSAGES.ERROR_TITLE
      );
    }

    return null;
  }
}

export async function uploadPetPhoto(petId, file, telegramFileId = null) {
  if (!file) {
    NotificationService.showError?.(
      'Файл не указан',
      ERROR_MESSAGES.ERROR_TITLE
    );
  }

  if (!petId) {
    NotificationService.showError?.(
      'ID питомца не указан',
      ERROR_MESSAGES.ERROR_TITLE
    );
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const url =
      `/api/pets/${petId}/upload${telegramFileId ? `?telegramFileId=${encodeURIComponent(telegramFileId)}` : ''}`;
    
    const response = await apiClient.upload(url, formData);

    if (!response.photoUrl || !response.url) {
      NotificationService.showError?.(
        'Ответ сервера не содержит URL фотографии',
        ERROR_MESSAGES.ERROR_TITLE
      );

      return null;
    }

    if (!response.Id && !response.id) {
      NotificationService.showError?.(
        'Ответ сервера не содержит ID фотографии',
        ERROR_MESSAGES.ERROR_TITLE
      );

      return null;
    }

    return response;
  } catch (error) {
    if (error.status === 404) {
      NotificationService.showError?.(
        ERROR_MESSAGES.PET_NOT_FOUND,
        ERROR_MESSAGES.ERROR_TITLE
      );
    } else if (error.status === 400) {
      NotificationService.showError?.(
        'Превышен лимит фотографий (максимум 4)',
        ERROR_MESSAGES.ERROR_TITLE
      );
    } else {
      NotificationService.showError?.(
        'При загрузке фотографий произошла ошибка',
        ERROR_MESSAGES.ERROR_TITLE
      );
    }

    return null;
  }
}

export async function updatePetPhotos(petId, options = {}) {
  const { newFiles = [], deletePhotoIds = [] } = options;
  const formData = new FormData();

  newFiles.forEach(file => formData.append('newFiles', file));
  deletePhotoIds.forEach(id => formData.append('deletePhotoIds', id.toString()));

  try {
    const response = await apiClient.put(`/api/Pets/${petId}/photos`, formData);

    return response;
  } catch (error) {
    if (error.status === 404) {
      NotificationService.showError?.(
        ERROR_MESSAGES.PET_NOT_FOUND,
        ERROR_MESSAGES.ERROR_TITLE
      );
    } else if (error.status === 400) {
      NotificationService.showError?.(
        'При обновлении фотографии произошла ошибка',
        ERROR_MESSAGES.ERROR_TITLE
      );
    }

    return null;
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

    NotificationService.showSuccess?.(
      'Фотография успешно удалена',
      'Success!'
    );

    return response;
  } catch (error) {
    if (error.status === 404) {
      NotificationService.showError?.(
        'Питомец или фото не найдено',
        ERROR_MESSAGES.ERROR_TITLE
      );
    } else {
      NotificationService.showError?.(
        'При удалении фотографии произошла ошибка',
        ERROR_MESSAGES.ERROR_TITLE
      );
    }

    return null;
  }
}
