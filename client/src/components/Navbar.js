import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Remove the token from cookies
      Cookies.remove('token');

      // Redirect to the login page or homepage
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <Link className="text-xl" to="/">Appointment System</Link>
      <div>
        <button onClick={handleLogout} className="mr-4 text-white">Logout</button>
        <Link to="/login" className="mr-4">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
