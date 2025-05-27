import { Trip } from '@prisma/client';
import { TripDTO } from '../TripDTO';

export const toTripDTO = (trip: Trip): TripDTO => ({
  uuid: trip.uuid,
  origin: trip.origin,
  destination: trip.destination,
  status: trip.status,
  fare: trip.fare,
  driverId: trip.driverId,
  createdAt: trip.createdAt.toISOString(),
  updatedAt: trip.updatedAt?.toISOString(),
  completedAt: trip.completedAt?.toISOString() ?? null,
  cancelledAt: trip.cancelledAt?.toISOString() ?? null
});
