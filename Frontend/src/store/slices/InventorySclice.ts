import {createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const orgId :string ="6a21e93d947a50040cd0b35e";

export const fetchAllLocations = createAsyncThunk(
    'inventory/fetchAllLocations',
    async () => {
        const response = await axios.get(`http://localhost:3000/api/location/organization/${orgId}`);
        return response.data;
    }
);

const inventorySlice = createSlice({
    name: 'inventory',
    initialState: {
        locations: [],
        status: 'idle',
        currentView: true,
    },
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


export default inventorySlice.reducer;

