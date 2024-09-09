/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_YEAR_FORMAT = 'YYYY';

export function formatToDateTime(date = undefined, format = DATE_TIME_FORMAT) {
  return dayjs(date).format(format);
}

export function formatToDate(date = undefined, format = DATE_FORMAT) {
  return dayjs(date).format(format);
}
export function formatToDateYear(date = undefined, format = DATE_YEAR_FORMAT) {
  return dayjs(date).format(format);
}
export const dateUtil = dayjs;

export function disabledYesterday(ts) {
  return new Date(ts + 1000 * 60 * 60 * 24) <= new Date();
}

export function disabledTomorrow(ts) {
  return dayjs(ts).add(1, 'day') > dayjs();
}
