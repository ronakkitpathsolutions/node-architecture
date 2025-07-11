import User from '../models/user.model.js';
import { createApiResponse, asyncHandler } from '../utils/helper.js';
import { VALIDATION_MESSAGES } from '../utils/constants/messages.js';

export const createUser = asyncHandler(async (req, res) => {
  // Get validated data from middleware
  const validatedData = req.validatedData;

  // 2. Create user (Zod + Sequelize hooks will handle password hash, etc.)
  const user = await User.create(validatedData);

  // 3. Return created user (password already stripped in .toJSON())
  return res
    .status(201)
    .json(createApiResponse(true, 'User created successfully', user));
}, VALIDATION_MESSAGES.USER.GENERAL.CREATION_FAILED);

export const getUser = asyncHandler(async (req, res) => {
  // Get validated ID from middleware
  const userId = req.validatedId;

  // 2. Fetch user by ID
  const user = await User.findByPk(userId);

  if (!user) {
    return res
      .status(404)
      .json(
        createApiResponse(false, VALIDATION_MESSAGES.USER.GENERAL.NOT_FOUND)
      );
  }

  // 3. Return user data
  return res
    .status(200)
    .json(createApiResponse(true, 'User retrieved successfully', user));
}, 'Failed to fetch user');

export const updateUser = asyncHandler(async (req, res) => {
  // Get validated ID and data from middleware
  const userId = req.validatedId;
  const updateData = req.validatedData;

  // Check if file was uploaded and add to update data
  if (req.file) {
    updateData.profile = req.file.location; // S3 URL from multer-s3
  }

  // 3. Fetch user by ID
  const user = await User.findByPk(userId);

  if (!user) {
    return res
      .status(404)
      .json(
        createApiResponse(false, VALIDATION_MESSAGES.USER.GENERAL.NOT_FOUND)
      );
  }

  // 4. Update user data
  await user.update(updateData);

  // 5. Return updated user data
  return res
    .status(200)
    .json(createApiResponse(true, 'User updated successfully', user));
}, VALIDATION_MESSAGES.USER.GENERAL.UPDATE_FAILED);

export const getAllUsers = asyncHandler(async (req, res) => {
  // Extract query parameters directly
  const {
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'createdAt',
    sortOrder = 'DESC',
    is_active,
    role_id,
  } = req.query;

  // Build filters object
  const filters = {};
  if (is_active !== undefined) filters.is_active = is_active === 'true';
  if (role_id !== undefined) filters.role_id = parseInt(role_id, 10);

  // Use enhanced pagination method with built-in logic
  const result = await User.paginateWithSearch({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    filters,
    includeRole: true,
  });

  // Return paginated user data
  return res
    .status(200)
    .json(createApiResponse(true, 'Users retrieved successfully', result));
}, 'Failed to fetch users');

export const deleteUser = asyncHandler(async (req, res) => {
  // Get validated ID from middleware
  const userId = req.validatedId;

  // 2. Fetch user by ID
  const user = await User.findByPk(userId);

  if (!user) {
    return res
      .status(404)
      .json(
        createApiResponse(false, VALIDATION_MESSAGES.USER.GENERAL.NOT_FOUND)
      );
  }

  // 3. Delete the user
  await user.destroy();

  // 4. Return success response
  return res
    .status(200)
    .json(createApiResponse(true, 'User deleted successfully'));
}, VALIDATION_MESSAGES.USER.GENERAL.DELETE_FAILED);
