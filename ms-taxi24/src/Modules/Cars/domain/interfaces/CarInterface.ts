export interface Car {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: number;
  color: string;
  driverId: string;
  createdAt: Date;
  updatedAt: Date;
  position?: CarPosition;
}

export interface CarPosition {
  id: string;
  carId: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  isFree: boolean;
  updatedAt: Date;
  car?: Car;
}

export interface CarRepository {
  create(car: Omit<Car, 'id' | 'createdAt' | 'updatedAt' | 'position'>): Promise<Car>;
  findById(id: string): Promise<Car | null>;
  findByDriverId(driverId: string): Promise<Car[]>;
  update(id: string, car: Partial<Car>): Promise<Car>;
  delete(id: string): Promise<void>;
  updateCarPosition(carId: string, data: {
    latitude: number;
    longitude: number;
    isActive: boolean;
    isFree: boolean;
  }): Promise<CarPosition | null>;
  getCarPosition(carId: string): Promise<CarPosition | null>;
  getActiveCars(): Promise<CarPosition[]>;
  getFreeCars(): Promise<CarPosition[]>;
} 