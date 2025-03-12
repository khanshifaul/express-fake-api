import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  values: [{
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  }],
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
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

// Compound unique index for key and product
variantSchema.index({ key: 1, product: 1 }, { unique: true });

// Middleware to update the 'updatedAt' field before saving
variantSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Variant', variantSchema);