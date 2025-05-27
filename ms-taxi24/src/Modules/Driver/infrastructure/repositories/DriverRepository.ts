import { PrismaClient } from '@prisma/client';

import { DriverInterface } from '@Driver/model/interfaces/DriverInterface';
import Logger from '@Shared/domain/Logger';
import { InternalResponse } from '@Shared/dto/InternalResponse';
import { GenericResponse } from '@Shared/dto/GenericResponse';
import { DriverDTO } from '@Modules/Driver/model/DriverDTO';
import { toDriverDTO } from '@Driver/model/Mappers/DriverMapper';

export class DriverRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly logger: Logger
  ) {}

  async create(driverData: DriverInterface): Promise<InternalResponse> {
    try {
      const { id, ...createData } = driverData;
      await this.prisma.driver.create({ data: createData });
      return { success: true, message: 'Driver created successfully' };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error creating driver' };
    }
  }

  async getAll(
    page: number,
    perPage: number
  ): Promise<GenericResponse<DriverDTO[]>> {
    try {
      const skip = (page - 1) * perPage;
      const drivers = await this.prisma.driver.findMany({
        skip,
        take: perPage
      });

      return { success: true, data: drivers.map(toDriverDTO) };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error retrieving drivers' };
    }
  }

  async getAllActive(
    page: number,
    perPage: number
  ): Promise<GenericResponse<DriverDTO[]>> {
    try {
      const skip = (page - 1) * perPage;
      const drivers = await this.prisma.driver.findMany({
        where: { active: true },
        skip,
        take: perPage
      });

      return { success: true, data: drivers.map(toDriverDTO) };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error retrieving drivers' };
    }
  }

  async getDriverById(uuid: string): Promise<GenericResponse<DriverDTO>> {
    try {
      const driver = await this.prisma.driver.findUnique({
        where: { uuid, active: true }
      });

      return driver
        ? { success: true, data: toDriverDTO(driver) }
        : { success: false, message: 'Driver not found' };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Cannot get driver' };
    }
  }

  async getByEmail(email: string): Promise<GenericResponse<DriverInterface>> {
    try {
      const driver = await this.prisma.driver.findUnique({
        where: { email, active: true }
      });
      return driver
        ? { success: true, data: driver }
        : { success: false, message: 'Driver not found by email' };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Cannot get driver by email' };
    }
  }
}
