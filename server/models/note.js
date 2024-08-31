const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: String,
  filePath: String,
  uploadedBy: String, // Reference to the student who uploaded
  status: { type: String, default: 'pending' }, // 'pending', 'approved', 'rejected'
  reviewedBy: String, // Reference to the teacher who reviewed
  reviewDate: Date,
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
