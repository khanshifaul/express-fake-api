import { Router } from 'express';
import brandRoutes from './brandRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import subcategoryRoutes from './subcategoryRoutes.js';
import tagRoutes from './tagRoutes.js';
import userRoutes from './userRoutes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/subcategories', subcategoryRoutes);
router.use('/brands', brandRoutes);
router.use('/tags', tagRoutes);

export default router;