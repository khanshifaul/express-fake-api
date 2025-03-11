import express from 'express';
import {
    createTag,
    deleteTag,
    getTagById,
    getTags,
    updateTag
} from '../controllers/tagController.js';

const router = express.Router();

router.route('/')
    .post(createTag)
    .get(getTags);

router.route('/:id')
    .get(getTagById)
    .put(updateTag)
    .delete(deleteTag);

export default router;