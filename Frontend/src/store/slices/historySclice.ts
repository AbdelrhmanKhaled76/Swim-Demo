import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { API_BASE_URL } from "../../core/api.constants";
import type { RootState } from "../index";
import type { FetchedOrder } from "../../interfaces/historyTypes/history";

interface HistoryState {
    orders: FetchedOrder[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export const fetchHistory = createAsyncThunk ('history/fetchHistory',
    async () =>{
        const response = await axios.get(`${API_BASE_URL}order/store/6a21e93f947a50040cd0b361`)
        return response.data;
    }
);

const initialState: HistoryState = {
    orders: [],
    status: 'idle'
};

const historySlice = createSlice ({
    name:'history',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
                  .addCase(fetchHistory.pending, (state) => {
                      state.status = 'loading';
                  })
                  .addCase(fetchHistory.fulfilled, (state, action) => {
                      state.status = 'succeeded';
                      state.orders = action.payload.data;
                  })
                  .addCase(fetchHistory.rejected, (state) => {
                      state.status = 'failed';
                  })
    }
})

export const selectOrders = (state: RootState) => state.history.orders

export default historySlice.reducer ;