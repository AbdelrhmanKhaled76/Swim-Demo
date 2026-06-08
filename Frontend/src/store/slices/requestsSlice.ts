import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import type {
  StockRequest,
  ApproveRequestPayload,
} from "../../interfaces/RequestTypes/request";
import { API_BASE_URL } from "../../core/api.constants";
import type { RootState } from "../index";

// ─── Mock Data (swap for real endpoint) ──────────────────────────────────────
const MOCK_REQUESTS: StockRequest[] = [
  {
    _id: "req-001",
    warehouseId: "wh-001",
    storeId: "store-001",
    storeName: "Node-Alpha",
    organizationId: "org-001",
    requestedBy: {
      fullName: "Ahmed Kamel",
      email: "",
      organizationID: "org-001",
      role: "StoreManager",
    },
    resolvedBy: {
      fullName: "Sara Nasser",
      email: "",
      organizationID: "org-001",
      role: "StoreManager",
    },
    items: [
      {
        itemId: "item-001",
        quantity: 10,
      },
    ],
    status: "pending",
    notes: "Sample request",
    resolvedAt: new Date().toISOString(),
    adminNote: "Request approved",
  },
];

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
      // TODO: replace with real endpoint:
      // const response = await axios.get<StockRequest[]>(`${API_BASE_URL}requests`);
      // return response.data;

      await new Promise((r) => setTimeout(r, 500));
      return MOCK_REQUESTS;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch requests",
      );
    }
  },
);

export const approveRequest = createAsyncThunk<
  { id: string; approvedQuantity: number },
  ApproveRequestPayload
>(
  "requests/approve",
  async ({ itemId, quantity }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const request = state.requests.requests.find((r) => r._id === id);
      const qty = quantity ?? request?.quantity ?? 0;

      // TODO: replace with real endpoint:
      // await axios.patch(`${API_BASE_URL}requests/${id}/approve`, { approvedQuantity: qty });

      await new Promise((r) => setTimeout(r, 400));
      return { id, approvedQuantity: qty };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve request",
      );
    }
  },
);

export const declineRequest = createAsyncThunk<string, string>(
  "requests/decline",
  async (id, { rejectWithValue }) => {
    try {
      // TODO: replace with real endpoint:
      // await axios.patch(`${API_BASE_URL}requests/${id}/decline`);

      await new Promise((r) => setTimeout(r, 400));
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to decline request",
      );
    }
  },
);

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
        const { id, approvedQuantity } = action.payload;
        const req = state.requests.find((r) => r._id === id);
        if (req) {
          req.status = "Approved";
          req.approvedQuantity = approvedQuantity;
        }
      })
      .addCase(declineRequest.fulfilled, (state, action) => {
        const req = state.requests.find((r) => r._id === action.payload);
        if (req) {
          req.status = "Declined";
        }
      });
  },
});

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectAllRequests = (state: RootState) => state.requests.requests;
export const selectPendingRequests = (state: RootState) =>
  state.requests.requests.filter((r) => r.status === "Pending");
export const selectRequestsStatus = (state: RootState) => state.requests.status;
export const selectRequestsError = (state: RootState) => state.requests.error;

export default requestsSlice.reducer;
