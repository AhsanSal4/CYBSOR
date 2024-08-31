// backend/index.js
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');  
const path = require('path');

// Firebase Admin Initialization
const serviceAccount = require('./cybsor-firebase-adminsdk-gb55e-6efb6131ea'); // Replace with your correct path

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "cybsor.appspot.com" // Replace with your storage bucket name
});

const db = admin.firestore();
const bucket = admin.storage().bucket(); // Initialize Firebase Storage
const app = express();
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(cors()); 
app.use(express.json()); // Middleware to parse JSON request bodies

// Route to get the logged-in user's info (e.g., teacher info)
app.get('/auth/me', (req, res) => {
    const user = {
        username: 'Teacher Name',  // Example: replace this with actual username from your auth system
        rewards: 10                // Example: replace this with the actual rewards
    };
    res.json(user);
});

// Route to fetch pending notes for approval
// Route to fetch pending notes for approval
app.get('/verify/pending', async (req, res) => {
    try {
        const snapshot = await db.collection('notes').where('approved', '==', false).get();
        if (snapshot.empty) {
            return res.status(404).json({ message: 'No pending notes found' });
        }

        const notes = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

        // Fetch file URLs from Firebase Storage
        const signedUrls = await Promise.all(
            notes.map(async (note) => {
                try {
                    const file = bucket.file(note.filePath); // Ensure 'filePath' is correct
                    const [url] = await file.getSignedUrl({
                        action: 'read',
                        expires: '03-01-2025' // Set an appropriate expiration date
                    });
                    return { ...note, fileUrl: url }; // Append the signed URL to each note object
                } catch (error) {
                    console.error(`Error fetching signed URL for note ID ${note._id}:`, error.message);
                    return { ...note, fileUrl: null }; // If there's an error, return null for fileUrl
                }
            })
        );

        res.json(signedUrls);
    } catch (error) {
        console.error('Error fetching pending notes:', error); // Log full error
        res.status(444).send('Error fetching pending notes');
    }
});

// Route to fetch all notes
app.get('/notes', async (req, res) => {
    try {
        const snapshot = await db.collection('notes').get(); // Fetch all notes without conditions
        if (snapshot.empty) {
            return res.status(404).json({ message: 'No notes found' });
        }

        const notes = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

        // Fetch file URLs from Firebase Storage
        const signedUrls = await Promise.all(
            notes.map(async (note) => {
                try {
                    const file = bucket.file(note.filePath); // Ensure 'filePath' is correct
                    const [url] = await file.getSignedUrl({
                        action: 'read',
                        expires: '03-01-2025' // Set an appropriate expiration date
                    });
                    return { ...note, fileUrl: url }; // Append the signed URL to each note object
                } catch (error) {
                    console.error(`Error fetching signed URL for note ID ${note._id}:`, error.message);
                    return { ...note, fileUrl: null }; // If there's an error, return null for fileUrl
                }
            })
        );

        res.json(signedUrls); // Return the notes with their signed URLs
    } catch (error) {
        console.error('Error fetching all notes:', error); // Log full error
        res.status(500).send('Error fetching all notes');
    }
});



// Route to approve a note
app.post('/verify/approve/:id', async (req, res) => {
    const noteId = req.params.id;
    try {
        await db.collection('notes').doc(noteId).update({ approved: true });
        res.json({ message: 'Note approved successfully!' });
    } catch (error) {
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
        res.status(500).send('Error rejecting note');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
