const express = require('express')
const {addRM} = require('../controllers/rmController')


const router = express.Router()
router.post('/add', addRM)

module.exports = {  
    routes: router
}