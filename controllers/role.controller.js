import Role from '../models/role.model.js';
import { createApiResponse, extractValidationErrors } from '../utils/helper.js';

export const createRole = async (req, res) => {
  try {
    // Get validated data from middleware
    const validatedData = req.validatedData;

    // 2. Create role
    const role = await Role.create(validatedData);

    // 3. Return created role
    return res
      .status(201)
      .json(createApiResponse(true, 'Role created successfully', role));
  } catch (error) {
    // Extract and format validation errors
    const formattedErrors = extractValidationErrors(error);
    return res
      .status(500)
      .json(
        createApiResponse(false, 'Failed to create role', null, formattedErrors)
      );
  }
};

export const getRole = async (req, res) => {
  try {
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
  } catch (error) {
    // Extract and format validation errors
    const formattedErrors = extractValidationErrors(error);
    return res
      .status(500)
      .json(
        createApiResponse(false, 'Failed to fetch role', null, formattedErrors)
      );
  }
};

export const getAllRoles = async (req, res) => {
  try {
    // 1. Fetch all roles
    const roles = await Role.findAll();

    // 2. Return role data
    return res
      .status(200)
      .json(createApiResponse(true, 'Roles retrieved successfully', roles));
  } catch (error) {
    // Extract and format validation errors
    const formattedErrors = extractValidationErrors(error);
    return res
      .status(500)
      .json(
        createApiResponse(false, 'Failed to fetch roles', null, formattedErrors)
      );
  }
};

export const updateRole = async (req, res) => {
  try {
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
  } catch (error) {
    // Extract and format validation errors
    const formattedErrors = extractValidationErrors(error);
    return res
      .status(500)
      .json(
        createApiResponse(false, 'Failed to update role', null, formattedErrors)
      );
  }
};

export const deleteRole = async (req, res) => {
  try {
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
  } catch (error) {
    // Extract and format validation errors
    const formattedErrors = extractValidationErrors(error);
    return res
      .status(500)
      .json(
        createApiResponse(false, 'Failed to delete role', null, formattedErrors)
      );
  }
};
