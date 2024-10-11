import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import { Authorizer } from './middleware/auth';
import BookAppointment from './components/BookAppointmentForm';
import AddAvailability from './components/AddAvailabilityForm';

export const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book-appointment" element={
          <Authorizer>
            <BookAppointment />
          </Authorizer>
        } />
        <Route path="/add-availability" element={
          <Authorizer>
            <AddAvailability />
          </Authorizer>
        } />
        {/* <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/add-availability" element={<AddAvailability />} /> */}
      </Routes>
    </Router>
  );
};
