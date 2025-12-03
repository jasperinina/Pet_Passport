export const formatDate = (dateString) => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

export const formatTime = (dateString) => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

export const formatEventDateTime = (dateString) => {
  if (!dateString) return { date: "", time: "", fullDate: "" };

  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("ru-RU", { month: "long" });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      date: `${day} ${month}`,
      time,
      fullDate: `${day} ${month} ${year}`,
    };
  } catch {
    return { date: "", time: "", fullDate: "" };
  }
};

export const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
};

export const formatTimeForInput = (dateString) => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch {
    return "";
  }
};

export const combineDateTimeToISO = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return "";
  
  try {
    const [hours, minutes] = timeStr.split(":");
    const date = new Date(dateStr);
    date.setHours(parseInt(hours, 10) || 0);
    date.setMinutes(parseInt(minutes, 10) || 0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.toISOString();
  } catch {
    return "";
  }
};

