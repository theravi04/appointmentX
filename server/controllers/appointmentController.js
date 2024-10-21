const Availability = require("../models/Availability");
const Appointment = require("../models/Appointment");

// The provider adds their availability
const createAvailability = async (req, res) => {
  const { providerId, date, timeSlots } = req.body; // timeSlots is an array of time slots

  try {
    const existingAvailability = await Availability.findOne({ providerId, date });

    if (existingAvailability) {
      // Find existing time slots to compare with the new time slots
      const existingTimeSlots = existingAvailability.timeSlots.map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
      }));

      // Check for duplicates in the new time slots
      const duplicates = timeSlots.filter(newSlot =>
        existingTimeSlots.some(existingSlot =>
          existingSlot.startTime === newSlot.startTime && existingSlot.endTime === newSlot.endTime
        )
      );

      // If there are duplicates, return a message indicating that
      if (duplicates.length > 0) {
        return res.status(409).json({
          message: "Some time slots already exist.",
          duplicates: duplicates, // Optionally send the duplicate time slots
        });
      }

      // If no duplicates, append new time slots to the existing time slots
      existingAvailability.timeSlots = [
        ...existingAvailability.timeSlots,
        ...timeSlots,
      ];

      // Optionally filter out duplicate time slots again
      existingAvailability.timeSlots = existingAvailability.timeSlots.filter(
        (slot, index, self) =>
          index === self.findIndex(
            (s) => s.startTime === slot.startTime && s.endTime === slot.endTime
          )
      );

      await existingAvailability.save();
      return res.status(200).json({
        message: "Availability updated successfully.",
        availability: existingAvailability,
      });
    } else {
      // If no availability exists for the given date, create a new one
      const newAvailability = new Availability({ providerId, date, timeSlots });
      await newAvailability.save();
      return res.status(201).json({
        message: "New availability created successfully.",
        availability: newAvailability,
      });
    }
  } catch (error) {
    console.error("Error creating availability:", error);
    res.status(500).json({ message: "Error creating availability", error });
  }
};


// delete availability of the provided which he already added
const deleteAvailability = async (req, res) => {
  const { providerId, slotId } = req.body; // Ensure these are extracted from req.body

  try {
    console.log(slotId); // This should now log the correct slotId
    
    const existingAvailability = await Availability.findOne({ providerId, "timeSlots._id": slotId });

    if (!existingAvailability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    // Filter out the time slot by its _id (slotId)
    const updatedTimeSlots = existingAvailability.timeSlots.filter(
      (slot) => slot._id.toString() !== slotId
    );

    // Update the time slots in the existing availability
    existingAvailability.timeSlots = updatedTimeSlots;

    // Save the updated availability
    await existingAvailability.save();

    return res.status(200).json({
      message: "Time slot removed successfully",
      availability: existingAvailability,
    });
  } catch (error) {
    console.error("Error deleting time slot:", error);
    res.status(500).json({ message: "Error deleting time slot", error });
  }
};


// delete appointment from provdier
const deleteAppointmentByProvider = async (req, res) => {
  const { appointmentId } = req.body; // Extract appointmentId from req.body

  try {
    console.log("Request Body:", req.body); // Log the request body

    // Ensure appointmentId is used with the correct field name
    const appointmentProvider = await Appointment.findOneAndDelete({ _id: appointmentId });

    if (!appointmentProvider) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // If found and deleted, return the deleted object
    return res.status(200).json({
      message: "Appointment removed successfully",
      deletedAppointment: appointmentProvider,
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ message: "Error deleting appointment", error });
  }
};
const deleteAppointmentByClient = async (req, res) => {
  const { appointmentId } = req.body; // Extract appointmentId from req.body

  try {
    console.log("Request Body:", req.body); // Log the request body

    // Ensure appointmentId is used with the correct field name
    const appointmentProvider = await Appointment.findOneAndDelete({ _id: appointmentId });

    if (!appointmentProvider) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // If found and deleted, return the deleted object
    return res.status(200).json({
      message: "Appointment removed successfully",
      deletedAppointment: appointmentProvider,
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ message: "Error deleting appointment", error });
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
  deleteAvailability,
  deleteAppointmentByProvider,
  deleteAppointmentByClient,
};
