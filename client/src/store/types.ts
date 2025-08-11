import {
  ActionCreatorWithoutPayload,
  AsyncThunk,
  EntitySelectors,
  EntityState,
  SerializedError,
} from '@reduxjs/toolkit';

export type AppointmentDTO = {
  patientId: number;
  practitionerId: number;
  startDate: Date;
  endDate: Date;
};

export type Practitioner = {
  id: number;
  firstName: string;
  lastName: string;
  speciality: string;
};
export type Patient = {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
};
export type Appointment = {
  id: number;
  patientId: number;
  practitionerId: number;
  startDate: Date;
  endDate: Date;
};
export type Availability = {
  id: number;
  practitionerId: number;
  startDate: Date;
  endDate: Date;
};
export type Timeslot = {
  id: number;
  practitionerId: number;
  startDate: Date;
  endDate: Date;
};

export declare type SliceState<T> = EntityState<T> & {
  loading: boolean;
  error: SerializedError;
};

export declare type SliceSelectors<T> = EntitySelectors<T, SliceState<T>> & {
  selectError: (state: SliceState<T>) => SerializedError;
  selectLoading: (state: SliceState<T>) => boolean;
};

export declare type RootState = {
  timeslotsUtils: SliceState<any>;
  appointmentsUtils: SliceState<Appointment>;
  patientsUtils: SliceState<Patient>;
  practitionersUtils: SliceState<Practitioner>;
  availabilitiesUtils: SliceState<Availability>;
};

export type SliceActionsConfig = {
  getList?: { params?: Record<string, number | string> };
  create?: { item?: any; params?: Record<string, number | string> };
};

export type DefaultSliceActionsConfig = {
  getList: undefined;
  create: undefined;
};

export declare type SliceActions<
  T extends Record<string, unknown>,
  C extends SliceActionsConfig = DefaultSliceActionsConfig
> = {
  reset: ActionCreatorWithoutPayload<string>;
  getList: AsyncThunk<T[], C['getList'], Record<string, unknown>>;
  create: AsyncThunk<T, C['create'], Record<string, unknown>>;
};

export declare type StoreActions = {
  timeslotsActions: SliceActions<Timeslot>;
  appointmentsActions: SliceActions<
    Appointment,
    {
      create: { item: AppointmentDTO };
    }
  >;
  patientsActions: SliceActions<Patient>;
  practitionersActions: SliceActions<Practitioner>;
  availabilitiesActions: SliceActions<
    Availability,
    { getList: { params: { practitionerId: number } } }
  >;
};

export declare type StoreSelectors = {
  timeslotsSelectors: SliceSelectors<Timeslot>;
  appointmentsSelectors: SliceSelectors<Appointment>;
  patientsSelectors: SliceSelectors<Patient>;
  practitionersSelectors: SliceSelectors<Practitioner>;
  availabilitiesSelectors: SliceSelectors<Availability>;
};
