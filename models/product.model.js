import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { Product as ProductValidation } from '../utils/validations/index.js';
import { validateWithZod } from '../utils/helper.js';
import { VALIDATION_MESSAGES } from '../utils/constants/messages.js';
import Category from './category.model.js';

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: VALIDATION_MESSAGES.PRODUCT.NAME.EMPTY,
        },
        len: {
          args: [2, 255],
          msg: VALIDATION_MESSAGES.PRODUCT.NAME.TOO_LONG,
        },
      },
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        msg: VALIDATION_MESSAGES.PRODUCT.SLUG.ALREADY_EXISTS,
      },
      validate: {
        notEmpty: {
          msg: VALIDATION_MESSAGES.PRODUCT.SLUG.REQUIRED,
        },
        len: {
          args: [2, 255],
          msg: VALIDATION_MESSAGES.PRODUCT.SLUG.TOO_LONG,
        },
        is: {
          args: /^[a-z0-9-]+$/,
          msg: VALIDATION_MESSAGES.PRODUCT.SLUG.INVALID_FORMAT,
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: VALIDATION_MESSAGES.PRODUCT.PRICE.MUST_BE_POSITIVE,
        },
        isDecimal: {
          msg: VALIDATION_MESSAGES.PRODUCT.PRICE.INVALID_DECIMAL,
        },
      },
      set(value) {
        // Ensure the value is rounded to 2 decimal places
        if (value !== null && value !== undefined) {
          this.setDataValue('price', Math.round(parseFloat(value) * 100) / 100);
        }
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: VALIDATION_MESSAGES.PRODUCT.STOCK.MUST_BE_POSITIVE,
        },
      },
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: {
          msg: VALIDATION_MESSAGES.PRODUCT.IMAGE_URL.INVALID_URL,
        },
      },
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: 'id',
      },
      validate: {
        notNull: {
          msg: VALIDATION_MESSAGES.PRODUCT.CATEGORY_ID.REQUIRED,
        },
      },
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'draft'),
      allowNull: false,
      defaultValue: 'draft',
      validate: {
        isIn: {
          args: [['active', 'inactive', 'draft']],
          msg: VALIDATION_MESSAGES.PRODUCT.STATUS.INVALID,
        },
      },
    },
  },
  {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeValidate: async (product, _options) => {
        // Auto-generate slug from name if not provided
        if (product.name && !product.slug) {
          product.slug = product.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
        }
      },
    },
  }
);

// Define associations
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Category.hasMany(Product, {
  foreignKey: 'category_id',
  as: 'products',
});

// Custom validation methods
Product.validateCreateData = async data => {
  return validateWithZod(ProductValidation.schemas.create, data);
};

Product.validateUpdateData = async data => {
  return validateWithZod(ProductValidation.schemas.update, data);
};

Product.validatePartialUpdateData = async data => {
  return validateWithZod(ProductValidation.schemas.partialUpdate, data);
};

// Pagination method similar to User.paginateWithSearch
Product.paginateWithSearch = async function (options = {}) {
  const {
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'created_at',
    sortOrder = 'DESC',
    filters = {},
    includeCategory = true,
    where = {},
    include = [],
    attributes,
  } = options;

  // Import Op here to avoid circular dependency issues
  const { Op } = await import('sequelize');

  // Validate and sanitize parameters
  const pageNumber = Math.max(1, parseInt(page, 10));
  const limitNumber = Math.max(1, Math.min(100, parseInt(limit, 10))); // Max 100 items per page
  const offset = (pageNumber - 1) * limitNumber;

  // Validate sort order
  const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase())
    ? sortOrder.toUpperCase()
    : 'DESC';

  try {
    // Build where clause
    const whereClause = { ...where };

    // Add search functionality
    if (search && search.trim()) {
      const searchTerm = search.trim();
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${searchTerm}%` } },
        { description: { [Op.iLike]: `%${searchTerm}%` } },
        { slug: { [Op.iLike]: `%${searchTerm}%` } },
      ];
    }

    // Add filters
    if (filters && typeof filters === 'object') {
      Object.keys(filters).forEach(key => {
        if (
          filters[key] !== undefined &&
          filters[key] !== null &&
          filters[key] !== ''
        ) {
          // Special handling for price range filters
          if (key === 'min_price') {
            if (!whereClause.price) whereClause.price = {};
            whereClause.price[Op.gte] = parseFloat(filters[key]);
          } else if (key === 'max_price') {
            if (!whereClause.price) whereClause.price = {};
            whereClause.price[Op.lte] = parseFloat(filters[key]);
          } else if (key === 'in_stock') {
            if (filters[key] === 'true' || filters[key] === true) {
              whereClause.stock = { [Op.gt]: 0 };
            } else if (filters[key] === 'false' || filters[key] === false) {
              whereClause.stock = 0;
            }
          } else {
            whereClause[key] = filters[key];
          }
        }
      });
    }

    // Build include array
    const includeArray = [...include];
    if (includeCategory) {
      includeArray.push({
        model: sequelize.models.Category,
        as: 'category',
        attributes: ['id', 'category_name', 'slug'],
      });
    }

    // Build order clause
    const orderClause = [[sortBy, validSortOrder]];

    // Get total count
    const totalCount = await this.count({
      where: whereClause,
      include: includeArray.length > 0 ? includeArray : undefined,
    });

    // Get paginated data
    const products = await this.findAll({
      where: whereClause,
      include: includeArray,
      order: orderClause,
      limit: limitNumber,
      offset,
      attributes,
    });

    return {
      result: products,
      pagination: {
        currentPage: pageNumber,
        totalCount,
        limit: limitNumber,
      },
    };
  } catch (error) {
    throw new Error(`Pagination failed: ${error.message}`);
  }
};

export default Product;
