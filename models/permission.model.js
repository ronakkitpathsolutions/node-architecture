import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { createJSONValidator } from '../utils/helper.js';
import VALIDATION_MESSAGES from '../utils/constants/messages.js';
import { Permission as PermissionValidation } from '../utils/validations/index.js';
import { validateWithZod } from '../utils/helper.js';

const Permission = sequelize.define(
  'Permission',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      validate: {
        notNull: {
          msg: VALIDATION_MESSAGES.ROLE.ID.REQUIRED,
        },
        isInt: {
          msg: VALIDATION_MESSAGES.ROLE.ID.INVALID,
        },
      },
    },
    access: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
      validate: {
        isValidJSON: createJSONValidator({
          fieldName: 'Access',
          allowEmpty: true,
          allowNull: true,
        }),
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
    tableName: 'permissions',
    timestamps: true,
  }
);

// Zod validation methods
Permission.validateCreateData = function (data) {
  return validateWithZod(PermissionValidation.schemas.create, data);
};

Permission.validateUpdateData = function (data) {
  return validateWithZod(PermissionValidation.schemas.update, data);
};

Permission.validateAssignData = function (data) {
  return validateWithZod(PermissionValidation.schemas.assign, data);
};

Permission.validateBulkAssignData = function (data) {
  return validateWithZod(PermissionValidation.schemas.bulkAssign, data);
};

Permission.validateAccessData = function (data) {
  return validateWithZod(PermissionValidation.schemas.access, data);
};

Permission.validateFilterData = function (data) {
  return validateWithZod(PermissionValidation.schemas.filter, data);
};

// Static method to get validation schemas
Permission.getValidationSchemas = function () {
  return PermissionValidation.schemas;
};

// Static method to get a specific validation schema
Permission.getValidationSchema = function (schemaName) {
  return PermissionValidation.schemas[schemaName];
};

// Static method to get or create permission for a role
Permission.getOrCreatePermission = async function (roleId) {
  let permission = await this.findOne({
    where: { role_id: roleId },
  });

  if (!permission) {
    // Create a new permission with empty access for the role
    permission = await this.create({
      role_id: roleId,
      access: {},
    });
  }

  return permission;
};

export default Permission;
