import { PrismaClient } from '@prisma/client';
import { TripRepository } from '@Modules/Trips/infrastructure/repositories/TripRepository';
import { TripInterface } from '@Modules/Trips/model/interfaces/TripInterface';
import { TripDTO } from '@Modules/Trips/model/TripDTO';
import { InternalResponse } from '@Shared/dto/InternalResponse';
import { GenericResponse } from '@Shared/dto/GenericResponse';
import Logger from '@Shared/domain/Logger';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import { CaseUseException } from '@Shared/domain/exceptions/CaseUseException';

export class TripService {
  constructor(
    private readonly tripRepository: TripRepository = new TripRepository(
      new PrismaClient(),
      new WinstonLogger()
    ),
    private readonly logger: Logger = new WinstonLogger()
  ) {}

  async create(tripData: TripInterface): Promise<InternalResponse> {
    try {
      return await this.tripRepository.create(tripData);
    } catch (error) {
      this.logger.error(error);
      throw new CaseUseException('Error creating trip');
    }
  }

  async getAll(page: number, perPage: number): Promise<GenericResponse<TripDTO[]>> {
    try {
      return await this.tripRepository.getAll(page, perPage);
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error fetching trips' };
    }
  }

  async getById(id: string): Promise<GenericResponse<TripDTO>> {
    try {
      return await this.tripRepository.getById(id);
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error fetching trip by ID' };
    }
  }

  async update(id: string, tripData: Partial<TripInterface>): Promise<InternalResponse> {
    try {
      const tripResult = await this.getById(id);
      if (!tripResult.success || !tripResult.data) {
        return { success: false, message: 'Trip not found' };
      }

      const updatedTripData: TripInterface = {
        id: tripResult.data.id,
        origin: tripResult.data.origin,
        destination: tripResult.data.destination,
        status: tripResult.data.status,
        fare: tripResult.data.fare,
        driverId: String(tripResult.data.driverId),
        passengerId: tripResult.data.passengerId,
        ...tripData
      };

      return await this.tripRepository.update(id, updatedTripData);
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error updating trip' };
    }
  }

  async delete(id: string): Promise<InternalResponse> {
    try {
      return await this.tripRepository.delete(id);
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error deleting trip' };
    }
  }
} 