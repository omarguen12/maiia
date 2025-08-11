import { format } from 'date-fns';

const DATE_FORMAT = 'MM/dd/yyyy';
const TIME_FORMAT = 'HH:mm';

export type Range = { from: Date | string; to: Date | string };

export const formatDate = (date: Date | string) =>
  format(new Date(date), DATE_FORMAT);

export const formatTime = (date: Date | string) =>
  format(new Date(date), TIME_FORMAT);

export const formatTimeRange = (range: Range) =>
  `${formatTime(range.from)} - ${formatTime(range.to)}`;

export const formatDateRange = (range: Range) => {
  const { from, to } = range;
  return `${formatDate(from)} ${formatTime(from)} - ${formatTime(to)}`;
};

export const formatName = ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) => `${firstName} ${lastName}`;
