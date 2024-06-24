// firebase.js (or wherever you initialize Firebase)
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');
// const firebaseConfig = require('../config/config');
const firebaseConfig = {
    apiKey: "AIzaSyCniySBR2sN0WB1864XOLSojI0134G4xXA",
    authDomain: "fler-498d0.firebaseapp.com",
    projectId: "fler-498d0",
    storageBucket: "fler-498d0.appspot.com",
    messagingSenderId: "746151676303",
    appId: "1:746151676303:web:f1bcb9d51da7e8281da3fa"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

module.exports = { auth, firestore };
