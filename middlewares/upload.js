const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../service/config/cloudinary.js");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads", // base folder
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

module.exports = upload;
