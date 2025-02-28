const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();
dotenv.config();
connectDB();

app.use(cors({
    origin: "https://appointment-x-ten.vercel.app",
    credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
