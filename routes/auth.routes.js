import express from 'express';
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  verifyUser,
  resendVerification,
} from '../controllers/auth.controller.js';
import {
  forgotPasswordValidationMiddleware,
  loginValidationMiddleware,
  registerValidationMiddleware,
  resendVerificationValidationMiddleware,
  resetPasswordValidationMiddleware,
} from '../middlewares/auth.middleware.js';

const authRoutes = express.Router();

authRoutes.post('/login', loginValidationMiddleware, login);
authRoutes.post('/register', registerValidationMiddleware, register);
authRoutes.get('/verify', verifyUser);
authRoutes.post(
  '/forgot-password',
  forgotPasswordValidationMiddleware,
  forgotPassword
);
authRoutes.post(
  '/reset-password',
  resetPasswordValidationMiddleware,
  resetPassword
);
authRoutes.post(
  '/resend-verification',
  resendVerificationValidationMiddleware,
  resendVerification
);

export default authRoutes;
