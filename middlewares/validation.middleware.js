import { createApiResponse } from '../utils/helper.js';
import { Common } from '../utils/validations/index.js';

const createValidationMiddleware = validationFunction => {
  return (req, res, next) => {
    try {
      const validationResult = validationFunction(req.body);

      if (!validationResult.success) {
        return res
          .status(400)
          .json(
            createApiResponse(
              false,
              'Validation failed',
              null,
              validationResult.errors
            )
          );
      }

      // Add validated data to request object for use in controller
      req.validatedData = validationResult.data;
      next();
    } catch (error) {
      return res.status(500).json(
        createApiResponse(false, 'Validation error', null, {
          general: error.message || 'An unexpected validation error occurred',
        })
      );
    }
  };
};

const createIdValidationMiddleware = paramName => {
  return (req, res, next) => {
    try {
      const id = parseInt(req.params[paramName], 10);
      const validationResult = Common.validate.id(id);

      if (!validationResult.success) {
        return res
          .status(400)
          .json(
            createApiResponse(
              false,
              'Invalid ID provided',
              null,
              validationResult.error
            )
          );
      }

      // Add validated ID to request object
      req.validatedId = validationResult.data;
      next();
    } catch (error) {
      return res.status(500).json(
        createApiResponse(false, 'ID validation error', null, {
          general: error.message || 'An unexpected validation error occurred',
        })
      );
    }
  };
};
// ID validation middlewares
const idValidationMiddleware = createIdValidationMiddleware('id'); // use 'id' parameter

// Generic validation middleware for any validation function
export {
  createValidationMiddleware,
  createIdValidationMiddleware,
  idValidationMiddleware,
};
