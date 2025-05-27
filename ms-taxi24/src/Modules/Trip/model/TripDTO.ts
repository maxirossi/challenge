import { TripStatus } from '@prisma/client';

export interface TripDTO {
  uuid: string;
  origin: string;
  destination: string;
  status: TripStatus;
  fare: number;
  driverId: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  cancelledAt: string | null;
}
