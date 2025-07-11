import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { Role as RoleValidation } from '../utils/validations/index.js';
import { validateWithZod } from '../utils/helper.js';
import { VALIDATION_MESSAGES } from '../utils/constants/messages.js';

const Role = sequelize.define(
  'Role',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        msg: VALIDATION_MESSAGES.ROLE.NAME.ALREADY_EXISTS,
      },
      validate: {
        notEmpty: {
          msg: VALIDATION_MESSAGES.ROLE.NAME.EMPTY,
        },
        len: {
          args: [2, 50],
          msg: VALIDATION_MESSAGES.ROLE.NAME.TOO_LONG,
        },
      },
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    tableName: 'roles',
    timestamps: true,
  }
);

// Zod validation methods
Role.validateCreateData = function (data) {
  return validateWithZod(RoleValidation.schemas.create, data);
};

Role.validateUpdateData = function (data) {
  return validateWithZod(RoleValidation.schemas.update, data);
};

Role.validateAssignData = function (data) {
  return validateWithZod(RoleValidation.schemas.assign, data);
};

Role.validateBulkAssignData = function (data) {
  return validateWithZod(RoleValidation.schemas.bulkAssign, data);
};

Role.validatePermissionData = function (data) {
  return validateWithZod(RoleValidation.schemas.permission, data);
};

// Static method to get validation schemas
Role.getValidationSchemas = function () {
  return RoleValidation.schemas;
};

// Static method to get a specific validation schema
Role.getValidationSchema = function (schemaName) {
  return RoleValidation.schemas[schemaName];
};

export default Role;
