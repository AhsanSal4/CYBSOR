const express = require('express');
const admin = require('firebase-admin');
const path = require('path');

// Firebase Admin Initialization
const serviceAccount = require('./notetrove-9f4e6-firebase-adminsdk-gmcsq-be15713652.json'); // Replace with your path

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "notetrove-9f4e6.appspot.com" // Replace with your storage bucket name
});

const db = admin.firestore(); // Initialize Firestore

const app = express();
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.json()); // Middleware to parse JSON request bodies

// Route to get the count of files uploaded
app.get('/files-count', async (req, res) => {
    try {
        const snapshot = await db.collection('notes').get();
        const fileCount = snapshot.size;
        res.json({ fileCount });
    } catch (error) {
        console.error('Error getting file count:', error);
        res.status(500).send('Error getting file count');
    }
});

// Route to fetch pending notes for approval
app.get('/verify/pending', async (req, res) => {
    try {
        const snapshot = await db.collection('notes').where('approved', '==', false).get();
        
        if (snapshot.empty) {
            return res.status(404).json({ message: 'No pending notes found' });
        }

        const notes = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        res.json(notes);
    } catch (error) {
        console.error('Error fetching pending notes:', error);
        res.status(500).send('Error fetching pending notes');
    }
});

// Route to approve a note
app.post('/verify/approve/:id', async (req, res) => {
    const noteId = req.params.id;
    try {
        await db.collection('notes').doc(noteId).update({ approved: true });
        res.json({ message: 'Note approved successfully!' });
    } catch (error) {
        console.error('Error approving note:', error);
        res.status(500).send('Error approving note');
    }
});

// Route to reject a note
app.post('/verify/reject/:id', async (req, res) => {
    const noteId = req.params.id;
    try {
        await db.collection('notes').doc(noteId).delete(); // Delete rejected note
        res.json({ message: 'Note rejected successfully!' });
    } catch (error) {
        console.error('Error rejecting note:', error);
        res.status(500).send('Error rejecting note');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
