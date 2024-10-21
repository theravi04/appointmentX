import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { User, Mail, Calendar, Loader2 } from 'lucide-react';
import ClientAppointment from './ClientAppointment';
import AvailabilityModal from './AvailabilityModal';

const BookAppointmentForm = ({ userId }) => {
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const token = Cookies.get('token');
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/auth/providerProfile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProviders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching providers:', error);
        setError('Failed to load providers');
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const viewAvailabilities = async (providerId) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/appointments/providerAvailability', {
        params: { providerId },
      });
      setAvailability(response.data);
      setSelectedProvider(providerId);
      setIsModalOpen(true);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching provider availability:", err);
      setError("Failed to fetch availability data.");
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 font-['Inconsolata']">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Book an Appointment</h1>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-8">
        <p className="text-lg text-gray-700">User ID: <span className="font-semibold">{userId}</span></p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <User className="mr-2 text-blue-500" />
          Available Providers
        </h2>
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.length > 0 ? (
              providers.map((provider) => (
                <div key={provider._id} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <h3 className="font-semibold text-lg mb-2">{provider.name}</h3>
                  <div className="flex items-center mb-2">
                    <Mail className="mr-2 text-green-500" size={18} />
                    <span>{provider.email}</span>
                  </div>
                  <button
                    className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
                    onClick={() => viewAvailabilities(provider._id)}
                  >
                    <Calendar className="mr-2" size={18} />
                    Check Availability
                  </button>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-600">No providers available.</p>
            )}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <Calendar className="mr-2 text-blue-500" />
          Your Appointments
        </h2>
        <ClientAppointment userId={userId} />
      </div>

      <AvailabilityModal
        isOpen={isModalOpen}
        onClose={closeModal}
        availability={availability}
        provider={selectedProvider}
        clientId={userId}
      />
    </div>
  );
};

export default BookAppointmentForm;