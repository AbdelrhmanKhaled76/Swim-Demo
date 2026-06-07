export type RequestStatus = 'Pending' | 'Approved' | 'Declined';

export interface StockRequest {
  _id: string;
  storeManagerId: string;
  storeManagerName?: string;
  storeId: string;
  storeName?: string;
  itemId: string;
  itemName?: string;
  requestedQuantity: number;
  approvedQuantity?: number;
  status: RequestStatus;
  note?: string;
  createdAt: string;
}

export interface ApproveRequestPayload {
  id: string;
  approvedQuantity?: number;
}
