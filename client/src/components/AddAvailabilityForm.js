import  { useEffect, useState } from 'react';
import AddAvailability from './AddAvailability';
import ViewAppointments from './ViewAppointments';
import ProviderAvailability from './ProviderAvailability';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';

const Provider = ({ userId }) => {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [removeSlot, setRemoveSlot] = useState([]);

  const fetchAvailability = async () => {
    const token = Cookies.get('token');
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/appointments/providerAvailability', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { providerId: userId },
      });
      setAvailability(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching provider availability:", err);
      setError("Failed to fetch availability data.");
      setLoading(false);
    }
  };

  const handleAvailabilityUpdate = () => {
    fetchAvailability();
  };

  useEffect(() => {
    fetchAvailability();
}, [userId, fetchAvailability]);


  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );
  // to delete a slot
  const deleteSlot = async (date, slotId) => {
    const token = Cookies.get('token');
    console.log(date, slotId);
    console.log(userId);
    try {
      await axios.delete(`http://localhost:5000/api/appointments/deleteAvailability`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data:{
          providerId: userId,
          slotId,
        }
      });
      console.log("Slot deleted successfully.");
      handleAvailabilityUpdate();
    } catch (err) {
      console.error("Error deleting slot:", err);
    }
  };
  
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error:</strong>
      <span className="block sm:inline"> {error}</span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 font-['Inconsolata']">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Provider Dashboard</h1>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-8">
        <p className="text-lg text-gray-700">User ID: <span className="font-semibold">{userId}</span></p>
      </div>
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Add Availability</h2>
          <AddAvailability userId={userId} onAvailabilityUpdate={handleAvailabilityUpdate} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Current Availability</h2>
          <ProviderAvailability availability={availability} deleteSlot={deleteSlot}/>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Appointments</h2>
          <ViewAppointments userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default Provider;