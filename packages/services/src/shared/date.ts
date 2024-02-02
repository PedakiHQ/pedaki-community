export const dateWithoutTimezone = (date: Date): Date => {
  const timezoneOffset = date.getTimezoneOffset();
  const timezoneOffsetInMs = timezoneOffset * 60 * 1000;
  return new Date(date.getTime() - timezoneOffsetInMs);
};
