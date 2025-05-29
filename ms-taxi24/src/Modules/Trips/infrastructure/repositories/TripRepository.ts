import { PrismaClient } from '@prisma/client';

import { TripInterface } from '@Modules/Trips/model/interfaces/TripInterface';
import Logger from '@Shared/domain/Logger';
import { InternalResponse } from '@Shared/dto/InternalResponse';
import { GenericResponse } from '@Shared/dto/GenericResponse';
import { TripDTO } from '@Modules/Trips/model/TripDTO';
import { toTripDTO } from '@Modules/Trips/model/Mappers/TripMapper';

export class TripRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly logger: Logger
  ) {}

  async create(tripData: TripInterface): Promise<InternalResponse> {
    try {
      const { id, ...createData } = tripData;
      await this.prisma.trip.create({ data: createData });
      return { success: true, message: 'Trip created successfully' };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error creating trip' };
    }
  }

  async getAll(
    page: number,
    perPage: number
  ): Promise<GenericResponse<TripDTO[]>> {
    try {
      const skip = (page - 1) * perPage;
      const trips = await this.prisma.trip.findMany({
        skip,
        take: perPage
      });

      return { success: true, data: trips.map(toTripDTO) };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error retrieving trips' };
    }
  }

  async getById(id: string): Promise<GenericResponse<TripDTO>> {
    try {
      const trip = await this.prisma.trip.findUnique({
        where: { id }
      });

      return trip
        ? { success: true, data: toTripDTO(trip) }
        : { success: false, message: 'Trip not found' };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Cannot get trip' };
    }
  }

  async update(
    id: string,
    tripData: Partial<TripInterface>
  ): Promise<InternalResponse> {
    try {
      const trip = await this.prisma.trip.findUnique({
        where: { id }
      });

      if (!trip) return { success: false, message: 'Trip not found' };

      await this.prisma.trip.update({
        where: { id },
        data: tripData
      });

      return { success: true, message: 'Trip updated successfully' };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error updating trip' };
    }
  }

  async delete(id: string): Promise<InternalResponse> {
    try {
      const trip = await this.prisma.trip.findUnique({ where: { id } });

      if (!trip) return { success: false, message: 'Trip not found' };

      await this.prisma.trip.update({
        where: { id },
        data: { status: 'CANCELLED', cancelledAt: new Date() }
      });

      return { success: true, message: 'Trip deleted' };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error deleting trip' };
    }
  }
}
