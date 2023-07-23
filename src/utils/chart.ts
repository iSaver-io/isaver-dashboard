import { PERIOD } from '@/hooks/staking/useStakingHistory';

import { convertDayToLocalDateString, ONE_DAY } from './time';

export const chartDateTickFormatter = (day: any, period?: PERIOD) => {
  const date = convertDayToLocalDateString(parseFloat(day));
  if (period !== PERIOD.WEEK) return date;

  return `${date} (${getWeekNumber(new Date(parseFloat(day) * 86400 * 1000))})`;
};

const getWeekNumber = (date: Date) => {
  const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
  const week =
    Math.floor((date.getTime() - firstDayOfYear.getTime() + 6 * ONE_DAY) / (7 * ONE_DAY)) + 1;

  return week;
};
