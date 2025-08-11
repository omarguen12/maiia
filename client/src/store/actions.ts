import { slices } from './slices';
import { StoreActions } from './types';

export const {
  timeslotsActions,
  appointmentsActions,
  patientsActions,
  practitionersActions,
  availabilitiesActions,
} = slices.reduce((result, { name, actions }) => {
  return {
    ...result,
    [`${name}Actions`]: actions,
  };
}, {}) as StoreActions;
