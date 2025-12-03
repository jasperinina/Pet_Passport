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
}/**
 * Загрузка фотографии питомца
 * @param {number} petId - ID питомца
 * @param {File} file - Файл изображения
 * @param {string} [telegramFileId] - ID файла в Telegram (опционально)
 * @returns {Promise<Object>} URL загруженной фотографии и её ID
 */
export async function uploadPetPhoto(petId, file, telegramFileId = null) {
  if (!file) {
    throw new Error('Файл не указан');
  }

  if (!petId) {
    throw new Error('ID питомца не указан');
  }

  const formData = new FormData();
  formData.append('file', file);

  const url = `${API_BASE_URL}/api/pets/${petId}/upload${telegramFileId ? `?telegramFileId=${encodeURIComponent(telegramFileId)}` : ''}`;
  
  console.log('Загрузка фото:', {
    url,
    petId,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  });
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      // НЕ устанавливаем Content-Type - браузер сам установит с boundary для FormData
      body: formData,
    });

    console.log('Ответ сервера:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      let errorMessage = `Ошибка загрузки фотографии: ${response.status}`;
      
      try {
        const errorText = await response.text();
        console.error('Текст ошибки от сервера:', errorText);
        if (errorText) {
          errorMessage = errorText;
        }
      } catch (e) {
        console.error('Ошибка при чтении текста ошибки:', e);
        // Если не удалось прочитать текст ошибки, используем дефолтное сообщение
      }

      if (response.status === 404) {
        throw new Error('Питомец не найден');
      }
      if (response.status === 400) {
        throw new Error(errorMessage || 'Превышен лимит фотографий (максимум 4)');
      }
      
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    console.log('Content-Type ответа:', contentType);
    
    // Пытаемся прочитать как JSON
    let result;
    try {
      const text = await response.text();
      console.log('Результат загрузки (текст):', text);
      
      if (text) {
        result = JSON.parse(text);
        console.log('Результат загрузки (JSON):', result);
      } else {
        throw new Error('Пустой ответ от сервера');
      }
    } catch (parseError) {
      console.error('Ошибка парсинга JSON:', parseError);
      throw new Error('Не удалось прочитать ответ от сервера');
    }
    
    // Бекенд возвращает { photoUrl, Id } - проверяем оба варианта
    if (!result.photoUrl && !result.url) {
      throw new Error('Ответ сервера не содержит URL фотографии');
    }
    
    if (!result.Id && !result.id) {
      throw new Error('Ответ сервера не содержит ID фотографии');
    }
    
    return result;
  } catch (error) {
    console.error('Ошибка при загрузке фото:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Ошибка сети. Проверьте подключение к серверу.');
    }
    throw error;
  }
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

/**
 * Удаление фотографии питомца
 * @param {number} petId - ID питомца
 * @param {number} photoId - ID фотографии
 * @returns {Promise<Object>} Результат удаления
 */
export async function deletePetPhoto(petId, photoId) {
  // Метод на бекенде: [HttpDelete("{petId}/photos/{photoId}")]
  // Если контроллер имеет [Route("api/pets")], то путь будет /api/pets/{petId}/photos/{photoId}
  // Но возможно контроллер имеет другой базовый маршрут или метод в другом контроллере
  
  const url = `${API_BASE_URL}/api/pets/${petId}/photos/${photoId}`;
  
  console.log('Удаление фото:', {
    url,
    petId,
    photoId,
    photoIdType: typeof photoId,
  });

  const response = await fetch(url, {
    method: 'DELETE',
    // Для DELETE запросов обычно не нужен Content-Type, если нет тела
  });

  console.log('Ответ при удалении фото:', {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
  });

  if (!response.ok) {
    let errorText = '';
    try {
      errorText = await response.text();
      console.error('Текст ошибки при удалении:', errorText);
    } catch (e) {
      console.error('Ошибка при чтении текста ошибки:', e);
    }

    if (response.status === 404) {
      throw new Error(errorText || 'Питомец или фото не найдено');
    }
    throw new Error(errorText || `Ошибка удаления фотографии: ${response.status}`);
  }

  // DELETE может вернуть NoContent (204) или Ok с сообщением
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const text = await response.text();
    if (text) {
      return JSON.parse(text);
    }
  }
  return { message: 'Фотография успешно удалена' };
}
