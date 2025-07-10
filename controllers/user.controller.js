import User from '../models/user.model.js';
import { createApiResponse, extractValidationErrors } from '../utils/helper.js';

export const createUser = async (req, res) => {
  try {
    // Get validated data from middleware
    const validatedData = req.validatedData;

    // 2. Create user (Zod + Sequelize hooks will handle password hash, etc.)
    const user = await User.create(validatedData);

    // 3. Return created user (password already stripped in .toJSON())
    return res
      .status(201)
      .json(createApiResponse(true, 'User created successfully', user));
  } catch (error) {
    // Extract and format validation errors
    const formattedErrors = extractValidationErrors(error);
    return res
      .status(500)
      .json(
        createApiResponse(false, 'Failed to create user', null, formattedErrors)
      );
  }
};

export const getUser = async (req, res) => {
  try {
    // Get validated ID from middleware
    const userId = req.validatedId;

    // 2. Fetch user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json(createApiResponse(false, 'User not found'));
    }

    // 3. Return user data
    return res
      .status(200)
      .json(createApiResponse(true, 'User retrieved successfully', user));
  } catch (error) {
    // Extract and format validation errors
    const formattedErrors = extractValidationErrors(error);
    return res
      .status(500)
      .json(
        createApiResponse(false, 'Failed to fetch user', null, formattedErrors)
      );
  }
};

export const updateUser = async (req, res) => {
  try {
    // Get validated ID and data from middleware
    const userId = req.validatedId;
    const updateData = req.validatedData;

    // 3. Fetch user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json(createApiResponse(false, 'User not found'));
    }

    // 4. Update user data
    await user.update(updateData);

    // 5. Return updated user data
    return res
      .status(200)
      .json(createApiResponse(true, 'User updated successfully', user));
  } catch (error) {
    // Extract and format validation errors
    const formattedErrors = extractValidationErrors(error);
    return res
      .status(500)
      .json(
        createApiResponse(false, 'Failed to update user', null, formattedErrors)
      );
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // 1. Fetch all users
    const users = await User.findAll();

    // 2. Return user data
    return res
      .status(200)
      .json(createApiResponse(true, 'Users retrieved successfully', users));
  } catch (error) {
    // Extract and format validation errors
    const formattedErrors = extractValidationErrors(error);
    return res
      .status(500)
      .json(
        createApiResponse(false, 'Failed to fetch users', null, formattedErrors)
      );
  }
};

export const deleteUser = async (req, res) => {
  try {
    // Get validated ID from middleware
    const userId = req.validatedId;

    // 2. Fetch user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json(createApiResponse(false, 'User not found'));
    }

    // 3. Delete the user
    await user.destroy();

    // 4. Return success response
    return res
      .status(200)
      .json(createApiResponse(true, 'User deleted successfully'));
  } catch (error) {
    // Extract and format validation errors
    const formattedErrors = extractValidationErrors(error);
    return res
      .status(500)
      .json(
        createApiResponse(false, 'Failed to delete user', null, formattedErrors)
      );
  }
};
