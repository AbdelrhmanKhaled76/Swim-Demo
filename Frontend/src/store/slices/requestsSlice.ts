import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import type { StockRequest } from "../../interfaces/RequestTypes/request";
import type { RootState } from "../index";
import apiClient from "../../core/apiClient";

interface StockRequestsResponse {
  success: boolean;
  count: number;
  data: StockRequest[];
}

interface StockRequestResponse {
  success: boolean;
  data: StockRequest;
}

// ─── State ────────────────────────────────────────────────────────────────────
export interface RequestsState {
  requests: StockRequest[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: RequestsState = {
  requests: [],
  status: "idle",
  error: null,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────
export const fetchRequests = createAsyncThunk<StockRequest[]>(
  "requests/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await apiClient.get<StockRequestsResponse>("stock-requests");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch requests",
      );
    }
  },
);

export const approveRequest = createAsyncThunk<
  { request: StockRequest; approvedQuantity?: number },
  { id: string; approvedQuantity?: number; adminNote?: string }
>(
  "requests/approve",
  async ({ id, approvedQuantity, adminNote }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch<StockRequestResponse>(
        `stock-requests/${id}/approve`,
        {
          adminNote:
            adminNote || "Approved — stock transferred from Main Warehouse",
          approvedQuantity,
        },
      );
      return {
        request: response.data.data,
        approvedQuantity,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve request",
      );
    }
  },
);

export const declineRequest = createAsyncThunk<
  StockRequest,
  { id: string; adminNote?: string }
>("requests/decline", async ({ id, adminNote }, { rejectWithValue }) => {
  try {
    const response = await apiClient.patch<StockRequestResponse>(
      `stock-requests/${id}/reject`,
      {
        adminNote:
          adminNote || "Rejected — insufficient warehouse stock at this time",
      },
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to decline request",
    );
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────
const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.requests = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(approveRequest.fulfilled, (state, action) => {
        const updated = action.payload.request;
        const index = state.requests.findIndex((r) => r._id === updated._id);
        if (index >= 0) {
          state.requests[index] = updated;
          if (
            action.payload.approvedQuantity !== undefined &&
            state.requests[index].items[0]
          ) {
            state.requests[index].items[0].quantity =
              action.payload.approvedQuantity;
          }
        } else {
          state.requests.push(updated);
        }
      })

      .addCase(declineRequest.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.requests.findIndex((r) => r._id === updated._id);
        if (index >= 0) {
          state.requests[index] = updated;
        } else {
          state.requests.push(updated);
        }
      });
  },
});

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectAllRequests = (state: RootState) => state.requests.requests;
export const selectPendingRequests = createSelector(
  [selectAllRequests],
  (requests) => requests.filter((request) => request.status === "pending")
);

export const selectRequestsStatus = (state: RootState) => state.requests.status;
export const selectRequestsError = (state: RootState) => state.requests.error;

export default requestsSlice.reducer;
