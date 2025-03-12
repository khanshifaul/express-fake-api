import Category from "../models/Category.js";
import Subcategory from "../models/Subcategory.js";

export const createSubcategory = async (req, res) => {
    try {
        const { name, category, description } = req.body;

        // Check if the category exists
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        const subcategory = await Subcategory.create({ name, category, description });
        res.status(201).json(subcategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate("category");
        res.json(subcategories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSubcategoryById = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id).populate("category");
        if (!subcategory) return res.status(404).json({ error: "Subcategory not found" });
        res.json(subcategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!subcategory) return res.status(404).json({ error: "Subcategory not found" });
        res.json(subcategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
        if (!subcategory) return res.status(404).json({ error: "Subcategory not found" });
        res.json({ message: "Subcategory deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};