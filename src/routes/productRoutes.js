import express from 'express';
import {
    createProduct,
    getProducts,
    seedProducts
} from '../controllers/productController.js';

const router = express.Router();

router.post('/', createProduct);
router.post('/seed', seedProducts);
router.get('/', getProducts);

export default router;