import { PrismaClient } from '@prisma/client';
import Logger from '@Shared/domain/Logger';
import { GenericResponse } from '@Shared/dto/GenericResponse';
import { PassengerDTO } from '@Modules/Passengers/model/PassagerDTO';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import { toPassengerDTO } from '@Modules/Passengers/model/Mappers/PassengerMapper';
import { PassengerInterface } from '@Modules/Passengers/model/interfaces/PassengerInterface';

export class PassengerRepository {
  constructor(
    private readonly prisma: PrismaClient = new PrismaClient(),
    private readonly logger: Logger = new WinstonLogger()
  ) {}

  async create(passengerData: PassengerInterface): Promise<GenericResponse<PassengerDTO>> {
    try {
      const { id, ...createData } = passengerData;
      const passenger = await this.prisma.passenger.create({ data: createData });
      return { success: true, data: toPassengerDTO(passenger) };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error creating passenger' };
    }
  }

  async getAll(): Promise<GenericResponse<PassengerDTO[]>> {
    try {
      const passengers = await this.prisma.passenger.findMany();
      return { success: true, data: passengers.map(toPassengerDTO) };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error retrieving passengers' };
    }
  }

  async getById(id: string): Promise<GenericResponse<PassengerDTO>> {
    try {
      const passenger = await this.prisma.passenger.findUnique({
        where: { id }
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
