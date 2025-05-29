import { Router, Request, Response } from 'express';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';

import { UserController } from '@Modules/Users/infrastructure/controllers/UserController';
import { UserService } from '@Modules/Users/application/services/UserService';
import { PassengerController } from '@Modules/Passengers/infrastructure/controllers/PassengerController';
import { PassengerService } from '@Modules/Passengers/application/services/PassengerService';
import { DriverController } from '@Modules/Drivers/infrastructure/controllers/DriverController';
import { DriversService } from '@Modules/Drivers/application/services/DriverService';
import { TripController } from '@Modules/Trips/infrastructure/controllers/TripController';
import { TripService } from '@Modules/Trips/application/services/TripService';
import { UserRepository } from '@Modules/Users/infrastructure/repositories/UserRepository';


const router = Router();
const logger = new WinstonLogger();

const userService = new UserService();
const usersController = new UserController(userService, logger);

const passengerService = new PassengerService();
const passengerController = new PassengerController(passengerService);

const driverService = new DriversService();
const driverController = new DriverController(driverService, logger);
const tripService = new TripService();
const tripController = new TripController(tripService, logger);
/* Health Check */
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).send({
    status: 'OK',
    message: 'Success'
  });
});

const apiVersion: string = 'v1';

/* Users Routes */
router.post(`/${apiVersion}/users`, (req, res) => usersController.createUser(req, res));
router.get(`/${apiVersion}/users`, (req, res) => usersController.getAllUsers(req, res));
router.get(`/${apiVersion}/users/:userId`, (req, res) => usersController.getUserById(req, res));
router.put(`/${apiVersion}/users/:userId`, (req, res) => usersController.updateUser(req, res));
router.delete(`/${apiVersion}/users/:userId`, (req, res) => usersController.deleteUser(req, res));
router.post(`/${apiVersion}/users/authenticate`, (req, res) => usersController.authenticateUser(req, res));

/* Passengers Routes */
router.get(`/${apiVersion}/passengers`, (req, res) => passengerController.getAllPassengers(req, res));
router.get(`/${apiVersion}/passengers/:userId`, (req, res) => passengerController.getPassengerById(req, res));

/* Drivers Routes */
router.get(`/${apiVersion}/drivers`, (req, res) =>
  driverController.getAllDrivers(req, res)
);
router.get(`/${apiVersion}/drivers/active`, (req, res) =>
  driverController.getAllDriversActive(req, res)
);
router.get(`/${apiVersion}/drivers/:driverId`, (req, res) =>
  driverController.getDriverById(req, res)
);

/* Trips Routes */
router.post(`/${apiVersion}/trips`, (req, res) =>
  tripController.createTrip(req, res)
);
router.get(`/${apiVersion}/trips`, (req, res) =>
  tripController.getAllTrips(req, res)
);
router.get(`/${apiVersion}/trips/:tripId`, (req, res) =>
  tripController.getTripById(req, res)
);
router.put(`/${apiVersion}/trips/:tripId`, (req, res) =>
  tripController.updateTrip(req, res)
);
router.delete(`/${apiVersion}/trips/:tripId`, (req, res) =>
  tripController.deleteTrip(req, res)
);


export default router;
