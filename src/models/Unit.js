import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Unit name is required"],
    trim: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the 'updatedAt' field before saving
unitSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Unit', unitSchema);