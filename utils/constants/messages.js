// Validation error messages constants
export const VALIDATION_MESSAGES = {
  // Common field validation messages
  REQUIRED: 'This field is required',
  INVALID_FORMAT: 'Invalid format',
  TOO_SHORT: 'Value is too short',
  TOO_LONG: 'Value is too long',
  INVALID_TYPE: 'Invalid data type',
  MUST_BE_POSITIVE: 'Must be a positive number',
  MUST_BE_INTEGER: 'Must be an integer',
  CANNOT_BE_EMPTY: 'Cannot be empty',
  INVALID_CHARACTERS: 'Contains invalid characters',

  // User validation messages
  USER: {
    NAME: {
      REQUIRED: 'Name is required',
      TOO_SHORT: 'Name must be at least 2 characters long',
      TOO_LONG: 'Name must not exceed 100 characters',
      EMPTY: 'Name cannot be empty',
      INVALID_FORMAT: 'Name contains invalid characters',
    },
    EMAIL: {
      REQUIRED: 'Email is required',
      INVALID: 'Must be a valid email address',
      TOO_LONG: 'Email must not exceed 150 characters',
      ALREADY_EXISTS: 'Email address already in use',
      NOT_FOUND: 'Email address not found',
    },
    PASSWORD: {
      REQUIRED: 'Password is required',
      TOO_SHORT: 'Password must be at least 6 characters long',
      TOO_LONG: 'Password must not exceed 255 characters',
      EMPTY: 'Password cannot be empty',
      WEAK: 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
      MISMATCH: "Passwords don't match",
      CURRENT_REQUIRED: 'Current password is required',
      NEW_REQUIRED: 'New password is required',
      CONFIRM_REQUIRED: 'Password confirmation is required',
      INCORRECT: 'Current password is incorrect',
    },
    ROLE: {
      REQUIRED: 'Role ID is required',
      INVALID: 'Role ID must be a valid integer',
      NOT_FOUND: 'Role not found',
    },
    PROVIDERS: {
      INVALID: 'Invalid provider',
      DUPLICATE: 'Providers must be unique',
      UNSUPPORTED: 'Unsupported provider',
    },
    GENERAL: {
      NOT_FOUND: 'User not found',
      ALREADY_EXISTS: 'User already exists',
      CREATION_FAILED: 'Failed to create user',
      UPDATE_FAILED: 'Failed to update user',
      DELETE_FAILED: 'Failed to delete user',
      UNAUTHORIZED: 'Unauthorized access',
      FORBIDDEN: 'Access forbidden',
    },
  },

  // Role validation messages
  ROLE: {
    NAME: {
      REQUIRED: 'Role name is required',
      TOO_SHORT: 'Role name must be at least 2 characters long',
      TOO_LONG: 'Role name must not exceed 50 characters',
      EMPTY: 'Role name cannot be empty',
      INVALID_FORMAT:
        'Role name can only contain letters, numbers, underscores, and hyphens',
      ALREADY_EXISTS: 'Role name already exists',
    },
    DESCRIPTION: {
      TOO_LONG: 'Description must not exceed 255 characters',
    },
    ID: {
      REQUIRED: 'Role ID is required',
      INVALID: 'Role ID must be a valid integer',
      NOT_FOUND: 'Role not found',
    },
    ASSIGNMENT: {
      USER_REQUIRED: 'User ID is required for role assignment',
      ROLE_REQUIRED: 'Role ID is required for assignment',
      FAILED: 'Failed to assign role',
      ALREADY_ASSIGNED: 'Role already assigned to user',
      BULK_LIMIT: 'Cannot assign roles to more than 100 users at once',
      NO_USERS: 'At least one user ID is required',
      PERMISSION_LIMIT: 'Cannot assign more than 50 permissions at once',
      NO_PERMISSIONS: 'At least one permission ID is required',
    },
    GENERAL: {
      NOT_FOUND: 'Role not found',
      CREATION_FAILED: 'Failed to create role',
      UPDATE_FAILED: 'Failed to update role',
      DELETE_FAILED: 'Failed to delete role',
      IN_USE: 'Role is currently in use and cannot be deleted',
    },
  },

  // Permission validation messages
  PERMISSION: {
    NAME: {
      REQUIRED: 'Permission name is required',
      TOO_SHORT: 'Permission name must be at least 2 characters long',
      TOO_LONG: 'Permission name must not exceed 50 characters',
      EMPTY: 'Permission name cannot be empty',
      INVALID_FORMAT:
        'Permission name can only contain letters, numbers, underscores, dots, and hyphens',
      PATTERN_MISMATCH:
        'Permission name should follow the pattern: action_resource',
      ALREADY_EXISTS: 'Permission name already exists',
    },
    RESOURCE: {
      REQUIRED: 'Resource is required',
      INVALID: 'Invalid resource type',
    },
    ACTION: {
      REQUIRED: 'Action is required',
      INVALID: 'Invalid action type',
    },
    DESCRIPTION: {
      TOO_LONG: 'Description must not exceed 255 characters',
    },
    ID: {
      REQUIRED: 'Permission ID is required',
      INVALID: 'Permission ID must be a valid integer',
      NOT_FOUND: 'Permission not found',
    },
    ASSIGNMENT: {
      ROLE_REQUIRED: 'Role ID is required for permission assignment',
      PERMISSION_REQUIRED: 'Permission ID is required for assignment',
      FAILED: 'Failed to assign permission',
      ALREADY_ASSIGNED: 'Permission already assigned to role',
      BULK_LIMIT: 'Cannot assign more than 50 permissions at once',
      NO_PERMISSIONS: 'At least one permission ID is required',
    },
    GENERAL: {
      NOT_FOUND: 'Permission not found',
      CREATION_FAILED: 'Failed to create permission',
      UPDATE_FAILED: 'Failed to update permission',
      DELETE_FAILED: 'Failed to delete permission',
      IN_USE: 'Permission is currently in use and cannot be deleted',
    },
  },

  // Common validation messages
  COMMON: {
    ID: {
      REQUIRED: 'ID is required',
      INVALID: 'ID must be a valid integer',
      POSITIVE: 'ID must be a positive number',
    },
    PAGINATION: {
      PAGE_INVALID: 'Page must be a positive integer',
      LIMIT_INVALID: 'Limit must be a positive integer',
      LIMIT_EXCEEDED: 'Limit cannot exceed 100',
      OFFSET_INVALID: 'Offset must be non-negative',
    },
    SEARCH: {
      QUERY_EMPTY: 'Search query cannot be empty',
      QUERY_TOO_LONG: 'Search query cannot exceed 255 characters',
      INVALID_SORT_ORDER: 'Sort order must be ASC or DESC',
    },
    DATE: {
      INVALID_FORMAT: 'Invalid date format',
      START_AFTER_END: 'Start date must be before or equal to end date',
      FUTURE_DATE: 'Date cannot be in the future',
      PAST_DATE: 'Date cannot be in the past',
    },
    FILE: {
      NAME_REQUIRED: 'Filename is required',
      TYPE_REQUIRED: 'File type is required',
      SIZE_INVALID: 'File size must be positive',
      SIZE_EXCEEDED: 'File size cannot exceed 10MB',
      INVALID_TYPE: 'Invalid file type',
      UPLOAD_FAILED: 'File upload failed',
    },
    PHONE: {
      INVALID_FORMAT: 'Invalid phone number format',
      TOO_SHORT: 'Phone number must be at least 10 digits',
      TOO_LONG: 'Phone number cannot exceed 20 characters',
    },
    URL: {
      INVALID: 'Must be a valid URL',
      TOO_LONG: 'URL cannot exceed 500 characters',
    },
  },

  // Authentication messages
  AUTH: {
    TOKEN: {
      REQUIRED: 'Authentication token is required',
      INVALID: 'Invalid authentication token',
      EXPIRED: 'Authentication token has expired',
      MALFORMED: 'Malformed authentication token',
    },
    LOGIN: {
      FAILED: 'Invalid email or password',
      REQUIRED: 'Email and password are required',
      ACCOUNT_LOCKED: 'Account is locked',
      ACCOUNT_DISABLED: 'Account is disabled',
    },
    REGISTER: {
      FAILED: 'Registration failed',
      EMAIL_EXISTS: 'Email already exists',
      WEAK_PASSWORD: 'Password is too weak',
    },
    RESET: {
      TOKEN_REQUIRED: 'Reset token is required',
      TOKEN_INVALID: 'Invalid or expired reset token',
      FAILED: 'Password reset failed',
    },
  },

  // System messages
  SYSTEM: {
    SERVER_ERROR: 'Internal server error',
    DATABASE_ERROR: 'Database connection error',
    VALIDATION_FAILED: 'Validation failed',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    CONFLICT: 'Resource conflict',
    RATE_LIMIT: 'Too many requests',
  },
};

// Helper function to get nested message
export const getMessage = (path, defaultMessage = 'Validation error') => {
  const pathArray = path.split('.');
  let current = VALIDATION_MESSAGES;

  for (const key of pathArray) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return defaultMessage;
    }
  }

  return typeof current === 'string' ? current : defaultMessage;
};

// Helper function to format validation messages with dynamic values
export const formatMessage = (template, values = {}) => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key] !== undefined ? values[key] : match;
  });
};

// Export default
export default VALIDATION_MESSAGES;
