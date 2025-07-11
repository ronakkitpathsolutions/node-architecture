import Product from '../models/product.model.js';
import Category from '../models/category.model.js';
import { createApiResponse, asyncHandler } from '../utils/helper.js';
import { VALIDATION_MESSAGES } from '../utils/constants/messages.js';

export const createProduct = asyncHandler(async (req, res) => {
  // Get validated data from middleware
  const validatedData = req.validatedData;
  // Check if category exists
  const category = await Category.findByPk(validatedData.category_id);
  if (!category) {
    return res
      .status(404)
      .json(
        createApiResponse(
          false,
          VALIDATION_MESSAGES.PRODUCT.CATEGORY_ID.NOT_FOUND
        )
      );
  }

  // Create product
  const product = await Product.create(validatedData);

  // Fetch the created product with category details
  const createdProduct = await Product.findByPk(product.id, {
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'category_name', 'slug'],
      },
    ],
  });

  return res
    .status(201)
    .json(
      createApiResponse(true, 'Product created successfully', createdProduct)
    );
}, VALIDATION_MESSAGES.PRODUCT.GENERAL.CREATION_FAILED);

export const getProduct = asyncHandler(async (req, res) => {
  // Get validated ID from middleware
  const productId = req.validatedId;

  // Fetch product by ID with category details
  const product = await Product.findByPk(productId, {
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'category_name', 'slug'],
      },
    ],
  });

  if (!product) {
    return res
      .status(404)
      .json(
        createApiResponse(false, VALIDATION_MESSAGES.PRODUCT.GENERAL.NOT_FOUND)
      );
  }

  return res
    .status(200)
    .json(createApiResponse(true, 'Product retrieved successfully', product));
}, 'Failed to fetch product');

export const getAllProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category_id,
    status,
    search,
    min_price,
    max_price,
    in_stock,
    sortBy = 'created_at',
    sortOrder = 'DESC',
  } = req.query;

  // Build filters object
  const filters = {};
  if (category_id) filters.category_id = category_id;
  if (status) filters.status = status;
  if (min_price) filters.min_price = min_price;
  if (max_price) filters.max_price = max_price;
  if (in_stock) filters.in_stock = in_stock;

  // Use the paginateWithSearch method
  const { result: products, pagination } = await Product.paginateWithSearch({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    filters,
    includeCategory: true,
  });

  return res.status(200).json(
    createApiResponse(true, 'Products retrieved successfully', {
      result: products,
      pagination,
    })
  );
}, 'Failed to fetch products');

export const updateProduct = asyncHandler(async (req, res) => {
  // Get validated ID and data from middleware
  const productId = req.validatedId;
  const updateData = req.validatedData;

  // Check if file was uploaded and add to update data
  if (req.file) {
    updateData.image_url = req.file.location; // S3 URL from multer-s3
  }

  // Check if category exists (if category_id is being updated)
  if (updateData.category_id) {
    const category = await Category.findByPk(updateData.category_id);
    if (!category) {
      return res
        .status(404)
        .json(
          createApiResponse(
            false,
            VALIDATION_MESSAGES.PRODUCT.CATEGORY_ID.NOT_FOUND
          )
        );
    }
  }

  // Fetch product by ID
  const product = await Product.findByPk(productId);

  if (!product) {
    return res
      .status(404)
      .json(
        createApiResponse(false, VALIDATION_MESSAGES.PRODUCT.GENERAL.NOT_FOUND)
      );
  }

  // Update the product
  await product.update(updateData);

  // Fetch updated product with category details
  const updatedProduct = await Product.findByPk(productId, {
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'category_name', 'slug'],
      },
    ],
  });

  return res
    .status(200)
    .json(
      createApiResponse(true, 'Product updated successfully', updatedProduct)
    );
}, VALIDATION_MESSAGES.PRODUCT.GENERAL.UPDATE_FAILED);

export const updateProductStock = asyncHandler(async (req, res) => {
  const productId = req.validatedId;
  const { stock } = req.validatedData;

  const product = await Product.findByPk(productId);

  if (!product) {
    return res
      .status(404)
      .json(
        createApiResponse(false, VALIDATION_MESSAGES.PRODUCT.GENERAL.NOT_FOUND)
      );
  }

  await product.update({ stock });

  return res.status(200).json(
    createApiResponse(true, 'Product stock updated successfully', {
      id: product.id,
      stock: product.stock,
    })
  );
}, VALIDATION_MESSAGES.PRODUCT.GENERAL.UPDATE_FAILED);

export const updateProductStatus = asyncHandler(async (req, res) => {
  const productId = req.validatedId;
  const { status } = req.validatedData;

  const product = await Product.findByPk(productId);

  if (!product) {
    return res
      .status(404)
      .json(
        createApiResponse(false, VALIDATION_MESSAGES.PRODUCT.GENERAL.NOT_FOUND)
      );
  }

  await product.update({ status });

  return res.status(200).json(
    createApiResponse(true, 'Product status updated successfully', {
      id: product.id,
      status: product.status,
    })
  );
}, VALIDATION_MESSAGES.PRODUCT.GENERAL.UPDATE_FAILED);

export const deleteProduct = asyncHandler(async (req, res) => {
  // Get validated ID from middleware
  const productId = req.validatedId;

  // Fetch product by ID
  const product = await Product.findByPk(productId);

  if (!product) {
    return res
      .status(404)
      .json(
        createApiResponse(false, VALIDATION_MESSAGES.PRODUCT.GENERAL.NOT_FOUND)
      );
  }

  // Delete the product
  await product.destroy();

  return res
    .status(200)
    .json(
      createApiResponse(true, 'Product deleted successfully', { id: productId })
    );
}, VALIDATION_MESSAGES.PRODUCT.GENERAL.DELETE_FAILED);

export const getProductBySlug = asyncHandler(async (req, res) => {
  // Get validated slug from middleware
  const slug = req.validatedSlug;

  // Fetch product by slug with category details
  const product = await Product.findOne({
    where: { slug },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'category_name', 'slug'],
      },
    ],
  });

  if (!product) {
    return res
      .status(404)
      .json(
        createApiResponse(false, VALIDATION_MESSAGES.PRODUCT.GENERAL.NOT_FOUND)
      );
  }

  return res
    .status(200)
    .json(createApiResponse(true, 'Product retrieved successfully', product));
}, 'Failed to fetch product by slug');
