import { CarPosition } from '../domain/interfaces/CarInterface';

export interface CarDTO {
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