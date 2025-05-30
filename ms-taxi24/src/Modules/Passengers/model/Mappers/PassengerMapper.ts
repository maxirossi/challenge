import { PrismaClient } from '@prisma/client';
import { PassengerDTO } from '../PassengerDTO';
import { UserDTO } from '@Modules/Users/model/UserDTO';
import { toUserDTO } from '@Modules/Users/model/Mappers/UserMapper';

type Passenger = PrismaClient['passenger']['findUnique']['result'];

export const toPassengerDTO = (data: any): PassengerDTO => {
  return {
    id: data.id,
    userId: data.userId,
    isActive: data.isActive,
    user: data.user ? toUserDTO(data.user) : undefined
  };
};
