import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ClientAppointment = ({ userId }) => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = Cookies.get('token'); // Get the token from cookies
      try {
        const response = await axios.get('http://localhost:5000/api/appointments/client', {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the headers
          },
          params: { clientId: userId }, // Pass clientId as a query parameter
        });
        setAppointments(response.data); // Set appointments to the response data
      } catch (error) {
        console.error('Error fetching client appointments:', error);
        setError('Failed to load appointments'); // Set error message
      }
    };

    fetchAppointments();
  }, [userId]); // Fetch appointments whenever userId changes

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
      {error && <p className="text-red-500">{error}</p>} {/* Display error if any */}
      {appointments.length > 0 ? (
        <ul className="list-disc list-inside">
          {appointments.map((appointment) => (
            <li key={appointment._id} className="mb-4">
              <div>
                <strong>Provider Name:</strong> {appointment.providerId.name || "N/A"}
              </div>
              <div>
                <strong>Provider Email:</strong> {appointment.providerId.email || "N/A"}
              </div>
              <div>
                <strong>Appointment Date:</strong> {new Date(appointment.date).toLocaleDateString()}
              </div>
              <div>
                <strong>Time Slot:</strong> {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
              </div>
              <div>
                <strong>Description:</strong> {appointment.description}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No appointments found.</p>
      )}
    </div>
  );
};

export default ClientAppointment;
