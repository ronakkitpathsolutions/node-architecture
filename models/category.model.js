import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { z } from 'zod';
import { Category as CategoryValidation } from '../utils/validations/index.js';
import { validateWithZod, formatZodErrors } from '../utils/helper.js';
import { VALIDATION_MESSAGES } from '../utils/constants/messages.js';

const Category = sequelize.define(
  'Category',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    category_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: VALIDATION_MESSAGES.CATEGORY.CATEGORY_NAME.ALREADY_EXISTS,
      },
      validate: {
        notEmpty: {
          msg: VALIDATION_MESSAGES.CATEGORY.CATEGORY_NAME.EMPTY,
        },
        len: {
          args: [2, 100],
          msg: VALIDATION_MESSAGES.CATEGORY.CATEGORY_NAME.TOO_LONG,
        },
      },
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: VALIDATION_MESSAGES.CATEGORY.SLUG.ALREADY_EXISTS,
      },
      validate: {
        notEmpty: {
          msg: VALIDATION_MESSAGES.CATEGORY.SLUG.REQUIRED,
        },
        len: {
          args: [2, 100],
          msg: VALIDATION_MESSAGES.CATEGORY.SLUG.TOO_LONG,
        },
        is: {
          args: /^[a-z0-9-]+$/,
          msg: VALIDATION_MESSAGES.CATEGORY.SLUG.INVALID_FORMAT,
        },
      },
    },
    category_image: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: {
          msg: VALIDATION_MESSAGES.CATEGORY.CATEGORY_IMAGE.INVALID_URL,
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    tableName: 'categories',
    timestamps: true,
    hooks: {
      beforeValidate: async (category, options) => {
        // Prepare data for Zod validation
        const categoryData = {
          category_name: category.category_name,
          slug: category.slug,
          category_image: category.category_image,
        };

        try {
          // Use appropriate schema based on operation
          if (options.isNewRecord) {
            // For new records, validate all required fields
            const validatedData =
              CategoryValidation.schemas.create.parse(categoryData);
            Object.assign(category, validatedData);
          } else {
            // For updates, only validate changed fields
            const changedFields = {};
            if (category.changed('category_name'))
              changedFields.category_name = category.category_name;
            if (category.changed('slug')) changedFields.slug = category.slug;
            if (category.changed('category_image'))
              changedFields.category_image = category.category_image;

            if (Object.keys(changedFields).length > 0) {
              const validatedData =
                CategoryValidation.schemas.update.parse(changedFields);
              Object.assign(category, validatedData);
            }
          }
        } catch (error) {
          if (error instanceof z.ZodError) {
            // Transform Zod errors to simple object format
            const validationErrors = formatZodErrors(error);

            // Create a new error with the simple format
            const validationError = new Error(
              VALIDATION_MESSAGES.SYSTEM.VALIDATION_FAILED
            );
            validationError.name = 'SequelizeValidationError';
            validationError.errors = validationErrors;
            throw validationError;
          }
          throw error;
        }
      },
      beforeCreate: category => {
        if (!category.slug && category.category_name) {
          category.slug = Category.generateSlug(category.category_name);
        }
      },
      beforeUpdate: category => {
        if (category.changed('category_name') && !category.changed('slug')) {
          category.slug = Category.generateSlug(category.category_name);
        }
      },
    },
  }
);

// Zod validation methods
Category.validateCreateData = function (data) {
  return validateWithZod(CategoryValidation.schemas.create, data);
};

Category.validateUpdateData = function (data) {
  return validateWithZod(CategoryValidation.schemas.update, data);
};

// Static method to get validation schemas
Category.getValidationSchemas = function () {
  return CategoryValidation.schemas;
};

// Static method to get a specific validation schema
Category.getValidationSchema = function (schemaName) {
  return CategoryValidation.schemas[schemaName];
};

// Static method to generate slug
Category.generateSlug = function (categoryName) {
  return CategoryValidation.helpers.generateSlug(categoryName);
};

export default Category;
