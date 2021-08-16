const firebase = require("firebase-admin");
const config = require("./config");

firebase.initializeApp({
    credential: firebase.credential.cert(config.firebaseConfig),
    databaseURL: config.databaseURL,
});

const DataBase = firebase.database();
module.exports = DataBase;