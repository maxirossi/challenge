import { Car } from '../../domain/interfaces/CarInterface';
import { CarDTO } from '../CarDTO';

export const toCarDTO = (car: Car): CarDTO => {
  return {
    id: car.id,
    plate: car.plate,
    model: car.model,
    brand: car.brand,
    year: car.year,
    color: car.color,
    driverId: car.driverId,
    createdAt: car.createdAt,
    updatedAt: car.updatedAt,
    position: car.position ? {
      id: car.position.id,
      carId: car.position.carId,
      latitude: car.position.latitude,
      longitude: car.position.longitude,
      isActive: car.position.isActive,
      isFree: car.position.isFree,
      updatedAt: car.position.updatedAt
    } : undefined
  };
};

export const toCar = (carDTO: CarDTO): Car => {
  return {
    id: carDTO.id,
    plate: carDTO.plate,
    model: carDTO.model,
    brand: carDTO.brand,
    year: carDTO.year,
    color: carDTO.color,
    driverId: carDTO.driverId,
    createdAt: carDTO.createdAt,
    updatedAt: carDTO.updatedAt,
    position: carDTO.position ? {
      id: carDTO.position.id,
      carId: carDTO.position.carId,
      latitude: carDTO.position.latitude,
      longitude: carDTO.position.longitude,
      isActive: carDTO.position.isActive,
      isFree: carDTO.position.isFree,
      updatedAt: carDTO.position.updatedAt
    } : undefined
  };
}; 