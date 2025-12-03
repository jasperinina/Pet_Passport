export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10 MB
  MAX_PHOTOS: 4,
  ACCEPTED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
};

export const UI = {
  UPCOMING_EVENTS_LIMIT: 3,
  DEBOUNCE_DELAY: 300,
};

export const ROUTES = {
  HOME: '/',
  UPCOMING: '/upcoming',
  HISTORY: '/history',
  DOCTOR_VISIT: (id) => `/doctor-visit/${id}`,
  VACCINE: (id) => `/vaccine/${id}`,
  TREATMENT: (id) => `/treatment/${id}`,
};

export const ERROR_MESSAGES = {
  PET_NOT_FOUND: 'Питомец не найден',
  NO_PET_ID: 'ID питомца не указан в URL',
  FILE_TOO_LARGE: `Размер файла не должен превышать ${FILE_UPLOAD.MAX_SIZE / 1024 / 1024} МБ`,
  INVALID_FILE_TYPE: 'Выберите файл изображения',
  NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к серверу.',
  GENERIC_ERROR: 'Произошла ошибка. Попробуйте позже.',
};

