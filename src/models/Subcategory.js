import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Subcategory', subcategorySchema);