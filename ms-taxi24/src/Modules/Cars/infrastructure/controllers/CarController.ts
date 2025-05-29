import { Request, Response } from 'express';
import { CarService } from '../../application/services/CarService';
import { HttpResponseCodes } from '@Shared/HttpResponseCodes';
import { ControllerError } from '@Shared/domain/exceptions/ControllerException';
import { CarLocationService } from '../../application/services/CarLocationService';

export class CarController {
  constructor(
    private carService: CarService,
    private carLocationService: CarLocationService
  ) {}

  async createCar(req: Request, res: Response): Promise<void> {
    try {
      const { driverId, plate, brand, model, year, color } = req.body;

      if (!driverId || !plate || !brand || !model || !year || !color) {
        throw new ControllerError(
          'All fields are required',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      const car = await this.carService.createCar({
        driverId,
        plate,
        brand,
        model,
        year,
        color
      });

      res.status(HttpResponseCodes.CREATED).json({
        success: true,
        data: car
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getCarById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const car = await this.carService.getCarById(id);

      if (!car) {
        throw new ControllerError(
          'Car not found',
          HttpResponseCodes.NOT_FOUND
        );
      }

      res.status(HttpResponseCodes.OK).json({
        success: true,
        data: car
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getCarsByDriver(req: Request, res: Response): Promise<void> {
    try {
      const { driverId } = req.params;
      const cars = await this.carService.getCarsByDriver(driverId);

      res.status(HttpResponseCodes.OK).json({
        success: true,
        data: cars
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateCar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { plate, brand, model, year, color } = req.body;

      const car = await this.carService.updateCar(id, {
        plate,
        brand,
        model,
        year,
        color
      });

      res.status(HttpResponseCodes.OK).json({
        success: true,
        data: car
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async deleteCar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.carService.deleteCar(id);

      res.status(HttpResponseCodes.OK).json({
        success: true,
        message: 'Car deleted successfully'
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateCarLocation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { latitude, longitude, isActive, isFree } = req.body;

      if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        throw new ControllerError(
          'latitude and longitude must be numbers',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      if (typeof isActive !== 'boolean' || typeof isFree !== 'boolean') {
        throw new ControllerError(
          'isActive and isFree must be boolean values',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      const carPosition = await this.carLocationService.updateCarLocation(id, {
        latitude,
        longitude,
        isActive,
        isFree
      });

      if (!carPosition) {
        throw new ControllerError(
          'Car not found',
          HttpResponseCodes.NOT_FOUND
        );
      }

      res.status(HttpResponseCodes.OK).json({
        success: true,
        data: carPosition
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getCarLocation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const carPosition = await this.carLocationService.getCarLocation(id);

      if (!carPosition) {
        throw new ControllerError(
          'Car location not found',
          HttpResponseCodes.NOT_FOUND
        );
      }

      res.status(HttpResponseCodes.OK).json({
        success: true,
        data: carPosition
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getActiveCars(req: Request, res: Response): Promise<void> {
    try {
      const cars = await this.carLocationService.getActiveCars();

      res.status(HttpResponseCodes.OK).json({
        success: true,
        data: cars
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getFreeCars(req: Request, res: Response): Promise<void> {
    try {
      const cars = await this.carLocationService.getFreeCars();

      res.status(HttpResponseCodes.OK).json({
        success: true,
        data: cars
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: unknown, res: Response): void {
    if (error instanceof ControllerError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 