import Permission from '../models/permission.model.js';
import {
  createApiResponse,
  asyncHandler,
  mergeAccessPermissions,
  validateAccessUpdates,
} from '../utils/helper.js';

export const getPermission = asyncHandler(async (req, res) => {
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
}, 'Failed to fetch permission');

export const updatePermission = asyncHandler(async (req, res) => {
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
}, 'Failed to update permission');
