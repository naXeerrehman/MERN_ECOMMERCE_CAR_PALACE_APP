import express from "express";
import {
  addReview,
  getReviewByVehicle,
} from "../controllers/ReviewsController.js";

const router = express.Router();

// Add a new review
router.post("/:vehicleId", addReview);

// Get review for a specific vehicle
router.get("/:vehicleId", getReviewByVehicle);

export default router;
