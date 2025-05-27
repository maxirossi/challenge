import { PrismaClient } from '@prisma/client';
import Logger from '@Shared/domain/Logger';
import { GenericResponse } from '@Shared/dto/GenericResponse';
import { PassengerDTO } from '@Modules/Passenger/model/PassagerDTO';
import { toPassengerDTO } from '@Modules/Passenger/model/Mappers/PassagerMapper';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';

export class PassengerRepository {
  constructor(
    private readonly prisma: PrismaClient = new PrismaClient(),
    private readonly logger: Logger = new WinstonLogger()
  ) {}

  async getAll(): Promise<GenericResponse<PassengerDTO[]>> {
    try {
      const passengers = await this.prisma.passenger.findMany();
      return { success: true, data: passengers.map(toPassengerDTO) };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error retrieving passengers' };
    }
  }

  async getByUuid(uuid: string): Promise<GenericResponse<PassengerDTO>> {
    try {
      const passenger = await this.prisma.passenger.findUnique({
        where: { uuid }
      });

      return passenger
        ? { success: true, data: toPassengerDTO(passenger) }
        : { success: false, message: 'Passenger not found' };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error retrieving passenger' };
    }
  }
}
