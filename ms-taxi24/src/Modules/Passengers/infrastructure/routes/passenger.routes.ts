import { Router } from 'express';
import { PassengerController } from '../controllers/PassengerController';
import { PassengerService } from '../../application/services/PassengerService';
import { PassengerRepository } from '../repositories/PassengerRepository';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import { PrismaClient } from '@prisma/client';

const router = Router();
const passengerRepository = new PassengerRepository(new PrismaClient(), new WinstonLogger());
const passengerService = new PassengerService(passengerRepository, new WinstonLogger());
const passengerController = new PassengerController(passengerService);

router.get('/', (req, res) => passengerController.getAllPassengers(req, res));
router.get('/:userId', (req, res) => passengerController.getPassengerById(req, res));

export default router; 