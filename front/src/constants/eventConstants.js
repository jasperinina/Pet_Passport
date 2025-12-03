// Общие константы для событий (посещения врача, вакцинации, обработки)

export const PERIOD_UNITS = {
  MINUTE: 0,
  HOUR: 1,
  DAY: 2,
  WEEK: 3,
  MONTH: 4,
  YEAR: 5,
};

export const PERIOD_OPTIONS = [
  { value: PERIOD_UNITS.DAY, label: "Раз в день" },
  { value: PERIOD_UNITS.WEEK, label: "Раз в неделю" },
  { value: PERIOD_UNITS.MONTH, label: "Раз в месяц" },
  { value: PERIOD_UNITS.YEAR, label: "Раз в год" },
];

export const REMINDER_OPTIONS = [
  { value: 5, unit: PERIOD_UNITS.MINUTE, label: "5 минут" },
  { value: 1, unit: PERIOD_UNITS.HOUR, label: "1 час" },
  { value: 1, unit: PERIOD_UNITS.DAY, label: "1 день" },
];

export const EVENT_TYPES = {
  DOCTOR_VISIT: "doctor-visit",
  VACCINE: "vaccine",
  TREATMENT: "treatment",
};

