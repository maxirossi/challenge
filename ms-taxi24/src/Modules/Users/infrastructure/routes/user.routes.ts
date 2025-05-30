import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserService } from '../../application/services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import { PrismaClient } from '@prisma/client';

const router = Router();
const userRepository = new UserRepository(new PrismaClient(), new WinstonLogger());
const userService = new UserService(userRepository, new WinstonLogger());
const userController = new UserController(userService, new WinstonLogger());

router.post('/', (req, res) => userController.createUser(req, res));
router.get('/', (req, res) => userController.getAllUsers(req, res));
router.get('/:userId', (req, res) => userController.getUserById(req, res));
router.put('/:userId', (req, res) => userController.updateUser(req, res));
router.delete('/:userId', (req, res) => userController.deleteUser(req, res));
router.post('/authenticate', (req, res) => userController.authenticateUser(req, res));

export default router; 