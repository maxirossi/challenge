import { Router } from 'express';
import { DriverController } from '../controllers/DriverController';
import { DriversService } from '../../application/services/DriverService';
import { DriverRepository } from '../repositories/DriverRepository';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import { PrismaClient } from '@prisma/client';

const router = Router();
const driverRepository = new DriverRepository(new PrismaClient(), new WinstonLogger());
const driverService = new DriversService(driverRepository, new WinstonLogger());
const driverController = new DriverController(driverService, new WinstonLogger());

router.get('/', (req, res) => driverController.getAllDrivers(req, res));
router.get('/active', (req, res) => driverController.getAllDriversActive(req, res));
router.get('/:driverId', (req, res) => driverController.getDriverById(req, res));
router.post('/', (req, res) => driverController.createDriver(req, res));
router.put('/:driverId', (req, res) => driverController.updateDriver(req, res));
router.delete('/:driverId', (req, res) => driverController.deleteDriver(req, res));
router.post('/:driverId/car', (req, res) => driverController.assignCar(req, res));

export default router; 