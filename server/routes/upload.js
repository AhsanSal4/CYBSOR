// routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Note = require('../models/note');
const User = require('../models/user'); // Import the User model

const router = express.Router();

// Multer setup for file upload...
// (Code omitted for brevity)

// Route to handle file upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const note = new Note({
      title: req.body.title,
      filePath: `/uploads/${req.file.filename}`,
      uploadedBy: req.user.username,
      status: 'pending',
    });

    await note.save();

    // Increment rewards for the student
    const student = await User.findOne({ username: req.user.username });
    student.rewards += 10; // Add 10 points for each note upload (you can adjust this)
    await student.save();

    res.json({ message: 'File uploaded successfully', file: req.file });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

module.exports = router;
