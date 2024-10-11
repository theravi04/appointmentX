const mongoose = require('mongoose');

// Appointment schema
const appointmentSchema = new mongoose.Schema({
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the User model
        required: true,
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the User model
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    timeSlot: {
        startTime: {
            type: String, // Use a string for time (e.g., '14:00')
            required: true,
        },
        endTime: {
            type: String, // Use a string for time (e.g., '15:00')
            required: true,
        },
    },
    description: {
        type: String,
        default: 'Booking for selected time slot',
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
