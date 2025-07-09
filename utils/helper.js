import { z } from 'zod';

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
