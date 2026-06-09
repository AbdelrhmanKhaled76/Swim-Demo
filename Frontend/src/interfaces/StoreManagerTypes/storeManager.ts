export interface StoreManager {
  _id: string;
  fullName: string;
  email: string;
  storeId: string;
  storeName?: string;
  role: 'StoreManager';
  createdAt?: string;
}

export interface CreateStoreManagerPayload {
  fullName: string;
  email: string;
  password: string;
  storeId: string;
  role: 'StoreManager';
}
