import mongoose from 'mongoose';

const taxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tax name is required"],
    trim: true,
    unique: true,
  },
  type: {
    type: String,
    required: [true, "Tax type is required"],
    enum: ["inclusive", "exclusive"],
    default: "inclusive",
  },
  percentage: {
    type: Number,
    required: [true, "Tax percentage is required"],
    min: [0, "Tax percentage cannot be negative"],
    max: [100, "Tax percentage cannot exceed 100%"],
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
taxSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Tax', taxSchema);