import { Passenger } from '@prisma/client';
import { PassengerDTO } from '../PassagerDTO';

export const toPassengerDTO = (passenger: Passenger): PassengerDTO => ({
  uuid: passenger.uuid,
  name: passenger.name,
  lastName: passenger.lastName,
  email: passenger.email,
  phone: passenger.phone,
  createdAt: passenger.createdAt.toISOString(),
  updatedAt: passenger.updatedAt?.toISOString() ?? null,
  deletedAt: passenger.deletedAt?.toISOString() ?? null,
});
