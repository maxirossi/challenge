// src/Modules/User/model/Mappers/UserMapper.ts

import { User } from '@prisma/client';
import { UserDTO } from '../UserDTO';

export const toUserDTO = (user: User): UserDTO => ({
  uuid: user.uuid,
  name: user.name,
  email: user.email,
  lastName: user.lastName,
  user: user.user,
  active: user.active,
  createdAt: user.createdAt.toISOString(),
  deletedAt: user.deletedAt?.toISOString() ?? null,
  modifiedAt: user.modifiedAt?.toISOString() ?? null
});
