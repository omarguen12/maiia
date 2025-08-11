import generator from './generator';
import { sortByName, sortByStartDate } from 'utils/sort';

const sortComparerMap = {
  appointments: sortByStartDate,
  availabilities: sortByStartDate,
  patients: sortByName,
  practitioners: sortByName,
  timeslots: sortByStartDate,
};

export const slices = Object.keys(sortComparerMap).map((name) =>
  generator(name, sortComparerMap[name]),
);
