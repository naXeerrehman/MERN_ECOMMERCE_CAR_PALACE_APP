import Vehicle from "../models/vehicle.js";
import cloudinary from "cloudinary";
import sharp from "sharp";
import multer from "multer";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// In-memory file storage configuration
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Please upload only images!"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadFiles = upload.array("images", 10); // Handle up to 10 images

export const uploadImages = (req, res, next) => {
  uploadFiles(req, res, (err) => {
    if (
      err instanceof multer.MulterError &&
      err.code === "LIMIT_UNEXPECTED_FILE"
    ) {
      return res.status(400).json({ message: "Too many files to upload!" });
    }
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    next();
  });
};

export const resizeImages = async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = [];

  try {
    await Promise.all(
      req.files.map(async (file) => {
        const filename = `vehicle-${Date.now()}-${file.originalname}`;
        const buffer = await sharp(file.buffer)
          .resize(640, 320)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toBuffer();

        const uploadPromise = new Promise((resolve, reject) => {
          cloudinary.v2.uploader
            .upload_stream({ folder: "vehicles" }, (error, uploadedFile) => {
              if (error) {
                reject(new Error("Cloudinary upload failed"));
              } else {
                req.body.images.push(uploadedFile.secure_url);
                resolve();
              }
            })
            .end(buffer); // Use sharp's buffer as input to Cloudinary
        });

        await uploadPromise;
      })
    );

    next();
  } catch (error) {
    console.error("Error resizing and uploading images:", error);
    res.status(500).json({ message: "Error processing images", error });
  }
};

const createVehicle = async (req, res) => {
  try {
    const { type, brand, model, price, stock, description } = req.body;

    // Save the vehicle with the description and image URLs
    const newVehicle = new Vehicle({
      type,
      brand,
      model,
      price,
      stock,
      description,
      imageUrls: req.body.images, // Store Cloudinary image URLs
    });

    await newVehicle.save();
    res
      .status(201)
      .json({ message: "Vehicle uploaded successfully", vehicle: newVehicle });
  } catch (error) {
    console.error("Error uploading vehicle:", error);
    res.status(500).json({ message: "Error uploading vehicle", error });
  }
};

// Function to fetch all vehicles
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({}); // Fetch all vehicles from the database
    if (!vehicles.length) {
      return res.status(404).json({ message: "No vehicles found" }); // Handle case when no vehicles exist
    }
    res.status(200).json(vehicles); // Respond with the vehicles
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error }); // Handle errors
  }
};

// Function to get vehicle by ID
const getVehicleById = async (req, res) => {
  const id = req.params.id;

  try {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

// Function to update vehicle
const updateVehicle = async (req, res) => {
  try {
    const { model, brand, type, price, stock, description } = req.body;

    // Find the existing vehicle
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    // Update fields
    vehicle.model = model || vehicle.model;
    vehicle.brand = brand || vehicle.brand;
    vehicle.type = type || vehicle.type;
    vehicle.price = price || vehicle.price;
    vehicle.stock = stock || vehicle.stock;
    vehicle.description = description || vehicle.description; // Add this line

    // Handle image updates if new images are uploaded
    if (req.body.images && req.body.images.length > 0) {
      vehicle.imageUrls = req.body.images;
    }

    // Save the updated vehicle to the database
    await vehicle.save();

    res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    console.error("Error in updating vehicle:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Function to delete vehicle
const deleteVehicle = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(id); // Delete the vehicle by ID

    if (!deletedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" }); // Handle vehicle not found
    }

    res
      .status(200)
      .json({ message: "Vehicle deleted successfully", deletedVehicle }); // Respond with success message
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error }); // Handle errors
  }
};

export {createVehicle,getVehicles,updateVehicle,getVehicleById,deleteVehicle};
