import { Router, Request, Response } from 'express';
import { DriverLocationController } from '../controllers/DriverLocationController';
import { DriverLocationService } from '../../application/services/DriverLocationService';
import { RedisDriverLocationService } from '../services/RedisDriverLocationService';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';

const router = Router();
const logger = new WinstonLogger();
const redisDriverLocationService = new RedisDriverLocationService(logger);
const driverLocationService = new DriverLocationService(redisDriverLocationService, logger);
const driverLocationController = new DriverLocationController(driverLocationService, logger);

// Get the three nearest drivers to a location
router.get('/nearest', (req: Request, res: Response) => driverLocationController.findNearestDrivers(req, res));

// Get a specific driver's location
router.get('/:driverId/location', (req: Request, res: Response) => driverLocationController.getDriverLocation(req, res));

// Update driver location
router.put('/:driverId/location', (req: Request, res: Response) => driverLocationController.updateDriverLocation(req, res));

// Update driver availability
router.patch('/:driverId/availability', (req: Request, res: Response) => driverLocationController.updateDriverAvailability(req, res));

// Update driver status
router.patch('/:driverId/status', (req: Request, res: Response) => driverLocationController.updateDriverStatus(req, res));

// Remove driver
router.delete('/:driverId', (req: Request, res: Response) => driverLocationController.removeDriver(req, res));

export default router; 