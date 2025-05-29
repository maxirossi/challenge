import { Passenger } from '@prisma/client';
import { PassengerDTO } from '../PassagerDTO';

export const toPassengerDTO = (passenger: Passenger): PassengerDTO => ({
  id: passenger.id,
  userId: passenger.userId,
});
