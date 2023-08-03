import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./logistics/features/user/userSlice";
import siteVisitSlice from "./logistics/features/siteVisit/siteVisitSlice";
import vehicleRequestSlice from "./logistics/features/vehicleRequest/vehicleRequestSlice";
import notificationsReducer from "./logistics/features/notifications/notificationsSlice";
import paginationReducer from './logistics/features/pagination/paginationSlice';

const persistConfig = {
  key: "root",
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userSlice);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    siteVisit: siteVisitSlice,
    vehicleRequest: vehicleRequestSlice,
    notifications: notificationsReducer,
    pagination: paginationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export const persistor = persistStore(store);
