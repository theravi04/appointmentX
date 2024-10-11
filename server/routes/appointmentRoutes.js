const express = require('express');
const {
    createAvailability,
    createAppointment,
    getProviderAppointments,
    getClientAppointments,
} = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Provider adds their availability
router.post('/availability', authMiddleware, createAvailability);

// Client books an appointment
router.post('/bookAppointment', authMiddleware, createAppointment);

// Get appointments for a provider
router.get('/provider', authMiddleware, getProviderAppointments);

// Get appointments for a client
router.get('/client', authMiddleware, getClientAppointments);

module.exports = router;
