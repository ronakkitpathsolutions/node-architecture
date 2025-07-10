import Role from '../models/role.model.js';
import { createApiResponse, asyncHandler } from '../utils/helper.js';

export const createRole = asyncHandler(async (req, res) => {
  // Get validated data from middleware
  const validatedData = req.validatedData;

  // 2. Create role
  const role = await Role.create(validatedData);

  // 3. Return created role
  return res
    .status(201)
    .json(createApiResponse(true, 'Role created successfully', role));
}, 'Failed to create role');

export const getRole = asyncHandler(async (req, res) => {
  // Get validated ID from middleware
  const roleId = req.validatedId;

  // 2. Fetch role by ID
  const role = await Role.findByPk(roleId);

  if (!role) {
    return res.status(404).json(createApiResponse(false, 'Role not found'));
  }

  // 3. Return role data
  return res
    .status(200)
    .json(createApiResponse(true, 'Role retrieved successfully', role));
}, 'Failed to fetch role');

export const getAllRoles = asyncHandler(async (req, res) => {
  // 1. Fetch all roles
  const roles = await Role.findAll();

  // 2. Return role data
  return res
    .status(200)
    .json(createApiResponse(true, 'Roles retrieved successfully', roles));
}, 'Failed to fetch roles');

export const updateRole = asyncHandler(async (req, res) => {
  // Get validated ID and data from middleware
  const roleId = req.validatedId;
  const updateData = req.validatedData;

  // 3. Fetch role by ID
  const role = await Role.findByPk(roleId);

  if (!role) {
    return res.status(404).json(createApiResponse(false, 'Role not found'));
  }

  // 4. Update role data
  await role.update(updateData);

  // 5. Return updated role data
  return res
    .status(200)
    .json(createApiResponse(true, 'Role updated successfully', role));
}, 'Failed to update role');

export const deleteRole = asyncHandler(async (req, res) => {
  // Get validated ID from middleware
  const roleId = req.validatedId;

  // 2. Fetch role by ID
  const role = await Role.findByPk(roleId);

  if (!role) {
    return res.status(404).json(createApiResponse(false, 'Role not found'));
  }

  // 3. Delete the role
  await role.destroy();

  // 4. Return success response
  return res
    .status(200)
    .json(createApiResponse(true, 'Role deleted successfully'));
}, 'Failed to delete role');
