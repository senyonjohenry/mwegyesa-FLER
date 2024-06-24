const { auth, firestore } = require('../db/db');
const { addDoc, doc, setDoc, getDocs, getDoc, collection, updateDoc, deleteDoc } = require('firebase/firestore');
const Event = require('../models/Events');
const {  Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

const createEvent = async (event) => {
    await setDoc(doc(firestore, 'events', event.uid), event);
};

const addEvent = async (req, res, next) => {
    try {
        const data = req.body;
        const eventsCollectionRef = collection(firestore, 'events');
        const newEventRef = await addDoc(eventsCollectionRef, {
            eventName: data.eventName,
            eventDate: data.eventDate,
            deliveryMode: data.deliveryMode,
            details: data.details,
            contactPersonDesignation: data.contactPersonDesignation,
            contactPersonPhoneNumber: data.contactPersonPhoneNumber,
            flProgramName: data.flProgramName
        });

        // Fetch selected relationship managers from the relationship_managers collection
        const relationshipManagerIds = data.relationshipManagerIds || [];
        const relationshipManagersArray = [];

        for (const managerId of relationshipManagerIds) {
            const relationshipManagerDocRef = doc(firestore, `relationship_managers/${managerId}`);
            const relationshipManagerDocSnapshot = await getDoc(relationshipManagerDocRef);

            if (relationshipManagerDocSnapshot.exists()) {
                relationshipManagersArray.push({
                    managerId: managerId,
                    name: relationshipManagerDocSnapshot.data().name,
                    email: relationshipManagerDocSnapshot.data().email,
                    phone: relationshipManagerDocSnapshot.data().phone
                });
            }
        }

        // Create a subcollection for relationship managers
        const relationshipManagersCollectionRef = collection(firestore, `events/${newEventRef.id}/relationship_managers`);

        // Add relationship managers to the event's subcollection
        for (const manager of relationshipManagersArray) {
            await addDoc(relationshipManagersCollectionRef, {
                managerId: manager.managerId,
                name: manager.name,
                email: manager.email,
                phone: manager.phone
            });
        }

        // Fetch selected FL Coordinating Staff from the fl_coordinating_staff collection
        const flCoordinatingStaffIds = data.flCoordinatingStaffIds || [];
        const flCoordinatingStaffArray = [];

        for (const staffId of flCoordinatingStaffIds) {
            const flCoordinatingStaffDocRef = doc(firestore, `fl_coordinating_staff/${staffId}`);
            const flCoordinatingStaffDocSnapshot = await getDoc(flCoordinatingStaffDocRef);

            if (flCoordinatingStaffDocSnapshot.exists()) {
                flCoordinatingStaffArray.push({
                    staffId: staffId,
                    name: flCoordinatingStaffDocSnapshot.data().name,
                    email: flCoordinatingStaffDocSnapshot.data().email,
                    phone: flCoordinatingStaffDocSnapshot.data().phone
                });
            }
        }

        // Create a subcollection for FL Coordinating Staff
        const flCoordinatingStaffCollectionRef = collection(firestore, `events/${newEventRef.id}/fl_coordinating_staff`);

        // Add FL Coordinating Staff to the event's subcollection
        for (const staff of flCoordinatingStaffArray) {
            await addDoc(flCoordinatingStaffCollectionRef, {
                staffId: staff.staffId,
                name: staff.name,
                email: staff.email,
                phone: staff.phone
            });
        }

        res.send('Record saved successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const getEvent = async (req, res, next) => {
    try {
        const eventsCollectionRef = collection(firestore, 'events');
        const snapshot = await getDocs(eventsCollectionRef);

        if (snapshot.empty) {
            res.status(404).send("NOT FOUND");
            return;
        }

        const eventsArray = [];

        snapshot.forEach(async (eventDoc) => {
            const event = {
                eventId: eventDoc.id,
                deliveryMode: eventDoc.data().deliveryMode,
                details: eventDoc.data().details,
                eventDate: eventDoc.data().eventDate,
                eventName: eventDoc.data().eventName,
                contactPersonDesignation: eventDoc.data().contactPersonDesignation,
                contactPersonPhoneNumber: eventDoc.data().contactPersonPhoneNumber,
                flProgramName: eventDoc.data().flProgramName
            };

            if (!event) {
                res.status(404).send("NOT FOUND");
                return;
            }

            // Get relationship managers for the event
            const relationshipManagersCollectionRef = collection(firestore, `events/${eventDoc.id}/relationship_managers`);
            const relationshipManagersSnapshot = await getDocs(relationshipManagersCollectionRef);

            if (!relationshipManagersSnapshot.empty) {
                const relationshipManagersArray = [];

                relationshipManagersSnapshot.forEach((managerDoc) => {
                    const manager = {
                        managerId: managerDoc.id,
                        name: managerDoc.data().name,
                        email: managerDoc.data().email,
                        phone: managerDoc.data().phone,
                    };
                    relationshipManagersArray.push(manager);
                });

                event.relationshipManagers = relationshipManagersArray;
            } else {
                event.relationshipManagers = [];
            }

            // Get FL Coordinating Staff for the event
            const flCoordinatingStaffCollectionRef = collection(firestore, `events/${eventDoc.id}/fl_coordinating_staff`);
            const flCoordinatingStaffSnapshot = await getDocs(flCoordinatingStaffCollectionRef);

            if (!flCoordinatingStaffSnapshot.empty) {
                const flCoordinatingStaffArray = [];

                flCoordinatingStaffSnapshot.forEach((staffDoc) => {
                    const staff = {
                        staffId: staffDoc.id,
                        name: staffDoc.data().name,
                        email: staffDoc.data().email,
                        phone: staffDoc.data().phone,
                    };
                    flCoordinatingStaffArray.push(staff);
                });

                event.flCoordinatingStaff = flCoordinatingStaffArray;
            } else {
                event.flCoordinatingStaff = [];
            }

            eventsArray.push(event);
        });

        res.status(200).send(eventsArray);
    } catch (error) {
        console.error('Error getting events:', error);
        res.status(400).send(error.message);
    }
};

const deleteEvent = async (eventId) => {
    try {
        const eventDocRef = doc(firestore, 'events', eventId);
        await deleteDoc(eventDocRef);
        console.log(`Event with ID ${eventId} deleted successfully.`);
    } catch (error) {
        console.error('Error deleting event:', error);
        throw new Error('Error deleting event');
    }
};

const removeEvent = async (req, res, next) => {
    try {
        const eventId = req.params.id;

        if (!eventId) {
            res.status(400).send("Event ID is required");
            return;
        }

        await deleteEvent(eventId);

        res.status(200).send(`Event with ID ${eventId} deleted successfully`);
    } catch (error) {
        console.error('Error in removeEvent:', error);
        res.status(400).send(error.message);
    }
};

// Function to fetch all events and convert them to CSV format
const fetchEventsAndConvertToCSV = async () => {
    try {
        const eventsCollectionRef = collection(firestore, 'events');
        const snapshot = await getDocs(eventsCollectionRef);
 
        if (snapshot.empty) {
            throw new Error('No events found');
        }
 
        const eventsArray = [];
 
        snapshot.forEach(eventDoc => {
            const eventData = eventDoc.data();
            eventsArray.push({
                eventId: eventDoc.id,
                eventName: eventData.eventName,
                eventDate: eventData.eventDate,
                deliveryMode: eventData.deliveryMode,
                details: eventData.details,
                contactPersonDesignation: eventData.contactPersonDesignation,
                contactPersonPhoneNumber: eventData.contactPersonPhoneNumber,
                flProgramName: eventData.flProgramName
                // Add more fields as needed
            });
        });
 
        // Convert JSON to CSV format using json2csv.Parser
        const json2csvParser = new Parser({ fields: Object.keys(eventsArray[0]) });
        const csv = json2csvParser.parse(eventsArray);
 
        // Write CSV to a file (temporarily store in memory or write to disk)
        const filePath = path.join(__dirname, 'events.csv');
        fs.writeFileSync(filePath, csv);
 
        return filePath;
    } catch (error) {
        throw new Error(`Error converting events to CSV: ${error.message}`);
    }
};

// Controller function to initiate download
const downloadEvents = async (req, res, next) => {
    try {
        const filePath = await fetchEventsAndConvertToCSV();
 
        // Send the file as a download to the client
        res.download(filePath, 'events.csv', (err) => {
            if (err) {
                throw new Error('Error downloading file');
            }
 
            // Clean up: delete the temporary file after sending
            fs.unlinkSync(filePath);
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};
 

module.exports = { addEvent, getEvent, removeEvent, downloadEvents};
