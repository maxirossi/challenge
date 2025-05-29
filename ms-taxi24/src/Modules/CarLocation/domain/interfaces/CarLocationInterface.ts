export interface CarLocation {
  carId: string;
  driverId: string;
  longitude: number;
  latitude: number;
  lastUpdate: number;
  distance?: number;
  eta?: number;
  isAvailable: boolean;
}

export interface CarLocationRepository {
  updateLocation(carId: string, driverId: string, longitude: number, latitude: number, isAvailable: boolean): Promise<void>;
  getNearestCars(longitude: number, latitude: number, limit: number, onlyAvailable?: boolean): Promise<CarLocation[]>;
  removeCar(carId: string): Promise<void>;
  getCarLocation(carId: string): Promise<CarLocation | null>;
  updateAvailability(carId: string, isAvailable: boolean): Promise<void>;
  updateCarStatus(carId: string, isActive: boolean, isFree: boolean): Promise<void>;
} 