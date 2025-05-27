import { Request, Response } from 'express';
import { PassengersService } from '@Modules/Passenger/application/PassengersService';
import Logger from '@Shared/domain/Logger';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import { HttpResponseCodes } from '@Shared/HttpResponseCodes';
import { ControllerError } from '@Shared/domain/exceptions/ControllerException';
import { PassengerRepository } from '@Modules/Passenger/infrastructure/repositories/PassengerRepository';
import { PrismaClient } from '@prisma/client';

export class PassengerController {
  constructor(
    private readonly passengerService: PassengersService = new PassengersService(
      new PassengerRepository(new PrismaClient(), new WinstonLogger()),
      new WinstonLogger()
    ),
    private readonly logger: Logger = new WinstonLogger()
  ) {}

  private handleError(error: unknown, res: Response): void {
    this.logger.error(error);
    const status = error instanceof ControllerError
      ? HttpResponseCodes.BAD_REQUEST
      : HttpResponseCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json({ success: false });
  }

  async getAllPassengers(req: Request, res: Response): Promise<void> {
    try {
      const response = await this.passengerService.getAll();

      if (!response.success) throw new ControllerError('Error getting all passengers', HttpResponseCodes.BAD_REQUEST);

      res.status(HttpResponseCodes.OK).json({
        success: true,
        passengers: response.data
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getPassengerById(req: Request, res: Response): Promise<void> {
    try {
      const uuid = req.params.passengerId;
      const response = await this.passengerService.getByUuid(uuid);

      if (!response.success) throw new ControllerError('Error getting passenger by uuid', HttpResponseCodes.BAD_REQUEST);

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }
}
