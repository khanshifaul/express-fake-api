import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Inventory name is required"],
    trim: true,
  },
  type: { 
    type: String, 
    required: [true, "Inventory type is required"],
    enum: ["warehouse", "branch"], // Distinguish between warehouse and branch
  },
  location: { 
    type: String, 
    required: [true, "Location is required"],
    trim: true,
  },
  contact: { 
    type: String, 
    trim: true,
  },
  // capacity: { 
  //   type: Number, 
  //   min: [0, "Capacity cannot be negative"],
  // },
  isActive: { 
    type: Boolean, 
    default: true,
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
inventorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Inventory", inventorySchema);