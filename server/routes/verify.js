// routes/verify.js
const express = require('express');
const Note = require('../models/note');
const router = express.Router();

// Middleware to check if the user is a teacher
const isTeacher = (req, res, next) => {
  if (req.user && req.user.role === 'teacher') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};

// Get all pending notes
router.get('/pending', isTeacher, async (req, res) => {
  try {
    const notes = await Note.find({ status: 'pending' });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending notes' });
  }
});

// Approve a note
router.post('/approve/:id', isTeacher, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    note.status = 'approved';
    note.reviewedBy = req.user.username;
    note.reviewDate = new Date();
    await note.save();
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
    res.json({ message: 'Note rejected' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject note' });
  }
});

module.exports = router;
