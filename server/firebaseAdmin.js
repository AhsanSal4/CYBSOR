// firebaseAdmin.js
const admin = require('firebase-admin');

// Replace with the path to your service account key JSON file
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'notetrove-9f4e6.appspot.com' // Your Storage bucket name
});

const bucket = admin.storage().bucket();

module.exports = bucket;
