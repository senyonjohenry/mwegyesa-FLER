const express = require('express')
const {addEvent, getEvent, removeEvent, findEventById, addEventWithRMs, downloadEvents} = require('../controllers/eventController')

const router = express.Router()

router.post('/add', addEvent)
router.get('/get', getEvent)
router.delete('/delete/:id', removeEvent)
router.get('/download-events', downloadEvents)
// router.get('/:id', findEventById)
// router.post('/addWithRMs', addEventWithRMs)
module.exports = {
    routes: router
}