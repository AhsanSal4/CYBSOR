// backend/index.js
const express = require('express');
const admin = require('firebase-admin');
const uploadRoutes = require('./routes/upload');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('path/to/serviceAccountKey.json'); // Replace with the path to your downloaded JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "your-project-id.appspot.com" // Replace with your storage bucket name
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'frontend')));

// Routes
app.use('/upload', uploadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { db, bucket };
