import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Discount name is required"],
    unique: true, // Ensure discount names are unique
    trim: true,
  },
  type: {
    type: String,
    required: [true, "Discount type is required"],
    enum: ["percentage", "fixed"], // Only allow these two types
    default: "percentage",
  },
  value: {
    type: Number,
    required: [true, "Discount value is required"],
    min: [0, "Discount value cannot be negative"],
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"],
    validate: {
      validator: function (value) {
        return value > this.startDate; // Ensure end date is after start date
      },
      message: "End date must be after start date",
    },
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
discountSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Discount", discountSchema);