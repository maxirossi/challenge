import { TripStatus } from '@prisma/client';

export interface TripDTO {
  id: string;
  origin: string;
  destination: string;
  status: TripStatus;
  fare: number;
  driverId: string;
  passengerId: string;
  createdAt: Date;
  completedAt?: Date | null;
  cancelledAt?: Date | null;
}
