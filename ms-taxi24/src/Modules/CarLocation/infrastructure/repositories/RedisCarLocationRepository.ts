import Redis from 'ioredis';
import { GeoUtils } from '@Modules/Shared/utils/geo/GeoUtils';
import { CarLocation, CarLocationRepository } from '../../domain/interfaces/CarLocationInterface';

interface RedisGeoPosition {
  [index: number]: [number, number];
}

export class RedisCarLocationRepository implements CarLocationRepository {
  private readonly redis: Redis;
  private readonly LOCATION_KEY = 'car:locations';
  private readonly AVAILABLE_KEY = 'car:available';
  private readonly LOCATION_TTL = 3600; // 1 hora

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    });
  }

  async updateLocation(
    carId: string, 
    driverId: string, 
    longitude: number, 
    latitude: number, 
    isAvailable: boolean
  ): Promise<void> {
    const pipeline = this.redis.pipeline();

    // Actualizar ubicación en GEO
    pipeline.geoadd(this.LOCATION_KEY, longitude, latitude, carId);
    pipeline.expire(this.LOCATION_KEY, this.LOCATION_TTL);

    // Actualizar disponibilidad
    if (isAvailable) {
      pipeline.sadd(this.AVAILABLE_KEY, carId);
    } else {
      pipeline.srem(this.AVAILABLE_KEY, carId);
    }

    await pipeline.exec();
  }

  async getNearestCars(
    longitude: number,
    latitude: number,
    limit: number,
    onlyAvailable: boolean = false
  ): Promise<CarLocation[]> {
    // Obtener los N carros más cercanos
    const nearestCars = await this.redis.georadius(
      this.LOCATION_KEY,
      longitude,
      latitude,
      'inf', // Radio infinito para obtener todos
      'km',
      'WITHCOORD',
      'WITHDIST',
      'COUNT',
      limit,
      'ASC' // Ordenar por distancia ascendente
    );

    if (!nearestCars || nearestCars.length === 0) {
      return [];
    }

    // Si solo queremos conductores disponibles, filtramos
    let filteredCars = nearestCars;
    if (onlyAvailable) {
      const availableCars = await this.redis.smembers(this.AVAILABLE_KEY);
      const availableSet = new Set(availableCars);
      filteredCars = nearestCars.filter((car: any) => availableSet.has(car[0]));
    }

    // Construir respuesta
    return filteredCars.map((car: any) => {
      const [carId, [carLongitude, carLatitude], distance] = car;
      const distanceKm = parseFloat(distance);
      
      return {
        carId,
        driverId: carId, // En este caso usamos el carId como driverId
        longitude: parseFloat(carLongitude),
        latitude: parseFloat(carLatitude),
        distance: distanceKm,
        eta: GeoUtils.calculateETA(distanceKm),
        lastUpdate: Date.now(),
        isAvailable: onlyAvailable ? true : false // Si filtramos por disponibles, sabemos que están disponibles
      };
    });
  }

  async removeCar(carId: string): Promise<void> {
    const pipeline = this.redis.pipeline();
    pipeline.zrem(this.LOCATION_KEY, carId);
    pipeline.srem(this.AVAILABLE_KEY, carId);
    await pipeline.exec();
  }

  async getCarLocation(carId: string): Promise<CarLocation | null> {
    const pipeline = this.redis.pipeline();
    pipeline.geopos(this.LOCATION_KEY, carId);
    pipeline.sismember(this.AVAILABLE_KEY, carId);
    
    const results = await pipeline.exec();
    if (!results) return null;

    const [[err1, position], [err2, isAvailable]] = results;
    if (err1 || err2) return null;

    const geoPosition = position as RedisGeoPosition;
    if (!geoPosition || !geoPosition[0]) {
      return null;
    }

    const [longitude, latitude] = geoPosition[0];
    return {
      carId,
      driverId: carId, // En este caso usamos el carId como driverId
      longitude,
      latitude,
      lastUpdate: Date.now(),
      isAvailable: isAvailable === 1
    };
  }

  async updateAvailability(carId: string, isAvailable: boolean): Promise<void> {
    if (isAvailable) {
      await this.redis.sadd(this.AVAILABLE_KEY, carId);
    } else {
      await this.redis.srem(this.AVAILABLE_KEY, carId);
    }
  }

  async updateCarStatus(carId: string, isActive: boolean, isFree: boolean): Promise<void> {
    const pipeline = this.redis.pipeline();

    if (isActive) {
      // Si el carro está activo, lo mantenemos en el GEO
      if (isFree) {
        // Si está libre, lo añadimos a los disponibles
        pipeline.sadd(this.AVAILABLE_KEY, carId);
      } else {
        // Si está ocupado, lo removemos de los disponibles
        pipeline.srem(this.AVAILABLE_KEY, carId);
      }
    } else {
      // Si el carro está inactivo, lo removemos de todo
      pipeline.zrem(this.LOCATION_KEY, carId);
      pipeline.srem(this.AVAILABLE_KEY, carId);
    }

    await pipeline.exec();
  }
} 