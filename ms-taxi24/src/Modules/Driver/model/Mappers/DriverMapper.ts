import { Driver } from '@prisma/client';
import { DriverDTO } from '../DriverDTO';

export const toDriverDTO = (driver: Driver): DriverDTO => ({
  uuid: driver.uuid,
  name: driver.name,
  lastName: driver.lastName,
  email: driver.email,
  phone: driver.phone,
  active: driver.active,
  createdAt: driver.createdAt.toISOString(),
  updatedAt: driver.updatedAt?.toISOString() ?? null,
  deletedAt: driver.deletedAt?.toISOString() ?? null
});
