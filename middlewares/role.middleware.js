import Role from '../models/role.model.js';
import { createValidationMiddleware } from './validation.middleware.js';

// Role validation middlewares
export const createRoleValidationMiddleware = createValidationMiddleware(
  Role.validateCreateData
);

export const updateRoleValidationMiddleware = createValidationMiddleware(
  Role.validateUpdateData
);

export const assignRoleValidationMiddleware = createValidationMiddleware(
  Role.validateAssignData
);

export const bulkAssignRoleValidationMiddleware = createValidationMiddleware(
  Role.validateBulkAssignData
);

export const rolePermissionValidationMiddleware = createValidationMiddleware(
  Role.validatePermissionData
);
