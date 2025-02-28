import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full p-4 bg-gray-900 text-white shadow-lg">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl md:text-2xl font-bold text-white hover:text-blue-400 transition-colors duration-200">
          AppointmentX
        </Link>
        
        {/* Hamburger menu for mobile */}
        <button 
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
          </svg>
        </button>
        
        {/* Desktop menu */}
        <div className="hidden md:flex items-center">
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
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-4">
          <Link 
            to="/login" 
            className="text-lg text-gray-300 hover:text-blue-400 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="text-lg text-gray-300 hover:text-blue-400 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Register
          </Link>
          <button 
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }} 
            className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600 transition-colors duration-200 text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;