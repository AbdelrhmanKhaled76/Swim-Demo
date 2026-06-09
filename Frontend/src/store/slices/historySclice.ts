import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../core/apiClient";
import type { RootState } from "../index";
import type { FetchedOrder } from "../../interfaces/historyTypes/history";

interface HistoryState {
  orders: FetchedOrder[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

export const fetchHistory = createAsyncThunk(
  "history/fetchHistory",
  async () => {
    const response = await apiClient.get("order");
    return response.data;
  },
);

const initialState: HistoryState = {
  orders: [],
  status: "idle",
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload.data;
      })
      .addCase(fetchHistory.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectOrders = (state: RootState) => state.history.orders;

export default historySlice.reducer;
