import React, { useEffect, useState } from "react";
import axios from "axios";

import Cookies from 'js-cookie';

const ProviderAvailability = ({ userId }) => {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailability = async () => {
        const token = Cookies.get('token');
        console.log(token);
      try {
        // Make a GET request to fetch provider availability
        const response = await axios.get('http://localhost:5000/api/appointments/providerAvailability', {
            headers: {
                Authorization: `Bearer ${token}`  // Add the token to the headers
              },
          params: { providerId: userId } // Pass providerId as a query parameter
        });
        console.log(response);
        console.log(response.data);
        
        setAvailability(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching provider availability:", err);
        setError("Failed to fetch availability data.");
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [userId]);

  if (loading) return <div>Loading availability data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Availability</h2>
      {availability.length > 0 ? (
        availability.map((avail, index) => (
          <div key={index} className="mb-6">
            <p className="text-lg mb-4">
              <strong>Date:</strong> {new Date(avail.date).toLocaleDateString()} {/* Format the date */}
            </p>
            <ul className="space-y-2">
              {avail.timeSlots.map((slot, slotIndex) => (
                <li key={slotIndex} className="p-2 border-b border-gray-200">
                  <strong>Start:</strong> {slot.startTime} | <strong>End:</strong> {slot.endTime}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No availability found.</p>
      )}
    </div>
  );
};

export default ProviderAvailability;
