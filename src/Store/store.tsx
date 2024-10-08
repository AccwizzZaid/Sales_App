import { configureStore, combineReducers } from '@reduxjs/toolkit';
import UserSlice from './Slices/UserSlice';
import LocationSlice from './Slices/LocationSlice';

// Combine reducers
const rootReducer = combineReducers({
  user: UserSlice,
  location : LocationSlice
});

// Configure the store
const store = configureStore({
  reducer: rootReducer,
});

// Define the RootState type based on the return type of the rootReducer
export type RootState = ReturnType<typeof rootReducer>;

export { store };
