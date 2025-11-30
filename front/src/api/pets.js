import API_BASE_URL from './config.js';
import { USE_MOCK_API, mockGetPet } from './mockApi.js';

/**
 * Создание нового питомца
 * @param {Object} petData - Данные питомца
 * @param {string} petData.name - Имя питомца (обязательно)
 * @param {string} [petData.breed] - Порода
 * @param {number} [petData.weightKg] - Вес в кг
 * @param {string} [petData.birthDate] - Дата рождения (формат: YYYY-MM-DD)
 * @param {number} petData.ownerId - ID владельца (обязательно)
 * @returns {Promise<number>} ID созданного питомца
 */
export async function createPet(petData) {
  const response = await fetch(`${API_BASE_URL}/api/pets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(petData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка создания питомца: ${response.status}`);
  }

  const petId = await response.json();
  return petId;
}

/**
 * Получение информации о питомце по ID
 * @param {number} id - ID питомца
 * @returns {Promise<Object>} Данные питомца
 */
export async function getPet(id) {
  // Используем моковые данные, если включен режим моков
  if (USE_MOCK_API) {
    return await mockGetPet(id);
  }

  const response = await fetch(`${API_BASE_URL}/api/pets/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Питомец не найден');
    }
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка получения питомца: ${response.status}`);
  }

  const pet = await response.json();
  return pet;
}

/**
 * Обновление информации о питомце
 * @param {number} id - ID питомца
 * @param {Object} petData - Данные для обновления (все поля опциональны)
 * @param {string} [petData.name] - Имя питомца
 * @param {string} [petData.breed] - Порода
 * @param {number} [petData.weightKg] - Вес в кг
 * @param {string} [petData.birthDate] - Дата рождения (формат: YYYY-MM-DD)
 * @returns {Promise<Object>} Результат обновления
 */
export async function updatePet(id, petData) {
  const response = await fetch(`${API_BASE_URL}/api/pets/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(petData),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Питомец не найден');
    }
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка обновления питомца: ${response.status}`);
  }

  const result = await response.json();
  return result;
}

/**
 * Загрузка фотографии питомца
 * @param {number} petId - ID питомца
 * @param {File} file - Файл изображения
 * @param {string} [telegramFileId] - ID файла в Telegram (опционально)
 * @returns {Promise<Object>} URL загруженной фотографии и её ID
 */
export async function uploadPetPhoto(petId, file, telegramFileId = null) {
  const formData = new FormData();
  formData.append('file', file);

  const url = `${API_BASE_URL}/api/pets/${petId}/upload${telegramFileId ? `?telegramFileId=${encodeURIComponent(telegramFileId)}` : ''}`;
  
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Питомец не найден');
    }
    if (response.status === 400) {
      const errorText = await response.text();
      throw new Error(errorText || 'Превышен лимит фотографий (максимум 4)');
    }
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка загрузки фотографии: ${response.status}`);
  }

  const result = await response.json();
  return result;
}

/**
 * Обновление фотографий питомца (добавление новых и удаление старых)
 * @param {number} petId - ID питомца
 * @param {Object} options - Параметры обновления
 * @param {File[]} [options.newFiles] - Массив новых файлов для загрузки
 * @param {number[]} [options.deletePhotoIds] - Массив ID фотографий для удаления
 * @returns {Promise<Object>} Результат обновления
 */
export async function updatePetPhotos(petId, options = {}) {
  const { newFiles = [], deletePhotoIds = [] } = options;

  const formData = new FormData();

  // Добавляем новые файлы
  if (newFiles && newFiles.length > 0) {
    newFiles.forEach((file) => {
      formData.append('newFiles', file);
    });
  }

  // Добавляем ID фотографий для удаления
  if (deletePhotoIds && deletePhotoIds.length > 0) {
    deletePhotoIds.forEach((id) => {
      formData.append('deletePhotoIds', id.toString());
    });
  }

  const response = await fetch(`${API_BASE_URL}/api/pets/${petId}/photos`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Питомец не найден');
    }
    if (response.status === 400) {
      const errorText = await response.text();
      throw new Error(errorText || 'Ошибка обновления фотографий');
    }
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка обновления фотографий: ${response.status}`);
  }

  const result = await response.json();
  return result;
}

