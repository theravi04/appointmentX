import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl">Welcome to the Appointment System</h1>
      <p className="mt-4">Book your appointment or add your availability.</p>
      {/* <div className="mt-6">
        <Link to="/book-appointment">
          <button className="mr-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Book Appointment
          </button>
        </Link>
        <Link to="/add-availability">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Add Availability
          </button>
        </Link>
      </div> */}
    </div>
  );
};

export default Home;
