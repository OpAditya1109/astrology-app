// Backend/firebaseAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-service-account.json"); // path to your secret key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
