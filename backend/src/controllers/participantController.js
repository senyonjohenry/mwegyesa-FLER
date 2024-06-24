const { firestore } = require('../db/db');
const { addDoc, collection, doc, getDoc, updateDoc, deleteDoc, writeBatch } = require('firebase/firestore');

// Add multiple participants to an event
const addParticipantsToEvent = async (req, res, next) => {
    try {
        const eventId = req.params.eventId;
        const participants = req.body;

        // Ensure the event exists
        const eventDocRef = doc(firestore, 'events', eventId);
        const eventDocSnapshot = await getDoc(eventDocRef);

        if (!eventDocSnapshot.exists()) {
            return res.status(404).send("Event not found");
        }

        const participantsCollectionRef = collection(eventDocRef, 'registered_participants');

        // Create a batch to perform multiple writes
        const batch = writeBatch(firestore);

        participants.forEach(participant => {
            // Check if the participant is a member
            if (participant.isMember) {
                // Only members should have NSSFNumber and photo
                if (!participant.NSSFNumber || !participant.photo) {
                    throw new Error('NSSFNumber and photo are required for members');
                }
            } else {
                // Non-members should not have NSSFNumber and photo
                delete participant.NSSFNumber;
                delete participant.photo;
            }

            const newParticipantRef = doc(participantsCollectionRef);

            batch.set(newParticipantRef, {
                phoneContact: participant.phoneContact,
                email: participant.email,
                mothersName: participant.mothersName,
                lastEmployer: participant.lastEmployer,
                dateOfBirth: participant.dateOfBirth,
                NIN: participant.NIN,
                isMember: participant.isMember,
                NSSFNumber: participant.NSSFNumber || null,
                photo: participant.photo || null
            });
        });

        await batch.commit();

        res.send('Participants added to event successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Get a specific participant from an event
const getParticipant = async (req, res, next) => {
    try {
        const eventId = req.params.eventId;
        const participantId = req.params.participantId;

        // Ensure the event exists
        const eventDocRef = doc(firestore, 'events', eventId);
        const eventDocSnapshot = await getDoc(eventDocRef);

        if (!eventDocSnapshot.exists()) {
            return res.status(404).send("Event not found");
        }

        const participantDocRef = doc(eventDocRef, 'registered_participants', participantId);
        const participantDocSnapshot = await getDoc(participantDocRef);

        if (!participantDocSnapshot.exists()) {
            return res.status(404).send("Participant not found");
        }

        res.send(participantDocSnapshot.data());
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Update a specific participant in an event
const updateParticipant = async (req, res, next) => {
    try {
        const eventId = req.params.eventId;
        const participantId = req.params.participantId;
        const data = req.body;

        // Ensure the event exists
        const eventDocRef = doc(firestore, 'events', eventId);
        const eventDocSnapshot = await getDoc(eventDocRef);

        if (!eventDocSnapshot.exists()) {
            return res.status(404).send("Event not found");
        }

        const participantDocRef = doc(eventDocRef, 'registered_participants', participantId);
        const participantDocSnapshot = await getDoc(participantDocRef);

        if (!participantDocSnapshot.exists()) {
            return res.status(404).send("Participant not found");
        }

        await updateDoc(participantDocRef, data);

        res.send('Participant updated successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Delete a specific participant from an event
const deleteParticipant = async (req, res, next) => {
    try {
        const eventId = req.params.eventId;
        const participantId = req.params.participantId;

        // Ensure the event exists
        const eventDocRef = doc(firestore, 'events', eventId);
        const eventDocSnapshot = await getDoc(eventDocRef);

        if (!eventDocSnapshot.exists()) {
            return res.status(404).send("Event not found");
        }

        const participantDocRef = doc(eventDocRef, 'registered_participants', participantId);

        await deleteDoc(participantDocRef);

        res.send('Participant deleted successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

module.exports = {
    addParticipantsToEvent,
    getParticipant,
    updateParticipant,
    deleteParticipant
};
