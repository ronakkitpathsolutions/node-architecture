import Product from '../models/product.model.js';
import { createValidationMiddleware } from './validation.middleware.js';
import { createApiResponse, asyncHandler } from '../utils/helper.js';
import { VALIDATION_MESSAGES } from '../utils/constants/messages.js';

// Custom middleware for product creation that handles file upload
export const createProductValidationMiddleware = asyncHandler(
  async (req, res, next) => {
    // If a file was uploaded, add the image URL to the request body
    if (req.file && req.file.location) {
      req.body.image_url = req.file.location;
    }

    // Validate the data using the standard product validation
    const validationResult = await Product.validateCreateData(req.body);

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
  },
  'Validation error'
);

// Custom middleware for product update that handles file upload
export const updateProductValidationMiddleware = asyncHandler(
  async (req, res, next) => {
    // If a file was uploaded, add the image URL to the request body
    if (req.file && req.file.location) {
      req.body.image_url = req.file.location;
    }

    // Validate the data using the standard product validation
    const validationResult = await Product.validateUpdateData(req.body);

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
  },
  'Validation error'
);

export const partialUpdateProductValidationMiddleware =
  createValidationMiddleware(Product.validatePartialUpdateData);

// Specialized validation middlewares for specific update operations
export const updateProductStockValidationMiddleware =
  createValidationMiddleware(async data => {
    const { Product: ProductValidation } = await import(
      '../utils/validations/index.js'
    );
    const { validateWithZod } = await import('../utils/helper.js');
    return validateWithZod(ProductValidation.schemas.updateStock, data);
  });

export const updateProductStatusValidationMiddleware =
  createValidationMiddleware(async data => {
    const { Product: ProductValidation } = await import(
      '../utils/validations/index.js'
    );
    const { validateWithZod } = await import('../utils/helper.js');
    return validateWithZod(ProductValidation.schemas.updateStatus, data);
  });

export const updateProductPriceValidationMiddleware =
  createValidationMiddleware(async data => {
    const { Product: ProductValidation } = await import(
      '../utils/validations/index.js'
    );
    const { validateWithZod } = await import('../utils/helper.js');
    return validateWithZod(ProductValidation.schemas.updatePrice, data);
  });
