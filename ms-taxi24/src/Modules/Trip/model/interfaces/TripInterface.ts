import { TripStatus } from '@prisma/client';

export interface TripInterface {
  readonly id?: number | null;
  uuid: string;
  origin: string;
  destination: string;
  status: TripStatus;
  fare: number;
  driverId: number;
  createdAt: Date | string;
  deletedAt?: Date | string | null;
  modifiedAt?: Date | string | null;
}
