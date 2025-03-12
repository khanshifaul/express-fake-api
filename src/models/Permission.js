import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
  module: { 
    type: String, 
    required: true, 
    trim: true 
  }, // Module name (e.g., 'users', 'products')
  description: { 
    type: String, 
    trim: true 
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

// Compound unique index for module
permissionSchema.index({ module: 1 }, { unique: true });

// Update the 'updatedAt' field before saving
permissionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Permission', permissionSchema);