import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AddAvailability = ({ userId, onAvailabilityUpdate }) => {
  const [date, setDate] = useState('');
  const [timeSlots, setTimeSlots] = useState([{ startTime: '', endTime: '' }]);

  const handleTimeSlotChange = (index, field, value) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index][field] = value;
    setTimeSlots(newTimeSlots);
  };

  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, { startTime: '', endTime: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('token');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/appointments/availability',
        {
          providerId: userId,
          date,
          timeSlots,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // log(response.message);
      console.log(response);
      console.log("message : ",response.data.message);
      
      alert(response.data.message);
      onAvailabilityUpdate(); // Trigger the parent to fetch new availability
    } catch (error) {
      console.error('Error adding availability:', error);
      alert('Adding failed. Please try again.');
    }
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Add Availability</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-gray-600">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-gray-600">Time Slots:</label>
          {timeSlots.map((slot, index) => (
            <div key={index} className="flex space-x-2 mb-3">
              <input
                type="time"
                value={slot.startTime}
                onChange={(e) => handleTimeSlotChange(index, 'startTime', e.target.value)}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="time"
                value={slot.endTime}
                onChange={(e) => handleTimeSlotChange(index, 'endTime', e.target.value)}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddTimeSlot}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Add Time Slot
          </button>
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mt-4"
        >
          Submit Availability
        </button>
      </form>
    </div>
  );
};

export default AddAvailability;
