import API_BASE_URL from './config.js';
import { USE_MOCK_API, mockGetPet } from './mockApi.js';

export async function createPet(petData) {
  const response = await fetch(`${API_BASE_URL}/api/pets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(petData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка создания питомца: ${response.status}`);
  }

  return await response.json();
}

export async function getPet(id) {
  if (USE_MOCK_API) {
    return await mockGetPet(id);
  }

  const response = await fetch(`${API_BASE_URL}/api/pets/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Питомец не найден');
    }
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка получения питомца: ${response.status}`);
  }

  return await response.json();
}

export async function updatePet(id, petData) {
  const response = await fetch(`${API_BASE_URL}/api/pets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(petData),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Питомец не найден');
    }
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка обновления питомца: ${response.status}`);
  }

  return await response.json();
}

export async function uploadPetPhoto(petId, file, telegramFileId = null) {
  if (!file) throw new Error('Файл не указан');
  if (!petId) throw new Error('ID питомца не указан');

  const formData = new FormData();
  formData.append('file', file);

  const url = `${API_BASE_URL}/api/pets/${petId}/upload${
    telegramFileId ? `?telegramFileId=${encodeURIComponent(telegramFileId)}` : ''
  }`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    
    if (response.status === 404) throw new Error('Питомец не найден');
    if (response.status === 400) throw new Error(errorText || 'Превышен лимит фотографий (максимум 4)');
    
    throw new Error(errorText || `Ошибка загрузки фотографии: ${response.status}`);
  }

  const text = await response.text();
  if (!text) throw new Error('Пустой ответ от сервера');

  const result = JSON.parse(text);
  
  if (!result.photoUrl && !result.url) {
    throw new Error('Ответ сервера не содержит URL фотографии');
  }
  if (!result.Id && !result.id) {
    throw new Error('Ответ сервера не содержит ID фотографии');
  }

  return result;
}

export async function updatePetPhotos(petId, options = {}) {
  const { newFiles = [], deletePhotoIds = [] } = options;
  const formData = new FormData();

  newFiles.forEach(file => formData.append('newFiles', file));
  deletePhotoIds.forEach(id => formData.append('deletePhotoIds', id.toString()));

  const response = await fetch(`${API_BASE_URL}/api/pets/${petId}/photos`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    
    if (response.status === 404) throw new Error('Питомец не найден');
    if (response.status === 400) throw new Error(errorText || 'Ошибка обновления фотографий');
    
    throw new Error(errorText || `Ошибка обновления фотографий: ${response.status}`);
  }

  return await response.json();
}

export async function deletePetPhoto(petId, photoId) {
  const response = await fetch(`${API_BASE_URL}/api/pets/${petId}/photos/${photoId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 404) {
      throw new Error(errorText || 'Питомец или фото не найдено');
    }
    throw new Error(errorText || `Ошибка удаления фотографии: ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    const text = await response.text();
    if (text) return JSON.parse(text);
  }
  
  return { message: 'Фотография успешно удалена' };
}
