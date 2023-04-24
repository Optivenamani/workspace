const format12HourTime = (timeStr) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(":");
  const ampm = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes}${ampm}`;
};

export default format12HourTime;
