import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { type InventoryItem } from "../../components/InventoryRow/InventoryRow";

const orgId: string = "6a21e93d947a50040cd0b35e";

export interface InventoryState {
    locations: any[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    currentView: boolean;
    inventoryItems: InventoryItem[];
    inventoryStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    inventoryError: string | null;
}

export const fetchAllLocations = createAsyncThunk(
    'inventory/fetchAllLocations',
    async () => {
        const response = await axios.get(`http://localhost:3000/api/location/organization/${orgId}`);
        return response.data;
    }
);

export const fetchInventoryForLocation = createAsyncThunk(
    'inventory/fetchInventoryForLocation',
    async (locationId: string) => {
        const response = await axios.get(`http://localhost:3000/api/inventory/${locationId}`);
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
        setCurrentView(state, action) {
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

export const selectTotalWarehouses = (state: any) => {
    return state.inventory.locations.filter((loc: any) => loc.type === 'Warehouse');
};

export const selectTotalStores = (state: any) => {
    return state.inventory.locations.filter((loc: any) => loc.type === 'Store');
};

export const selectCurrentView = (state: any) => {
    return state.inventory.currentView;
};

export const selectInventoryItems = (state: any) => {
    return state.inventory.inventoryItems;
};

export const selectInventoryStatus = (state: any) => {
    return state.inventory.inventoryStatus;
};

export const selectInventoryError = (state: any) => {
    return state.inventory.inventoryError;
};

export default inventorySlice.reducer;
