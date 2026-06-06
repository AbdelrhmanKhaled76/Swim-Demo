import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from 'axios';
import { type InventoryItem, type Location } from "../../interfaces/InventoryTypes/inventory";
import { API_BASE_URL } from "../../core/api.constants";
import type { RootState } from "../index";

const orgId: string = "6a21e93d947a50040cd0b35e";

export interface InventoryState {
    locations: Location[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    currentView: boolean;
    inventoryItems: InventoryItem[];
    inventoryStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    inventoryError: string | null;
}

export const fetchAllLocations = createAsyncThunk<Location[]>(
    'inventory/fetchAllLocations',
    async () => {
        const response = await axios.get<Location[]>(`${API_BASE_URL}location/organization/${orgId}`);
        return response.data;
    }
);

export const fetchInventoryForLocation = createAsyncThunk<InventoryItem[], string>(
    'inventory/fetchInventoryForLocation',
    async (locationId: string) => {
        const response = await axios.get<{ inventory: InventoryItem[] }>(`${API_BASE_URL}inventory/${locationId}`);
        return response.data.inventory;
    }
);

const initialState: InventoryState = {
    locations: [],
    status: 'idle',
    currentView: true,
    inventoryItems: [],
    inventoryStatus: 'idle',
    inventoryError: null,
};

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        setCurrentView(state, action: PayloadAction<boolean>) {
            state.currentView = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllLocations.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllLocations.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.locations = action.payload;
            })
            .addCase(fetchAllLocations.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(fetchInventoryForLocation.pending, (state) => {
                state.inventoryStatus = 'loading';
            })
            .addCase(fetchInventoryForLocation.fulfilled, (state, action) => {
                state.inventoryStatus = 'succeeded';
                state.inventoryItems = action.payload;
            })
            .addCase(fetchInventoryForLocation.rejected, (state, action) => {
                state.inventoryStatus = 'failed';
                state.inventoryError = action.error.message || 'Failed to fetch inventory';
            });
    },
}); 

export const { setCurrentView } = inventorySlice.actions;

export const selectTotalWarehouses = (state: RootState) => {
    return state.inventory.locations.filter((loc: Location) => loc.type === 'Warehouse');
};

export const selectTotalStores = (state: RootState) => {
    return state.inventory.locations.filter((loc: Location) => loc.type === 'Store');
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
