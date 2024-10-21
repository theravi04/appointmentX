import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

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
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-lg font-[Inconsolata]">
      <Link to="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors duration-200">
        Appointment System
      </Link>
      <div className="flex items-center">
        <button 
          onClick={handleLogout} 
          className="mr-6 bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600 transition-colors duration-200"
        >
          Logout
        </button>
        <Link 
          to="/login" 
          className="mr-4 text-lg text-gray-300 hover:text-blue-400 transition-colors duration-200"
        >
          Login
        </Link>
        <Link 
          to="/register" 
          className="text-lg text-gray-300 hover:text-blue-400 transition-colors duration-200"
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
