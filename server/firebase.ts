const admin = require('firebase-admin');
const serviceAccount = require('./config/p4p-disaster-news-firebase-adminsdk-bj3fv-ff12061545.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
module.exports = firestore;
