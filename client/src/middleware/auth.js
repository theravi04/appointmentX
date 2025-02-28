import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const Authorizer = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('token');
      if (!token) {
        console.warn("No token found");
        navigate("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        setUser({ id: decoded.id });
      } catch (error) {
        console.error("Invalid token", error);
        Cookies.remove('token');
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) return <div>Loading...</div>;

  return React.cloneElement(children, { user });
};
