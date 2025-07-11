import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import roleRoutes from './role.routes.js';
import permissionRoutes from './permission.routes.js';
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';

const router = express.Router();
router.use('/auth', authRoutes);
router.use(userRoutes);
router.use(roleRoutes);
router.use(permissionRoutes);
router.use(categoryRoutes);
router.use(productRoutes);
// Handle /api route specifically (when no sub-route matches)
export default router;
