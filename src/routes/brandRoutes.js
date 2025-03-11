import express from 'express';
import {
    createBrand,
    deleteBrand,
    getBrandById,
    getBrands,
    updateBrand
} from '../controllers/brandController.js';

const router = express.Router();

router.route('/')
    .post(createBrand)
    .get(getBrands);

router.route('/:id')
    .get(getBrandById)
    .put(updateBrand)
    .delete(deleteBrand);

export default router;