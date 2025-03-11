import Tag from '../models/Tags.js';

export const createTag = async (req, res) => {
    try {
        const tag = await Tag.create(req.body);
        res.status(201).json(tag);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getTags = async (req, res) => {
    try {
        const tags = await Tag.find();
        res.json(tags);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTagById = async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id);
        if (!tag) return res.status(404).json({ error: 'Tag not found' });
        res.json(tag);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTag = async (req, res) => {
    try {
        const tag = await Tag.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!tag) return res.status(404).json({ error: 'Tag not found' });
        res.json(tag);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteTag = async (req, res) => {
    try {
        const tag = await Tag.findByIdAndDelete(req.params.id);
        if (!tag) return res.status(404).json({ error: 'Tag not found' });
        res.json({ message: 'Tag deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};