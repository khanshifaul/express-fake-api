import express from 'express';
import {
    createSubcategory,
    deleteSubcategory,
    getSubcategories,
    getSubcategoryById,
    updateSubcategory
} from '../controllers/subcategoryController.js';

const router = express.Router();

router.route('/')
    .post(createSubcategory)
    .get(getSubcategories);

router.route('/:id')
    .get(getSubcategoryById)
    .put(updateSubcategory)
    .delete(deleteSubcategory);

export default router;