// Import all validation schemas and functions
import * as UserValidation from './user.validation.js';
import * as RoleValidation from './role.validation.js';
import * as PermissionValidation from './permission.validation.js';
import * as CommonValidation from './common.validation.js';
import ValidationMiddleware from './middleware.js';

// Export all user validations
export const User = {
  schemas: {
    create: UserValidation.CreateUserSchema,
    update: UserValidation.UpdateUserSchema,
    login: UserValidation.LoginSchema,
    register: UserValidation.RegisterUserSchema,
    changePassword: UserValidation.ChangePasswordSchema,
    forgotPassword: UserValidation.ForgotPasswordSchema,
    resetPassword: UserValidation.ResetPasswordSchema,
    updateProfile: UserValidation.UpdateProfileSchema,
  },
  validate: {
    create: UserValidation.validateCreateUser,
    update: UserValidation.validateUpdateUser,
    login: UserValidation.validateLogin,
    register: UserValidation.validateRegister,
    changePassword: UserValidation.validateChangePassword,
    forgotPassword: UserValidation.validateForgotPassword,
    resetPassword: UserValidation.validateResetPassword,
    updateProfile: UserValidation.validateUpdateProfile,
  },
};

// Export all role validations
export const Role = {
  schemas: {
    create: RoleValidation.CreateRoleSchema,
    update: RoleValidation.UpdateRoleSchema,
    assign: RoleValidation.AssignRoleSchema,
    bulkAssign: RoleValidation.BulkAssignRoleSchema,
    permission: RoleValidation.RolePermissionSchema,
  },
  validate: {
    create: RoleValidation.validateCreateRole,
    update: RoleValidation.validateUpdateRole,
    assign: RoleValidation.validateAssignRole,
    bulkAssign: RoleValidation.validateBulkAssignRole,
    permission: RoleValidation.validateRolePermission,
  },
};

// Export all permission validations
export const Permission = {
  schemas: {
    create: PermissionValidation.CreatePermissionSchema,
    update: PermissionValidation.UpdatePermissionSchema,
    assignToRole: PermissionValidation.AssignPermissionToRoleSchema,
    bulkAssign: PermissionValidation.BulkAssignPermissionSchema,
    check: PermissionValidation.CheckPermissionSchema,
    filter: PermissionValidation.FilterPermissionSchema,
  },
  validate: {
    create: PermissionValidation.validateCreatePermission,
    update: PermissionValidation.validateUpdatePermission,
    assignToRole: PermissionValidation.validateAssignPermissionToRole,
    bulkAssign: PermissionValidation.validateBulkAssignPermission,
    check: PermissionValidation.validateCheckPermission,
    filter: PermissionValidation.validateFilterPermission,
  },
  enums: {
    actions: PermissionValidation.ActionEnum,
    resources: PermissionValidation.ResourceEnum,
  },
};

// Export all common validations
export const Common = {
  schemas: {
    id: CommonValidation.IdSchema,
    pagination: CommonValidation.PaginationSchema,
    search: CommonValidation.SearchSchema,
    dateRange: CommonValidation.DateRangeSchema,
    filter: CommonValidation.FilterSchema,
    responseMeta: CommonValidation.ResponseMetaSchema,
    apiResponse: CommonValidation.ApiResponseSchema,
    email: CommonValidation.EmailSchema,
    password: CommonValidation.PasswordSchema,
    phone: CommonValidation.PhoneSchema,
    url: CommonValidation.UrlSchema,
    file: CommonValidation.FileSchema,
  },
  validate: {
    id: CommonValidation.validateId,
    pagination: CommonValidation.validatePagination,
    search: CommonValidation.validateSearch,
    dateRange: CommonValidation.validateDateRange,
    filter: CommonValidation.validateFilter,
    email: CommonValidation.validateEmail,
    password: CommonValidation.validatePassword,
    phone: CommonValidation.validatePhone,
    url: CommonValidation.validateUrl,
    file: CommonValidation.validateFile,
  },
};

// Export individual validation modules for direct access
export {
  UserValidation,
  RoleValidation,
  PermissionValidation,
  CommonValidation,
  ValidationMiddleware,
};

// Export a combined validation object for easy access
export const Validations = {
  User,
  Role,
  Permission,
  Common,
  Middleware: ValidationMiddleware,
};

// Default export
export default Validations;
