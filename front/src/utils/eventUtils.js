import { EVENT_STATUSES, EVENT_TYPES } from "../constants/eventConstants";

const EVENT_TYPE_NAMES = {
  [EVENT_TYPES.DOCTOR_VISIT]: "Прием",
  [EVENT_TYPES.VACCINE]: "Вакцинация",
  [EVENT_TYPES.TREATMENT]: "Обработка",
};

export const getEventTypeName = (type) => {
  return EVENT_TYPE_NAMES[type] || "Процедура";
};

const EVENT_STATUS_META = {
  [EVENT_STATUSES.INDEFINITE]: {
    label: "Неопределено",
    variant: "indefinite",
  },
  [EVENT_STATUSES.UPCOMING]: {
    label: "Предстоящее",
    variant: "upcoming",
  },
  [EVENT_STATUSES.COMPLETED]: {
    label: "Выполнено",
    variant: "completed",
  },
  [EVENT_STATUSES.CANCELLED]: {
    label: "Отменено",
    variant: "cancelled",
  },
};

export const getEventStatusMeta = (status) => {
  return EVENT_STATUS_META[Number(status)] || null;
};

export const getEventPath = (type, eventId, search = "") => {
  const paths = {
    [EVENT_TYPES.DOCTOR_VISIT]: `/doctor-visit/${eventId}${search}`,
    [EVENT_TYPES.VACCINE]: `/vaccine/${eventId}${search}`,
    [EVENT_TYPES.TREATMENT]: `/treatment/${eventId}${search}`,
  };
  return paths[type] || null;
};
