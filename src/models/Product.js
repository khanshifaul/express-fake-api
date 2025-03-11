import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  sku: { type: String, unique: true, required: [true, "SKU is required"] },
  size: { type: String, required: [true, "Size is required"] },
  color: { type: String, required: [true, "Color is required"] },
  price: { type: Number, required: [true, "Price is required"], min: [0, "Price must be a positive number"] },
  stock: { type: Number, default: 0, min: [0, "Stock cannot be negative"] },
  images: { type: [String], default: [] },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Product name is required"] },
  image: { type: String, required: [true, "Product image is required"] },
  itemCode: { type: String, unique: true, required: [true, "Item code is required"] },
  itemName: { type: String, required: [true, "Item name is required"] },
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
  variants: {
    type: [variantSchema],
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: "At least one variant is required",
    },
  },
  unit: { type: String, required: [true, "Unit is required"] },
  stock: { type: Number, default: 0, min: [0, "Stock cannot be negative"] },
  alertQuantity: { type: Number, default: 0, min: [0, "Alert quantity cannot be negative"] },
  salesPrice: { type: Number, required: [true, "Sales price is required"], min: [0, "Sales price must be a positive number"] },
  tax: { type: String, required: [true, "Tax is required"] },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);