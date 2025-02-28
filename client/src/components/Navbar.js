import  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="shadow-lg font-['Inconsolata']">
      <div className="px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-blue-400 transition-colors duration-200">
          AppointmentX
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center">
          {isAuthenticated ? (
            <button 
              onClick={handleLogout} 
              className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          ) : (
            <>
              <Link 
                to="/login" 
                className="mr-4 text-lg hover:text-blue-400 transition-colors duration-200"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="text-lg hover:text-blue-400 transition-colors duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-2 pb-4 border-t">
          {isAuthenticated ? (
            <button 
              onClick={handleLogout} 
              className="block w-full text-left py-2 text-lg hover:text-blue-400 transition-colors duration-200"
            >
              Logout
            </button>
          ) : (
            <>
              <Link 
                to="/login" 
                className="block py-2 text-lg hover:text-blue-400 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="block py-2 text-lg hover:text-blue-400 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;