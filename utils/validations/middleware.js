import { ZodError } from 'zod';

/**
 * Middleware factory for Zod validation
 * @param {Object} schema - Zod schema to validate against
 * @param {String} source - Where to get data from ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const data = req[source];
      const result = schema.safeParse(data);

      if (!result.success) {
        const errors = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
      }

      // Replace the original data with validated and transformed data
      req[source] = result.data;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal validation error',
        error: error.message,
      });
    }
  };
};

/**
 * Middleware for validating request body
 * @param {Object} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
export const validateBody = schema => validate(schema, 'body');

/**
 * Middleware for validating query parameters
 * @param {Object} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
export const validateQuery = schema => validate(schema, 'query');

/**
 * Middleware for validating route parameters
 * @param {Object} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
export const validateParams = schema => validate(schema, 'params');

/**
 * Middleware for validating multiple sources
 * @param {Object} schemas - Object with schemas for different sources
 * @returns {Function} Express middleware function
 */
export const validateMultiple = schemas => {
  return (req, res, next) => {
    const errors = [];

    // Validate each specified source
    for (const [source, schema] of Object.entries(schemas)) {
      if (req[source] && schema) {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
          const sourceErrors = result.error.errors.map(err => ({
            field: `${source}.${err.path.join('.')}`,
            message: err.message,
            code: err.code,
          }));
          errors.push(...sourceErrors);
        } else {
          // Update with validated data
          req[source] = result.data;
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    next();
  };
};

/**
 * Helper function to format Zod errors
 * @param {ZodError} error - Zod error object
 * @returns {Array} Formatted error array
 */
export const formatZodError = error => {
  if (!(error instanceof ZodError)) {
    return [{ message: error.message || 'Unknown error' }];
  }

  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code,
    received: err.received,
  }));
};

/**
 * Async validation helper
 * @param {Object} schema - Zod schema
 * @param {Object} data - Data to validate
 * @returns {Promise<Object>} Validation result
 */
export const validateAsync = async (schema, data) => {
  try {
    const result = await schema.parseAsync(data);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      errors: formatZodError(error),
    };
  }
};

/**
 * Synchronous validation helper
 * @param {Object} schema - Zod schema
 * @param {Object} data - Data to validate
 * @returns {Object} Validation result
 */
export const validateSync = (schema, data) => {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: formatZodError(result.error),
  };
};

// Export default object with all validation functions
export default {
  validate,
  validateBody,
  validateQuery,
  validateParams,
  validateMultiple,
  formatZodError,
  validateAsync,
  validateSync,
};
