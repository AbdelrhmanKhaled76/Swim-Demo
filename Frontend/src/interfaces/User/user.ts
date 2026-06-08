export interface User {
  fullName: string;
  email: string;
  passwordHash?: string;
  role: "Owner" | "StoreManager";
  organizationID: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}
