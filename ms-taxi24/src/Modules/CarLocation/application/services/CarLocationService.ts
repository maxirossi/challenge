import { CarLocation, CarLocationRepository } from '../../domain/interfaces/CarLocationInterface';

export class CarLocationService {
  constructor(private carLocationRepository: CarLocationRepository) {}

  async updateCarLocation(
    carId: string, 
    driverId: string, 
    longitude: number, 
    latitude: number, 
    isAvailable: boolean
  ): Promise<void> {
    await this.carLocationRepository.updateLocation(carId, driverId, longitude, latitude, isAvailable);
  }

  async findNearestCars(
    longitude: number,
    latitude: number,
    limit: number = 3,
    onlyAvailable: boolean = false
  ): Promise<CarLocation[]> {
    return this.carLocationRepository.getNearestCars(longitude, latitude, limit, onlyAvailable);
  }

  async removeCarFromTracking(carId: string): Promise<void> {
    await this.carLocationRepository.removeCar(carId);
  }

  async getCarLocation(carId: string): Promise<CarLocation | null> {
    return this.carLocationRepository.getCarLocation(carId);
  }

  async updateDriverAvailability(carId: string, isAvailable: boolean): Promise<void> {
    await this.carLocationRepository.updateAvailability(carId, isAvailable);
  }

  async updateCarStatus(carId: string, isActive: boolean, isFree: boolean): Promise<void> {
    await this.carLocationRepository.updateCarStatus(carId, isActive, isFree);
  }
} 