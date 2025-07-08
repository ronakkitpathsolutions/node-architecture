import express from 'express';
import {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js';

const authRoutes = express.Router();

authRoutes.post('/login', login);
authRoutes.post('/register', register);
authRoutes.post('/logout', logout);
authRoutes.post('/forgot-password', forgotPassword);
authRoutes.post('/reset-password', resetPassword);

export default authRoutes;
