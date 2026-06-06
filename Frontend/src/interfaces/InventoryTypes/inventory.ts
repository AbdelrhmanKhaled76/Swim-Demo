export interface Location {
  _id: string;
  name: string;
  organizationId: string;
  type: 'Warehouse' | 'Store';
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
