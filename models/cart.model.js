import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { Cart as CartValidation } from '../utils/validations/index.js';
import { validateWithZod } from '../utils/helper.js';
import { VALIDATION_MESSAGES } from '../utils/constants/messages.js';
import Product from './product.model.js';

const Cart = sequelize.define(
  'Cart',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      validate: {
        notNull: {
          msg: VALIDATION_MESSAGES.CART.USER_ID.REQUIRED,
        },
        isInt: {
          msg: VALIDATION_MESSAGES.CART.USER_ID.INVALID,
        },
        min: {
          args: [1],
          msg: VALIDATION_MESSAGES.CART.USER_ID.POSITIVE,
        },
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
      validate: {
        notNull: {
          msg: VALIDATION_MESSAGES.CART.PRODUCT_ID.REQUIRED,
        },
        isInt: {
          msg: VALIDATION_MESSAGES.CART.PRODUCT_ID.INVALID,
        },
        min: {
          args: [1],
          msg: VALIDATION_MESSAGES.CART.PRODUCT_ID.POSITIVE,
        },
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        notNull: {
          msg: VALIDATION_MESSAGES.CART.QUANTITY.REQUIRED,
        },
        isInt: {
          msg: VALIDATION_MESSAGES.CART.QUANTITY.INVALID,
        },
        min: {
          args: [1],
          msg: VALIDATION_MESSAGES.CART.QUANTITY.MIN_VALUE,
        },
        max: {
          args: [999],
          msg: VALIDATION_MESSAGES.CART.QUANTITY.MAX_VALUE,
        },
      },
    },
    added_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'carts',
    timestamps: false, // Using custom timestamp fields
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'product_id'], // Ensure one product per user in cart
      },
      {
        fields: ['user_id'], // Index for faster user cart retrieval
      },
      {
        fields: ['product_id'], // Index for product lookups
      },
    ],
    hooks: {
      beforeUpdate: (cart, _options) => {
        cart.updated_at = new Date();
      },
    },
  }
);

// Instance methods for individual cart items
Cart.prototype.toJSON = function () {
  const values = { ...this.get() };

  // Format dates
  if (values.added_at) {
    values.added_at = values.added_at.toISOString();
  }
  if (values.updated_at) {
    values.updated_at = values.updated_at.toISOString();
  }

  return values;
};

// Static method to validate cart data using Zod
Cart.validateAddToCart = async function (data) {
  return validateWithZod(CartValidation.schemas.addToCart, data);
};

Cart.validateUpdateQuantity = async function (data) {
  return validateWithZod(CartValidation.schemas.updateQuantity, data);
};

// Static method to add item to cart or update quantity if exists
Cart.addToCart = async function (
  userId,
  product_id,
  quantity = 1,
  transaction = null
) {
  // Validate input data
  const validationResult = await this.validateAddToCart({
    product_id,
    quantity,
  });

  if (!validationResult.success) {
    throw new Error(validationResult.error);
  }

  const { product_id: validProductId, quantity: validQuantity } =
    validationResult.data;

  // Check if item already exists in cart
  const existingItem = await this.findOne({
    where: {
      user_id: userId,
      product_id: validProductId,
    },
    transaction,
  });

  if (existingItem) {
    // Update quantity if item exists
    const newQuantity = existingItem.quantity + validQuantity;

    // Validate new quantity
    const quantityValidation = await this.validateUpdateQuantity({
      quantity: newQuantity,
    });

    if (!quantityValidation.success) {
      throw new Error('Total quantity exceeds maximum allowed');
    }

    existingItem.quantity = newQuantity;
    existingItem.updated_at = new Date();
    await existingItem.save({ transaction });

    return existingItem;
  } else {
    // Create new cart item
    const cartItem = await this.create(
      {
        user_id: userId,
        product_id: validProductId,
        quantity: validQuantity,
      },
      { transaction }
    );

    return cartItem;
  }
};

// Static method to update cart item quantity
Cart.updateQuantity = async function (
  userId,
  productId,
  quantity,
  transaction = null
) {
  // Validate quantity
  const validationResult = await this.validateUpdateQuantity({ quantity });

  if (!validationResult.success) {
    throw new Error(validationResult.error);
  }

  const cartItem = await this.findOne({
    where: {
      user_id: userId,
      product_id: productId,
    },
    transaction,
  });

  if (!cartItem) {
    throw new Error(VALIDATION_MESSAGES.CART.ITEM.NOT_FOUND);
  }

  cartItem.quantity = validationResult.data.quantity;
  cartItem.updated_at = new Date();
  await cartItem.save({ transaction });

  return cartItem;
};

// Static method to remove item from cart
Cart.removeFromCart = async function (userId, productId, transaction = null) {
  const cartItem = await this.findOne({
    where: {
      user_id: userId,
      product_id: productId,
    },
    transaction,
  });

  if (!cartItem) {
    throw new Error(VALIDATION_MESSAGES.CART.ITEM.NOT_FOUND);
  }

  await cartItem.destroy({ transaction });
  return true;
};

// Static method to clear user's cart
Cart.clearCart = async function (userId, transaction = null) {
  const deletedCount = await this.destroy({
    where: {
      user_id: userId,
    },
    transaction,
  });

  return deletedCount;
};

// Static method to get user's cart with product details
Cart.getUserCart = async function (userId, transaction = null) {
  const cartItems = await this.findAll({
    where: {
      user_id: userId,
    },
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
    order: [['added_at', 'DESC']],
    transaction,
  });

  return cartItems;
};

// Static method to get cart item count for user
Cart.getCartItemCount = async function (userId, transaction = null) {
  const count = await this.sum('quantity', {
    where: {
      user_id: userId,
    },
    transaction,
  });

  return count || 0;
};

export default Cart;
