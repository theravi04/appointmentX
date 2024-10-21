# Appointment System

## Description

The Appointment System is a full-stack web application that allows clients to book appointments with service providers. Providers can set their availability, while clients can view this availability and book appointments in specific time slots. The application ensures secure authentication for both providers and clients using JWT-based authentication.

### Key Features

- **Provider Features**:
  - Set availability for specific time slots.
  - View all upcoming appointments.
  - Delete appointments as needed.
  - Delete availability slots.
  
- **Client Features**:
  - View available providers.
  - View providers' availability.
  - Book appointments with specific time slots.
  - View all upcoming appointments.
  - Cancel booked appointments.

- **Authentication & Authorization**:
  - Secure authentication for both providers and clients.
  - Role-based access to ensure proper authorization.

## Tech Stack

### Frontend:
- **React**: The UI is built using React, ensuring a dynamic and responsive user interface.
- **Tailwind CSS**: For styling components in a modular and maintainable way.
- **React Router**: For client-side routing.
- **Axios**: For making API requests from the frontend.
- **js-cookie**: For handling JWT tokens in cookies for authentication.

### Backend:
- **Node.js**: The server is built with Node.js, using Express.js to create API routes.
- **Express**: For routing and handling HTTP requests.
- **MongoDB**: The database used to store user, provider, appointment, and availability data.
- **JWT Authentication**: Used for secure login and role-based access control.

## Installation and Setup

### Prerequisites:
- **Node.js** (version 16.x or later)
- **MongoDB** (local or cloud instance)

### Steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/appointment-system.git
    cd appointment-system
    ```

2. **Install server dependencies**:
    ```bash
    cd backend
    npm install
    ```

3. **Install client dependencies**:
    ```bash
    cd frontend
    npm install
    ```

4. **Create a `.env` file in the `backend` folder**:
    ```bash
    PORT=5000
    MONGO_URI=<Your MongoDB URI>
    JWT_SECRET=<Your JWT Secret>
    ```

5. **Run the server**:
    ```bash
    cd backend
    npm start
    ```

6. **Run the client**:
    ```bash
    cd frontend
    npm start
    ```

The application will be available at `http://localhost:3000`.

## API Endpoints

### **Auth Routes** (`/api/auth`):
- `POST /register`: Register a new user (Client/Provider).
- `POST /login`: Log in a user.
- `GET /profile`: Get the profile of the logged-in user.
- `GET /providerProfile`: Get a list of all provider profiles (for clients to view).

### **Appointment Routes** (`/api/appointments`):
- `POST /availability`: Provider adds their availability.
- `GET /providerAvailability`: Get availability of a specific provider (clients can check availability of providers).
- `POST /bookAppointment`: Client books an appointment.
- `GET /provider`: Get all appointments for the logged-in provider.
- `GET /client`: Get all appointments for the logged-in client.
- `DELETE /deleteAvailability`: Provider deletes their availability.
- `DELETE /deleteAppointmentByProvider`: Provider deletes a specific appointment.
- `DELETE /deleteAppointmentByClient`: Client deletes a specific appointment.

## Folder Structure

```bash
├── backend
│   ├── controllers
│   │   ├── authController.js
│   │   ├── appointmentController.js
│   ├── models
│   │   ├── User.js
│   │   ├── Appointment.js
│   │   ├── Availability.js
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── appointmentRoutes.js
│   ├── middlewares
│   │   ├── authMiddleware.js
│   ├── server.js
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   │   ├── BookAppointmentForm.js
│   │   │   ├── ClientAppointment.js
│   │   │   ├── AvailabilityModal.js
│   │   │   ├── Navbar.js
│   │   ├── App.js
│   ├── package.json
