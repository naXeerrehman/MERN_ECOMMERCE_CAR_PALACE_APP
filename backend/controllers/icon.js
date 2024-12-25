import cloudinary from "cloudinary";
import Icon from "../models/Icon.js";

// Configure Cloudinary (use your actual credentials here)
cloudinary.config({
  cloud_name: "dsvpstplx",
  api_key: "255369348398518",
  api_secret: "pcrGANnxW0Y_MFmyoC5YnkI7D8Y",
});

// Create Icon
const createIcon = async (req, res) => {
  try {
    const { link } = req.body; // Get link and name from request body
    const image = req.file; // Image file from multer

    if (!link || !image) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.v2.uploader.upload(image.path);

    const newIcon = new Icon({
      link, // Save the link to the database
      image: result.secure_url, // Cloudinary URL
    });

    const savedIcon = await newIcon.save();
    res.status(201).json(savedIcon);
  } catch (error) {
    res.status(500).json({ message: "Failed to create icon.", error });
  }
};

// Edit Icon
const editIcon = async (req, res) => {
  try {
    const { id } = req.params;
    const { link } = req.body;
    const image = req.file; // Image file from multer

    if (!link) {
      return res.status(400).json({ message: "Link is required." });
    }

    let updatedData = { link };

    if (image) {
      // Upload new image to Cloudinary
      const result = await cloudinary.v2.uploader.upload(image.path);
      updatedData.image = result.secure_url; // Cloudinary URL
    }

    const updatedIcon = await Icon.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedIcon) {
      return res.status(404).json({ message: "Icon not found." });
    }

    res.status(200).json(updatedIcon);
  } catch (error) {
    res.status(500).json({ message: "Failed to update icon.", error });
  }
};

// Get All Icons
const getIcons = async (req, res) => {
  try {
    const icons = await Icon.find(); // Fetch all icons
    res.status(200).json(icons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch icons.", error });
  }
};

// Delete Icon
const deleteIcon = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedIcon = await Icon.findByIdAndDelete(id);

    if (deletedIcon) {
      return res.status(200).json({ message: "Icon deleted successfully" });
    } else {
      return res.status(404).json({ message: "Icon not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error deleting the icon" });
  }
};

export { createIcon, getIcons, editIcon, deleteIcon };
