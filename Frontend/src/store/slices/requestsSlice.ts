import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { StockRequest, ApproveRequestPayload } from '../../interfaces/RequestTypes/request';
import { API_BASE_URL } from '../../core/api.constants';
import type { RootState } from '../index';

// ─── Mock Data (swap for real endpoint) ──────────────────────────────────────
const MOCK_REQUESTS: StockRequest[] = [
  {
    _id: 'req-001',
    storeManagerId: 'mgr-001',
    storeManagerName: 'Ahmed Kamel',
    storeId: 'store-001',
    storeName: 'Node-Alpha',
    itemId: 'item-101',
    itemName: 'Emergency Ration Pack',
    requestedQuantity: 200,
    status: 'Pending',
    createdAt: '2026-06-05T08:30:00Z',
  },
  {
    _id: 'req-002',
    storeManagerId: 'mgr-002',
    storeManagerName: 'Sara Nasser',
    storeId: 'store-002',
    storeName: 'Node-Beta',
    itemId: 'item-102',
    itemName: 'Medical Supply Kit',
    requestedQuantity: 50,
    status: 'Pending',
    createdAt: '2026-06-06T14:15:00Z',
  },
  {
    _id: 'req-003',
    storeManagerId: 'mgr-001',
    storeManagerName: 'Ahmed Kamel',
    storeId: 'store-001',
    storeName: 'Node-Alpha',
    itemId: 'item-103',
    itemName: 'Fuel Cell Cartridge',
    requestedQuantity: 100,
    approvedQuantity: 75,
    status: 'Approved',
    createdAt: '2026-06-01T10:00:00Z',
  },
  {
    _id: 'req-004',
    storeManagerId: 'mgr-002',
    storeManagerName: 'Sara Nasser',
    storeId: 'store-002',
    storeName: 'Node-Beta',
    itemId: 'item-104',
    itemName: 'Water Purification Tablet',
    requestedQuantity: 500,
    status: 'Declined',
    note: 'Insufficient warehouse stock.',
    createdAt: '2026-05-28T16:45:00Z',
  },
];

// ─── State ────────────────────────────────────────────────────────────────────
export interface RequestsState {
  requests: StockRequest[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RequestsState = {
  requests: [],
  status: 'idle',
  error: null,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────
export const fetchRequests = createAsyncThunk<StockRequest[]>(
  'requests/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: replace with real endpoint:
      // const response = await axios.get<StockRequest[]>(`${API_BASE_URL}requests`);
      // return response.data;

      await new Promise((r) => setTimeout(r, 500));
      return MOCK_REQUESTS;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch requests');
    }
  }
);

export const approveRequest = createAsyncThunk<
  { id: string; approvedQuantity: number },
  ApproveRequestPayload
>(
  'requests/approve',
  async ({ id, approvedQuantity }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const request = state.requests.requests.find((r) => r._id === id);
      const qty = approvedQuantity ?? request?.requestedQuantity ?? 0;

      // TODO: replace with real endpoint:
      // await axios.patch(`${API_BASE_URL}requests/${id}/approve`, { approvedQuantity: qty });

      await new Promise((r) => setTimeout(r, 400));
      return { id, approvedQuantity: qty };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve request');
    }
  }
);

export const declineRequest = createAsyncThunk<string, string>(
  'requests/decline',
  async (id, { rejectWithValue }) => {
    try {
      // TODO: replace with real endpoint:
      // await axios.patch(`${API_BASE_URL}requests/${id}/decline`);

      await new Promise((r) => setTimeout(r, 400));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to decline request');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.requests = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(approveRequest.fulfilled, (state, action) => {
        const { id, approvedQuantity } = action.payload;
        const req = state.requests.find((r) => r._id === id);
        if (req) {
          req.status = 'Approved';
          req.approvedQuantity = approvedQuantity;
        }
      })
      .addCase(declineRequest.fulfilled, (state, action) => {
        const req = state.requests.find((r) => r._id === action.payload);
        if (req) {
          req.status = 'Declined';
        }
      });
  },
});

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectAllRequests = (state: RootState) => state.requests.requests;
export const selectPendingRequests = (state: RootState) =>
  state.requests.requests.filter((r) => r.status === 'Pending');
export const selectRequestsStatus = (state: RootState) => state.requests.status;
export const selectRequestsError = (state: RootState) => state.requests.error;

export default requestsSlice.reducer;
