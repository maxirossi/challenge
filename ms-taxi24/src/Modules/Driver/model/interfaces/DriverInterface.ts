export interface DriverInterface {
  readonly id?: number | null;
  uuid: string;
  name: string;
  email: string;
  lastName: string;
  phone: string;
  active: boolean;
  createdAt: Date | string;
  updateAt?: Date | string | null;
  deletedAt?: Date | string | null;
}
