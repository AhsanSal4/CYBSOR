// routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // Store files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Append timestamp to avoid duplicate names
  }
});

const upload = multer({ storage: storage });

// Route to handle file upload
router.post('/', upload.single('file'), (req, res) => {
  try {
    res.json({ message: 'File uploaded successfully', file: req.file });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

module.exports = router;
