// backend/src/middleware/uploadImage.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Use the same Cloudinary config as your resume upload
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ats-profile-images",     // Separate folder for profile pics
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 500, height: 500, crop: "limit" },   // Optional: resize to square
      { quality: "auto" }
    ],
  },
});

const uploadImage = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpg, png, webp) are allowed"), false);
    }
  },
});

module.exports = uploadImage;