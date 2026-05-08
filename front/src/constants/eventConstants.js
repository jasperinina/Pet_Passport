// Общие константы для событий (посещения врача, вакцинации, обработки)

export const PERIOD_UNITS = {
  DAY: 0,
  MONTH: 1,
  YEAR: 2,
};

export const PERIOD_OPTIONS = [
  { value: PERIOD_UNITS.DAY, label: "Раз в день" },
  { value: PERIOD_UNITS.MONTH, label: "Раз в месяц" },
  { value: PERIOD_UNITS.YEAR, label: "Раз в год" },
];

export const REMINDER_OPTIONS = [
  { value: 1, unit: PERIOD_UNITS.DAY, label: "1 день" },
  { value: 1, unit: PERIOD_UNITS.MONTH, label: "1 месяц" },
  { value: 1, unit: PERIOD_UNITS.YEAR, label: "1 год" },
];

export const EVENT_TYPES = {
  DOCTOR_VISIT: "doctor-visit",
  VACCINE: "vaccine",
  TREATMENT: "treatment",
};

export const EVENT_STATUSES = {
  INDEFINITE: 0,
  UPCOMING: 1,
  COMPLETED: 2,
  CANCELLED: 3
};

export const PAST_EVENT_STATUS_OPTIONS = [
  { value: EVENT_STATUSES.INDEFINITE, label: "Неопределено" },
  { value: EVENT_STATUSES.COMPLETED, label: "Выполнено" },
  { value: EVENT_STATUSES.CANCELLED, label: "Отменено" },
];
