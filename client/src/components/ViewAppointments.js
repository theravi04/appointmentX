import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { Calendar, Clock, User, Mail, FileText, X } from 'lucide-react';

const ViewAppointments = ({ userId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    const token = Cookies.get("token");
    try {
      setLoading(true);
      const response = await axios.get(
        "https://appointmentx.onrender.com/api/appointments/provider",
        // "http://localhost:5000/api/appointments/provider",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { providerId: userId },
        }
      );

      const enrichedAppointments = await Promise.all(response.data.map(async (appointment) => {
        const clientResponse = await axios.get(
          `https://appointmentx.onrender.com/api/auth/profile`,
          // `http://localhost:5000/api/auth/profile`,
          {
            params: { userId: appointment.clientId },
          }
        );

        return {
          ...appointment,
          client: clientResponse.data,
        };
      }));

      setAppointments(enrichedAppointments);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to fetch appointments. Please try again later.");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAppointments();
  }, [userId, fetchAppointments]);

  const handleRemoveAppointment = async (appointmentId) => {
    const token = Cookies.get("token");
    console.log(appointmentId);
    
    try {
      await axios.delete(
        `https://appointmentx.onrender.com/api/appointments/deleteAppointmentByProvider`,
        // `http://localhost:5000/api/appointments/deleteAppointmentByProvider`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data:{
            appointmentId,
          }
        }
      );
      // Remove the appointment from the state
      setAppointments(appointments.filter(app => app._id !== appointmentId));
    } catch (error) {
      console.error("Error removing appointment:", error);
      // You might want to show an error message to the user here
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading appointments...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">My Appointments</h2>
      {appointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 relative">
              <button
                onClick={() => handleRemoveAppointment(appointment._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 focus:outline-none"
                aria-label="Remove appointment"
              >
                <X size={18} />
              </button>
              <div className="flex items-center mb-2">
                <User className="mr-2 text-blue-500" size={18} />
                <span className="font-medium">{appointment.client.name || "N/A"}</span>
              </div>
              <div className="flex items-center mb-2">
                <Mail className="mr-2 text-green-500" size={18} />
                <span>{appointment.client.email || "N/A"}</span>
              </div>
              <div className="flex items-center mb-2">
                <Calendar className="mr-2 text-purple-500" size={18} />
                <span>{new Date(appointment.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center mb-2">
                <Clock className="mr-2 text-orange-500" size={18} />
                <span>{appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}</span>
              </div>
              <div className="flex items-start mt-2">
                <FileText className="mr-2 text-gray-500 mt-1" size={18} />
                <span className="text-sm text-gray-600">{appointment.description}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No appointments found.</p>
      )}
    </div>
  );
};

export default ViewAppointments;