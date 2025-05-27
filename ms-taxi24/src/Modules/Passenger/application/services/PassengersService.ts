import { PassengerRepository } from '@Modules/Passenger/infrastructure/repositories/PassengerRepository';
import { GenericResponse } from '@Shared/dto/GenericResponse';
import { PassengerDTO } from '@Modules/Passenger/model/PassagerDTO';
import Logger from '@Shared/domain/Logger';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import { CaseUseException } from '@Shared/domain/exceptions/CaseUseException';

export class PassengersService {
  constructor(
    private readonly passengerRepository: PassengerRepository = new PassengerRepository(),
    private readonly logger: Logger = new WinstonLogger()
  ) {}

  async getAll(): Promise<GenericResponse<PassengerDTO[]>> {
    try {
      return await this.passengerRepository.getAll();
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error fetching passengers' };
    }
  }

  async getByUuid(uuid: string): Promise<GenericResponse<PassengerDTO>> {
    try {
      return await this.passengerRepository.getByUuid(uuid);
    } catch (error) {
      this.logger.error(error);
      throw new CaseUseException('Error fetching passenger by ID');
    }
  }
}
