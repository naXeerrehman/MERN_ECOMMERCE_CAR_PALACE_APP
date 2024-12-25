import mongoose from "mongoose";

// Define the schema for an order
const orderSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        name: String,
        price: Number,
        quantity: Number,
        imageUrls: [String],
        model: String,
      },
    ],
    totalCost: { type: Number, required: true },
    status: { type: String, required: true },
    amount: { type: Number, required: true },
    productsCount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    paymentMethod: { type: String, required: false },
    date: {
      type: String,
      required: true,
      default: () => moment().format("YYYY-MM-DD hh:mm A"),
    },
    createdAt: { type: Date, default: Date.now },
    paypalOrderId: { type: String, unique: true, required: true, sparse: true },
  },
  { timestamps: true }
);

// Create a model from the schema
const Order = mongoose.model("Order", orderSchema);

export default Order;
