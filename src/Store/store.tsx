import { configureStore, combineReducers } from '@reduxjs/toolkit';
import UserSlice from './Slices/UserSlice';

// Combine reducers
const rootReducer = combineReducers({
  user: UserSlice,
});

// Configure the store
const store = configureStore({
  reducer: rootReducer,
});

// Define the RootState type based on the return type of the rootReducer
export type RootState = ReturnType<typeof rootReducer>;

export { store };
