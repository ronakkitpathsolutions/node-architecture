import User from '../models/user.model.js';
import { createValidationMiddleware } from './validation.middleware.js';

// Auth validation middlewares
export const loginValidationMiddleware = createValidationMiddleware(
  User.validateLoginData
);

export const registerValidationMiddleware = createValidationMiddleware(
  User.validateRegisterData
);

export const forgotPasswordValidationMiddleware = createValidationMiddleware(
  User.validateForgotPassword
);

export const resetPasswordValidationMiddleware = createValidationMiddleware(
  User.validateResetPassword
);

export const updateProfileValidationMiddleware = createValidationMiddleware(
  User.validateUpdateProfile
);

export const changePasswordValidationMiddleware = createValidationMiddleware(
  User.validatePasswordChange
);

export const resendVerificationValidationMiddleware =
  createValidationMiddleware(
    User.validateForgotPassword // Uses same validation as forgot password (just email)
  );

// User validation middlewares
export const createUserValidationMiddleware = createValidationMiddleware(
  User.validateCreateData
);

export const updateUserValidationMiddleware = createValidationMiddleware(
  User.validateUpdateData
);
