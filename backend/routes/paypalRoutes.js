// routes/paypalRoutes.js
import express from "express";
import { createOrder, captureOrder } from "../controllers/paypal.js";

const router = express.Router();

// Route for creating PayPal order
router.post("/create-order", createOrder);

// Route for capturing PayPal order
router.get("/capture-order", captureOrder);

export default router;
