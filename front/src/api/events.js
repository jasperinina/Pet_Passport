import API_BASE_URL from './config.js';

const handleResponse = async (response, errorPrefix) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `${errorPrefix}: ${response.status}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }
  return {};
};

// ========== Doctor Visit ==========
export async function createDoctorVisit(data) {
  const response = await fetch(`${API_BASE_URL}/api/doctor-visit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await handleResponse(response, 'Ошибка создания посещения');
}

export async function getDoctorVisit(id) {
  const response = await fetch(`${API_BASE_URL}/api/doctor-visit/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return await handleResponse(response, 'Ошибка получения посещения');
}

export async function updateDoctorVisit(id, data) {
  const response = await fetch(`${API_BASE_URL}/api/doctor-visit/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await handleResponse(response, 'Ошибка обновления посещения');
}

export async function deleteDoctorVisit(id) {
  const response = await fetch(`${API_BASE_URL}/api/doctor-visit/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  return await handleResponse(response, 'Ошибка удаления посещения');
}

// ========== Vaccine ==========
export async function createVaccine(data) {
  const response = await fetch(`${API_BASE_URL}/api/vaccine`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await handleResponse(response, 'Ошибка создания вакцинации');
}

export async function getVaccine(id) {
  const response = await fetch(`${API_BASE_URL}/api/vaccine/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return await handleResponse(response, 'Ошибка получения вакцинации');
}

export async function updateVaccine(id, data) {
  const response = await fetch(`${API_BASE_URL}/api/vaccine/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await handleResponse(response, 'Ошибка обновления вакцинации');
}

export async function deleteVaccine(id) {
  const response = await fetch(`${API_BASE_URL}/api/vaccine/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  return await handleResponse(response, 'Ошибка удаления вакцинации');
}

// ========== Treatment ==========
export async function createTreatment(data) {
  const response = await fetch(`${API_BASE_URL}/api/treatment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await handleResponse(response, 'Ошибка создания обработки');
}

export async function getTreatment(id) {
  const response = await fetch(`${API_BASE_URL}/api/treatment/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return await handleResponse(response, 'Ошибка получения обработки');
}

export async function updateTreatment(id, data) {
  const response = await fetch(`${API_BASE_URL}/api/treatment/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await handleResponse(response, 'Ошибка обновления обработки');
}

export async function deleteTreatment(id) {
  const response = await fetch(`${API_BASE_URL}/api/treatment/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  return await handleResponse(response, 'Ошибка удаления обработки');
}

// ========== Events Lists ==========
export async function getUpcomingEvents(petId) {
  const response = await fetch(`${API_BASE_URL}/api/events/upcoming/${petId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  // Возвращаем пустой массив, если эндпоинт не найден
  if (response.status === 404) {
    console.warn('Эндпоинт для получения процедур не найден.');
    return [];
  }

  return await handleResponse(response, 'Ошибка получения процедур');
}

export async function getPastEvents(petId) {
  const response = await fetch(`${API_BASE_URL}/api/events/past/${petId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  // Возвращаем пустой массив, если эндпоинт не найден
  if (response.status === 404) {
    console.warn('Эндпоинт для получения истории не найден.');
    return [];
  }

  return await handleResponse(response, 'Ошибка получения истории');
}
