import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  updateProductStock,
  updateProductStatus,
  deleteProduct,
  getProductBySlug,
} from '../controllers/product.controller.js';
import {
  createProductValidationMiddleware,
  updateProductValidationMiddleware,
  updateProductStockValidationMiddleware,
  updateProductStatusValidationMiddleware,
} from '../middlewares/product.middleware.js';
import {
  idValidationMiddleware,
  slugValidationMiddleware,
} from '../middlewares/validation.middleware.js';
import { getImageUploadWithWebpMiddleware } from '../middlewares/s3.middleware.js';

const productRoutes = express.Router();

// Create S3 upload middleware for product images
const upload = getImageUploadWithWebpMiddleware('products'); // uploads go to "products/" folder

// Product CRUD routes
productRoutes.post(
  '/products/create',
  upload.single('image_url'),
  createProductValidationMiddleware,
  createProduct
);
productRoutes.get('/products', getAllProducts);
productRoutes.get('/products/:id', idValidationMiddleware, getProduct);
productRoutes.get(
  '/products/slug/:slug',
  slugValidationMiddleware,
  getProductBySlug
);

productRoutes.patch(
  '/products/:id',
  idValidationMiddleware,
  upload.single('image_url'), // Handle image upload
  updateProductValidationMiddleware,
  updateProduct
);
productRoutes.delete('/products/:id', idValidationMiddleware, deleteProduct);

// Specialized product update routes
productRoutes.patch(
  '/products/:id/stock',
  [idValidationMiddleware, updateProductStockValidationMiddleware],
  updateProductStock
);

productRoutes.patch(
  '/products/:id/status',
  [idValidationMiddleware, updateProductStatusValidationMiddleware],
  updateProductStatus
);

export default productRoutes;
