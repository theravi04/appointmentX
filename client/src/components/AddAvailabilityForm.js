import React from 'react';
import AddAvailability from './AddAvailability';
import ViewAppointments from './ViewAppointments';
import ProviderAvailability from './ProviderAvailability';

const Provider = ({ userId }) => { // Accept userId as a prop
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Provider Dashboard</h1>
      <p>User ID: {userId}</p> {/* Display the user ID */}
      <AddAvailability userId={userId} /> {/* Pass userId to AddAvailability */}
      <ProviderAvailability userId={userId}/>
      <ViewAppointments userId={userId} /> {/* Pass userId to ViewAppointments */}
    </div>
  );
};

export default Provider;
