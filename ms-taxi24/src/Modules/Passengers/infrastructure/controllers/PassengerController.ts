import { Request, Response } from 'express';
import { HttpResponseCodes } from '@Shared/HttpResponseCodes';
import { ControllerError } from '@Shared/domain/exceptions/ControllerException';
import { PassengerService } from '@Modules/Passengers/application/services/PassengerService';

export class PassengerController {
  private passengerService: PassengerService;

  constructor(passengerService: PassengerService) {
    this.passengerService = passengerService;
  }

  async createPassenger(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body.userId;
      const response = await this.passengerService.create(userId);

      if (!response.success)
        throw new ControllerError(
          'Error creating new passenger',
          HttpResponseCodes.BAD_REQUEST
        );

      res.status(HttpResponseCodes.CREATED).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getAllPassengers(req: Request, res: Response): Promise<void> {
    try {
      const response = await this.passengerService.getAll();
      
      if (!response.success)
        throw new ControllerError(
          'Error fetching passengers',
          HttpResponseCodes.INTERNAL_SERVER_ERROR
        );

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getPassengerById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const response = await this.passengerService.getById(id);

      if (!response.success)
        throw new ControllerError(
          'Passenger not found',
          HttpResponseCodes.NOT_FOUND
        );

      res.status(HttpResponseCodes.OK).json(response);
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