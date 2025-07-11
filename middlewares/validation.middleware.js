import { createApiResponse, asyncHandler } from '../utils/helper.js';
import { Common } from '../utils/validations/index.js';
import { VALIDATION_MESSAGES } from '../utils/constants/messages.js';

const createValidationMiddleware = validationFunction => {
  return asyncHandler(async (req, res, next) => {
    const validationResult = await validationFunction(req.body);

    if (!validationResult.success) {
      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            VALIDATION_MESSAGES.SYSTEM.VALIDATION_FAILED,
            null,
            validationResult.errors
          )
        );
    }

    // Add validated data to request object for use in controller
    req.validatedData = validationResult.data;
    next();
  }, 'Validation error');
};

const createIdValidationMiddleware = paramName => {
  return asyncHandler(async (req, res, next) => {
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
  }, 'ID validation error');
};

// Slug validation middleware
const createSlugValidationMiddleware = (paramName = 'slug') => {
  return asyncHandler(async (req, res, next) => {
    const slug = req.params[paramName];

    // Validate slug format
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      return res.status(400).json(
        createApiResponse(
          false,
          VALIDATION_MESSAGES.CATEGORY.SLUG.INVALID_FORMAT,
          null,
          {
            slug: 'Slug can only contain lowercase letters, numbers, and hyphens',
          }
        )
      );
    }

    // Add validated slug to request object
    req.validatedSlug = slug;
    next();
  }, 'Slug validation error');
};

// ID validation middlewares
const idValidationMiddleware = createIdValidationMiddleware('id'); // use 'id' parameter

// Slug validation middlewares
const slugValidationMiddleware = createSlugValidationMiddleware('slug'); // use 'slug' parameter

// Generic validation middleware for any validation function
export {
  createValidationMiddleware,
  createIdValidationMiddleware,
  createSlugValidationMiddleware,
  idValidationMiddleware,
  slugValidationMiddleware,
};
