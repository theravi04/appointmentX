import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AvailabilityModal = ({ isOpen, onClose, availability, provider, clientId }) => {
    console.log(provider, clientId);
    
  if (!isOpen) return null; // Don't render if modal is not open

  // Function to handle booking a slot
  const handleBookSlot = async (slot, providerId, date) => {
    const token = Cookies.get('token'); // Get the token from cookies
    try {
      // Make a POST request to book the appointment
      const response = await axios.post('http://localhost:5000/api/appointments/bookAppointment', {
        providerId: provider,
        clientId,
        date: date, // Assuming you pass today's date or use avail.date
        timeSlot: {
          startTime: slot.startTime,
          endTime: slot.endTime,
        },
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      console.log(response.data); // Log success message
      // Optionally, close the modal or show a success message
      onClose();
    } catch (error) {
      console.error("Error booking slot:", error);
      alert("Failed to book the slot."); // Display error message
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Available Dates and Slots</h2>
        {availability.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availability.map((avail) => (
              <div key={avail._id} className="p-4 border border-gray-200 rounded-lg shadow">
                <p className="text-lg">
                  <strong>Date:</strong> {new Date(avail.date).toLocaleDateString()}
                </p>
                <ul className="space-y-2 mt-2">
                  {avail.timeSlots.map((slot) => (
                    <li key={slot._id} className="flex justify-between items-center p-2 border-b border-gray-200">
                      <span>
                        <strong>Start:</strong> {slot.startTime} | <strong>End:</strong> {slot.endTime}
                      </span>
                      <button
                        onClick={() => handleBookSlot(slot, avail.providerId, avail.date)} // Pass providerId here
                        className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Book Slot
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>No availability found.</p>
        )}
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Close
        </button>
      </div>
    </div>
  );
};

export default AvailabilityModal;
