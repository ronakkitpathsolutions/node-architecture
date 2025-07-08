import Role from '../models/role.model.js';
import { createApiResponse, extractValidationErrors } from '../utils/helper.js';
import { Common, Role as RoleValidation } from '../utils/validations/index.js';

export const createRole = async (req, res) => {
  try {
    // 1. Validate input using Zod
    const validationResult = RoleValidation.validate.create(req.body);

    if (!validationResult.success) {
      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            'Validation failed',
            null,
            validationResult.errors
          )
        );
    }

    // 2. Create role
    const role = await Role.create(validationResult.data);

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
    const roleId = req.params.id;

    // 1. Validate role ID (Zod)
    const validationResult = Common.validate.id(parseInt(roleId, 10));

    if (!validationResult.success) {
      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            'Invalid role ID',
            null,
            validationResult.error
          )
        );
    }

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
    const roleId = req.params.id;

    // 1. Validate role ID (Zod)
    const validationResult = Common.validate.id(parseInt(roleId, 10));

    if (!validationResult.success) {
      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            'Invalid role ID',
            null,
            validationResult.error
          )
        );
    }

    // 2. Validate update data (Zod)
    const updateValidationResult = RoleValidation.validate.update(req.body);

    if (!updateValidationResult.success) {
      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            'Validation failed',
            null,
            updateValidationResult.errors
          )
        );
    }

    // 3. Fetch role by ID
    const role = await Role.findByPk(roleId);

    if (!role) {
      return res.status(404).json(createApiResponse(false, 'Role not found'));
    }

    // 4. Update role data
    await role.update(updateValidationResult.data);

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
    const roleId = req.params.id;

    // 1. Validate role ID (Zod)
    const validationResult = Common.validate.id(parseInt(roleId, 10));

    if (!validationResult.success) {
      return res
        .status(400)
        .json(
          createApiResponse(
            false,
            'Invalid role ID',
            null,
            validationResult.error
          )
        );
    }

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
