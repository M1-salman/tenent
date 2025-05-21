import multer from 'multer';
import path from 'path';

// Set up multer with memory storage (no disk storage)
const storage = multer.memoryStorage();

// File filter for jpg/jpeg only
const fileFilter = (req, file, cb) => {
  // Check file type
  const filetypes = /jpeg|jpg/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (mimetype && extname) {
    return cb(null, true);
  }
  
  return cb(new Error('Only JPEG/JPG images are allowed'), false);
};

// Set up multer upload with file size limit of 5MB
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

export default upload; 