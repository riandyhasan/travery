import { combineReducers, configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import userReducer from '../reducers/user';
import authReducer from '../reducers/auth';
import paramsReducer from '../reducers/params';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  blacklist: ['auth', 'user'],
};

const userPersistConfig = {
  key: 'user',
  storage: AsyncStorage,
  whitelist: ['email', 'id', 'username', 'avatar', 'name'],
};

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  auth: persistReducer(authPersistConfig, authReducer),
  params: paramsReducer,
  // etc: etcReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const createStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    devTools: __DEV__,
  });

  const persistor = persistStore(store);

  return { store, persistor };
};

const { store, persistor } = createStore();

export type AppDispatch = typeof store.dispatch;

export { store, persistor };
