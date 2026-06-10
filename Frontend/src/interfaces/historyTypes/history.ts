import type { InventoryTypes } from "../../types/InventoryTypes";

export interface FetchedCustomer {
  _id: string;
  name?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}

export interface FetchedStore {
  _id: string;
  name: string;
  organizationId: string;
  type: InventoryTypes;
  locationDetails?: string;
}

export interface FetchedItemDetails {
  _id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  imageUrl?: string;
  isActive?: boolean;
}

export interface FetchedOrderItem {
  itemId: FetchedItemDetails | null;
  quantity?: number;
  _id: string;
}

export interface FetchedOrder {
  _id: string;
  customerId: FetchedCustomer | null;
  storeId: FetchedStore | null;
  items: FetchedOrderItem[];
  status?: OrderStatus | string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = "PENDING" | "COMPLETED" | "CONFIRMED";
