import { z } from 'zod';
import logger from './logger.js';

export const formatZodErrors = zodError => {
  const errors = {};
  zodError.errors.forEach(err => {
    const fieldName = err.path.join('.');
    errors[fieldName] = err.message;
  });
  return errors;
};

export const formatSequelizeErrors = sequelizeError => {
  const errors = {};

  if (sequelizeError.errors && Array.isArray(sequelizeError.errors)) {
    sequelizeError.errors.forEach(err => {
      errors[err.path] = err.message;
    });
  } else if (sequelizeError.message) {
    errors.general = sequelizeError.message;
  }

  return errors;
};

export const createValidationResult = (success, data = null, errors = null) => {
  return {
    success,
    ...(success ? { data } : { errors }),
  };
};

export const validateWithZod = (schema, data) => {
  try {
    const result = schema.safeParse(data);

    if (result.success) {
      return createValidationResult(true, result.data);
    } else {
      const errors = formatZodErrors(result.error);
      return createValidationResult(false, null, errors);
    }
  } catch (err) {
    return createValidationResult(false, null, {
      general: err.message || 'Validation failed',
    });
  }
};

export const createApiResponse = (
  success,
  message,
  data = null,
  error = null
) => {
  return {
    success,
    message,
    ...(success ? { data } : { error }),
  };
};

export const extractValidationErrors = error => {
  if (error instanceof z.ZodError) {
    return formatZodErrors(error);
  }

  if (error.name === 'SequelizeValidationError') {
    return formatSequelizeErrors(error);
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    const errors = {};
    if (error.errors && Array.isArray(error.errors)) {
      error.errors.forEach(err => {
        errors[err.path] = err.message;
      });
    } else {
      errors.general = 'A unique constraint violation occurred';
    }
    return errors;
  }

  // Default error handling
  return {
    general: error.message || 'An unexpected error occurred',
  };
};

export const validateJSONField = (value, options = {}) => {
  const { fieldName = 'Field', allowEmpty = false, allowNull = true } = options;

  // Allow null and undefined values if specified
  if ((value === null || value === undefined) && allowNull) {
    return true;
  }

  // Reject null/undefined if not allowed
  if ((value === null || value === undefined) && !allowNull) {
    throw new Error(`${fieldName} cannot be null or undefined`);
  }

  try {
    // Handle string input - must be valid JSON
    if (typeof value === 'string') {
      const parsed = JSON.parse(value);

      // Ensure parsed result is an object (not array, null, or primitive)
      if (
        typeof parsed !== 'object' ||
        Array.isArray(parsed) ||
        parsed === null
      ) {
        throw new Error(
          `${fieldName} must be a JSON object, not an array, null, or primitive value`
        );
      }

      // Check if empty object is allowed
      if (!allowEmpty && Object.keys(parsed).length === 0) {
        throw new Error(`${fieldName} object cannot be empty`);
      }

      return true;
    }

    // Handle object input
    if (typeof value === 'object') {
      // Reject arrays
      if (Array.isArray(value)) {
        throw new Error(`${fieldName} must be a JSON object, not an array`);
      }

      // Reject null (already handled above, but keeping for safety)
      if (value === null) {
        throw new Error(`${fieldName} cannot be null`);
      }

      // Reject Date objects and other non-plain objects
      if (value.constructor !== Object) {
        throw new Error(`${fieldName} must be a plain JSON object`);
      }

      // Check if empty object is allowed
      if (!allowEmpty && Object.keys(value).length === 0) {
        throw new Error(`${fieldName} object cannot be empty`);
      }

      // Test if object can be serialized to JSON and back
      const serialized = JSON.stringify(value);
      const deserialized = JSON.parse(serialized);

      // Ensure no data loss during serialization
      if (JSON.stringify(deserialized) !== serialized) {
        throw new Error(`${fieldName} object contains non-serializable data`);
      }

      return true;
    }

    // Reject all other types (numbers, booleans, functions, etc.)
    throw new Error(
      `${fieldName} must be a JSON object, received ${typeof value}`
    );
  } catch (error) {
    // If it's already our custom error, re-throw it
    if (error.message.includes(fieldName)) {
      throw error;
    }

    // Handle JSON parsing errors
    throw new Error(
      `Invalid JSON format in ${fieldName.toLowerCase()}: ${error.message}`
    );
  }
};

export const createJSONValidator = (options = {}) => {
  return function (value) {
    return validateJSONField(value, options);
  };
};

export const mergeAccessPermissions = (
  existingAccess = {},
  accessUpdates = {},
  mergeStrategy = 'merge'
) => {
  if (!accessUpdates || Object.keys(accessUpdates).length === 0) {
    return existingAccess;
  }

  switch (mergeStrategy) {
    case 'replace':
      // Replace entire access object
      return accessUpdates;

    case 'merge':
      // Merge top-level modules
      return { ...existingAccess, ...accessUpdates };

    case 'deep_merge': {
      // Deep merge permissions within modules
      const deepMergedAccess = { ...existingAccess };
      Object.keys(accessUpdates).forEach(module => {
        if (deepMergedAccess[module]) {
          deepMergedAccess[module] = {
            ...deepMergedAccess[module],
            ...accessUpdates[module],
          };
        } else {
          deepMergedAccess[module] = accessUpdates[module];
        }
      });
      return deepMergedAccess;
    }

    default:
      // Default to merge strategy
      return { ...existingAccess, ...accessUpdates };
  }
};

export const validateAccessUpdates = accessUpdates => {
  if (!accessUpdates || typeof accessUpdates !== 'object') {
    return { isValid: false, error: 'Access updates must be an object' };
  }

  for (const [moduleName, permissions] of Object.entries(accessUpdates)) {
    if (
      typeof moduleName !== 'string' ||
      moduleName.length === 0 ||
      moduleName.length > 50
    ) {
      return { isValid: false, error: `Invalid module name: ${moduleName}` };
    }

    if (!permissions || typeof permissions !== 'object') {
      return {
        isValid: false,
        error: `Invalid permissions for module: ${moduleName}`,
      };
    }

    // Validate permission structure
    const { read, write, none } = permissions;
    if (read !== undefined && typeof read !== 'boolean') {
      return {
        isValid: false,
        error: `Invalid read permission for module: ${moduleName}`,
      };
    }
    if (write !== undefined && typeof write !== 'boolean') {
      return {
        isValid: false,
        error: `Invalid write permission for module: ${moduleName}`,
      };
    }
    if (none !== undefined && typeof none !== 'boolean') {
      return {
        isValid: false,
        error: `Invalid none permission for module: ${moduleName}`,
      };
    }

    // Validate logical consistency
    if (none === true && (read === true || write === true)) {
      return {
        isValid: false,
        error: `If none is true, both read and write must be false for module: ${moduleName}`,
      };
    }
  }

  return { isValid: true };
};

export const asyncHandler = (fn, errorMessage = 'Operation failed') => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      const formattedErrors = extractValidationErrors(error);
      logger.error(error);
      return res
        .status(500)
        .json(createApiResponse(false, errorMessage, null, formattedErrors));
    }
  };
};
