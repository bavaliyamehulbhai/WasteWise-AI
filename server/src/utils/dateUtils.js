export const getDateRange = (days) => {
  const end = new Date();
  const start = new Date(end);

  // Set to start of the day `days` ago
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);

  // Set end to end of today
  end.setHours(23, 59, 59, 999);

  return {
    start,
    end,
  };
};

export const getPreviousDateRange = (days) => {
  const end = new Date();
  end.setDate(end.getDate() - days);
  end.setHours(23, 59, 59, 999);

  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);

  return {
    start,
    end,
  };
};

export const generateDateArray = (start, end) => {
  const dates = [];
  let current = new Date(start);

  while (current <= end) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
};
