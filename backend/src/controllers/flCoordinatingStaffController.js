const { firestore } = require('../db/db');
const { addDoc, collection } = require('firebase/firestore');

const addFLCoordinatingStaff = async (req, res, next) => {
    try {
        const data = req.body;
        const flCoordinatingStaffCollectionRef = collection(firestore, 'fl_coordinating_staff');
        await addDoc(flCoordinatingStaffCollectionRef, {
            name: data.name,
            email: data.email,
            phone: data.phone
        });

        res.send('FL Coordinating Staff added successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

module.exports = { addFLCoordinatingStaff };
