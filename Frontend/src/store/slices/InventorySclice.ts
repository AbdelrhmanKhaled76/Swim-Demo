import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import apiClient from "../../core/apiClient";
import {
  type InventoryItem,
  type Location,
} from "../../interfaces/InventoryTypes/inventory";
import type { RootState } from "../index";

const getOrganizationId = (state: RootState): string | undefined => {
  if (state.auth?.user?.organizationID) {
    return state.auth.user.organizationID;
  }
  const userInfo = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;
  return userInfo?.organizationID;
};

export interface InventoryState {
  locations: Location[];
  status: "idle" | "loading" | "succeeded" | "failed";
  currentView: boolean;
  inventoryItems: InventoryItem[];
  inventoryStatus: "idle" | "loading" | "succeeded" | "failed";
  inventoryError: string | null;
}

export const fetchAllLocations = createAsyncThunk<
  Location[],
  void,
  { state: RootState; rejectValue: string }
>(
  "inventory/fetchAllLocations",
  async (_, { getState, rejectWithValue }) => {
    try {
      const orgId = getOrganizationId(getState());
      if (!orgId) {
        return rejectWithValue("No organization ID found. Please login again.");
      }
      const response = await apiClient.get<Location[]>(
        `location/organization/${orgId}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch locations",
      );
    }
  },
);

export const fetchInventoryForLocation = createAsyncThunk<
  InventoryItem[],
  string,
  { rejectValue: string }
>("inventory/fetchInventoryForLocation", async (locationId: string, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<{ inventory: InventoryItem[] }>(
      `inventory/${locationId}`,
    );
    return response.data.inventory;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch inventory",
    );
  }
});

export const createLocation = createAsyncThunk<
  Location,
  { name: string; type: "Store" | "Warehouse"; locationDetails?: string },
  { state: RootState; rejectValue: string }
>("inventory/createLocation", async (locationData, { getState, rejectWithValue }) => {
  try {
    const orgId = getOrganizationId(getState());
    if (!orgId) {
      return rejectWithValue("No organization ID found. Please login again.");
    }
    const response = await apiClient.post<Location>(`location`, {
      ...locationData,
      organizationID: orgId,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to create location",
    );
  }
});

const initialState: InventoryState = {
  locations: [],
  status: "idle",
  currentView: true,
  inventoryItems: [],
  inventoryStatus: "idle",
  inventoryError: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setCurrentView(state, action: PayloadAction<boolean>) {
      state.currentView = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLocations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllLocations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.locations = action.payload;
      })
      .addCase(fetchAllLocations.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchInventoryForLocation.pending, (state) => {
        state.inventoryStatus = "loading";
      })
      .addCase(fetchInventoryForLocation.fulfilled, (state, action) => {
        state.inventoryStatus = "succeeded";
        state.inventoryItems = action.payload;
      })
      .addCase(fetchInventoryForLocation.rejected, (state, action) => {
        state.inventoryStatus = "failed";
        state.inventoryError =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch inventory";
      })
      .addCase(createLocation.fulfilled, (state, action) => {
        state.locations.push(action.payload);
      });
  },
});

export const { setCurrentView } = inventorySlice.actions;

export const selectTotalWarehouses = (state: RootState) => {
  return state.inventory.locations.filter(
    (loc: Location) => loc.type === "Warehouse",
  );
};

export const selectTotalStores = (state: RootState) => {
  return state.inventory.locations.filter(
    (loc: Location) => loc.type === "Store",
  );
};

export const selectCurrentView = (state: RootState) => {
  return state.inventory.currentView;
};

export const selectInventoryItems = (state: RootState) => {
  return state.inventory.inventoryItems;
};

export const selectInventoryStatus = (state: RootState) => {
  return state.inventory.inventoryStatus;
};

export const selectInventoryError = (state: RootState) => {
  return state.inventory.inventoryError;
};

export default inventorySlice.reducer;
