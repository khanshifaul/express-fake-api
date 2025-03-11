import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Tag', tagSchema);