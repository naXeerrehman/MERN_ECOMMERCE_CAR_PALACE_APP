import express from "express";
import {
  uploadImages,
  resizeImages,
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController.js";

const router = express.Router();

// Route to create a new vehicle with images
router.post("/create-vehicle", uploadImages, resizeImages, createVehicle);

// Route to get all vehicles
router.get("/", getVehicles);
// Route to get a vehicle by ID
router.get("/:id", getVehicleById);

// Route to update a vehicle
router.put("/:id", uploadImages, resizeImages, updateVehicle);

// Route to delete a vehicle by ID
router.delete("/:id", deleteVehicle);

export default router;
