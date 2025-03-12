import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true, 
    unique: true, 
    minlength: [2, 'Subcategory name must be at least 2 characters long'], 
    maxlength: [50, 'Subcategory name cannot exceed 50 characters'] 
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  description: { 
    type: String, 
    trim: true, 
    maxlength: [500, 'Description cannot exceed 500 characters'] 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound unique index for name and category
subcategorySchema.index({ name: 1, category: 1 }, { unique: true });

// Middleware to update the 'updatedAt' field before saving
subcategorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Subcategory', subcategorySchema);