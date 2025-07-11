import Category from '../models/category.model.js';
import { createValidationMiddleware } from './validation.middleware.js';

// Category validation middlewares
export const createCategoryValidationMiddleware = createValidationMiddleware(
  Category.validateCreateData
);

export const updateCategoryValidationMiddleware = createValidationMiddleware(
  Category.validateUpdateData
);
