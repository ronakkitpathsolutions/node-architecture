import express from 'express';
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';
import {
  createUserValidationMiddleware,
  updateUserValidationMiddleware,
} from '../middlewares/auth.middleware.js';
import { idValidationMiddleware } from '../middlewares/validation.middleware.js';

const userRoutes = express.Router();

userRoutes.post('/users/create', createUserValidationMiddleware, createUser);
userRoutes.get('/users', getAllUsers);
userRoutes.get('/users/:id', idValidationMiddleware, getUser);
userRoutes.patch(
  '/users/:id',
  [idValidationMiddleware, updateUserValidationMiddleware],
  updateUser
);
userRoutes.delete('/users/:id', idValidationMiddleware, deleteUser);

export default userRoutes;
