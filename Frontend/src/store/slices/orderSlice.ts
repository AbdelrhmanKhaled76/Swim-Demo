import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../core/apiClient";
import type { RootState } from "../index";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FetchedItemDetails {
  _id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  imageUrl?: string;
}

export interface FetchedCustomer {
  _id: string;
  name: string;       // matches the backend customer schema field
  email?: string;
  phone?: string;
}

export interface StoreInventoryItem {
  _id: string;
  itemId: FetchedItemDetails;
  locationId: string;
  quantity: number;
}

type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";

interface OrderState {
  items: FetchedItemDetails[];
  customers: FetchedCustomer[];
  storeInventory: StoreInventoryItem[];
  itemsStatus: AsyncStatus;
  customersStatus: AsyncStatus;
  createCustomerStatus: AsyncStatus;
  orderSubmitStatus: AsyncStatus;
  lastCreatedOrder: any | null;
  lastTransaction: any | null;
  error: string | null;
}

// ─── Initial State ─────────────────────────────────────────────────────────────

const initialState: OrderState = {
  items: [],
  customers: [],
  storeInventory: [],
  itemsStatus: "idle",
  customersStatus: "idle",
  createCustomerStatus: "idle",
  orderSubmitStatus: "idle",
  lastCreatedOrder: null,
  lastTransaction: null,
  error: null,
};

// ─── Async Thunks ──────────────────────────────────────────────────────────────

/** Fetch all active items from GET /api/item */
export const fetchItems = createAsyncThunk("order/fetchItems", async () => {
  const response = await apiClient.get("item");
  return response.data.data as FetchedItemDetails[];
});

/** Fetch all active customers from GET /api/customer */
export const fetchCustomers = createAsyncThunk(
  "order/fetchCustomers",
  async () => {
    const response = await apiClient.get("customer");
    return response.data.data as FetchedCustomer[];
  },
);

/** Fetch store inventory by locationId */
export const fetchStoreInventory = createAsyncThunk(
  "order/fetchStoreInventory",
  async (locationId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`inventory/${locationId}`);
      return response.data.inventory as StoreInventoryItem[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch inventory",
      );
    }
  },
);

/** Create a new customer */
export const createCustomer = createAsyncThunk(
  "order/createCustomer",
  async (
    payload: { name: string; email?: string; phone?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await apiClient.post("customer", payload);
      return response.data.data as FetchedCustomer;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Customer creation failed",
      );
    }
  },
);

/** Full order + payment flow */
export const submitOrderWithPayment = createAsyncThunk(
  "order/submitOrderWithPayment",
  async (
    payload: {
      customerId: string;
      storeId: string;
      items: { itemId: string; quantity: number; unitPrice: number; name?: string }[];
      notes?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      // ── Step A: Create Order ──────────────────────────────────────────────
      const totalPriceDollars = payload.items.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
      const orderResponse = await apiClient.post("order", {
        customerId: payload.customerId,
        storeId: payload.storeId,
        items: payload.items.map(i => ({ itemId: i.itemId, quantity: i.quantity })),
        totalPrice: totalPriceDollars,
        status: "pending",
        notes: payload.notes || "",
      });
      const createdOrder = orderResponse.data.data;

      // ── Step B: Create Stripe PaymentIntent + Transaction ─────────────────
      const amountInCents = Math.round(totalPriceDollars * 100);
      const saleResponse = await apiClient.post("transactions/sale", {
        amount: amountInCents,
        currency: "usd",
        relatedOrderId: createdOrder._id,
        locationId: payload.storeId,
        items: payload.items.map(i => ({
          itemId: i.itemId,
          name: i.name || "",
          quantity: i.quantity,
          unitPrice: Math.round(i.unitPrice * 100),
        })),
        notes: payload.notes || "",
      });
      const { transaction, clientSecret } = saleResponse.data.data;

      // ── Step C: Confirm payment with Stripe.js ────────────────────────────
      const { loadStripe } = await import("@stripe/stripe-js");
      const stripe = await loadStripe(
        import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
      );
      if (!stripe) throw new Error("Stripe failed to load");

      const { error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: { token: "tok_visa" }, // Test mode only — do NOT ship to production
          },
        },
      );
      if (stripeError) throw new Error(stripeError.message);

      // ── Step D: Confirm transaction in your backend ───────────────────────
      const confirmResponse = await apiClient.post(
        `transactions/sale/${transaction._id}/confirm`,
      );
      const confirmedTransaction = confirmResponse.data.data;

      return { order: createdOrder, transaction: confirmedTransaction };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Order submission failed",
      );
    }
  },
);

// ─── Slice ─────────────────────────────────────────────────────────────────────

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    /** Reset the submit status after the confirmation popup is closed */
    resetOrderSubmit(state) {
      state.orderSubmitStatus = "idle";
      state.lastCreatedOrder = null;
      state.lastTransaction = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchItems
    builder
      .addCase(fetchItems.pending, (state) => {
        state.itemsStatus = "loading";
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.itemsStatus = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state) => {
        state.itemsStatus = "failed";
      });

    // fetchCustomers
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.customersStatus = "loading";
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.customersStatus = "succeeded";
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state) => {
        state.customersStatus = "failed";
      });

    // createCustomer
    builder
      .addCase(createCustomer.pending, (state) => {
        state.createCustomerStatus = "loading";
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.createCustomerStatus = "succeeded";
        state.customers.push(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.createCustomerStatus = "failed";
        state.error = action.payload as string;
      });

    // fetchStoreInventory
    builder
      .addCase(fetchStoreInventory.fulfilled, (state, action) => {
        state.storeInventory = action.payload;
      })
      .addCase(fetchStoreInventory.rejected, (state) => {
        state.storeInventory = [];
      });

    // submitOrderWithPayment
    builder
      .addCase(submitOrderWithPayment.pending, (state) => {
        state.orderSubmitStatus = "loading";
        state.error = null;
      })
      .addCase(submitOrderWithPayment.fulfilled, (state, action) => {
        state.orderSubmitStatus = "succeeded";
        state.lastCreatedOrder = action.payload.order;
        state.lastTransaction = action.payload.transaction;
      })
      .addCase(submitOrderWithPayment.rejected, (state, action) => {
        state.orderSubmitStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

// ─── Actions ───────────────────────────────────────────────────────────────────

export const { resetOrderSubmit } = orderSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────────

export const selectItems = (state: RootState) => state.order.items;
export const selectCustomers = (state: RootState) => state.order.customers;
export const selectItemsStatus = (state: RootState) => state.order.itemsStatus;
export const selectCustomersStatus = (state: RootState) =>
  state.order.customersStatus;
export const selectCreateCustomerStatus = (state: RootState) =>
  state.order.createCustomerStatus;
export const selectStoreInventory = (state: RootState) =>
  state.order.storeInventory;
export const selectOrderSubmitStatus = (state: RootState) =>
  state.order.orderSubmitStatus;
export const selectLastCreatedOrder = (state: RootState) =>
  state.order.lastCreatedOrder;
export const selectLastTransaction = (state: RootState) =>
  state.order.lastTransaction;

export default orderSlice.reducer;
