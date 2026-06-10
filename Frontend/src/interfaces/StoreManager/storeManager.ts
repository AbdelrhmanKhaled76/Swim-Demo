export interface StoreManager {
  _id: string;
  fullName: string;
  email: string;
  role: "StoreManager";
  organizationID?: string;
  assignedLocation?: string | AssignedLocation;
  storeId?: string;
  storeName?: string;
}

export interface AssignedLocation {
  _id: string;
  name: string;
  organizationId: string;
  type: string;
  locationDetails: string;
  __v: number;
}
