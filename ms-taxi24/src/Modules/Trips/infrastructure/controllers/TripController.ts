import { Request, Response } from 'express';
import { TripService } from '@Modules/Trips/application/services/TripService';
import { TripRepository } from '../repositories/TripRepository';
import { PrismaClient } from '@prisma/client';
import Logger from '@Shared/domain/Logger';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import { HttpResponseCodes } from '@Shared/HttpResponseCodes';
import { ControllerError } from '@Shared/domain/exceptions/ControllerException';

export class TripController {
  constructor(
    private readonly tripService: TripService = new TripService(
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
      const tripData = {
        origin: req.body.origin,
        destination: req.body.destination,
        status: req.body.status,
        fare: req.body.fare,
        driverId: req.body.driverId,
        passengerId: req.body.passengerId
      };

      const response = await this.tripService.create(tripData);

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
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 10;
      const response = await this.tripService.getAll(page, perPage);

      if (!response.success)
        throw new ControllerError(
          'Error getting all trips',
          HttpResponseCodes.BAD_REQUEST
        );

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getTripById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const response = await this.tripService.getById(id);

      if (!response.success)
        throw new ControllerError(
          'Error getting trip by id',
          HttpResponseCodes.BAD_REQUEST
        );

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateTrip(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const tripData = {
        origin: req.body.origin,
        destination: req.body.destination,
        fare: req.body.fare,
        status: req.body.status
      };

      const response = await this.tripService.update(id, tripData);

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
      const { id } = req.params;
      const response = await this.tripService.delete(id);

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