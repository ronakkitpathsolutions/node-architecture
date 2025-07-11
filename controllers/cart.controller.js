import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import sequelize from '../config/database.js';
import { VALIDATION_MESSAGES } from '../utils/constants/messages.js';
import { createApiResponse, asyncHandler } from '../utils/helper.js';

// Add item to cart or update quantity if exists
export const addToCart = asyncHandler(async (req, res) => {
  const transaction = await sequelize.transaction();

  const userId = req.user.id;
  const { product_id: productId, quantity = 1 } = req.validatedData;

  // Add item to cart (or update quantity if exists)
  const cartItem = await Cart.addToCart(
    userId,
    productId,
    quantity,
    transaction
  );

  await transaction.commit();

  // Fetch updated cart item with product details
  const updatedCartItem = await Cart.findByPk(cartItem.id, {
    include: [
      {
        model: Product,
        as: 'product',
        attributes: [
          'id',
          'name',
          'slug',
          'price',
          'stock',
          'image_url',
          'status',
        ],
      },
    ],
  });

  return res.status(200).json(
    createApiResponse(true, VALIDATION_MESSAGES.CART.OPERATION.ADD_SUCCESS, {
      cart_item: updatedCartItem,
    })
  );
}, VALIDATION_MESSAGES.CART.OPERATION.FAILED);

// Update cart item quantity
export const updateCartQuantity = asyncHandler(async (req, res) => {
  const transaction = await sequelize.transaction();

  const userId = req.user.id;
  const { product_id: productId } = req.validatedParams;
  const { quantity } = req.validatedData;

  // Update cart item quantity
  const cartItem = await Cart.updateQuantity(
    userId,
    productId,
    quantity,
    transaction
  );

  await transaction.commit();

  // Fetch updated cart item with product details
  const updatedCartItem = await Cart.findByPk(cartItem.id, {
    include: [
      {
        model: Product,
        as: 'product',
        attributes: [
          'id',
          'name',
          'slug',
          'price',
          'stock',
          'image_url',
          'status',
        ],
      },
    ],
  });

  return res.status(200).json(
    createApiResponse(true, VALIDATION_MESSAGES.CART.OPERATION.UPDATE_SUCCESS, {
      cart_item: updatedCartItem,
    })
  );
}, VALIDATION_MESSAGES.CART.OPERATION.FAILED);

// Remove item from cart
export const removeFromCart = asyncHandler(async (req, res) => {
  const transaction = await sequelize.transaction();

  const userId = req.user.id;
  const { product_id: productId } = req.validatedParams;

  // Remove item from cart
  await Cart.removeFromCart(userId, productId, transaction);

  await transaction.commit();

  return res
    .status(200)
    .json(
      createApiResponse(true, VALIDATION_MESSAGES.CART.OPERATION.REMOVE_SUCCESS)
    );
}, VALIDATION_MESSAGES.CART.OPERATION.FAILED);

// Get user's cart with product details
export const getUserCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  // Get user's cart items with product details
  const cartItems = await Cart.getUserCart(userId);

  // Calculate cart summary
  let totalItems = 0;
  let totalAmount = 0;

  cartItems.forEach(item => {
    totalItems += item.quantity;
    if (item.product && item.product.price) {
      totalAmount += item.quantity * parseFloat(item.product.price);
    }
  });

  return res.status(200).json(
    createApiResponse(true, 'Cart retrieved successfully', {
      cart_items: cartItems,
      summary: {
        total_unique_items: cartItems.length,
        total_items: totalItems,
        total_amount: totalAmount.toFixed(2),
      },
    })
  );
}, VALIDATION_MESSAGES.SYSTEM.SERVER_ERROR);

// Clear all items from user's cart
export const clearCart = asyncHandler(async (req, res) => {
  const transaction = await sequelize.transaction();

  const userId = req.user.id;
  // Clear user's cart
  const deletedCount = await Cart.clearCart(userId, transaction);

  await transaction.commit();

  if (deletedCount === 0) {
    return res.status(200).json(
      createApiResponse(true, VALIDATION_MESSAGES.CART.ITEM.EMPTY_CART, {
        deleted_items: 0,
      })
    );
  }

  return res.status(200).json(
    createApiResponse(true, VALIDATION_MESSAGES.CART.OPERATION.CLEAR_SUCCESS, {
      deleted_items: deletedCount,
    })
  );
}, VALIDATION_MESSAGES.CART.OPERATION.FAILED);

// Get cart item count for user
export const getCartItemCount = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  // Get total quantity of items in cart
  const itemCount = await Cart.getCartItemCount(userId);

  return res.status(200).json(
    createApiResponse(true, 'Cart item count retrieved successfully', {
      total_items: itemCount,
    })
  );
}, VALIDATION_MESSAGES.SYSTEM.SERVER_ERROR);

export default {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  getUserCart,
  clearCart,
  getCartItemCount,
};
