import Product from '../models/Product.js';
import { generateProduct } from '../utils/fakerGenerators.js';

export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const seedProducts = async (req, res) => {
    const { count = 10 } = req.body;
    
    try {
        const products = Array.from({ length: count }, () => generateProduct());
        await Product.insertMany(products);
        res.status(201).json({ message: `${count} products created` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category')
            .populate('subcategory')
            .populate('brand')
            .populate('tags');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};