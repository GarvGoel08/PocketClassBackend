const admin = require('firebase-admin');

const serviceAccount = require('./pocketclass-751d6-firebase-adminsdk-m169y-4dcc4f2d40.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://pocketclass-751d6.firebaseio.com`,
});

const db = admin.firestore(); 

module.exports = { db };
