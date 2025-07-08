import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { User as UserValidation } from '../utils/validations/index.js';
import VALIDATION_MESSAGES from '../utils/constants/messages.js';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: VALIDATION_MESSAGES.USER.NAME.EMPTY,
        },
        len: {
          args: [2, 100],
          msg: VALIDATION_MESSAGES.USER.NAME.TOO_LONG,
        },
      },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: {
        msg: UserValidation,
      },
      validate: {
        isEmail: {
          msg: VALIDATION_MESSAGES.USER.EMAIL.INVALID,
        },
        notEmpty: {
          msg: VALIDATION_MESSAGES.USER.EMAIL.REQUIRED,
        },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: VALIDATION_MESSAGES.USER.PASSWORD.REQUIRED,
        },
        len: {
          args: [6, 255],
          msg: VALIDATION_MESSAGES.USER.PASSWORD.TOO_SHORT,
        },
      },
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles', // References the roles table
        key: 'id',
      },
      validate: {
        notNull: {
          msg: VALIDATION_MESSAGES.USER.ROLE.REQUIRED,
        },
      },
    },
    providers: {
      type: DataTypes.ARRAY(DataTypes.ENUM('google', 'github')),
      allowNull: true,
      defaultValue: [],
      validate: {
        isValidProviders(value) {
          if (value && Array.isArray(value)) {
            const validProviders = ['google', 'github'];
            const invalidProviders = value.filter(
              provider => !validProviders.includes(provider)
            );
            if (invalidProviders.length > 0) {
              throw new Error(
                `Invalid providers: ${invalidProviders.join(', ')}. Valid providers are: ${validProviders.join(', ')}`
              );
            }
          }
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
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeValidate: async (user, options) => {
        // Prepare data for Zod validation
        const userData = {
          name: user.name,
          email: user.email,
          password: user.password,
          role_id: user.role_id,
          providers: user.providers,
        };

        try {
          // Use appropriate schema based on operation
          if (options.isNewRecord) {
            // For new records, validate all required fields
            const validatedData = UserValidation.schemas.create.parse(userData);
            Object.assign(user, validatedData);
          } else {
            // For updates, only validate changed fields
            const changedFields = {};
            if (user.changed('name')) changedFields.name = user.name;
            if (user.changed('email')) changedFields.email = user.email;
            if (user.changed('password'))
              changedFields.password = user.password;
            if (user.changed('role_id')) changedFields.role_id = user.role_id;
            if (user.changed('providers'))
              changedFields.providers = user.providers;

            if (Object.keys(changedFields).length > 0) {
              const validatedData =
                UserValidation.schemas.update.parse(changedFields);
              Object.assign(user, validatedData);
            }
          }
        } catch (error) {
          if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map(
              err => `${err.path.join('.')}: ${err.message}`
            );
            throw new Error(`Validation failed: ${errorMessages.join(', ')}`);
          }
          throw error;
        }
      },
      beforeCreate: async user => {
        if (user.password) {
          const saltRounds = 12;
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      },
      beforeUpdate: async user => {
        if (user.changed('password')) {
          const saltRounds = 12;
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      },
    },
  }
);

// Instance methods
User.prototype.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

User.prototype.toJSON = function () {
  const user = this.get();
  delete user.password; // Remove password from JSON output
  return user;
};

// Class methods
User.findByEmail = async function (email) {
  return await this.findOne({
    where: { email },
  });
};

User.findByEmailWithRole = async function (email) {
  return await this.findOne({
    where: { email },
    include: [
      {
        model: sequelize.models.Role,
        as: 'role',
      },
    ],
  });
};

// Zod validation methods
User.validateCreateData = function (data) {
  return UserValidation.validate.create(data);
};

User.validateUpdateData = function (data) {
  return UserValidation.validate.update(data);
};

User.validateLoginData = function (data) {
  return UserValidation.validate.login(data);
};

User.validateRegisterData = function (data) {
  return UserValidation.validate.register(data);
};

User.validatePasswordChange = function (data) {
  return UserValidation.validate.changePassword(data);
};

User.validateForgotPassword = function (data) {
  return UserValidation.validate.forgotPassword(data);
};

User.validateResetPassword = function (data) {
  return UserValidation.validate.resetPassword(data);
};

User.validateUpdateProfile = function (data) {
  return UserValidation.validate.updateProfile(data);
};

// Static method to get validation schemas
User.getValidationSchemas = function () {
  return UserValidation.schemas;
};

// Static method to get a specific validation schema
User.getValidationSchema = function (schemaName) {
  return UserValidation.schemas[schemaName];
};

export default User;
