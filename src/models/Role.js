import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
  },
  description: { 
    type: String, 
    trim: true 
  },
  permissions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Permission' 
  }], // Reference to permissions
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
roleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Role', roleSchema);