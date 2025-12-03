import { EVENT_TYPES } from "../constants/eventConstants";

const EVENT_TYPE_NAMES = {
  [EVENT_TYPES.DOCTOR_VISIT]: "Прием",
  [EVENT_TYPES.VACCINE]: "Вакцинация",
  [EVENT_TYPES.TREATMENT]: "Обработка",
};

export const getEventTypeName = (type) => {
  return EVENT_TYPE_NAMES[type] || "Процедура";
};

export const getEventPath = (type, eventId, search = "") => {
  const paths = {
    [EVENT_TYPES.DOCTOR_VISIT]: `/doctor-visit/${eventId}${search}`,
    [EVENT_TYPES.VACCINE]: `/vaccine/${eventId}${search}`,
    [EVENT_TYPES.TREATMENT]: `/treatment/${eventId}${search}`,
  };
  return paths[type] || null;
};

