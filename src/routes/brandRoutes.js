import express from 'express';
import {
    createBrand,
    deleteBrand,
    getBrandById,
    getBrands,
    updateBrand
} from '../controllers/brandController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.route('/')
    .post(upload, createBrand)
    .get(getBrands);

router.route('/:id')
    .get(getBrandById)
    .put(upload, updateBrand)
    .delete(deleteBrand);

export default router;