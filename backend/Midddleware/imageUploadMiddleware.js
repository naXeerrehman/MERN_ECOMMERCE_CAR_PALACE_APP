// imageUploadMiddleware.js

import multer from 'multer';
import sharp from 'sharp';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// In-memory file storage configuration
const multerStorage = multer.memoryStorage();

// File filter to allow only image files
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Please upload only images!'), false);
  }
};

// Create multer upload middleware
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Handle multiple image uploads (up to 10 files)
const uploadFiles = upload.array('images', 10); // Handle up to 10 images

// Middleware for uploading images
export const uploadImages = (req, res, next) => {
  uploadFiles(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Too many files to upload!' });
    }
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    next();
  });
};

// Middleware for resizing images and uploading to Cloudinary
export const resizeImages = async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = [];

  try {
    await Promise.all(
      req.files.map(async (file) => {
        const filename = `vehicle-${Date.now()}-${file.originalname}`;
        const buffer = await sharp(file.buffer)
          .resize(640, 320)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toBuffer();

        const uploadPromise = new Promise((resolve, reject) => {
          cloudinary.v2.uploader.upload_stream({ folder: 'vehicles' }, (error, uploadedFile) => {
            if (error) {
              reject(new Error('Cloudinary upload failed'));
            } else {
              req.body.images.push(uploadedFile.secure_url);
              resolve();
            }
          }).end(buffer); // Use sharp's buffer as input to Cloudinary
        });

        await uploadPromise;
      })
    );

    next();
  } catch (error) {
    console.error('Error resizing and uploading images:', error);
    res.status(500).json({ message: 'Error processing images', error });
  }
};
