export interface PassengerInterface {
  readonly id?: number | null;
  uuid: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
  deletedAt?: Date | string | null;
}