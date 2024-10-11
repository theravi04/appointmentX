import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode

export const Authorizer = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null); // State to store userId

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Retrieve the authentication token from cookies
        const token = Cookies.get('token');
        console.log(token);

        if (!token) {
          throw new Error("No token found");
        }

        // Decode the token to get the userID
        const decodedToken = jwtDecode(token);
        const id = decodedToken.id; // Assuming `id` is the field in the token payload

        console.log("User ID:", id);
        setUserId(id); // Set userId in state
        setIsLoading(false);
      } catch (error) {
        alert("You need to login to access this page");
        console.error("User is not authenticated", error);
        navigate("/login");
      }
    };

    if (navigate) checkAuth();
  }, [navigate]);

  // Pass userId to children as a prop
  return isLoading ? <div>Loading...</div> : <>{React.cloneElement(children, { userId })}</>;
};
