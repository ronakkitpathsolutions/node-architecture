import { z } from 'zod';
import { VALIDATION_MESSAGES } from '../constants/messages.js';

// Common actions enum
const ActionEnum = z.enum([
  'create',
  'read',
  'update',
  'delete',
  'list',
  'view',
  'edit',
  'remove',
  'manage',
  'access',
  'execute',
]);

// Common resources enum
const ResourceEnum = z.enum([
  'user',
  'role',
  'permission',
  'profile',
  'dashboard',
  'settings',
  'reports',
  'logs',
  'files',
  'uploads',
  'notifications',
  'system',
]);

// Base permission validation schema
const PermissionValidationSchema = z.object({
  name: z
    .string()
    .min(2, VALIDATION_MESSAGES.PERMISSION.NAME.TOO_SHORT)
    .max(50, VALIDATION_MESSAGES.PERMISSION.NAME.TOO_LONG)
    .trim()
    .refine(val => val.length > 0, VALIDATION_MESSAGES.PERMISSION.NAME.EMPTY)
    .refine(
      val => /^[a-zA-Z0-9_.-]+$/.test(val),
      VALIDATION_MESSAGES.PERMISSION.NAME.INVALID_FORMAT
    ),

  resource: ResourceEnum,

  action: ActionEnum,

  description: z
    .string()
    .max(255, VALIDATION_MESSAGES.PERMISSION.DESCRIPTION.TOO_LONG)
    .trim()
    .optional()
    .nullable(),
});

// Schema for permission creation
export const CreatePermissionSchema = PermissionValidationSchema.refine(
  data => {
    // Ensure the name follows a consistent pattern: action_resource
    const expectedName = `${data.action}_${data.resource}`;
    return (
      data.name === expectedName ||
      data.name.includes(`${data.action}_${data.resource}`)
    );
  },
  {
    message: VALIDATION_MESSAGES.PERMISSION.NAME.PATTERN_MISMATCH,
    path: ['name'],
  }
);

// Schema for permission updates
export const UpdatePermissionSchema = PermissionValidationSchema.partial();

// Schema for permission assignment to role
export const AssignPermissionToRoleSchema = z.object({
  role_id: z
    .number()
    .int(VALIDATION_MESSAGES.PERMISSION.ASSIGNMENT.ROLE_REQUIRED)
    .positive(VALIDATION_MESSAGES.COMMON.ID.POSITIVE),
  permission_id: z
    .number()
    .int(VALIDATION_MESSAGES.PERMISSION.ASSIGNMENT.PERMISSION_REQUIRED)
    .positive(VALIDATION_MESSAGES.COMMON.ID.POSITIVE),
});

// Schema for bulk permission assignment
export const BulkAssignPermissionSchema = z.object({
  role_id: z
    .number()
    .int(VALIDATION_MESSAGES.PERMISSION.ASSIGNMENT.ROLE_REQUIRED)
    .positive(VALIDATION_MESSAGES.COMMON.ID.POSITIVE),
  permission_ids: z
    .array(z.number().int().positive())
    .min(1, VALIDATION_MESSAGES.PERMISSION.ASSIGNMENT.NO_PERMISSIONS)
    .max(50, VALIDATION_MESSAGES.PERMISSION.ASSIGNMENT.BULK_LIMIT),
});

// Schema for permission check
export const CheckPermissionSchema = z.object({
  user_id: z
    .number()
    .int(VALIDATION_MESSAGES.COMMON.ID.INVALID)
    .positive(VALIDATION_MESSAGES.COMMON.ID.POSITIVE),
  resource: ResourceEnum,
  action: ActionEnum,
});

// Schema for resource-based permission filtering
export const FilterPermissionSchema = z.object({
  resource: ResourceEnum.optional(),
  action: ActionEnum.optional(),
  role_id: z
    .number()
    .int(VALIDATION_MESSAGES.COMMON.ID.INVALID)
    .positive(VALIDATION_MESSAGES.COMMON.ID.POSITIVE)
    .optional(),
});

// Validation helper functions
export const validateCreatePermission = data =>
  CreatePermissionSchema.safeParse(data);
export const validateUpdatePermission = data =>
  UpdatePermissionSchema.safeParse(data);
export const validateAssignPermissionToRole = data =>
  AssignPermissionToRoleSchema.safeParse(data);
export const validateBulkAssignPermission = data =>
  BulkAssignPermissionSchema.safeParse(data);
export const validateCheckPermission = data =>
  CheckPermissionSchema.safeParse(data);
export const validateFilterPermission = data =>
  FilterPermissionSchema.safeParse(data);

// Export enums for use in other parts of the application
export { ActionEnum, ResourceEnum };
