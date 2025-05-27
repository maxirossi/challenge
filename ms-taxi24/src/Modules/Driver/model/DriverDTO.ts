export interface DriverDTO {
  uuid: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
}
