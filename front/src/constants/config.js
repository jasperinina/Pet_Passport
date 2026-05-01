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

export const NOTIFICATION_TYPES = {
  ERROR: 'error',
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info'
};

export const NOTIFICATION_TITLES = {
  ERROR: 'Error :(',
  SUCCESS: 'Success!',
  WARNING: 'Warning',
  INFO: 'Info'
};

export const ERROR_MESSAGES = {
  PET: {
    BAD_REQUEST: 'Данные в запросе некорректны',
    NOT_FOUND: 'Питомец не найден',
    NO_GET: 'При попытке загрузить данные питомца произошла ошибка',
    NO_UPDATED: 'При попытке обновить данные питомца произошла ошибка',
    NO_DELETED: 'При попытке удалить питомца произошла ошибка',
    NO_ID: 'ID питомца не указан в URL'
  },
  FILE: {
    NOT_FOUND: 'Питомец или фотография не найдены',
    NO_SPECIFIED: 'Файл не указан',
    NO_UPDATED: 'При попытке обновить фотографии произошла ошибка',
    NO_DELETED: 'При попытке удалить фотографию произошла ошибка',
    RESPONSE_NO_CONTAINS_ID: 'Ответ сервера не содержит ID фотографии',
    RESPONSE_NO_CONTAINS_URL: 'Ответ сервера не содержит URL фотографии',
    TOO_LARGE: `Размер файла не должен превышать ${FILE_UPLOAD.MAX_SIZE / 1024 / 1024} МБ`,
    INVALID_TYPE: 'Выберите файл изображения',
    LIMIT_EXCEEDED: 'Превышен лимит фотографий (максимум 4)',
    DEFAULT: 'При попытке загрузить фотографии произошла ошибка'
  },
  EVENT: {
    BAD_REQUEST: 'Данные в запросе некорректны',
    EVENTS_NOT_FOUND: 'Процедуры не найдены'
  },
  GLOBAL: {
    DEFAULT: 'Произошла ошибка. Попробуйте позже',
    NETWORK: 'Ошибка сети. Проверьте подключение к серверу',
    NOT_FOUND: 'Запрашиваемый ресурс не найден'
  }
};

export const SUCCESS_MESSAGES = {
  PET: {
    CREATED: 'Питомец успешно создан',
    UPDATED: 'Данные питомца успешно обновлены',
    DELETED: 'Питомец успешно удален'
  },
  FILE: {
    UPDATED: 'Фотографии успешно обновлены',
    DELETED: "Фотография успешно удалена"
  },
  EVENT: {
    CREATED: 'Событие успешно добавлено',
    UPDATED: 'Детали события успешно обновлены',
    DELETED: 'Событие было успешно удалено'
  }
};
