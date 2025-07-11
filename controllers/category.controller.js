import Category from '../models/category.model.js';
import { createApiResponse, asyncHandler } from '../utils/helper.js';
import { VALIDATION_MESSAGES } from '../utils/constants/messages.js';

export const createCategory = asyncHandler(async (req, res) => {
  // Get validated data from middleware
  const validatedData = req.validatedData;

  // Check if file was uploaded and add to create data
  if (req.file) {
    validatedData.category_image = req.file.location; // S3 URL from multer-s3
  }

  // Create category
  const category = await Category.create(validatedData);

  // Return created category
  return res
    .status(201)
    .json(createApiResponse(true, 'Category created successfully', category));
}, VALIDATION_MESSAGES.CATEGORY.GENERAL.CREATION_FAILED);

export const getCategory = asyncHandler(async (req, res) => {
  // Get validated ID from middleware
  const categoryId = req.validatedId;

  // Fetch category by ID
  const category = await Category.findByPk(categoryId);

  if (!category) {
    return res
      .status(404)
      .json(
        createApiResponse(false, VALIDATION_MESSAGES.CATEGORY.GENERAL.NOT_FOUND)
      );
  }

  // Return category data
  return res
    .status(200)
    .json(createApiResponse(true, 'Category retrieved successfully', category));
}, 'Failed to fetch category');

export const getAllCategories = asyncHandler(async (req, res) => {
  // Fetch all categories
  const categories = await Category.findAll({
    order: [['category_name', 'ASC']], // Order by category name alphabetically
  });

  // Return categories data
  return res
    .status(200)
    .json(
      createApiResponse(true, 'Categories retrieved successfully', categories)
    );
}, 'Failed to fetch categories');

export const updateCategory = asyncHandler(async (req, res) => {
  // Get validated ID and data from middleware
  const categoryId = req.validatedId;
  const updateData = req.validatedData;

  // Check if file was uploaded and add to update data
  if (req.file) {
    updateData.category_image = req.file.location; // S3 URL from multer-s3
  }

  // Fetch category by ID
  const category = await Category.findByPk(categoryId);

  if (!category) {
    return res
      .status(404)
      .json(
        createApiResponse(false, VALIDATION_MESSAGES.CATEGORY.GENERAL.NOT_FOUND)
      );
  }

  // Update category data
  await category.update(updateData);

  // Return updated category data
  return res
    .status(200)
    .json(createApiResponse(true, 'Category updated successfully', category));
}, VALIDATION_MESSAGES.CATEGORY.GENERAL.UPDATE_FAILED);

export const deleteCategory = asyncHandler(async (req, res) => {
  // Get validated ID from middleware
  const categoryId = req.validatedId;

  // Fetch category by ID
  const category = await Category.findByPk(categoryId);

  if (!category) {
    return res
      .status(404)
      .json(
        createApiResponse(false, VALIDATION_MESSAGES.CATEGORY.GENERAL.NOT_FOUND)
      );
  }

  // Delete the category
  await category.destroy();

  // Return success response
  return res
    .status(200)
    .json(createApiResponse(true, 'Category deleted successfully'));
}, VALIDATION_MESSAGES.CATEGORY.GENERAL.DELETE_FAILED);

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  // Get validated slug from middleware
  const slug = req.validatedSlug;

  // Fetch category by slug
  const category = await Category.findOne({
    where: { slug },
  });

  if (!category) {
    return res
      .status(404)
      .json(
        createApiResponse(false, VALIDATION_MESSAGES.CATEGORY.GENERAL.NOT_FOUND)
      );
  }

  // Return category data
  return res
    .status(200)
    .json(createApiResponse(true, 'Category retrieved successfully', category));
}, 'Failed to fetch category by slug');
