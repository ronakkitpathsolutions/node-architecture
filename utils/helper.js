import { z } from 'zod';

/**
 * Formats Zod validation errors into a simple object format
 * @param {z.ZodError} zodError - The Zod validation error
 * @returns {Object} Simple error object with field names as keys and error messages as values
 */
export const formatZodErrors = zodError => {
  const errors = {};
  zodError.errors.forEach(err => {
    const fieldName = err.path.join('.');
    errors[fieldName] = err.message;
  });
  return errors;
};

/**
 * Formats Sequelize validation errors into a simple object format
 * @param {Object} sequelizeError - The Sequelize validation error
 * @returns {Object} Simple error object with field names as keys and error messages as values
 */
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

/**
 * Creates a standardized validation result object
 * @param {boolean} success - Whether validation was successful
 * @param {Object} data - The validated data (if successful)
 * @param {Object} errors - The validation errors (if unsuccessful)
 * @returns {Object} Standardized validation result
 */
export const createValidationResult = (success, data = null, errors = null) => {
  return {
    success,
    ...(success ? { data } : { errors }),
  };
};

/**
 * Validates data using a Zod schema and returns a standardized result
 * @param {z.ZodSchema} schema - The Zod schema to validate against
 * @param {Object} data - The data to validate
 * @returns {Object} Standardized validation result
 */
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

/**
 * Creates a standardized API response object
 * @param {boolean} success - Whether the operation was successful
 * @param {string} message - Response message
 * @param {Object} data - Response data (if successful)
 * @param {Object} error - Error details (if unsuccessful)
 * @returns {Object} Standardized API response
 */
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

/**
 * Extracts and formats validation errors from various error types
 * @param {Error} error - The error to format
 * @returns {Object} Formatted error object
 */
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
