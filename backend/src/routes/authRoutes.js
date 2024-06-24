const express = require('express')
const { register, createUserProfile, login, logout,} = require('../controllers/authController')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
// router.get('/logout', logout)


module.exports = {
    routes: router
}