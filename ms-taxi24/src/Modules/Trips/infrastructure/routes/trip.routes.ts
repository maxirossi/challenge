import { Router } from 'express';
import { TripController } from '../controllers/TripController';
import { TripService } from '../../application/services/TripService';
import { TripRepository } from '../repositories/TripRepository';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import { PrismaClient } from '@prisma/client';

const router = Router();
const tripRepository = new TripRepository(new PrismaClient(), new WinstonLogger());
const tripService = new TripService(tripRepository, new WinstonLogger());
const tripController = new TripController(tripService, new WinstonLogger());

router.post('/', (req, res) => tripController.createTrip(req, res));
router.get('/', (req, res) => tripController.getAllTrips(req, res));
router.get('/:tripId', (req, res) => tripController.getTripById(req, res));
router.put('/:tripId', (req, res) => tripController.updateTrip(req, res));
router.delete('/:tripId', (req, res) => tripController.deleteTrip(req, res));

export default router; 