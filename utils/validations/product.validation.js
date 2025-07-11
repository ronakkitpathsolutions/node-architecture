import { z } from 'zod';
import { VALIDATION_MESSAGES } from '../constants/messages.js';

// Helper function to validate decimal places
const validateDecimalPlaces = (value, maxDecimalPlaces = 2) => {
  // Convert to string to check decimal places accurately
  const stringValue = value.toString();

  // Check if there's a decimal point
  if (!stringValue.includes('.')) {
    return true; // No decimal places, valid
  }

  // Get the decimal part
  const decimalPart = stringValue.split('.')[1];

  // Remove trailing zeros to get actual decimal places
  const actualDecimalPart = decimalPart.replace(/0+$/, '');

  // Check if decimal part has more than allowed places
  return actualDecimalPart.length <= maxDecimalPlaces;
};

// Base product validation schema
const ProductValidationSchema = z.object({
  name: z
    .string()
    .min(2, VALIDATION_MESSAGES.PRODUCT.NAME.TOO_SHORT)
    .max(255, VALIDATION_MESSAGES.PRODUCT.NAME.TOO_LONG)
    .trim()
    .refine(val => val.length > 0, VALIDATION_MESSAGES.PRODUCT.NAME.EMPTY),

  slug: z
    .string()
    .min(2, VALIDATION_MESSAGES.PRODUCT.SLUG.TOO_SHORT)
    .max(255, VALIDATION_MESSAGES.PRODUCT.SLUG.TOO_LONG)
    .regex(/^[a-z0-9-]+$/, VALIDATION_MESSAGES.PRODUCT.SLUG.INVALID_FORMAT)
    .optional(),

  description: z
    .string()
    .max(5000, VALIDATION_MESSAGES.PRODUCT.DESCRIPTION.TOO_LONG)
    .optional()
    .nullable(),

  price: z
    .union([z.number(), z.string()])
    .transform(val => (typeof val === 'string' ? parseFloat(val) : val))
    .refine(
      val => !isNaN(val),
      VALIDATION_MESSAGES.PRODUCT.PRICE.INVALID_DECIMAL
    )
    .refine(val => val > 0, VALIDATION_MESSAGES.PRODUCT.PRICE.MUST_BE_POSITIVE)
    .refine(val => {
      // Check if price has more than 2 decimal places
      return validateDecimalPlaces(val, 2);
    }, VALIDATION_MESSAGES.PRODUCT.PRICE.INVALID_DECIMAL),

  stock: z
    .union([z.number(), z.string()])
    .transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
    .refine(
      val => !isNaN(val),
      VALIDATION_MESSAGES.PRODUCT.STOCK.MUST_BE_INTEGER
    )
    .refine(
      val => Number.isInteger(val),
      VALIDATION_MESSAGES.PRODUCT.STOCK.MUST_BE_INTEGER
    )
    .refine(
      val => val >= 0,
      VALIDATION_MESSAGES.PRODUCT.STOCK.MUST_BE_POSITIVE
    ),

  image_url: z
    .string()
    .url(VALIDATION_MESSAGES.PRODUCT.IMAGE_URL.INVALID_URL)
    .max(255, VALIDATION_MESSAGES.PRODUCT.IMAGE_URL.TOO_LONG)
    .optional()
    .nullable(),

  category_id: z
    .union([z.number(), z.string()])
    .transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
    .refine(val => !isNaN(val), VALIDATION_MESSAGES.PRODUCT.CATEGORY_ID.INVALID)
    .refine(
      val => Number.isInteger(val),
      VALIDATION_MESSAGES.PRODUCT.CATEGORY_ID.INVALID
    )
    .refine(val => val > 0, VALIDATION_MESSAGES.PRODUCT.CATEGORY_ID.POSITIVE),

  status: z.enum(['active', 'inactive', 'draft']).optional().default('draft'),
});

