import Coupon from "../models/Coupon.js";

// Create Coupon
const createCoupon = async (req, res) => {
  try {
    const { name, discount, expirationDate } = req.body;

    if (!name || !discount || !expirationDate) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const expirationDateObj = new Date(expirationDate);

    if (isNaN(expirationDateObj)) {
      return res.status(400).json({ message: "Invalid expiration date." });
    }

    if (expirationDateObj < new Date()) {
      return res
        .status(400)
        .json({ message: "Coupon expiration date cannot be in the past." });
    }

    const newCoupon = new Coupon({
      name,
      discount,
      expirationDate: expirationDateObj,
    });

    const savedCoupon = await newCoupon.save();
    res.status(201).json(savedCoupon);
  } catch (error) {
    res.status(500).json({ message: "Failed to create coupon.", error });
  }
};

// Get All Coupons
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find(); // Fetch all coupons
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch coupons.", error });
  }
};

// Verify Coupon
const verifyCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required." });
    }

    const coupon = await Coupon.findOne({ name: code });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found." });
    }

    if (new Date(coupon.expirationDate) < new Date()) {
      return res.status(400).json({ message: "Coupon has expired." });
    }

    res.status(200).json({ discount: coupon.discount });
  } catch (error) {
    res.status(500).json({ message: "Failed to verify coupon.", error });
  }
};

// Edit Coupon
const editCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, discount, expirationDate } = req.body;

    if (!name || !discount || !expirationDate) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const expirationDateObj = new Date(expirationDate);

    if (isNaN(expirationDateObj)) {
      return res.status(400).json({ message: "Invalid expiration date." });
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { name, discount, expirationDate: expirationDateObj },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found." });
    }

    res.status(200).json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ message: "Failed to update coupon.", error });
  }
};

// Delete Coupon
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (deletedCoupon) {
      return res.status(200).json({ message: "Coupon deleted successfully" });
    } else {
      return res.status(404).json({ message: "Coupon not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error deleting the coupon" });
  }
};

export { createCoupon, getCoupons, verifyCoupon, editCoupon, deleteCoupon };
