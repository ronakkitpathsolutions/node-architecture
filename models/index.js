import sequelize from '../config/database.js';
import User from './user.model.js';
import Role from './role.model.js';
import Permission from './permission.model.js';
import Category from './category.model.js';
import Product from './product.model.js';
import Cart from './cart.model.js';

// Define associations
Role.hasMany(User, {
  foreignKey: 'role_id',
  as: 'users',
});

User.belongsTo(Role, {
  foreignKey: 'role_id',
  as: 'role',
});

Role.hasMany(Permission, {
  foreignKey: 'role_id',
  as: 'permissions',
});

Permission.belongsTo(Role, {
  foreignKey: 'role_id',
  as: 'role',
});

// User-Cart associations
User.hasMany(Cart, {
  foreignKey: 'user_id',
  as: 'cart_items',
});

Cart.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Product-Cart associations
Product.hasMany(Cart, {
  foreignKey: 'product_id',
  as: 'cart_items',
});

Cart.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

// Product-Category associations are defined in product.model.js

// Export models and sequelize instance
const db = {
  sequelize,
  User,
  Role,
  Permission,
  Category,
  Product,
  Cart,
};

export default db;
