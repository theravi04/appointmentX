import React from 'react'

const ViewAppointments = () => {
  return (
    <div>ViewAppointments</div>
  )
}

export default ViewAppointments
// import React, { useEffect, useState } from 'react';

// const ViewAppointments = () => {
//   const [appointments, setAppointments] = useState([]);

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const response = await fetch('/api/appointments', {
//           method: 'GET',
//           headers: {
//             'Authorization': 'Bearer YOUR_TOKEN', // Replace with actual token
//           },
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setAppointments(data);
//         } else {
//           console.error('Error fetching appointments:', data.message);
//         }
//       } catch (error) {
//         console.error('Error fetching appointments:', error);
//       }
//     };

//     fetchAppointments();
//   }, []);

//   return (
//     <div className="mt-8">
//       <h2 className="text-xl font-semibold">My Appointments</h2>
//       {appointments.length > 0 ? (
//         <ul className="list-disc list-inside">
//           {appointments.map((appointment) => (
//             <li key={appointment._id}>
//               {`Client: ${appointment.clientId.name}, Email: ${appointment.clientId.email}, Date: ${appointment.date}, Time: ${appointment.time}`}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No appointments found.</p>
//       )}
//     </div>
//   );
// };

// export default ViewAppointments;
