import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AddAvailability = ({ userId }) => {
  const [date, setDate] = useState('');
  const [timeSlots, setTimeSlots] = useState([{ startTime: '', endTime: '' }]); // Array of objects to hold startTime and endTime

  // Handle change for start and end times
  const handleTimeSlotChange = (index, field, value) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index][field] = value;
    setTimeSlots(newTimeSlots);
  };

  // Add a new time slot (with startTime and endTime fields)
  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, { startTime: '', endTime: '' }]);
  };

  // Submit the availability form
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userId);
    console.log(date);
    console.log(timeSlots);
    const token = Cookies.get('token');
        console.log(token);
    
    try {
      const response = await axios.post('http://localhost:5000/api/appointments/availability', {
        providerId: userId,
        date,
        timeSlots,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`  // Add the token to the headers
        }
      }
    );
      alert('Availability added successfully');
      console.log(response.data);
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
