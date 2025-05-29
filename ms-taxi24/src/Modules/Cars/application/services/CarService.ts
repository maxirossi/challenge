import { Car, CarRepository } from '../../domain/interfaces/CarInterface';

export class CarService {
  constructor(private carRepository: CarRepository) {}

  async createCar(carData: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>): Promise<Car> {
    return this.carRepository.create(carData);
  }

  async getCarById(id: string): Promise<Car | null> {
    return this.carRepository.findById(id);
  }

  async getCarsByDriver(driverId: string): Promise<Car[]> {
    return this.carRepository.findByDriverId(driverId);
  }

  async updateCar(id: string, carData: Partial<Car>): Promise<Car> {
    return this.carRepository.update(id, carData);
  }

  async deleteCar(id: string): Promise<void> {
    await this.carRepository.delete(id);
  }
} 