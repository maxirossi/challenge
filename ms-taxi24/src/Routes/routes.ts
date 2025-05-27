import { Router, Request, Response } from 'express';
import { UsersController } from '@User/infrastructure/controllers/UsersController';
import { UsersService } from '@User/application/services/UsersService';
import { PassengerController} from '@Modules/Passenger/infrastructure/controllers/PassengerController';
import { PassengersService } from '@Modules/Passenger/application/services/PassengersService';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';

const router = Router();
const logger = new WinstonLogger();

const userService = new UsersService();
const usersController = new UsersController(userService, logger);

const passengerService = new PassengersService();
const passengerController = new PassengerController(passengerService, logger);

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


export default router;
