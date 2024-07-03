import { configureStore, combineReducers } from "@reduxjs/toolkit";
import useReducer from "./user/userSlice";
import themeReducer from "./theme/themeSlice.js";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";

const rootReducer = combineReducers({
  user: useReducer,
  theme: themeReducer,
});
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};
const persistedReduser = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReduser,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
