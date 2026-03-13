export const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getEndOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const getTodayRange = () => {
  return {
    start: getStartOfDay(),
    end: getEndOfDay(),
  };
};

export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

export const parseDate = (dateString) => {
  return new Date(dateString);
};
