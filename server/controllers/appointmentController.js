const Availability = require("../models/Availability");
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
    const existingAvailability = await Availability.findOne({
      providerId,
      date,
    });

    if (existingAvailability) {
      // Append new timeSlots to the existing timeSlots
      existingAvailability.timeSlots = [
        ...existingAvailability.timeSlots,
        ...timeSlots,
      ];

      // Optionally, you can filter out duplicate time slots if needed
      existingAvailability.timeSlots = existingAvailability.timeSlots.filter(
        (slot, index, self) =>
          index ===
          self.findIndex(
            (s) => s.startTime === slot.startTime && s.endTime === slot.endTime
          )
      );

      await existingAvailability.save();
      return res.status(200).json({
        message: "Availability updated successfully",
        availability: existingAvailability,
      });
    } else {
      // If no availability exists for the given date, create a new one
      const newAvailability = new Availability({ providerId, date, timeSlots });
      await newAvailability.save();
      return res.status(201).json({
        message: "New availability created successfully",
        availability: newAvailability,
      });
    }
  } catch (error) {
    console.error("Error creating availability:", error);
    res.status(500).json({ message: "Error creating availability", error });
  }
};

// for provider to view his own availability
const providerAvailability = async (req, res) => {
  // const { providerId } = req.body;
  const { providerId } = req.query;
  try {
    const availabilityData = await Availability.find({ providerId });
    if (!availabilityData) {
      return res
        .status(404)
        .json({ message: "you didn't added your availability" });
    }
    res.json(availabilityData);
  } catch (error) {
    console.error("Error getting availability:", error);
    res.status(500).json({ message: "Error getting availability", error });
  }
};

// for provider to view his appointment with client
const getProviderAppointments = async (req, res) => {
  try {
    const { providerId } = req.query;
    const appointments = await Appointment.find({
      providerId
    });
    if (!appointments) {
      return res.status(404).json({ message: "you dont have any appointment" });
    }
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching provider appointments:", error);
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

// for client to book
const createAppointment = async (req, res) => {
    const { providerId, clientId, date, timeSlot } = req.body; // Expecting timeSlot object
  
    try {
      console.log(providerId, clientId, date, timeSlot);
      
      // Check if the requested time slot is available
      const availability = await Availability.findOne({
        providerId,
        date: new Date(date), // Ensure the date is in the correct format
        timeSlots: {
          $elemMatch: {
            startTime: { $lte: timeSlot.endTime },  // Check if requested slot overlaps
            endTime: { $gte: timeSlot.startTime },
          },
        },
      });
  
      if (!availability) {
        return res
          .status(400)
          .json({ message: "Selected time slot is not available." });
      }
  
      // Create the appointment
      const appointment = new Appointment({
        providerId,
        clientId,
        date,
        timeSlot, // Store the booked time slot
        description: "Booking for selected time slot", // Optional description
      });
  
      await appointment.save();
      res
        .status(201)
        .json({ message: "Appointment booked successfully", appointment });
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(500).json({ message: "Error creating appointment", error });
    }
  };
  
// const createAppointment = async (req, res) => {
//   const { providerId, clientId, date, timeSlot } = req.body; // Expecting timeSlot object

//   try {
//     console.log(providerId, clientId, date, timeSlot);
    
//     // Check if the requested time slot is available
//     const availability = await Availability.findOne({
//       providerId,
//       date,
//       timeSlots: {
//         $elemMatch: {
//           startTime: timeSlot.startTime,
//           endTime: timeSlot.endTime,
//         },
//       },
//     });

//     if (!availability) {
//       return res
//         .status(400)
//         .json({ message: "Selected time slot is not available." });
//     }

//     // Create the appointment
//     const appointment = new Appointment({
//       providerId,
//       clientId,
//       date,
//       timeSlot, // Store the booked time slot
//       description: "Booking for selected time slot", // Optional description
//     });

//     await appointment.save();
//     res
//       .status(201)
//       .json({ message: "Appointment booked successfully", appointment });
//   } catch (error) {
//     console.error("Error creating appointment:", error);
//     res.status(500).json({ message: "Error creating appointment", error });
//   }
// };

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

// Get appointments for a client
const getClientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      clientId: req.user._id,
    }).populate("providerId", "name email");
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching client appointments:", error);
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

module.exports = {
  createAvailability,
  providerAvailability,
  createAppointment,
  getProviderAppointments,
  getClientAppointments,
};
