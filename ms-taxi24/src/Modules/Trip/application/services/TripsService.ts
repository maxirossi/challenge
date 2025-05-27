import { Origin } from '@Shared/domain/value-object/Trip/Origin';
import { Destination } from '@Shared/domain/value-object/Trip/Destination';
import { Fare } from '@Shared/domain/value-object/Trip/Fare';
import { Status } from '@Shared/domain/value-object/Trip/Status';
import { CreatedAt } from '@Shared/domain/value-object/CreatedAt';
import { Page } from '@Shared/domain/value-object/Page';

import { InternalResponse } from '@Shared/dto/InternalResponse';
import { GenericResponse } from '@Shared/dto/GenericResponse';

import { TripInterface } from '@Trip/model/interfaces/TripInterface';
import { TripDTO } from '@Modules/Trip/model/TripDTO';

import { TripRepository } from '@Trip/infrastructure/repositories/TripRepository';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import Logger from '@Shared/domain/Logger';

import { Constants } from '@Modules/Trip/Shared/constants';
import { CaseUseException } from '@Shared/domain/exceptions/CaseUseException';

import { TripCreatedEvent } from '@Modules/Trip/model/events/TripCreatedEvent';
import { DomainEventDispatcher } from '@Shared/DomainEventDispatcher';

import { PrismaClient } from '@prisma/client';

export class TripsService {
  constructor(
    private readonly tripRepository: TripRepository = new TripRepository(
      new PrismaClient(),
      new WinstonLogger()
    ),
    private readonly logger: Logger = new WinstonLogger()
  ) {}

  async create(
    uuid: string,
    origin: Origin,
    destination: Destination,
    status: Status,
    fare: Fare,
    driverId: number,
    createdAt: CreatedAt
  ): Promise<InternalResponse> {
    try {
      const trip: TripInterface = {
        uuid,
        origin: origin.value,
        destination: destination.value,
        status: status.value,
        fare: fare.value,
        driverId,
        createdAt: createdAt.value
      };

      const event = new TripCreatedEvent(trip.uuid);
      DomainEventDispatcher.dispatch(event);

      return await this.tripRepository.create(trip);
    } catch (error) {
      this.logger.error(error);
      throw new CaseUseException('Error creating trip');
    }
  }

  async getAll(page: Page): Promise<GenericResponse<TripDTO[]>> {
    const perPage = Constants.RECORDS_PER_PAGE;
    try {
      return await this.tripRepository.getAll(page.getValue(), perPage);
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error fetching trips' };
    }
  }

  async getById(uuid: string): Promise<GenericResponse<TripDTO>> {
    try {
      return await this.tripRepository.getTripById(uuid);
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error fetching trip by ID' };
    }
  }

  async update(
    uuid: string,
    tripData: Partial<TripInterface>
  ): Promise<InternalResponse> {
    try {
      const tripResult = await this.getById(uuid);
      if (!tripResult.success || !tripResult.data) {
        return { success: false, message: 'Trip not found' };
      }

      const updatedTripData: TripInterface = {
        ...tripResult.data,
        ...tripData
      };

      return await this.tripRepository.update(uuid, updatedTripData);
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error updating trip' };
    }
  }

  async delete(uuid: string): Promise<InternalResponse> {
    try {
      return await this.tripRepository.delete(uuid);
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error deleting trip' };
    }
  }
}
