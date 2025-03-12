import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory for Cloudinary

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single("logo"); // 🔥 Ensure "logo" matches the form field name!

export default upload;
