import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";
import paypalRoutes from "./routes/paypalRoutes.js";
import orderHistoryRoutes from "./routes/orderHistoryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import couponRoutes from "./routes/CouponRoutes.js";
import ReviewsRoutes from "./routes/ReviewsRoutes.js";
import icon from "./routes/icon.js";
import connectDB from "./db.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api/vehicles", vehicleRoutes); // Route for vehicle management

app.use("/api/stripe", stripeRoutes);

app.use("/api/paypal", paypalRoutes);

app.use("/api/orders", orderHistoryRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api", couponRoutes);

app.use("/api/Reviews", ReviewsRoutes);

app.use("/api", icon);

// MongoDB Connection
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server Is Running On Port ${PORT}`);
});
