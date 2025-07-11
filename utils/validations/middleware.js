import { ZodError } from 'zod';
import { VALIDATION_MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../helper.js';

export const validate = (schema, source = 'body') => {
  return asyncHandler(async (req, res, next) => {
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
        message: VALIDATION_MESSAGES.SYSTEM.VALIDATION_FAILED,
        errors,
      });
    }

    // Replace the original data with validated and transformed data
    req[source] = result.data;
    next();
  }, 'Internal validation error');
};
export const validateBody = schema => validate(schema, 'body');

export const validateQuery = schema => validate(schema, 'query');

export const validateParams = schema => validate(schema, 'params');

export const validateMultiple = schemas => {
  return asyncHandler(async (req, res, next) => {
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
        message: VALIDATION_MESSAGES.SYSTEM.VALIDATION_FAILED,
        errors,
      });
    }

    next();
  }, 'Internal validation error');
};

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
  validateSync,
};
