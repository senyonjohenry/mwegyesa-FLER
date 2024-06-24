const {firestore, auth} = require('../db/db')

const {addDoc, doc, setDoc, getDocs, getDoc, collection, deleteDoc} = require('firebase/firestore')

const addRM = async (req, res, next) => {
    try {
        const data = req.body;
        const relationshipManagersCollectionRef = collection(firestore, 'relationship_managers');
        const newRelationshipManagerRef = await addDoc(relationshipManagersCollectionRef, {
            name: data.name,
            email: data.email,
            phone: data.phone
        });

        res.send('Relationship manager added successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

module.exports = { addRM }