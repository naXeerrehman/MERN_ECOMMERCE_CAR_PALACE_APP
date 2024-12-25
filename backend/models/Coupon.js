import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    discount: { type: Number, required: true },
    expirationDate: {
      type: Date,
      required: true,
      set: (value) => new Date(value), // Ensuring the value is a Date object
    },
  },
  { timestamps: true }
); // Add timestamps for createdAt and updatedAt fields

export default mongoose.model("Coupon", couponSchema);
