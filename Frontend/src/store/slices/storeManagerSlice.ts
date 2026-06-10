import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import apiClient from "../../core/apiClient";
import type { getAllStoreMangersResponse } from "../../dtos/getAllStoreManagers";
import type { StoreManager } from "../../interfaces/StoreManager/storeManager";
import type { CreateStoreManagerResponse } from "../../dtos/createStoreManger";

type CreateStoreManagerPayload = {
  fullName: string;
  email: string;
  password: string;
  assignedLocation: string;
  role: "StoreManager";
};

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

export const fetchStoreManagers = createAsyncThunk<getAllStoreMangersResponse>(
  "storeManagers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("users/store-managers");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch store managers",
      );
    }
  },
);

export const createStoreManager = createAsyncThunk<
  CreateStoreManagerResponse["data"],
  CreateStoreManagerPayload
>("storeManagers/create", async (storeManager, { rejectWithValue }) => {
  try {
    const response = await apiClient.post(
      "auth/createStoreManager",
      storeManager,
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create store manager",
    );
  }
});

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
      .addCase(createStoreManager.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createStoreManager.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.managers.push(action.payload);
      })
      .addCase(createStoreManager.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const selectStoreManagers = (state: RootState) =>
  state.storeManagers.managers;
export const selectStoreManagerStatus = (state: RootState) =>
  state.storeManagers.status;
export const selectStoreManagerError = (state: RootState) =>
  state.storeManagers.error;

export default storeManagerSlice.reducer;
