const Availability =  require("../models/Availability");
const Appointment = require("../models/Appointment");

// The provider adds their availability
const createAvailability = async (req, res) => {
    const { providerId, date, timeSlots } = req.body; // timeSlots is an array of time slots
    // Create an availability object
    const availability = {
        providerId,
        date,
        timeSlots,
    };
    
    try {
        const addAvailability = new Availability(availability);
        await addAvailability.save();
        res.status(201).json({ message: 'Provider added their availability', availability: addAvailability });
    } catch (error) {
        console.error('Error creating availability:', error);
        res.status(500).json({ message: 'Error creating availability', error });
    }
};

const createAppointment = async (req, res) => {
    const { providerId, clientId, date, timeSlot } = req.body; // Expecting timeSlot object

    try {
        // Check if the requested time slot is available
        const availability = await Availability.findOne({
            providerId,
            date,
            timeSlots: {
                $elemMatch: {
                    startTime: timeSlot.startTime,
                    endTime: timeSlot.endTime
                }
            }
        });

        if (!availability) {
            return res.status(400).json({ message: 'Selected time slot is not available.' });
        }

        // Create the appointment
        const appointment = new Appointment({
            providerId,
            clientId,
            date,
            timeSlot, // Store the booked time slot
            description: 'Booking for selected time slot', // Optional description
        });

        await appointment.save();
        res.status(201).json({ message: 'Appointment booked successfully', appointment });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'Error creating appointment', error });
    }
};

// Create a new appointment by booking a specific time slot
// const createAppointment = async (req, res) => {
//     const { providerId, clientId, date, timeSlot } = req.body; // Expecting timeSlot object

//     try {
//         // Check if the requested time slot is available
//         const availability = await Availability.findOne({
//             providerId,
//             date,
//             'timeSlots.startTime': timeSlot.startTime,
//             'timeSlots.endTime': timeSlot.endTime,
//         });
//         console.log('Searching for availability with:', {
//             providerId,
//             date,
//             'timeSlots.startTime': timeSlot.startTime,
//             'timeSlots.endTime': timeSlot.endTime,
//         });
        

//         if (!availability) {
//             return res.status(400).json({ message: 'Selected time slot is not available.' });
//         }

//         // Create the appointment
//         const appointment = new Appointment({
//             providerId,
//             clientId,
//             date,
//             timeSlot, // Store the booked time slot
//             description: 'Booking for selected time slot', // Optional description
//         });

//         await appointment.save();
//         res.status(201).json({ message: 'Appointment booked successfully', appointment });
//     } catch (error) {
//         console.error('Error creating appointment:', error);
//         res.status(500).json({ message: 'Error creating appointment', error });
//     }
// };

// Get appointments for a provider
const getProviderAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ providerId: req.user._id }).populate('clientId', 'name email');
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching provider appointments:', error);
        res.status(500).json({ message: 'Error fetching appointments', error });
    }
};

// Get appointments for a client
const getClientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ clientId: req.user._id }).populate('providerId', 'name email');
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching client appointments:', error);
        res.status(500).json({ message: 'Error fetching appointments', error });
    }
};

module.exports = { createAvailability, createAppointment, getProviderAppointments, getClientAppointments };
