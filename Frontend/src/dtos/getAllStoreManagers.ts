export type getAllStoreMangersResponse = getStoreManager[];

interface getStoreManager {
  _id: string;
  fullName: string;
  email: string;
  role: "StoreManager";
  rank?: string;
  bio?: string;
  organizationID?: string;
  assignedLocation?: AssignedLocation;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface AssignedLocation {
  _id: string;
  name: string;
  organizationId: string;
  type: string;
  locationDetails: string;
  __v: number;
}
