import express from 'express';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  getCategoryBySlug,
  updateCategory,
} from '../controllers/category.controller.js';
import {
  idValidationMiddleware,
  slugValidationMiddleware,
} from '../middlewares/validation.middleware.js';
import {
  createCategoryValidationMiddleware,
  updateCategoryValidationMiddleware,
} from '../middlewares/category.middleware.js';
import { getCategoryImageUploadMiddleware } from '../middlewares/s3.middleware.js';

const categoryRoutes = express.Router();

// Create S3 upload middleware for category images with aggressive compression
const upload = getCategoryImageUploadMiddleware('categories'); // This will compress images by ~80%

// Category CRUD routes
categoryRoutes.post(
  '/categories/create',
  [upload.single('category_image'), createCategoryValidationMiddleware],
  createCategory
);
categoryRoutes.get('/categories', getAllCategories);
categoryRoutes.get('/categories/:id', idValidationMiddleware, getCategory);
categoryRoutes.patch(
  '/categories/:id',
  [
    idValidationMiddleware,
    upload.single('category_image'),
    updateCategoryValidationMiddleware,
  ],
  updateCategory
);
categoryRoutes.delete(
  '/categories/:id',
  idValidationMiddleware,
  deleteCategory
);

// Additional route to get category by slug (must be placed after other specific routes to avoid conflicts)
categoryRoutes.get(
  '/categories/slug/:slug',
  slugValidationMiddleware,
  getCategoryBySlug
);

export default categoryRoutes;
