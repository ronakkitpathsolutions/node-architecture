import { z } from 'zod';
import { VALIDATION_MESSAGES } from '../constants/messages.js';

// Base cart validation schema
const CartValidationSchema = z.object({
  user_id: z
    .union([z.number(), z.string()])
    .transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
    .refine(val => !isNaN(val), VALIDATION_MESSAGES.CART.USER_ID.INVALID)
    .refine(
      val => Number.isInteger(val),
      VALIDATION_MESSAGES.CART.USER_ID.INVALID
    )
    .refine(val => val > 0, VALIDATION_MESSAGES.CART.USER_ID.POSITIVE),

  product_id: z
    .union([z.number(), z.string()])
    .transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
    .refine(val => !isNaN(val), VALIDATION_MESSAGES.CART.PRODUCT_ID.INVALID)
    .refine(
      val => Number.isInteger(val),
      VALIDATION_MESSAGES.CART.PRODUCT_ID.INVALID
    )
    .refine(val => val > 0, VALIDATION_MESSAGES.CART.PRODUCT_ID.POSITIVE),

  quantity: z
    .union([z.number(), z.string()])
    .transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
    .refine(val => !isNaN(val), VALIDATION_MESSAGES.CART.QUANTITY.INVALID)
    .refine(
      val => Number.isInteger(val),
      VALIDATION_MESSAGES.CART.QUANTITY.INVALID
    )
    .refine(val => val >= 1, VALIDATION_MESSAGES.CART.QUANTITY.MIN_VALUE)
    .refine(val => val <= 999, VALIDATION_MESSAGES.CART.QUANTITY.MAX_VALUE),
});

// Schema for adding item to cart
export const AddToCartSchema = z.object({
  product_id: z
    .union([z.number(), z.string()])
    .transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
    .refine(val => !isNaN(val), VALIDATION_MESSAGES.CART.PRODUCT_ID.INVALID)
    .refine(
      val => Number.isInteger(val),
      VALIDATION_MESSAGES.CART.PRODUCT_ID.INVALID
    )
    .refine(val => val > 0, VALIDATION_MESSAGES.CART.PRODUCT_ID.POSITIVE),

  quantity: z
    .union([z.number(), z.string()])
    .transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
    .refine(val => !isNaN(val), VALIDATION_MESSAGES.CART.QUANTITY.INVALID)
    .refine(
      val => Number.isInteger(val),
      VALIDATION_MESSAGES.CART.QUANTITY.INVALID
    )
    .refine(val => val >= 1, VALIDATION_MESSAGES.CART.QUANTITY.MIN_VALUE)
    .refine(val => val <= 999, VALIDATION_MESSAGES.CART.QUANTITY.MAX_VALUE)
    .optional()
    .default(1),
});

// Schema for updating cart item quantity
export const UpdateCartQuantitySchema = z.object({
  quantity: z
    .union([z.number(), z.string()])
    .transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
    .refine(val => !isNaN(val), VALIDATION_MESSAGES.CART.QUANTITY.INVALID)
    .refine(
      val => Number.isInteger(val),
      VALIDATION_MESSAGES.CART.QUANTITY.INVALID
    )
    .refine(val => val >= 1, VALIDATION_MESSAGES.CART.QUANTITY.MIN_VALUE)
    .refine(val => val <= 999, VALIDATION_MESSAGES.CART.QUANTITY.MAX_VALUE),
});

// Schema for cart item ID parameter validation
export const CartItemIdSchema = z.object({
  id: z
    .union([z.number(), z.string()])
    .transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
    .refine(val => !isNaN(val), VALIDATION_MESSAGES.CART.PRODUCT_ID.INVALID)
    .refine(
      val => Number.isInteger(val),
      VALIDATION_MESSAGES.CART.PRODUCT_ID.INVALID
    )
    .refine(val => val > 0, VALIDATION_MESSAGES.CART.PRODUCT_ID.POSITIVE),
});

// Schema for product ID parameter validation
export const ProductIdSchema = z.object({
  product_id: z
    .union([z.number(), z.string()])
    .transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
    .refine(val => !isNaN(val), VALIDATION_MESSAGES.CART.PRODUCT_ID.INVALID)
    .refine(
      val => Number.isInteger(val),
      VALIDATION_MESSAGES.CART.PRODUCT_ID.INVALID
    )
    .refine(val => val > 0, VALIDATION_MESSAGES.CART.PRODUCT_ID.POSITIVE),
});

// Export all schemas
export const Cart = {
  CartValidationSchema,
  AddToCartSchema,
  UpdateCartQuantitySchema,
  CartItemIdSchema,
  ProductIdSchema,
};
