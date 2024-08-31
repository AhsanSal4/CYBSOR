// backend/routes/upload.js
const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { db, bucket } = require('../index');

const router = express.Router();

// Multer setup for file uploads
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const file = req.file;
  const fileId = uuidv4();
  const fileName = `${fileId}_${file.originalname}`;
  const fileUpload = bucket.file(fileName);

  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  blobStream.on('error', (err) => {
    console.error('Upload error:', err);
    res.status(500).send('Unable to upload file.');
  });

  blobStream.on('finish', async () => {
    const downloadURL = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;

    // Store file metadata in Firestore
    await db.collection('notes').add({
      title: req.body.title,
      filePath: downloadURL,
      approved: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).send('File uploaded successfully.');
  });

  blobStream.end(file.buffer);
});

module.exports = router;
