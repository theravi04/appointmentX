import React from "react";
import { Calendar, Clock, X } from "lucide-react";

const ProviderAvailability = ({ availability, deleteSlot }) => {
  if (!availability || availability.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <p className="text-lg text-gray-600">No availability found.</p>
        <p className="mt-2 text-sm text-gray-500">Add some time slots to get started!</p>
      </div>
    );
  }

  // Group availability by date
  const groupedAvailability = availability.reduce((acc, curr) => {
    const date = new Date(curr.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(curr);
    return acc;
  }, {});

  const handleRemoveTimeSlot = (date, timeSlotId) => {
    deleteSlot(date, timeSlotId)
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
        <Calendar className="mr-2 text-blue-500" />
        Your Availability
      </h2>
      {Object.entries(groupedAvailability).map(([date, slots]) => (
        <div key={date} className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3 text-gray-700">{date}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {slots.flatMap(slot => 
              slot.timeSlots.map((timeSlot, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center">
                    <Clock className="mr-2 text-green-500" size={18} />
                    <span className="text-sm">
                      {timeSlot.startTime} - {timeSlot.endTime}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveTimeSlot(slot.date, timeSlot._id)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label="Remove time slot"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProviderAvailability;