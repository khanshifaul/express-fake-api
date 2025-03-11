import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Category', categorySchema);