import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    minlength: [2, 'Category name must be at least 2 characters long'], 
    maxlength: [50, 'Category name cannot exceed 50 characters'] 
  },
  logo: { 
    type: String, 
    default: 'https://via.placeholder.com/150', // Default logo URL
    trim: true 
  },
  subcategories: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subcategory' 
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the 'updatedAt' field before saving
categorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Category', categorySchema);