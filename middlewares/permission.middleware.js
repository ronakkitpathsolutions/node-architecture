import { z } from 'zod';
import {
  validateBody,
  validateParams,
} from '../utils/validations/middleware.js';
import { UpdateRoleAccessSchema } from '../utils/validations/permission.validation.js';
import { IdSchema } from '../utils/validations/common.validation.js';

// Schema for role ID parameter (for role-specific routes)
const RoleParamsSchema = z.object({
  roleId: z
    .string()
    .transform(val => parseInt(val, 10))
    .pipe(IdSchema),
});

// Middleware for validating role ID in params
export const validateRoleParams = validateParams(RoleParamsSchema);

// Middleware for validating role-based access updates
export const validateUpdateAccess = validateBody(UpdateRoleAccessSchema);

// Export middlewares as default object
export default {
  validateRoleParams,
  validateUpdateAccess,
};