// Schema for product creation (all required fields except optional ones)
export const CreateProductSchema = ProductValidationSchema.omit({
  slug: true, // Will be auto-generated if not provided
}).extend({
  slug: z
    .string()
    .min(2, VALIDATION_MESSAGES.PRODUCT.SLUG.TOO_SHORT)
    .max(255, VALIDATION_MESSAGES.PRODUCT.SLUG.TOO_LONG)
    .regex(/^[a-z0-9-]+$/, VALIDATION_MESSAGES.PRODUCT.SLUG.INVALID_FORMAT)
    .optional(),
});

// Schema for product updates (all fields optional except those that shouldn't be updated)
export const UpdateProductSchema = ProductValidationSchema.partial().extend({
  // Ensure critical fields are validated if provided with proper type coercion
  price: z
    .union([z.number(), z.string()])
    .transform(val => (typeof val === 'string' ? parseFloat(val) : val))
    .refine(
      val => !isNaN(val),
      VALIDATION_MESSAGES.PRODUCT.PRICE.INVALID_DECIMAL
    )
    .refine(val => val > 0, VALIDATION_MESSAGES.PRODUCT.PRICE.MUST_BE_POSITIVE)
    .refine(val => {
      // Check if price has more than 2 decimal places
      return validateDecimalPlaces(val, 2);
    }, VALIDATION_MESSAGES.PRODUCT.PRICE.INVALID_DECIMAL)
    .optional(),

  stock: z
    .union([z.number(), z.string()])
    .transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
    .refine(
      val => !isNaN(val),
      VALIDATION_MESSAGES.PRODUCT.STOCK.MUST_BE_INTEGER
    )
    .refine(
      val => Number.isInteger(val),
      VALIDATION_MESSAGES.PRODUCT.STOCK.MUST_BE_INTEGER
    )
    .refine(val => val >= 0, VALIDATION_MESSAGES.PRODUCT.STOCK.MUST_BE_POSITIVE)
    .optional(),

  category_id: z
    .union([z.number(), z.string()])
    .transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
    .refine(val => !isNaN(val), VALIDATION_MESSAGES.PRODUCT.CATEGORY_ID.INVALID)
    .refine(
      val => Number.isInteger(val),
      VALIDATION_MESSAGES.PRODUCT.CATEGORY_ID.INVALID
    )
    .refine(val => val > 0, VALIDATION_MESSAGES.PRODUCT.CATEGORY_ID.POSITIVE)
    .optional(),
});

// Schema for partial updates (all fields optional)
export const PartialUpdateProductSchema = ProductValidationSchema.partial();

// Schema for price updates only
export const UpdateProductPriceSchema = z.object({
  price: z
    .union([z.number(), z.string()])
    .transform(val => (typeof val === 'string' ? parseFloat(val) : val))
    .refine(
      val => !isNaN(val),
      VALIDATION_MESSAGES.PRODUCT.PRICE.INVALID_DECIMAL
    )
    .refine(val => val > 0, VALIDATION_MESSAGES.PRODUCT.PRICE.MUST_BE_POSITIVE)
    .refine(val => {
      // Check if price has more than 2 decimal places
      return validateDecimalPlaces(val, 2);
    }, VALIDATION_MESSAGES.PRODUCT.PRICE.INVALID_DECIMAL),
});

// Schema for stock updates only
export const UpdateProductStockSchema = z.object({
  stock: z
    .union([z.number(), z.string()])
    .transform(val => (typeof val === 'string' ? parseInt(val, 10) : val))
    .refine(
      val => !isNaN(val),
      VALIDATION_MESSAGES.PRODUCT.STOCK.MUST_BE_INTEGER
    )
    .refine(
      val => Number.isInteger(val),
      VALIDATION_MESSAGES.PRODUCT.STOCK.MUST_BE_INTEGER
    )
    .refine(
      val => val >= 0,
      VALIDATION_MESSAGES.PRODUCT.STOCK.MUST_BE_POSITIVE
    ),
});

// Schema for status updates only
export const UpdateProductStatusSchema = z.object({
  status: z.enum(['active', 'inactive', 'draft']),
});

// Export all schemas
export const Product = {
  CreateProductSchema,
  UpdateProductSchema,
  PartialUpdateProductSchema,
  UpdateProductPriceSchema,
  UpdateProductStockSchema,
  UpdateProductStatusSchema,
};
