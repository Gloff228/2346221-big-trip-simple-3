import dayjs from 'dayjs';
import { FILTER_TYPE, DESTINATION_NAMES } from './const';

const getDate = (date) => dayjs(date).format('MMM D');
const getTime = (date) => dayjs(date).format('HH-mm');
const getFullDataTime = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'm');

const sortDays = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.dateTo, taskB.dateTo);

  return weight ?? dayjs(taskA.dateTo).diff(dayjs(taskB.dateTo));
};

const sortPrices = (taskA, taskB) => taskB.basePrice - taskA.basePrice;

const isDateFuture = (date) => {
  const currentDate = dayjs();
  const targetDate = dayjs(date);
  return targetDate.isAfter(currentDate, 'm');
};

const filter = {
  [FILTER_TYPE.EVERYTHING]: (points) => points,
  [FILTER_TYPE.FUTURE]: (points) => points.filter((point) => isDateFuture(point.dateTo)),
};

const isFormValid = (state) => {
  if (state.destination && state.basePrice) {
    const isDestination = DESTINATION_NAMES.includes(state.destination.name);
    return isDestination && /^\d+$/.test(state.basePrice);
  }
  return false;
};

export { isFormValid, filter, isDatesEqual, sortDays, sortPrices, getDate, getTime, getFullDataTime };
