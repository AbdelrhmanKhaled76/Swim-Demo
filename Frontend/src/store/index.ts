import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import inventoryReducer from "./slices/InventorySclice";
import HistoryReducer from "./slices/historySclice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    history : HistoryReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
