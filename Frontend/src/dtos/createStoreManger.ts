export interface CreateStoreManagerResponse {
  success: boolean;
  data: Data;
  message: string;
}

interface Data {
  _id: string;
  fullName: string;
  email: string;
  role: "StoreManager";
  organizationID: string;
  assignedLocation: string;
}
