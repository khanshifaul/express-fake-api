import express from 'express';
import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategoryById,
    updateCategory
} from '../controllers/categoryController.js';

const router = express.Router();

router.route('/')
    .post(createCategory)
    .get(getCategories);

router.route('/:id')
    .get(getCategoryById)
    .put(updateCategory)
    .delete(deleteCategory);

export default router;