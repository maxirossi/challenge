import { PrismaClient } from '@prisma/client';

import { UserInterface } from '@User/model/interfaces/UserInterface';
import Logger from '@Shared/domain/Logger';
import { InternalResponse } from '@Shared/dto/InternalResponse';
import { GenericResponse } from '@Shared/dto/GenericResponse';
import { UserDTO } from '@Modules/User/model/UserDTO';
import { toUserDTO } from '@User/model/Mappers/UserMapper';

export class UserRepository {
  
  constructor(
    private readonly prisma: PrismaClient,
    private readonly logger: Logger
  ) {}

  async create(userData: UserInterface): Promise<InternalResponse> {
    try {
      const { id, ...createData } = userData; 
      await this.prisma.user.create({ data: createData });
      return { success: true, message: 'User created successfully' };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error creating user' };
    }
  }

  async getAll(page: number, perPage: number): Promise<GenericResponse<UserDTO[]>> {
    try {
      const skip = (page - 1) * perPage;
      const users = await this.prisma.user.findMany({
        where: { active: true },
        skip,
        take: perPage
      });

      return { success: true, data: users.map(toUserDTO) };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error retrieving users' };
    }
  }

  async getUserById(uuid: string): Promise<GenericResponse<UserDTO>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { uuid, active: true }
      });

      return user
        ? { success: true, data: toUserDTO(user) }
        : { success: false, message: 'User not found' };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Cannot get user' };
    }
  }

  async update(uuid: string, userData: UserInterface): Promise<InternalResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { uuid, active: true }
      });

      if (!user) return { success: false, message: 'User not found' };

      const { id, ...updatedData } = userData;
      await this.prisma.user.update({
        where: { uuid },
        data: updatedData
      });

      return { success: true, message: 'User updated successfully' };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error updating user' };
    }
  }

  async delete(uuid: string): Promise<InternalResponse> {
    try {
      const user = await this.prisma.user.findUnique({ where: { uuid } });

      if (!user) return { success: false, message: 'User not found' };

      await this.prisma.user.update({
        where: { uuid },
        data: { active: false, deletedAt: new Date() }
      });

      return { success: true, message: 'User deleted' };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error deleting user' };
    }
  }

  async getByEmail(email: string): Promise<GenericResponse<UserInterface>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email, active: true }
      });
      return user
        ? { success: true, data: user } 
        : { success: false, message: 'User not found by email' };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Cannot get user by email' };
    }
  }
}
