const {auth , firestore }= require('../db/db')
const { createUserWithEmailAndPassword, signInWithEmailAndPassword} = require('firebase/auth');
const { doc, setDoc, getDoc} = require('firebase/firestore')
const User = require('../models/UserModel')


const createUserProfile = async (userProfile) => {
    await setDoc(doc(firestore, 'profile', userProfile.uid), userProfile);
}


const register = async (req, res, next) => {
    try {
        const data = req.body;
        const { email, password, username, avatar } = data;

        if (!email || !password || !username) {
            res.status(400).send('Please provide an email, password and username');
            return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user) {
            res.status(401).send('Invalid credentials');
            return;
        }

        const userProfile = { uid: user.uid, username, email, role: 'user' };
        await createUserProfile(userProfile);

        res.status(200).json({
            success: true
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).send('Please provide a password and email');
            return;
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user) {
            res.status(401).send('Invalid credentials');
            return;
        }

        // Example: Fetching user profile data from Firestore
        const userDocRef = doc(firestore, 'profile', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            // Access settings or other user data here if needed
            res.status(200).json({
                success: true,
                userData: userData // Include additional user data if necessary
            });
        } else {
            res.status(404).send('User data not found');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).send(error.message);
    }
};

module.exports = { register, createUserProfile, login };
