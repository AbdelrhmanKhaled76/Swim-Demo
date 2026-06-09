import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  StoreManager,
  CreateStoreManagerPayload,
} from "../../interfaces/StoreManagerTypes/storeManager";
import type { RootState } from "../index";

// ─── Mock Data (swap for real endpoint) ──────────────────────────────────────
const MOCK_MANAGERS: StoreManager[] = [
  {
    _id: "mgr-001",
    fullName: "Ahmed Kamel",
    email: "a.kamel@swim-hq.io",
    storeId: "store-001",
    storeName: "Node-Alpha",
    role: "StoreManager",
    createdAt: "2026-01-15T09:00:00Z",
  },
  {
    _id: "mgr-002",
    fullName: "Sara Nasser",
    email: "s.nasser@swim-hq.io",
    storeId: "store-002",
    storeName: "Node-Beta",
    role: "StoreManager",
    createdAt: "2026-02-20T11:30:00Z",
  },
];

// ─── State ────────────────────────────────────────────────────────────────────
export interface StoreManagerState {
  managers: StoreManager[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: StoreManagerState = {
  managers: [],
  status: "idle",
  error: null,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────
export const fetchStoreManagers = createAsyncThunk<StoreManager[]>(
  "storeManagers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: replace with real endpoint, e.g.:
      // const response = await axios.get<StoreManager[]>(`${API_BASE_URL}users?role=StoreManager`);
      // return response.data;

      // Mock delay to simulate network request
      await new Promise((r) => setTimeout(r, 500));
      return MOCK_MANAGERS;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch store managers",
      );
    }
  },
);

export const createStoreManager = createAsyncThunk<
  StoreManager,
  CreateStoreManagerPayload
>("storeManagers/create", async (payload, { rejectWithValue }) => {
  try {
    // TODO: replace with real endpoint, e.g.:
    // const response = await axios.post<StoreManager>(`${API_BASE_URL}auth/register`, payload);
    // return response.data;

    // Mock response
    await new Promise((r) => setTimeout(r, 600));
    const newManager: StoreManager = {
      _id: `mgr-${Date.now()}`,
      fullName: payload.fullName,
      email: payload.email,
      storeId: payload.storeId,
      role: "StoreManager",
      createdAt: new Date().toISOString(),
    };
    return newManager;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create store manager",
    );
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────
const storeManagerSlice = createSlice({
  name: "storeManagers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreManagers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStoreManagers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.managers = action.payload;
      })
      .addCase(fetchStoreManagers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createStoreManager.fulfilled, (state, action) => {
        state.managers.push(action.payload);
      });
  },
});

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectStoreManagers = (state: RootState) =>
  state.storeManagers.managers;
export const selectStoreManagerStatus = (state: RootState) =>
  state.storeManagers.status;
export const selectStoreManagerError = (state: RootState) =>
  state.storeManagers.error;

export default storeManagerSlice.reducer;
