import express from 'express';
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';

const userRoutes = express.Router();

userRoutes.post('/users/create', createUser);
userRoutes.get('/users', getAllUsers);
userRoutes.get('/users/:id', getUser);
userRoutes.patch('/users/:id', updateUser);
userRoutes.delete('/users/:id', deleteUser);

export default userRoutes;
