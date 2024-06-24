const express = require('express')
const {addReport, getReport, deleteReport, findReportById, updateReport, getReportByEvent, getAllReports} = require('../controllers/ReportController')
const router = express.Router()

router.post('/add', addReport)
// router.get('/get', getReport)
// router.delete('/delete/:id', deleteReport)
// router.get('/:id', findReportById)
// router.put('/update/:id', updateReport)
// router.get('/getByEvent/:eventId', getReportByEvent)
// router.get('/getAllReports', getAllReports)

module.exports = {
    routes: router
}