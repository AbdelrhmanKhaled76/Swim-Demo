import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import inventoryReducer from "./slices/InventorySclice";
import HistoryReducer from "./slices/historySclice";
import storeManagersReducer from "./slices/storeManagerSlice";
import requestsReducer from "./slices/requestsSlice";
import orderReducer from "./slices/orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    history: HistoryReducer,
    storeManagers: storeManagersReducer,
    requests: requestsReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
