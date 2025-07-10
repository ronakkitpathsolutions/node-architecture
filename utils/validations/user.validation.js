import { z } from 'zod';
import { VALIDATION_MESSAGES } from '../constants/messages.js';

// Base user validation schema
const UserValidationSchema = z.object({
  name: z
    .string()
    .min(2, VALIDATION_MESSAGES.USER.NAME.TOO_SHORT)
    .max(100, VALIDATION_MESSAGES.USER.NAME.TOO_LONG)
    .trim()
    .refine(val => val.length > 0, VALIDATION_MESSAGES.USER.NAME.EMPTY),

  email: z
    .string()
    .email(VALIDATION_MESSAGES.USER.EMAIL.INVALID)
    .max(150, VALIDATION_MESSAGES.USER.EMAIL.TOO_LONG)
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(6, VALIDATION_MESSAGES.USER.PASSWORD.TOO_SHORT)
    .max(255, VALIDATION_MESSAGES.USER.PASSWORD.TOO_LONG)
    .refine(val => val.length > 0, VALIDATION_MESSAGES.USER.PASSWORD.EMPTY),

  role_id: z
    .number()
    .int(VALIDATION_MESSAGES.USER.ROLE.INVALID)
    .positive(VALIDATION_MESSAGES.COMMON.ID.POSITIVE),

  providers: z
    .array(z.enum(['google', 'github']))
    .optional()
    .default([])
    .refine(providers => {
      if (!providers) return true;
      const uniqueProviders = new Set(providers);
      return uniqueProviders.size === providers.length;
    }, VALIDATION_MESSAGES.USER.PROVIDERS.DUPLICATE),

  is_active: z.boolean().optional().default(false),

  profile: z
    .string()
    .url('Profile image must be a valid URL')
    .max(500, 'Profile image URL is too long')
    .optional(),
});

// Schema for user creation (all required fields)
export const CreateUserSchema = UserValidationSchema;

// Schema for user updates (all fields optional)
export const UpdateUserSchema = UserValidationSchema.partial();

// Schema for login validation
export const LoginSchema = z.object({
  email: z
    .string()
    .email(VALIDATION_MESSAGES.USER.EMAIL.INVALID)
    .trim()
    .toLowerCase(),
  password: z.string().min(1, VALIDATION_MESSAGES.USER.PASSWORD.REQUIRED),
});

// Schema for password change
export const ChangePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, VALIDATION_MESSAGES.USER.PASSWORD.CURRENT_REQUIRED),
  newPassword: z
    .string()
    .min(6, VALIDATION_MESSAGES.USER.PASSWORD.TOO_SHORT)
    .max(255, VALIDATION_MESSAGES.USER.PASSWORD.TOO_LONG),
});

// Schema for user registration
export const RegisterUserSchema = z
  .object({
    name: z
      .string()
      .min(2, VALIDATION_MESSAGES.USER.NAME.TOO_SHORT)
      .max(100, VALIDATION_MESSAGES.USER.NAME.TOO_LONG)
      .trim(),
    email: z
      .string()
      .email(VALIDATION_MESSAGES.USER.EMAIL.INVALID)
      .max(150, VALIDATION_MESSAGES.USER.EMAIL.TOO_LONG)
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(6, VALIDATION_MESSAGES.USER.PASSWORD.TOO_SHORT)
      .max(255, VALIDATION_MESSAGES.USER.PASSWORD.TOO_LONG),
    confirmPassword: z
      .string()
      .min(1, VALIDATION_MESSAGES.USER.PASSWORD.CONFIRM_REQUIRED),
    role_id: z
      .number()
      .int(VALIDATION_MESSAGES.USER.ROLE.INVALID)
      .positive(VALIDATION_MESSAGES.COMMON.ID.POSITIVE)
      .optional()
      .default(2), // Default user role
    providers: z
      .array(z.enum(['google', 'github']))
      .optional()
      .default([]),
    is_active: z.boolean().optional().default(false), // Default to false for new registrations
  })
  .refine(data => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.USER.PASSWORD.MISMATCH,
    path: ['confirmPassword'],
  });

// Schema for forgot password
export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .email(VALIDATION_MESSAGES.USER.EMAIL.INVALID)
    .trim()
    .toLowerCase(),
});

// Schema for reset password
export const ResetPasswordSchema = z
  .object({
    refresh_token: z
      .string()
      .min(1, VALIDATION_MESSAGES.AUTH.RESET.TOKEN_REQUIRED),
    newPassword: z
      .string()
      .min(6, VALIDATION_MESSAGES.USER.PASSWORD.TOO_SHORT)
      .max(255, VALIDATION_MESSAGES.USER.PASSWORD.TOO_LONG),
    confirmPassword: z
      .string()
      .min(1, VALIDATION_MESSAGES.USER.PASSWORD.CONFIRM_REQUIRED),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: VALIDATION_MESSAGES.USER.PASSWORD.MISMATCH,
    path: ['confirmPassword'],
  });

// Schema for profile update
export const UpdateProfileSchema = z.object({
  name: z
    .string()
    .min(2, VALIDATION_MESSAGES.USER.NAME.TOO_SHORT)
    .max(100, VALIDATION_MESSAGES.USER.NAME.TOO_LONG)
    .trim()
    .optional(),
  email: z
    .string()
    .email(VALIDATION_MESSAGES.USER.EMAIL.INVALID)
    .max(150, VALIDATION_MESSAGES.USER.EMAIL.TOO_LONG)
    .toLowerCase()
    .trim()
    .optional(),
  providers: z
    .array(z.enum(['google', 'github']))
    .optional()
    .refine(providers => {
      if (!providers) return true;
      const uniqueProviders = new Set(providers);
      return uniqueProviders.size === providers.length;
    }, VALIDATION_MESSAGES.USER.PROVIDERS.DUPLICATE),
  is_active: z.boolean().optional(),
  profile: z
    .string()
    .url('Profile image must be a valid URL')
    .max(500, 'Profile image URL is too long')
    .optional(),
});

// Validation helper functions
export const validateCreateUser = data => CreateUserSchema.safeParse(data);
export const validateUpdateUser = data => UpdateUserSchema.safeParse(data);
export const validateLogin = data => LoginSchema.safeParse(data);
export const validateRegister = data => RegisterUserSchema.safeParse(data);
export const validateChangePassword = data =>
  ChangePasswordSchema.safeParse(data);
export const validateForgotPassword = data =>
  ForgotPasswordSchema.safeParse(data);
export const validateResetPassword = data =>
  ResetPasswordSchema.safeParse(data);
export const validateUpdateProfile = data =>
  UpdateProfileSchema.safeParse(data);
