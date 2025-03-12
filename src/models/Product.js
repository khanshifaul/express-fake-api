import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Product name is required"],
    trim: true,
  },
  image: { 
    type: String, 
    required: [true, "Product image is required"],
    trim: true,
  },
  sku: { 
    type: String, 
    unique: true, 
    required: [true, "SKU is required"],
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
    required: [true, "Subcategory is required"],
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: [true, "Brand is required"],
  },
  purchasePrice: { 
    type: Number, 
    required: [true, "Purchase price is required"], 
    min: [0, "Purchase price cannot be negative"],
  },
  profitMargin: { 
    type: Number, 
    required: [true, "Profit margin is required"], 
    min: [0, "Profit margin cannot be negative"],
  },
  salesPrice: { 
    type: Number, 
    required: [true, "Sales price is required"], 
    min: [0, "Sales price cannot be negative"],
  },
  mrp: { 
    type: Number, 
    required: [true, "MRP is required"], 
    min: [0, "MRP cannot be negative"],
  },
  inventory: [{
    inventoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: [true, "Inventory reference is required"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
  }],
  totalStock: { 
    type: Number, 
    default: 0, 
    min: [0, "Stock cannot be negative"],
  },
  alertQuantity: { 
    type: Number, 
    default: 0, 
    min: [0, "Alert quantity cannot be negative"],
  },
  tax: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tax",
    required: [true, "Tax is required"],
  },
  discount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Discount",
  },
  status: { 
    type: String, 
    enum: ["Active", "Inactive"], 
    default: "Active",
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag",
  }],
  createdAt: { 
    type: Date, 
    default: Date.now,
  },
  updatedAt: { 
    type: Date, 
    default: Date.now,
  },
});

// Virtual for total price (including tax and discount)
productSchema.virtual('totalPrice').get(function() {
  const price = this.salesPrice;
  const taxAmount = (this.tax.percentage / 100) * price;
  const discountAmount = this.discount ? (this.discount.value / 100) * price : 0;
  return price + taxAmount - discountAmount;
});

// Compound index for frequently queried fields
productSchema.index({ category: 1, subcategory: 1, brand: 1 });

// Middleware to update the 'updatedAt' field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Product", productSchema);