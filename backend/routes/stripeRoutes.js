import express from "express";
import { StripePayment, SaveOrder } from "../controllers/stripeController.js"; // Adjust path as necessary

const router = express.Router();

// Route to create a Stripe Checkout Session
router.post("/create-checkout-session", StripePayment);

// Route to save the order after payment
router.post("/save-order", SaveOrder);

export default router;
