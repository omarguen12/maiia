import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { slices } from './slices';

const reducers = slices.reduce((result, currentSlice) => {
  return {
    ...result,
    [currentSlice.name]: currentSlice.reducer,
  };
}, {});
const rootReducer = combineReducers(reducers);

export const store = configureStore({
  reducer: rootReducer,
});
