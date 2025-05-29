import { TripDTO } from '../TripDTO';
import { Trip } from '@prisma/client';

export const toTripDTO = (trip: Trip): TripDTO => ({
  id: trip.id,
  origin: trip.origin,
  destination: trip.destination,
  status: trip.status,
  fare: trip.fare,
  driverId: trip.driverId,
  passengerId: trip.passengerId,
  createdAt: trip.createdAt,
  completedAt: trip.completedAt,
  cancelledAt: trip.cancelledAt
});
