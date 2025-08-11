import { formatName } from './format';

export const sortByStartDate = <T extends { startDate: string }>(a: T, b: T) =>
  new Date(a.startDate).getTime() - new Date(b.startDate).getTime();

export const sortByName = <T extends { firstName: string; lastName: string }>(
  a: T,
  b: T,
) => formatName(a).localeCompare(formatName(b));
