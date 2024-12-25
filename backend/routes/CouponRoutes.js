import express from "express";
import {
  createCoupon,
  getCoupons,
  verifyCoupon,
  editCoupon,
  deleteCoupon,
} from "../controllers/CouponController.js";

const router = express.Router();

// Route to create a new coupon
router.post("/coupons", createCoupon);

// Route to get all coupons
router.get("/coupons", getCoupons);

// Route to verify a coupon code
router.post("/coupons/verify", verifyCoupon);

// Route to update a coupon
router.put("/coupons/:id", editCoupon);

// Route to delete a coupon
router.delete("/coupons/:id", deleteCoupon);

export default router;
