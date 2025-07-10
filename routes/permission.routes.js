import express from 'express';
import {
  getPermission,
  updatePermission,
} from '../controllers/permission.controller.js';
import {
  validateRoleParams,
  validateUpdateAccess,
} from '../middlewares/permission.middleware.js';

const permissionRoutes = express.Router();

// Get specific access using role ID
permissionRoutes.get('/permission/:roleId', validateRoleParams, getPermission);

// Update access data using role ID
permissionRoutes.put(
  '/permission/:roleId',
  [validateRoleParams, validateUpdateAccess],
  updatePermission
);

export default permissionRoutes;
