import type { User } from "../User/user";

export type RequestStatus = "pending" | "approved" | "rejected";

export interface StockRequest {
  _id: string;
  warehouseId: string;
  storeId: string;
  storeName?: string;
  organizationId: string;
  items: ApproveRequestPayload[];
  status: RequestStatus;
  notes?: string;
  resolvedAt: string;
  adminNote?: string;
  requestedBy: User;
  resolvedBy: User;
}

export interface ApproveRequestPayload {
  itemId: string;
  quantity: number;
}
