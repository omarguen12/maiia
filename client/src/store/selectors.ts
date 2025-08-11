import { slices } from './slices';
import { StoreSelectors } from './types';

export const {
  timeslotsSelectors,
  appointmentsSelectors,
  patientsSelectors,
  practitionersSelectors,
  availabilitiesSelectors,
} = slices.reduce((result, { name, selectors }) => {
  return {
    ...result,
    [`${name}Selectors`]: selectors,
  };
}, {}) as StoreSelectors;
