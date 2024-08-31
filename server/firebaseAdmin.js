// Test Firestore Query (separate script)
const admin = require('firebase-admin');

const serviceAccount = require('./cybsor-firebase-adminsdk-gb55e-6efb6131ea.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function testFirestoreQuery() {
    try {
        const snapshot = await db.collection('notes').where('approved', '==', false).get();
        if (snapshot.empty) {
            console.log('No pending notes found');
        } else {
            snapshot.docs.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
            });
        }
    } catch (error) {
        console.error('Error fetching notes:', error);
    }
}

testFirestoreQuery();
