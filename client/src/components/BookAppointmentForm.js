import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ClientAppointment from './ClientAppointment';
import AvailabilityModal from './AvailabilityModal'; // Import the modal component

const BookAppointmentForm = ({ userId }) => {
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedProvider, setSelectedProvider] = useState(null); // State to hold the selected provider

  useEffect(() => {
    const fetchProviders = async () => {
      const token = Cookies.get('token'); // Get the token from cookies
      try {
        const response = await axios.get('http://localhost:5000/api/auth/providerProfile', {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the headers
          },
        });
        setProviders(response.data); // Set providers to the response data
      } catch (error) {
        console.error('Error fetching providers:', error);
        setError('Failed to load providers'); // Set error message
      }
    };

    fetchProviders();
  }, []); // Empty dependency array means this effect runs once on mount

  const viewAvailabilities = async (providerId) => { 
    setLoading(true); // Set loading to true while fetching
    try {
      const response = await axios.get('http://localhost:5000/api/appointments/providerAvailability', {
        params: { providerId }, 
      });
      console.log('Available Dates and Slots:', response.data); 
      setAvailability(response.data); // Set availability
      setSelectedProvider(providerId); // Set the selected provider
      setIsModalOpen(true); // Open modal after fetching availability
      setLoading(false); 
    } catch (err) {
      console.error("Error fetching provider availability:", err);
      setError("Failed to fetch availability data.");
      setLoading(false); 
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <p>User ID: {userId}</p>
      <h2 className="text-xl font-semibold mb-4">Available Providers:</h2>
      {error && <p className="text-red-500">{error}</p>} {/* Display error if any */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {providers.length > 0 ? (
          providers.map((provider) => (
            <div key={provider._id} className="p-4 border rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-semibold">{provider.name}</h3>
              <p>Email: {provider.email}</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => viewAvailabilities(provider._id)}
              >
                Check Availability
              </button>
            </div>
          ))
        ) : (
          <p>No providers available.</p>
        )}
      </div>
      {loading && <p>Loading availability data...</p>} {/* Show loading message */}
      <ClientAppointment userId={userId} />
      <AvailabilityModal
        isOpen={isModalOpen}  // Use isModalOpen instead of modalOpen
        onClose={closeModal}
        availability={availability}
        provider={selectedProvider} // Pass selected provider ID
        clientId={userId} // Pass client ID
      />
      {/* Modal for availability */}
    </div>
  );
};

export default BookAppointmentForm;
