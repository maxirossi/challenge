import { CarPosition, CarRepository } from '../../domain/interfaces/CarInterface';

export class CarLocationService {
  constructor(private carRepository: CarRepository) {}

  async updateCarLocation(
    carId: string,
    data: {
      latitude: number;
      longitude: number;
      isActive: boolean;
      isFree: boolean;
    }
  ): Promise<CarPosition | null> {
    return this.carRepository.updateCarPosition(carId, data);
  }

  async getCarLocation(carId: string): Promise<CarPosition | null> {
    return this.carRepository.getCarPosition(carId);
  }

  async getActiveCars(): Promise<CarPosition[]> {
    return this.carRepository.getActiveCars();
  }

  async getFreeCars(): Promise<CarPosition[]> {
    return this.carRepository.getFreeCars();
  }
} 