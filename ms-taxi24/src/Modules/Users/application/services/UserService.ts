import { Name } from '@Shared/domain/value-object/User/Name';
import { LastName } from '@Shared/domain/value-object/User/LastName';
import { Email } from '@Shared/domain/value-object/Email';
import { UserName } from '@Shared/domain/value-object/User/UserName';
import { Active } from '@Shared/domain/value-object/User/Active';
import { CreatedAt } from '@Shared/domain/value-object/CreatedAt';
import { Page } from '@Shared/domain/value-object/Page';

import { InternalResponse } from '@Shared/dto/InternalResponse';
import { GenericResponse } from '@Shared/dto/GenericResponse';


import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import Logger from '@Shared/domain/Logger';

import { CaseUseException } from '@Shared/domain/exceptions/CaseUseException';

import { DomainEventDispatcher } from '@Shared/DomainEventDispatcher';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { UserCreatedEvent } from '@Modules/Users/model/events/UserCreatedEvent';
import { Constants } from '@Modules/Users/Shared/constants';
import { UserRepository } from '@Modules/Users/infrastructure/repositories/UserRepository';
import { UserDTO } from '@Modules/Users/model/UserDTO';
import { UserInterface } from '@Modules/Users/model/interfaces/UserInterface';

export class UserService {
  constructor(
    private readonly userRepository: UserRepository = new UserRepository(
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
    userName: UserName,
    password: string,
    active: Active,
    createdAt: CreatedAt
  ): Promise<InternalResponse> {
    try {
      const user: UserInterface = {
        uuid,
        name: name.value,
        lastName: lastName.value,
        email: email.value,
        user: userName.value,
        password,
        active: active.value,
        createdAt: createdAt.value
      };

      const event = new UserCreatedEvent(user.uuid, user.email);
      DomainEventDispatcher.dispatch(event);

      return await this.userRepository.create(user);

    } catch (error) {
      this.logger.error(error);
      throw new CaseUseException('Error creating user');
    }
  }

  async getAll(page: Page): Promise<GenericResponse<UserDTO[]>> {
    const perPage = Constants.RECORDS_PER_PAGE;
    try {
      return await this.userRepository.getAll(page.getValue(), perPage);
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error fetching users' };
    }
  }

  async getById(uuid: string): Promise<GenericResponse<UserDTO>> {
    try {
      return await this.userRepository.getUserById(uuid);
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error fetching user by ID' };
    }
  }

  async update(uuid: string, userData: Partial<UserInterface>): Promise<InternalResponse> {
    try {
      const userResult = await this.getById(uuid);
      if (!userResult.success || !userResult.data) {
        return { success: false, message: 'User not found' };
      }

      const updatedUserData: UserInterface = {
        ...userResult.data,
        ...userData,
        password: userData.password ?? ''
      };


      return await this.userRepository.update(uuid, updatedUserData);
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error updating user' };
    }
  }

  async delete(uuid: string): Promise<InternalResponse> {
    try {
      return await this.userRepository.delete(uuid);
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error deleting user' };
    }
  }

  async authenticate(email: Email, password: string): Promise<InternalResponse> {
    try {
      const userResult = await this.userRepository.getByEmail(email.value);
      if (!userResult.success || !userResult.data) {
        return { success: false, message: 'User not found' };
      }

      const validPassword = await bcrypt.compare(password, userResult.data.password);
      if (!validPassword) {
        return { success: false, message: 'Invalid password' };
      }

      return { success: true, message: 'Authentication successful' };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Authentication failed' };
    }
  }
} 