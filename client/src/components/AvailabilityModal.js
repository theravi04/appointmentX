import axios from 'axios';
import Cookies from 'js-cookie';
import { X } from 'lucide-react';  // Import the X icon from lucide-react

const AvailabilityModal = ({ isOpen, onClose, availability, provider, clientId }) => {
  if (!isOpen) return null;

  const handleBookSlot = async (slot, providerId, date) => {
    const token = Cookies.get('token');
    try {
      const response = await axios.post(
        'http://localhost:5000/api/appointments/bookAppointment',
        {
          providerId: provider,
          clientId,
          date,
          timeSlot: {
            startTime: slot.startTime,
            endTime: slot.endTime,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      onClose(); // Close the modal on successful booking
    } catch (error) {
      console.error('Error booking slot:', error);
      alert('Failed to book the slot.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full mx-auto p-6 overflow-y-auto max-h-[80vh]">
        
        {/* Header with Cross Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Available Dates and Slots</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 focus:outline-none"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {availability.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availability.map((avail) => (
              <div key={avail._id} className="p-4 bg-gray-50 rounded-lg shadow-md">
                <p className="text-lg font-medium text-gray-700">
                  <strong>Date:</strong> {new Date(avail.date).toLocaleDateString()}
                </p>
                <ul className="space-y-2 mt-2">
                  {avail.timeSlots.map((slot) => (
                    <li key={slot._id} className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm border-b border-gray-200">
                      <span className="text-gray-600">
                        <strong>Start:</strong> {slot.startTime} | <strong>End:</strong> {slot.endTime}
                      </span>
                      <button
                        onClick={() => handleBookSlot(slot, avail.providerId, avail.date)}
                        className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
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
          <p className="text-gray-600 text-center">No availability found.</p>
        )}

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AvailabilityModal;
