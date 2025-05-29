import { Driver } from '@prisma/client';
import { DriverDTO } from '../DriverDTO';

export const toDriverDTO = (driver: Driver): DriverDTO => ({
  id: driver.id,
  active: driver.active,
  userId: driver.userId,
});
