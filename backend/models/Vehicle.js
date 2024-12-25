import mongoose from "mongoose";

// Define the schema
const vehicleSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  description: { type: String },
  imageUrls: { type: [String], default: [] },
  stock: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Vehicle", vehicleSchema);
