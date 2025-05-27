import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { Uuid } from '@Shared/domain/value-object/Uuid';
import { Origin } from '@Shared/domain/value-object/Trip/Origin';
import { Destination } from '@Shared/domain/value-object/Trip/Destination';
import { CreatedAt } from '@Shared/domain/value-object/CreatedAt';
import { Page } from '@Shared/domain/value-object/Page';

import { HttpResponseCodes } from '@Shared/HttpResponseCodes';
import { TripsService } from '@Trip/application/services/TripsService';
import Logger from '@Shared/domain/Logger';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import { GeneralConstants } from '@Shared/constants';
import { ControllerError } from '@Shared/domain/exceptions/ControllerException';
import { TripRepository } from '../repositories/TripRepository';
import { PrismaClient } from '@prisma/client';
import { Status } from '@Shared/domain/value-object/Trip/Status';
import { Fare } from '@Shared/domain/value-object/Trip/Fare';

export class TripsController {
  constructor(
    private readonly tripService: TripsService = new TripsService(
      new TripRepository(new PrismaClient(), new WinstonLogger()),
      new WinstonLogger()
    ),
    private readonly logger: Logger = new WinstonLogger()
  ) {}

  private handleError(error: unknown, res: Response): void {
    this.logger.error(error);
    const status =
      error instanceof ControllerError
        ? HttpResponseCodes.BAD_REQUEST
        : HttpResponseCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json({ success: false });
  }

  async createTrip(req: Request, res: Response): Promise<void> {
    try {
      const uuid = new Uuid(uuidv4());
      const origin = new Origin(req.body.origin);
      const destination = new Destination(req.body.destination);
      const status = new Status(req.body.status);
      const fare = new Fare(req.body.fare);
      const driverId = Number(req.body.driverId);
      const createdAt = new CreatedAt(new Date());

      const response = await this.tripService.create(
        uuid.valueAsString,
        origin,
        destination,
        status,
        fare,
        driverId,
        createdAt
      );

      if (!response.success)
        throw new ControllerError(
          'Error creating new trip',
          HttpResponseCodes.BAD_REQUEST
        );

      res.status(HttpResponseCodes.CREATED).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getAllTrips(req: Request, res: Response): Promise<void> {
    try {
      const pageParam = req.query.page;
      const page = new Page(parseInt(pageParam as string) || 1);
      const response = await this.tripService.getAll(page);

      if (!response.success)
        throw new ControllerError(
          'Error getting all trips',
          HttpResponseCodes.BAD_REQUEST
        );

      res.status(HttpResponseCodes.OK).send({
        status: GeneralConstants.STATUS_OK,
        trips: response.data
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getTripById(req: Request, res: Response): Promise<void> {
    try {
      const uuidParam = req.params.tripId;
      const response = await this.tripService.getById(uuidParam);

      if (!response.success)
        throw new ControllerError(
          'Error getting trip by uuid',
          HttpResponseCodes.BAD_REQUEST
        );

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateTrip(req: Request, res: Response): Promise<void> {
    try {
      const uuidParam = req.params.tripId;
      const origin = req.body.origin
        ? new Origin(req.body.origin).value
        : undefined;
      const destination = req.body.destination
        ? new Destination(req.body.destination).value
        : undefined;
      const fare = req.body.fare ? new Fare(req.body.fare).value : undefined;
      const status = req.body.status
        ? new Status(req.body.status).value
        : undefined;

      const response = await this.tripService.update(uuidParam, {
        origin,
        destination,
        fare,
        status
      });

      if (!response.success)
        throw new ControllerError(
          'Error updating trip',
          HttpResponseCodes.BAD_REQUEST
        );

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async deleteTrip(req: Request, res: Response): Promise<void> {
    try {
      const uuidParam = req.params.tripId;
      const response = await this.tripService.delete(uuidParam);

      if (!response.success)
        throw new ControllerError(
          'Error deleting trip',
          HttpResponseCodes.BAD_REQUEST
        );

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }
}
