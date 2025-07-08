import { z } from "zod";
import { VALIDATION_MESSAGES } from "../constants/messages.js";

// Base role validation schema
const RoleValidationSchema = z.object({
    name: z.string()
        .min(2, VALIDATION_MESSAGES.ROLE.NAME.TOO_SHORT)
        .max(50, VALIDATION_MESSAGES.ROLE.NAME.TOO_LONG)
        .trim()
        .refine(val => val.length > 0, VALIDATION_MESSAGES.ROLE.NAME.EMPTY)
        .refine(val => /^[a-zA-Z0-9_-]+$/.test(val), VALIDATION_MESSAGES.ROLE.NAME.INVALID_FORMAT),
    
    description: z.string()
        .max(255, VALIDATION_MESSAGES.ROLE.DESCRIPTION.TOO_LONG)
        .trim()
        .optional()
        .nullable()
});

// Schema for role creation
export const CreateRoleSchema = RoleValidationSchema;

// Schema for role updates (all fields optional except validation requirements)
export const UpdateRoleSchema = RoleValidationSchema.partial();

// Schema for role assignment
export const AssignRoleSchema = z.object({
    user_id: z.number()
        .int(VALIDATION_MESSAGES.ROLE.ASSIGNMENT.USER_REQUIRED)
        .positive(VALIDATION_MESSAGES.COMMON.ID.POSITIVE),
    role_id: z.number()
        .int(VALIDATION_MESSAGES.ROLE.ASSIGNMENT.ROLE_REQUIRED)
        .positive(VALIDATION_MESSAGES.COMMON.ID.POSITIVE)
});

// Schema for bulk role assignment
export const BulkAssignRoleSchema = z.object({
    user_ids: z.array(z.number().int().positive())
        .min(1, VALIDATION_MESSAGES.ROLE.ASSIGNMENT.NO_USERS)
        .max(100, VALIDATION_MESSAGES.ROLE.ASSIGNMENT.BULK_LIMIT),
    role_id: z.number()
        .int(VALIDATION_MESSAGES.ROLE.ASSIGNMENT.ROLE_REQUIRED)
        .positive(VALIDATION_MESSAGES.COMMON.ID.POSITIVE)
});

// Schema for role permission assignment
export const RolePermissionSchema = z.object({
    role_id: z.number()
        .int(VALIDATION_MESSAGES.ROLE.ASSIGNMENT.ROLE_REQUIRED)
        .positive(VALIDATION_MESSAGES.COMMON.ID.POSITIVE),
    permission_ids: z.array(z.number().int().positive())
        .min(1, VALIDATION_MESSAGES.ROLE.ASSIGNMENT.NO_PERMISSIONS)
        .max(50, VALIDATION_MESSAGES.ROLE.ASSIGNMENT.PERMISSION_LIMIT)
});

// Validation helper functions
export const validateCreateRole = (data) => CreateRoleSchema.safeParse(data);
export const validateUpdateRole = (data) => UpdateRoleSchema.safeParse(data);
export const validateAssignRole = (data) => AssignRoleSchema.safeParse(data);
export const validateBulkAssignRole = (data) => BulkAssignRoleSchema.safeParse(data);
export const validateRolePermission = (data) => RolePermissionSchema.safeParse(data);
