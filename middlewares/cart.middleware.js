import { Cart as CartValidation } from '../utils/validations/index.js';
import { validateWithZod, asyncHandler } from '../utils/helper.js';
import { VALIDATION_MESSAGES } from '../utils/constants/messages.js';
import Product from '../models/product.model.js';
import Cart from '../models/cart.model.js';

// Middleware to validate add to cart request
export const validateAddToCart = asyncHandler(async (req, res, next) => {
  const validationResult = validateWithZod(
    CartValidation.schemas.addToCart,
    req.body
  );

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: VALIDATION_MESSAGES.SYSTEM.VALIDATION_FAILED,
      errors: validationResult.errors,
    });
  }

  req.validatedData = validationResult.data;
  next();
}, VALIDATION_MESSAGES.SYSTEM.SERVER_ERROR);

// Middleware to validate update quantity request
export const validateUpdateQuantity = asyncHandler(async (req, res, next) => {
  const validationResult = validateWithZod(
    CartValidation.schemas.updateQuantity,
    req.body
  );

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: VALIDATION_MESSAGES.SYSTEM.VALIDATION_FAILED,
      errors: validationResult.errors,
    });
  }

  req.validatedData = validationResult.data;
  next();
}, VALIDATION_MESSAGES.SYSTEM.SERVER_ERROR);

// Middleware to validate product ID parameter
export const validateProductId = asyncHandler(async (req, res, next) => {
  const validationResult = validateWithZod(
    CartValidation.schemas.productId,
    req.params
  );

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: VALIDATION_MESSAGES.SYSTEM.VALIDATION_FAILED,
      errors: validationResult.errors,
    });
  }

  req.validatedParams = validationResult.data;
  next();
}, VALIDATION_MESSAGES.SYSTEM.SERVER_ERROR);

// Middleware to check if product exists and is active
export const checkProductExists = asyncHandler(async (req, res, next) => {
  const productId =
    req.validatedData?.product_id || req.validatedParams?.product_id;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: VALIDATION_MESSAGES.CART.PRODUCT_ID.REQUIRED,
    });
  }

  const product = await Product.findByPk(productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: VALIDATION_MESSAGES.CART.PRODUCT_ID.NOT_FOUND,
    });
  }

  if (product.status !== 'active') {
    return res.status(400).json({
      success: false,
      message: 'Product is not available for purchase',
    });
  }

  req.product = product;
  next();
}, VALIDATION_MESSAGES.SYSTEM.SERVER_ERROR);

// Middleware to check stock availability
export const checkStockAvailability = asyncHandler(async (req, res, next) => {
  const { product } = req;
  const requestedQuantity = req.validatedData?.quantity || 1;

  if (!product) {
    return res.status(400).json({
      success: false,
      message: VALIDATION_MESSAGES.CART.PRODUCT_ID.NOT_FOUND,
    });
  }

  // Check if adding this quantity would exceed available stock
  const userId = req.user.id;
  const existingCartItem = await Cart.findOne({
    where: {
      user_id: userId,
      product_id: product.id,
    },
  });

  const currentCartQuantity = existingCartItem ? existingCartItem.quantity : 0;
  const totalQuantity = currentCartQuantity + requestedQuantity;

  if (totalQuantity > product.stock) {
    return res.status(400).json({
      success: false,
      message: VALIDATION_MESSAGES.CART.ITEM.INSUFFICIENT_STOCK,
      data: {
        available_stock: product.stock,
        current_cart_quantity: currentCartQuantity,
        requested_quantity: requestedQuantity,
      },
    });
  }

  next();
}, VALIDATION_MESSAGES.SYSTEM.SERVER_ERROR);

// Middleware to check if cart item exists for user
export const checkCartItemExists = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const productId = req.validatedParams?.product_id;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: VALIDATION_MESSAGES.CART.PRODUCT_ID.REQUIRED,
    });
  }

  const cartItem = await Cart.findOne({
    where: {
      user_id: userId,
      product_id: productId,
    },
  });

  if (!cartItem) {
    return res.status(404).json({
      success: false,
      message: VALIDATION_MESSAGES.CART.ITEM.NOT_FOUND,
    });
  }

  req.cartItem = cartItem;
  next();
}, VALIDATION_MESSAGES.SYSTEM.SERVER_ERROR);

// Middleware to validate stock for quantity update
export const validateStockForUpdate = asyncHandler(async (req, res, next) => {
  const { product, validatedData } = req;
  const newQuantity = validatedData.quantity;

  if (newQuantity > product.stock) {
    return res.status(400).json({
      success: false,
      message: VALIDATION_MESSAGES.CART.ITEM.INSUFFICIENT_STOCK,
      data: {
        available_stock: product.stock,
        requested_quantity: newQuantity,
      },
    });
  }

  next();
}, VALIDATION_MESSAGES.SYSTEM.SERVER_ERROR);

export default {
  validateAddToCart,
  validateUpdateQuantity,
  validateProductId,
  checkProductExists,
  checkStockAvailability,
  checkCartItemExists,
  validateStockForUpdate,
};
