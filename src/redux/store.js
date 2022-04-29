import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth';
import messageReducer from './slices/message';
import sessionReducer from './slices/session';
import { timekeeperApi } from '../services/timekeeperApi';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: [timekeeperApi.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, sessionReducer);

const reducer = {
  auth: authReducer,
  message: messageReducer,
  session: persistedReducer,
  [timekeeperApi.reducerPath]: timekeeperApi.reducer,
};

export const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(timekeeperApi.middleware),
  devTools: true,
});

export let persistor = persistStore(store);
