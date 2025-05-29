import { Name } from '@Shared/domain/value-object/Driver/Name';
import { LastName } from '@Shared/domain/value-object/Driver/LastName';
import { Email } from '@Shared/domain/value-object/Email';
import { Phone } from '@Shared/domain/value-object/Driver/Phone';
import { Active } from '@Shared/domain/value-object/Driver/Active';
import { CreatedAt } from '@Shared/domain/value-object/CreatedAt';
import { Page } from '@Shared/domain/value-object/Page';

import { InternalResponse } from '@Shared/dto/InternalResponse';
import { GenericResponse } from '@Shared/dto/GenericResponse';

import { DriverInterface } from '@Modules/Drivers/model/interfaces/DriverInterface';
import { DriverDTO } from '@Modules/Drivers/model/DriverDTO';

import { DriverRepository } from '@Modules/Drivers/infrastructure/repositories/DriverRepository';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import Logger from '@Shared/domain/Logger';

import { Constants } from '@Modules/Drivers/Shared/constants';
import { CaseUseException } from '@Shared/domain/exceptions/CaseUseException';

import { DriverCreatedEvent } from '@Modules/Drivers/model/events/DriverCreatedEvent';
import { DomainEventDispatcher } from '@Shared/DomainEventDispatcher';

import { PrismaClient } from '@prisma/client';

export class DriversService {
  constructor(
    private readonly driverRepository: DriverRepository = new DriverRepository(
      new PrismaClient(),
      new WinstonLogger()
    ),
    private readonly logger: Logger = new WinstonLogger()
  ) {}

  async create(
    uuid: string,
    name: Name,
    lastName: LastName,
    email: Email,
    phone: Phone,
    active: Active,
    createdAt: CreatedAt,
    userId: number
  ): Promise<InternalResponse> {
    try {
      const driver: DriverInterface = {
        uuid,
        name: name.value,
        lastName: lastName.value,
        email: email.value,
        phone: phone.value,
        active: active.value,
        createdAt: createdAt.value,
        userId
      };

      const event = new DriverCreatedEvent(driver.uuid, driver.email);
      DomainEventDispatcher.dispatch(event);

      return await this.driverRepository.create(driver);
    } catch (error) {
      this.logger.error(error);
      throw new CaseUseException('Error creating driver');
    }
  }

  async getAll(page: Page): Promise<GenericResponse<DriverDTO[]>> {
    const perPage = Constants.RECORDS_PER_PAGE;
    try {
      return await this.driverRepository.getAll(page.getValue(), perPage);
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error fetching drivers' };
    }
  }

  async getAllActive(page: Page): Promise<GenericResponse<DriverDTO[]>> {
    const perPage = Constants.RECORDS_PER_PAGE;
    try {
      return await this.driverRepository.getAllActive(page.getValue(), perPage);
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error fetching drivers' };
    }
  }

  async getById(uuid: string): Promise<GenericResponse<DriverDTO>> {
    try {
      return await this.driverRepository.getDriverById(uuid);
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error fetching driver by ID' };
    }
  }
}
