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

