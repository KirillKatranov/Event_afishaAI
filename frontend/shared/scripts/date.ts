import { format, parseISO } from "date-fns";

export const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  return format(date, "dd.MM.yyyy");
};

export const getDatesInRange = (startDate: string, endDate: string): string[] => {
  const date = new Date(startDate);
  const dates = [];

  while (date <= new Date(endDate)) {
    dates.push(date.toISOString().split('T')[0]);
    date.setDate(date.getDate() + 1);
  }

  return dates;
};

interface Borders {
  date_start?: string,
  date_end?: string
}

export const getPeriodBorders = (period: string[]): Borders => {
  if (period.length == 0) {
    return { date_start: undefined, date_end: undefined }
  }

  if (period.length == 1) {
    return { date_start: period[0], date_end: undefined }
  }

  return { date_start: period[0], date_end: period[period.length - 1] }
}
