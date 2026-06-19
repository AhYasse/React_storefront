import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { useDispatch, useSelector } from 'react-redux';

// 1. Robust custom storage engine for Vite/ESM environments
// (Prevents the "storage.getItem is not a function" error)
const storage = {
  getItem: (key: string) => {
    const value = localStorage.getItem(key);
    return Promise.resolve(value);
  },
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

// 2. Placeholder Root Reducer
// TODO: In the coming days, import your slices and add them here:
import cartReducer from './cartSlice';
import userReducer from './userSlice';
const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
  
  // Temporary placeholder to keep the store valid until slices are added
  _temp: (state = { initialized: true }) => state,
});

// 3. Configure Redux Persist
const persistConfig = {
  key: 'root',
  storage, // Uses our custom ESM-safe storage
  whitelist: ['cart', 'user'], // TODO: Add slice names here later to persist them
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configure Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions to prevent false-positive non-serializable warnings
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

// 5. Export Persistor and Types
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();