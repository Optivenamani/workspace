import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./features/user/userSlice";
import siteVisitSlice from "./features/siteVisit/siteVisitSlice";
import vehicleRequestSlice from "./features/vehicleRequest/vehicleRequestSlice";
import notificationsReducer from "./features/notifications/notificationsSlice";

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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export const persistor = persistStore(store);
