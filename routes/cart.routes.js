import express from 'express';
import cartController from '../controllers/cart.controller.js';
import cartMiddleware from '../middlewares/cart.middleware.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const cartRoutes = express.Router();

// Add item to cart
cartRoutes.post(
  '/cart/create',
  authenticateToken,
  cartMiddleware.validateAddToCart,
  cartMiddleware.checkProductExists,
  cartMiddleware.checkStockAvailability,
  cartController.addToCart
);

// Get user's cart
cartRoutes.get('/cart', authenticateToken, cartController.getUserCart);

// Get cart item count
cartRoutes.get(
  '/cart/count',
  authenticateToken,
  cartController.getCartItemCount
);

// Update cart item quantity
cartRoutes.put(
  '/cart/:product_id',
  authenticateToken,
  cartMiddleware.validateProductId,
  cartMiddleware.validateUpdateQuantity,
  cartMiddleware.checkProductExists,
  cartMiddleware.checkCartItemExists,
  cartMiddleware.validateStockForUpdate,
  cartController.updateCartQuantity
);

// Remove item from cart
cartRoutes.delete(
  '/cart/:product_id',
  authenticateToken,
  cartMiddleware.validateProductId,
  cartMiddleware.checkCartItemExists,
  cartController.removeFromCart
);

// Clear entire cart
cartRoutes.delete('/cart', authenticateToken, cartController.clearCart);

export default cartRoutes;
