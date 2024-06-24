const express = require('express');
const { addFLCoordinatingStaff } = require('../controllers/flCoordinatingStaffController');

const router = express.Router();

// Route to add FL Coordinating Staff
router.post('/add', addFLCoordinatingStaff);

module.exports = {routes:router};
