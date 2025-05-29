import { Request, Response } from 'express';
import { CarLocationService } from '../../application/services/CarLocationService';
import { HttpResponseCodes } from '@Shared/HttpResponseCodes';
import { ControllerError } from '@Shared/domain/exceptions/ControllerException';

export class CarLocationController {
  constructor(private carLocationService: CarLocationService) {}

  async updateLocation(req: Request, res: Response): Promise<void> {
    try {
      const { carId } = req.params;
      const { driverId, longitude, latitude, isAvailable } = req.body;

      if (!longitude || !latitude || !driverId) {
        throw new ControllerError(
          'DriverId, longitude and latitude are required',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      await this.carLocationService.updateCarLocation(
        carId,
        driverId,
        longitude,
        latitude,
        isAvailable ?? true
      );
      res.status(HttpResponseCodes.OK).json({
        success: true,
        message: 'Location updated successfully'
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getNearestCars(req: Request, res: Response): Promise<void> {
    try {
      const { longitude, latitude, limit = 3, onlyAvailable = false } = req.query;

      if (!longitude || !latitude) {
        throw new ControllerError(
          'Longitude and latitude are required',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      const cars = await this.carLocationService.findNearestCars(
        Number(longitude),
        Number(latitude),
        Number(limit),
        onlyAvailable === 'true'
      );

      res.status(HttpResponseCodes.OK).json({
        success: true,
        data: cars
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getCarLocation(req: Request, res: Response): Promise<void> {
    try {
      const { carId } = req.params;
      const location = await this.carLocationService.getCarLocation(carId);

      if (!location) {
        throw new ControllerError(
          'Car location not found',
          HttpResponseCodes.NOT_FOUND
        );
      }

      res.status(HttpResponseCodes.OK).json({
        success: true,
        data: location
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { carId } = req.params;
      const { isAvailable } = req.body;

      if (typeof isAvailable !== 'boolean') {
        throw new ControllerError(
          'isAvailable must be a boolean value',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      await this.carLocationService.updateDriverAvailability(carId, isAvailable);
      res.status(HttpResponseCodes.OK).json({
        success: true,
        message: 'Availability updated successfully'
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: unknown, res: Response): void {
    if (error instanceof ControllerError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else if (error instanceof Error) {
      res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'An unexpected error occurred'
      });
    }
  }
} 