const {firestore, auth} = require('../db/db')
const {addDoc, doc, setDoc, getDocs, getDoc, collection, deleteDoc} = require('firebase/firestore')

const addReport = async (req, res, next) => {
    try {
        const data = req.body;
        const {details, eventID, generatedDate} = data;

        if(!details || !eventID || !generatedDate){
            return res.status(400).send('Please provide all required fields')
        }
        
        const reportCollectionRef = collection(firestore, 'reports');
        if (!reportCollectionRef) {
            return res.status(404).send('Collection not found');
        }
        const newReportRef = await addDoc(reportCollectionRef, {
            details,
            eventID,
            generatedDate
        });

        return res.status(200).send('Report added successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = { addReport }