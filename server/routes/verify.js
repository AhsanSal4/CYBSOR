// routes/verify.js
const express = require('express');
const Note = require('../models/note');
const User = require('../models/user'); // Import the User model

const router = express.Router();

// Middleware to check if the user is a teacher...
// (Code omitted for brevity)

// Approve a note
router.post('/approve/:id', isTeacher, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    note.status = 'approved';
    note.reviewedBy = req.user.username;
    note.reviewDate = new Date();
    await note.save();

    // Increment rewards for the teacher
    const teacher = await User.findOne({ username: req.user.username });
    teacher.rewards += 5; // Add 5 points for each verification (you can adjust this)
    await teacher.save();

    res.json({ message: 'Note approved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve note' });
  }
});

// Reject a note
router.post('/reject/:id', isTeacher, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    note.status = 'rejected';
    note.reviewedBy = req.user.username;
    note.reviewDate = new Date();
    await note.save();

    // Increment rewards for the teacher
    const teacher = await User.findOne({ username: req.user.username });
    teacher.rewards += 5; // Add 5 points for each verification (you can adjust this)
    await teacher.save();

    res.json({ message: 'Note rejected' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject note' });
  }
});

module.exports = router;
