import { PrismaClient, Prisma } from '@prisma/client';
import { Car, CarPosition, CarRepository as ICarRepository } from '../../domain/interfaces/CarInterface';
import Logger from '@Shared/domain/Logger';
import { CarDTO } from '../../model/CarDTO';
import { toCar, toCarDTO } from '../../model/Mappers/CarMapper';

export class CarRepository implements ICarRepository {
  private prisma: PrismaClient;

  constructor(private readonly logger: Logger) {
    this.prisma = new PrismaClient();
  }

  async create(carData: Omit<Car, 'id' | 'createdAt' | 'updatedAt' | 'position'>): Promise<Car> {
    try {
      const car = await this.prisma.car.create({ 
        data: {
          plate: carData.plate,
          model: carData.model,
          brand: carData.brand,
          year: carData.year,
          color: carData.color,
          driverId: carData.driverId
        },
        include: {
          position: true
        }
      });
      return toCar(car as unknown as CarDTO);
    } catch (error) {
      this.logger.error(error);
      throw new Error('Error creating car');
    }
  }

  async findById(id: string): Promise<Car | null> {
    try {
      const car = await this.prisma.car.findUnique({
        where: { id },
        include: {
          position: true
        }
      });

      return car ? toCar(car as unknown as CarDTO) : null;
    } catch (error) {
      this.logger.error(error);
      throw new Error('Cannot get car');
    }
  }

  async findByDriverId(driverId: string): Promise<Car[]> {
    try {
      const cars = await this.prisma.car.findMany({
        where: { driverId },
        include: {
          position: true
        }
      });

      return cars.map(car => toCar(car as unknown as CarDTO));
    } catch (error) {
      this.logger.error(error);
      throw new Error('Error retrieving cars');
    }
  }

  async update(id: string, carData: Partial<Car>): Promise<Car> {
    try {
      const car = await this.prisma.car.update({
        where: { id },
        data: {
          plate: carData.plate,
          model: carData.model,
          brand: carData.brand,
          year: carData.year,
          color: carData.color,
          driverId: carData.driverId
        },
        include: {
          position: true
        }
      });
      return toCar(car as unknown as CarDTO);
    } catch (error) {
      this.logger.error(error);
      throw new Error('Error updating car');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.car.delete({
        where: { id }
      });
    } catch (error) {
      this.logger.error(error);
      throw new Error('Error deleting car');
    }
  }

  async updateStatus(id: string, isActive: boolean): Promise<void> {
    try {
      await this.prisma.carPosition.update({
        where: { carId: id },
        data: { isActive }
      });
    } catch (error) {
      this.logger.error(error);
      throw new Error('Error updating car status');
    }
  }

  async updateCarPosition(
    carId: string,
    data: {
      latitude: number;
      longitude: number;
      isActive: boolean;
      isFree: boolean;
    }
  ): Promise<CarPosition | null> {
    try {
      const carPosition = await this.prisma.carPosition.upsert({
        where: { carId },
        update: data,
        create: {
          ...data,
          carId
        },
        include: {
          car: true
        }
      });
      return carPosition as unknown as CarPosition;
    } catch (error) {
      this.logger.error(error);
      throw new Error('Error updating car position');
    }
  }

  async getCarPosition(carId: string): Promise<CarPosition | null> {
    try {
      const carPosition = await this.prisma.carPosition.findUnique({
        where: { carId },
        include: {
          car: true
        }
      });
      return carPosition as unknown as CarPosition;
    } catch (error) {
      this.logger.error(error);
      throw new Error('Error getting car position');
    }
  }

  async getActiveCars(): Promise<CarPosition[]> {
    try {
      const carPositions = await this.prisma.carPosition.findMany({
        where: { isActive: true },
        include: {
          car: true
        }
      });
      return carPositions as unknown as CarPosition[];
    } catch (error) {
      this.logger.error(error);
      throw new Error('Error getting active cars');
    }
  }

  async getFreeCars(): Promise<CarPosition[]> {
    try {
      const carPositions = await this.prisma.carPosition.findMany({
        where: { isFree: true },
        include: {
          car: true
        }
      });
      return carPositions as unknown as CarPosition[];
    } catch (error) {
      this.logger.error(error);
      throw new Error('Error getting free cars');
    }
  }
} 