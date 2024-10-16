import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

const ViewAppointments = ({ userId }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = Cookies.get("token");
      console.log(token);
      try {
        // Fetch provider appointments
        const response = await axios.get(
          "http://localhost:5000/api/appointments/provider",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the headers
            },
            params: { providerId: userId }, // Pass providerId as a query parameter
          }
        );

        // Initialize an array to hold enriched appointments
        const enrichedAppointments = await Promise.all(response.data.map(async (appointment) => {
          // Fetch client details using the clientId
          const clientResponse = await axios.get(
            `http://localhost:5000/api/auth/profile`, // Update this URL based on your actual endpoint
            {
              params: {
                userId: appointment.clientId, // Pass the clientId here
              },
            }
          );

          // Return a new appointment object with client details
          return {
            ...appointment,
            client: clientResponse.data, // Assuming the response contains the user object with name and email
          };
        }));

        setAppointments(enrichedAppointments); // Set the enriched appointments
        console.log(enrichedAppointments); // Log the enriched appointments

      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [userId]);

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
      {appointments.length > 0 ? (
        <ul className="list-disc list-inside">
          {appointments.map((appointment) => (
            <li key={appointment._id} className="mb-4">
              <div>
                <strong>Client Name:</strong> {appointment.client.name || "N/A"}
              </div>
              <div>
                <strong>Client Email:</strong> {appointment.client.email || "N/A"}
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

export default ViewAppointments;
