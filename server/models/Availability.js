const mongoose = require('mongoose');

// Define a time slot sub-schema
const timeSlotSchema = new mongoose.Schema({
    startTime: {
        type: String, // Use a string for time (e.g., '14:00')
        required: true,
    },
    endTime: {
        type: String, // Use a string for time (e.g., '15:00')
        required: true,
    },
});

// Availability schema
const availabilitySchema = new mongoose.Schema({
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the User model
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    timeSlots: [timeSlotSchema], // Array of time slots
});

const Availability = mongoose.model('Availability', availabilitySchema);
module.exports = Availability;
