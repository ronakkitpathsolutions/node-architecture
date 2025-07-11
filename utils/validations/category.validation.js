import { z } from 'zod';
import { VALIDATION_MESSAGES } from '../constants/messages.js';

// Helper function to generate slug from category name
const generateSlug = name => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

// Base category validation schema
const CategoryValidationSchema = z.object({
  category_name: z
    .string()
    .min(2, VALIDATION_MESSAGES.CATEGORY.CATEGORY_NAME.TOO_SHORT)
    .max(100, VALIDATION_MESSAGES.CATEGORY.CATEGORY_NAME.TOO_LONG)
    .trim()
    .refine(
      val => val.length > 0,
      VALIDATION_MESSAGES.CATEGORY.CATEGORY_NAME.EMPTY
    )
    .refine(
      val => /^[a-zA-Z0-9\s\-_&().,]+$/.test(val),
      VALIDATION_MESSAGES.CATEGORY.CATEGORY_NAME.INVALID_FORMAT
    ),

  slug: z
    .string()
    .min(2, VALIDATION_MESSAGES.CATEGORY.SLUG.TOO_SHORT)
    .max(100, VALIDATION_MESSAGES.CATEGORY.SLUG.TOO_LONG)
    .trim()
    .refine(
      val => /^[a-z0-9-]+$/.test(val),
      VALIDATION_MESSAGES.CATEGORY.SLUG.INVALID_FORMAT
    )
    .optional(), // Optional because it can be auto-generated

  category_image: z
    .string()
    .url(VALIDATION_MESSAGES.CATEGORY.CATEGORY_IMAGE.INVALID_URL)
    .max(500, VALIDATION_MESSAGES.CATEGORY.CATEGORY_IMAGE.TOO_LONG)
    .optional()
    .or(z.literal('')), // Allow empty string
});

// Schema for category creation
export const CreateCategorySchema = CategoryValidationSchema.omit({
  slug: true,
})
  .extend({
    slug: z
      .string()
      .min(2, VALIDATION_MESSAGES.CATEGORY.SLUG.TOO_SHORT)
      .max(100, VALIDATION_MESSAGES.CATEGORY.SLUG.TOO_LONG)
      .trim()
      .refine(
        val => /^[a-z0-9-]+$/.test(val),
        VALIDATION_MESSAGES.CATEGORY.SLUG.INVALID_FORMAT
      )
      .optional(),
  })
  .transform(data => {
    // Auto-generate slug if not provided
    if (!data.slug) {
      data.slug = generateSlug(data.category_name);
    }
    return data;
  });

// Schema for category updates (all fields optional except validation requirements)
export const UpdateCategorySchema =
  CategoryValidationSchema.partial().transform(data => {
    // Auto-generate slug if category_name is updated but slug is not provided
    if (data.category_name && !data.slug) {
      data.slug = generateSlug(data.category_name);
    }
    return data;
  });

// Validation helper functions
export const validateCreateCategory = data =>
  CreateCategorySchema.safeParse(data);
export const validateUpdateCategory = data =>
  UpdateCategorySchema.safeParse(data);

// Export helper function for slug generation
export { generateSlug };
