import type { InventoryTypes } from "../../types/InventoryTypes";

export interface Location {
  _id: string;
  name: string;
  organizationId: string;
  type: InventoryTypes;
  locationDetails?: string;
}

export interface ItemDetails {
  _id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  imageUrl?: string;
}

export interface InventoryItem {
  _id: string;
  itemId: ItemDetails | null;
  locationId: string;
  quantity: number;
}
