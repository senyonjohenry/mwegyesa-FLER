const express = require('express');
const {
    addParticipantsToEvent,
    getParticipant,
    updateParticipant,
    deleteParticipant
} = require('../controllers/participantController');

const router = express.Router();

// Route to add multiple participants to an event
router.post('/:eventId/add', addParticipantsToEvent);

// Route to get a specific participant from an event
router.get('/:eventId/get/:participantId', getParticipant);

// Route to update a specific participant in an event
router.put('/:eventId/update/:participantId', updateParticipant);

// Route to delete a specific participant from an event
router.delete('/:eventId/delete/:participantId', deleteParticipant);

module.exports = { routes: router };
