import type { RequestStatus } from "../../types/requestStatus";

export interface RequestUser {
  _id?: string;
  fullName: string;
  email?: string;
  organizationID?: string;
  role: string;
}

export interface PopulatedItem {
  _id: string;
  name: string;
  category: string;
  price: number;
}

export interface StockRequest {
  _id: string;
  warehouseId: string | PopulatedLocation;
  storeId: string | PopulatedLocation;
  storeName?: string;
  organizationId: string;
  items: ApproveRequestPayload[];
  status: RequestStatus;
  notes?: string;
  createdAt: string;
  resolvedAt: string;
  adminNote?: string;
  requestedBy: RequestUser;
  resolvedBy: RequestUser;
}

export interface ApproveRequestPayload {
  itemId: string | PopulatedItem;
  quantity: number;
}

export interface PopulatedLocation {
  _id: string;
  name: string;
  type: string;
}
