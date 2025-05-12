import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './userInfo/userInfo'

const rootReducer = combineReducers({
    user: userReducer,
});

const persistConfig = {
    key: 'root', // Storage key in localStorage
    storage,
    whitelist: ['user', 'isAuthenticated', "loading", "error"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer:  persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export default store;