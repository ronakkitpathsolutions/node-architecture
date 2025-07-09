import express from 'express';
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  verifyUser,
} from '../controllers/auth.controller.js';

const authRoutes = express.Router();

authRoutes.post('/login', login);
authRoutes.post('/register', register);
authRoutes.get('/verify', verifyUser);
authRoutes.post('/forgot-password', forgotPassword);
authRoutes.post('/reset-password', resetPassword);

export default authRoutes;
