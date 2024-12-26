import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  saveOrder,
  updateOrder,
} from "../controllers/OrdersHistory.js";

const router = express.Router();

// Route to create a new order
router.post("/", createOrder);

// Route to fetch all orders
router.get("/", getAllOrders);

// Route to fetch a specific order by ID
router.get("/:id", getOrderById);

router.post("/", saveOrder);

router.patch("/api/orders/:id", updateOrderStatus);

export default router;
