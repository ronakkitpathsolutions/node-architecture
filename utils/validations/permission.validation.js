import { z } from 'zod';
import { VALIDATION_MESSAGES } from '../constants/messages.js';

// Base permission level object schema
const PermissionLevelBaseSchema = z.object({
  read: z.boolean(),
  write: z.boolean(),
  none: z.boolean(),
});

// Permission level schema for each module/resource with validation
const PermissionLevelSchema = PermissionLevelBaseSchema.refine(
  data => {
    // Ensure logical consistency: if none is true, read and write should be false
    if (data.none && (data.read || data.write)) {
      return false;
    }
    return true;
  },
  {
    message: 'If none is true, both read and write must be false',
  }
);

// Partial permission level schema for updates (without strict validation)
const PartialPermissionLevelSchema = PermissionLevelBaseSchema.partial();

// Access control schema for the JSON field - flexible structure
const AccessControlSchema = z
  .record(
    z.string().min(1), // module name - can be any string
    PermissionLevelSchema
  )
  .optional()
  .default({});

// Base permission validation schema
const PermissionValidationSchema = z.object({
  role_id: z
    .number()
    .int(VALIDATION_MESSAGES.ROLE.ID.INVALID)
    .positive(VALIDATION_MESSAGES.COMMON.ID.POSITIVE),

  access: z
    .union([
      AccessControlSchema,
      z.string().refine(
        val => {
          try {
            const parsed = JSON.parse(val);
            return AccessControlSchema.safeParse(parsed).success;
          } catch {
            return false;
          }
        },
        {
          message:
            'Access must be a valid JSON object matching the access control schema',
        }
      ),
      z.null(),
      z.undefined(),
    ])
    .optional()
    .transform(val => {
      if (typeof val === 'string') {
        return JSON.parse(val);
      }
      return val || {};
    }),
});

// Schema for permission creation
export const CreatePermissionSchema = PermissionValidationSchema.required({
  role_id: true,
});

// Schema for permission updates
export const UpdatePermissionSchema = PermissionValidationSchema.partial();

// Schema for permission assignment (role-permission relationship)
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

// Schema for access validation - checking if a user has specific access
export const ValidateAccessSchema = z.object({
  user_id: z
    .number()
    .int(VALIDATION_MESSAGES.COMMON.ID.INVALID)
    .positive(VALIDATION_MESSAGES.COMMON.ID.POSITIVE),

  required_access: z.object({
    action: z.string().min(1, VALIDATION_MESSAGES.PERMISSION.ACTION.REQUIRED),
    resource: z
      .string()
      .min(1, VALIDATION_MESSAGES.PERMISSION.RESOURCE.REQUIRED)
      .optional(),
    context: z.record(z.string(), z.any()).optional(),
  }),
});

// Schema for updating access permissions
export const UpdateAccessSchema = z.object({
  permission_id: z
    .number()
    .int(VALIDATION_MESSAGES.COMMON.ID.INVALID)
    .positive(VALIDATION_MESSAGES.COMMON.ID.POSITIVE),

  access_updates: z
    .record(
      z.string().min(1).max(50), // module name
      PartialPermissionLevelSchema // allow partial permission updates
    )
    .optional(),

  merge_strategy: z
    .enum(['replace', 'merge', 'deep_merge'])
    .optional()
    .default('replace'),
});

// Simplified schema for role-based access updates (using role ID instead of permission ID)
export const UpdateRoleAccessSchema = z.object({
  access_updates: z
    .record(
      z.string().min(1).max(50), // module name
      PartialPermissionLevelSchema // allow partial permission updates
    )
    .optional(),

  merge_strategy: z
    .enum(['replace', 'merge', 'deep_merge'])
    .optional()
    .default('replace'),
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

export const validateAccess = data => ValidateAccessSchema.safeParse(data);

export const validateUpdateAccess = data => UpdateAccessSchema.safeParse(data);

// Helper functions to create predefined access templates
export const createFullAccessTemplate = (modules = []) => {
  const access = {};
  modules.forEach(module => {
    access[module] = { read: true, write: true, none: false };
  });
  return access;
};

export const createReadOnlyAccessTemplate = (modules = []) => {
  const access = {};
  modules.forEach(module => {
    access[module] = { read: true, write: false, none: false };
  });
  return access;
};

export const createManagerAccessTemplate = (
  modules = [],
  managerConfig = {}
) => {
  const access = {};
  modules.forEach(module => {
    // Default manager access - read only, but can be customized per module
    const moduleConfig = managerConfig[module] || {
      read: true,
      write: false,
      none: false,
    };
    access[module] = moduleConfig;
  });
  return access;
};

export const createNoAccessTemplate = (modules = []) => {
  const access = {};
  modules.forEach(module => {
    access[module] = { read: false, write: false, none: true };
  });
  return access;
};

// Helper function to create access for a single module
export const createModuleAccess = (
  moduleName,
  permissions = { read: false, write: false, none: true }
) => {
  return {
    [moduleName]: permissions,
  };
};

// Helper function to validate module name
export const isValidModuleName = moduleName => {
  return (
    typeof moduleName === 'string' &&
    moduleName.length >= 1 &&
    moduleName.length <= 50
  );
};

// Helper function to validate a complete access object
export const validateAccessObject = accessObject => {
  return AccessControlSchema.safeParse(accessObject);
};

// Helper function to get all modules from an access object
export const getModulesFromAccess = accessObject => {
  return Object.keys(accessObject || {});
};

// Helper function to check if a module has specific permission
export const hasModulePermission = (
  accessObject,
  moduleName,
  permissionType
) => {
  const module = accessObject?.[moduleName];
  if (!module) return false;

  switch (permissionType) {
    case 'read':
      return module.read === true;
    case 'write':
      return module.write === true;
    case 'none':
      return module.none === true;
    default:
      return false;
  }
};

// Helper function to update a specific module's permissions
export const updateModulePermissions = (
  accessObject,
  moduleName,
  newPermissions
) => {
  const validation = PermissionLevelSchema.safeParse(newPermissions);
  if (!validation.success) {
    throw new Error(
      `Invalid permissions for module ${moduleName}: ${validation.error.message}`
    );
  }

  return {
    ...accessObject,
    [moduleName]: newPermissions,
  };
};

// Export additional schemas for direct use
export {
  AccessControlSchema,
  PermissionLevelSchema,
  PartialPermissionLevelSchema,
};
