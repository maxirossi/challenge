export interface DriverInterface {
  readonly id?: string;
  uuid: string;
  name: string;
  email: string;
  lastName: string;
  phone: string;
  active: boolean;
  createdAt: Date | string;
  updateAt?: Date | string | null;
  deletedAt?: Date | string | null;
  userId: string;
}
