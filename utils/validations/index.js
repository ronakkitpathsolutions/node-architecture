// Import all validation schemas and functions
import * as UserValidation from './user.validation.js';
import * as RoleValidation from './role.validation.js';
import * as PermissionValidation from './permission.validation.js';
import * as CategoryValidation from './category.validation.js';
import * as ProductValidation from './product.validation.js';
import * as CartValidation from './cart.validation.js';
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

// Export all category validations
export const Category = {
  schemas: {
    create: CategoryValidation.CreateCategorySchema,
    update: CategoryValidation.UpdateCategorySchema,
  },
  validate: {
    create: CategoryValidation.validateCreateCategory,
    update: CategoryValidation.validateUpdateCategory,
  },
  helpers: {
    generateSlug: CategoryValidation.generateSlug,
  },
};

// Export all product validations
export const Product = {
  schemas: {
    create: ProductValidation.CreateProductSchema,
    update: ProductValidation.UpdateProductSchema,
    partialUpdate: ProductValidation.PartialUpdateProductSchema,
    updatePrice: ProductValidation.UpdateProductPriceSchema,
    updateStock: ProductValidation.UpdateProductStockSchema,
    updateStatus: ProductValidation.UpdateProductStatusSchema,
  },
};

// Export all cart validations
export const Cart = {
  schemas: {
    addToCart: CartValidation.AddToCartSchema,
    updateQuantity: CartValidation.UpdateCartQuantitySchema,
    cartItemId: CartValidation.CartItemIdSchema,
    productId: CartValidation.ProductIdSchema,
  },
};

// Export all permission validations
export const Permission = {
  schemas: {
    create: PermissionValidation.CreatePermissionSchema,
    update: PermissionValidation.UpdatePermissionSchema,
    assign: PermissionValidation.AssignPermissionToRoleSchema,
    bulkAssign: PermissionValidation.BulkAssignPermissionSchema,
    filter: PermissionValidation.FilterPermissionSchema,
    access: PermissionValidation.ValidateAccessSchema,
    updateAccess: PermissionValidation.UpdateAccessSchema,
    accessControl: PermissionValidation.AccessControlSchema,
    permissionLevel: PermissionValidation.PermissionLevelSchema,
  },
  validate: {
    create: PermissionValidation.validateCreatePermission,
    update: PermissionValidation.validateUpdatePermission,
    assign: PermissionValidation.validateAssignPermissionToRole,
    bulkAssign: PermissionValidation.validateBulkAssignPermission,
    filter: PermissionValidation.validateFilterPermission,
    access: PermissionValidation.validateAccess,
    updateAccess: PermissionValidation.validateUpdateAccess,
  },
  templates: {
    fullAccess: PermissionValidation.createFullAccessTemplate,
    readOnly: PermissionValidation.createReadOnlyAccessTemplate,
    manager: PermissionValidation.createManagerAccessTemplate,
    noAccess: PermissionValidation.createNoAccessTemplate,
  },
  helpers: {
    mergeAccess: PermissionValidation.mergeAccessPermissions,
  },
  enums: {
    modules: PermissionValidation.ModuleEnum,
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
  CategoryValidation,
  ProductValidation,
  CartValidation,
  CommonValidation,
  ValidationMiddleware,
};

// Export a combined validation object for easy access
export const Validations = {
  User,
  Role,
  Permission,
  Category,
  Product,
  Common,
  Middleware: ValidationMiddleware,
};

// Default export
export default Validations;
