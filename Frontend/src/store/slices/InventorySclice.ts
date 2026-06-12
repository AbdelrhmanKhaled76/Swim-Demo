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
  /** The locationId currently loaded into inventoryItems (used for socket matching) */
  activeLocationId: string;
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
  activeLocationId: "",
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setCurrentView(state, action: PayloadAction<boolean>) {
      state.currentView = action.payload;
    },

    // Called by the useSocket hook when the backend emits 'inventory_item_added'
    inventoryItemAdded(
      state,
      action: PayloadAction<{ locationId: string; item: InventoryItem }>
    ) {
      const { locationId, item } = action.payload;
      // Only update if the emitted locationId matches the currently active location
      if (state.activeLocationId !== locationId) return;

      const existingIndex = state.inventoryItems.findIndex(
        (inv) => inv._id === item._id
      );
      if (existingIndex >= 0) {
        state.inventoryItems[existingIndex] = item;
      } else {
        state.inventoryItems.push(item);
      }
    },

    // Called by the useSocket hook when the backend emits 'inventory_transferred'
    inventoryTransferred(
      state,
      action: PayloadAction<{
        fromLocationId: string;
        toLocationId: string;
        itemId: string;
        fromQuantity: number;
        toQuantity: number;
      }>
    ) {
      const { fromLocationId, toLocationId, itemId, fromQuantity, toQuantity } =
        action.payload;

      // Determine the locationId currently reflected in inventoryItems
      const currentLocationId = state.activeLocationId;

      if (currentLocationId === fromLocationId) {
        // Current view is the source — decrease qty or remove the item
        const idx = state.inventoryItems.findIndex(
          (inv) => inv.itemId?._id === itemId || (inv.itemId as any) === itemId
        );
        if (idx >= 0) {
          if (fromQuantity <= 0) {
            state.inventoryItems.splice(idx, 1);
          } else {
            state.inventoryItems[idx].quantity = fromQuantity;
          }
        }
      } else if (currentLocationId === toLocationId) {
        // Current view is the destination — increase qty or add item placeholder
        const idx = state.inventoryItems.findIndex(
          (inv) => inv.itemId?._id === itemId || (inv.itemId as any) === itemId
        );
        if (idx >= 0) {
          state.inventoryItems[idx].quantity = toQuantity;
        }
        // If the item wasn't in the destination before, a re-fetch will handle it
        // (the socket event for 'transfer to new destination' is best-effort)
      }
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
        // Track which location's data is now in state (used by socket reducers)
        state.activeLocationId = action.meta.arg;
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

export const { setCurrentView, inventoryItemAdded, inventoryTransferred } =
  inventorySlice.actions;

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
