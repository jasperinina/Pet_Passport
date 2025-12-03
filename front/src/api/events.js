import API_BASE_URL from './config.js';

/**
 * Создание посещения врача
 * @param {Object} data - Данные посещения
 * @returns {Promise<number>} ID созданного события
 */
export async function createDoctorVisit(data) {
  const response = await fetch(`${API_BASE_URL}/api/doctor-visit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка создания посещения: ${response.status}`);
  }

  const eventId = await response.json();
  return eventId;
}

/**
 * Создание вакцинации
 * @param {Object} data - Данные вакцинации
 * @returns {Promise<number>} ID созданного события
 */
export async function createVaccine(data) {
  const response = await fetch(`${API_BASE_URL}/api/vaccine`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка создания вакцинации: ${response.status}`);
  }

  const eventId = await response.json();
  return eventId;
}

/**
 * Создание обработки
 * @param {Object} data - Данные обработки
 * @returns {Promise<number>} ID созданного события
 */
export async function createTreatment(data) {
  const response = await fetch(`${API_BASE_URL}/api/treatment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка создания обработки: ${response.status}`);
  }

  const eventId = await response.json();
  return eventId;
}

/**
 * Получение предстоящих процедур для питомца
 * @param {number} petId - ID питомца
 * @returns {Promise<Array>} Массив предстоящих событий
 */
export async function getUpcomingEvents(petId) {
  const response = await fetch(`${API_BASE_URL}/api/events/upcoming/${petId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // Если эндпоинт не найден (404), возвращаем пустой массив
    // Это позволит приложению работать, пока контроллер не создан на бекенде
    if (response.status === 404) {
      console.warn('Эндпоинт для получения процедур не найден. Убедитесь, что контроллер EventsController создан на бекенде.');
      return [];
    }
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка получения процедур: ${response.status}`);
  }

  const events = await response.json();
  return events;
}

/**
 * Получение прошедших процедур для питомца
 * @param {number} petId - ID питомца
 * @returns {Promise<Array>} Массив прошедших событий
 */
export async function getPastEvents(petId) {
  const response = await fetch(`${API_BASE_URL}/api/events/past/${petId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // Если эндпоинт не найден (404), возвращаем пустой массив
    if (response.status === 404) {
      console.warn('Эндпоинт для получения истории не найден. Убедитесь, что контроллер EventsController создан на бекенде.');
      return [];
    }
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка получения истории: ${response.status}`);
  }

  const events = await response.json();
  return events;
}

/**
 * Удаление визита к врачу
 * @param {number} id - ID события (визита)
 * @returns {Promise<void>}
 */
export async function deleteDoctorVisit(id) {
  const response = await fetch(`${API_BASE_URL}/api/doctor-visit/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка удаления визита: ${response.status}`);
  }
  
  // DELETE может вернуть NoContent (204) без тела ответа
  // Проверяем, есть ли контент для парсинга
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const text = await response.text();
    if (text) {
      return JSON.parse(text);
    }
  }
  return;
}

/**
 * Обновление визита к врачу
 * @param {number} id - ID события (визита)
 * @param {Object} data - Обновленные данные визита
 * @returns {Promise<Object>} Обновлённый визит
 */
export async function updateDoctorVisit(id, data) {
  const response = await fetch(`${API_BASE_URL}/api/doctor-visit/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка обновления визита: ${response.status}`);
  }

  // Если ответ пустой (NoContent), возвращаем пустой объект
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const text = await response.text();
    if (text) {
      return JSON.parse(text);
    }
  }
  return {};
}
/**
 * Получение одного визита к врачу по ID
 * @param {number|string} id - ID визита к врачу
 * @returns {Promise<Object>} Визит к врачу
 */
export async function getDoctorVisit(id) {
  const response = await fetch(`${API_BASE_URL}/api/doctor-visit/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка получения визита: ${response.status}`);
  }

  const visit = await response.json();
  return visit;
}

/**
 * Получение всех визитов к врачу по питомцу
 * @param {number|string} petId - ID питомца
 * @returns {Promise<Array>} Массив визитов к врачу
 */
export async function getDoctorVisits(petId) {
  const response = await fetch(`${API_BASE_URL}/api/doctor-visit?petId=${petId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка получения визитов: ${response.status}`);
  }

  const visits = await response.json();
  return visits;
}

/**
 * Получение одной вакцинации по ID
 * @param {number|string} id - ID вакцинации
 * @returns {Promise<Object>} Вакцинация
 */
export async function getVaccine(id) {
  const response = await fetch(`${API_BASE_URL}/api/vaccine/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка получения вакцинации: ${response.status}`);
  }

  const vaccine = await response.json();
  return vaccine;
}

/**
 * Обновление вакцинации
 * @param {number} id - ID вакцинации
 * @param {Object} data - Обновленные данные вакцинации
 * @returns {Promise<Object>} Обновлённая вакцинация
 */
export async function updateVaccine(id, data) {
  const response = await fetch(`${API_BASE_URL}/api/vaccine/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка обновления вакцинации: ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const text = await response.text();
    if (text) {
      return JSON.parse(text);
    }
  }
  return {};
}

/**
 * Удаление вакцинации
 * @param {number} id - ID вакцинации
 * @returns {Promise<void>}
 */
export async function deleteVaccine(id) {
  const response = await fetch(`${API_BASE_URL}/api/vaccine/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка удаления вакцинации: ${response.status}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const text = await response.text();
    if (text) {
      return JSON.parse(text);
    }
  }
  return;
}

/**
 * Получение одной обработки по ID
 * @param {number|string} id - ID обработки
 * @returns {Promise<Object>} Обработка
 */
export async function getTreatment(id) {
  const response = await fetch(`${API_BASE_URL}/api/treatment/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка получения обработки: ${response.status}`);
  }

  const treatment = await response.json();
  return treatment;
}

/**
 * Обновление обработки
 * @param {number} id - ID обработки
 * @param {Object} data - Обновленные данные обработки
 * @returns {Promise<Object>} Обновлённая обработка
 */
export async function updateTreatment(id, data) {
  const response = await fetch(`${API_BASE_URL}/api/treatment/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка обновления обработки: ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const text = await response.text();
    if (text) {
      return JSON.parse(text);
    }
  }
  return {};
}

/**
 * Удаление обработки
 * @param {number} id - ID обработки
 * @returns {Promise<void>}
 */
export async function deleteTreatment(id) {
  const response = await fetch(`${API_BASE_URL}/api/treatment/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Ошибка удаления обработки: ${response.status}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const text = await response.text();
    if (text) {
      return JSON.parse(text);
    }
  }
  return;
}




