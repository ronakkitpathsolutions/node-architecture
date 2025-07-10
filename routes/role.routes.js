import express from 'express';
import {
  createRole,
  deleteRole,
  getAllRoles,
  getRole,
  updateRole,
} from '../controllers/role.controller.js';
import { idValidationMiddleware } from '../middlewares/validation.middleware.js';
import {
  createRoleValidationMiddleware,
  updateRoleValidationMiddleware,
} from '../middlewares/role.middleware.js';

const roleRoutes = express.Router();

roleRoutes.post('/roles/create', createRoleValidationMiddleware, createRole);
roleRoutes.get('/roles', getAllRoles);
roleRoutes.get('/roles/:id', idValidationMiddleware, getRole);
roleRoutes.patch(
  '/roles/:id',
  [idValidationMiddleware, updateRoleValidationMiddleware],
  updateRole
);
roleRoutes.delete('/roles/:id', idValidationMiddleware, deleteRole);

export default roleRoutes;
