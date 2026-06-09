import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import inventoryReducer from "./slices/InventorySclice";
import HistoryReducer from "./slices/historySclice";
import storeManagersReducer from "./slices/storeManagerSlice";
import requestsReducer from "./slices/requestsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    history: HistoryReducer,
    storeManagers: storeManagersReducer,
    requests: requestsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
