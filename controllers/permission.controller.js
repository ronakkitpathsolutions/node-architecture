import Permission from '../models/permission.model.js';
import {
  createApiResponse,
  extractValidationErrors,
  mergeAccessPermissions,
  validateAccessUpdates,
} from '../utils/helper.js';

export const getPermission = async (req, res) => {
  try {
    // Get validated role ID from middleware (params)
    const { roleId } = req.params;

    // Get or create permission for the role
    const permission = await Permission.getOrCreatePermission(roleId);

    // Return permission data with access information
    return res
      .status(200)
      .json(
        createApiResponse(true, 'Permission retrieved successfully', permission)
      );
  } catch (error) {
    // Extract and format validation errors
    const formattedErrors = extractValidationErrors(error);
    return res
      .status(500)
      .json(
        createApiResponse(
          false,
          'Failed to fetch permission',
          null,
          formattedErrors
        )
      );
  }
};

export const updatePermission = async (req, res) => {
  try {
    // Get validated role ID from middleware (params)
    const { roleId } = req.params;
    // Get validated update data from middleware (body)
    const { access_updates, merge_strategy = 'replace' } = req.body;

    // Additional validation for access updates
    if (access_updates) {
      const validation = validateAccessUpdates(access_updates);
      if (!validation.isValid) {
        return res.status(400).json(createApiResponse(false, validation.error));
      }
    }

    // Get or create permission for the role
    const permission = await Permission.getOrCreatePermission(roleId);

    // Merge access updates using helper function
    const updatedAccess = mergeAccessPermissions(
      permission.access,
      access_updates,
      merge_strategy
    );

    // Update permission with new access data
    await permission.update({ access: updatedAccess });

    // Return updated permission data
    return res
      .status(200)
      .json(
        createApiResponse(true, 'Permission updated successfully', permission)
      );
  } catch (error) {
    // Extract and format validation errors
    const formattedErrors = extractValidationErrors(error);
    return res
      .status(500)
      .json(
        createApiResponse(
          false,
          'Failed to update permission',
          null,
          formattedErrors
        )
      );
  }
};
