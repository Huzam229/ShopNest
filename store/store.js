import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import localStorage from "redux-persist/es/storage";
import authReducer from "./reducer/authReducer";

const rootReducer = combineReducers({
    authStore: authReducer
})

const persistConfig = {
    key: 'root',
    storage: localStorage,
}

const persistReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
    reducer: persistReducer,
    middleware: (getDefaultMiddleWar) => {
        getDefaultMiddleWar({ serializableCheck: false })
    }
})


export const persistor = persistStore(store)