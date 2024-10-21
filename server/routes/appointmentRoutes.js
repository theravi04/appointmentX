const express = require('express');
const {
    createAvailability,
    providerAvailability,
    createAppointment,
    getProviderAppointments,
    getClientAppointments,
    deleteAvailability,
    deleteAppointmentByProvider,
    deleteAppointmentByClient
} = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Provider adds their availability
router.post('/availability', authMiddleware, createAvailability);

// provider check his availability
// for the client ot check the persons availability
router.get('/providerAvailability', providerAvailability);

// Client books an appointment
router.post('/bookAppointment', authMiddleware, createAppointment);

// Get appointments for a provider
router.get('/provider', authMiddleware, getProviderAppointments);

// Get appointments for a client
router.get('/client', authMiddleware, getClientAppointments);

router.delete('/deleteAvailability', authMiddleware, deleteAvailability);

router.delete('/deleteAppointmentByProvider',authMiddleware, deleteAppointmentByProvider);

router.delete('/deleteAppointmentByClient',authMiddleware, deleteAppointmentByClient);

module.exports = router;
