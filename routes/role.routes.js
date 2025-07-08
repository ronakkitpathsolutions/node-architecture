import express from 'express';
import {
  createRole,
  deleteRole,
  getAllRoles,
  getRole,
  updateRole,
} from '../controllers/role.controller.js';

const roleRoutes = express.Router();

roleRoutes.post('/roles/create', createRole);
roleRoutes.get('/roles', getAllRoles);
roleRoutes.get('/roles/:id', getRole);
roleRoutes.patch('/roles/:id', updateRole);
roleRoutes.delete('/roles/:id', deleteRole);

export default roleRoutes;
