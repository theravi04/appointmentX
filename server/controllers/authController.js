const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

// Utility function to validate email format
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Register new user
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Password strength check (example: minimum 8 characters, at least 1 number and 1 special character)
  if (!/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one number and one special character' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword, role });
  await user.save();

  res.status(201).json({ message: 'User registered successfully' });
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate user credentials
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  if (!token) {
    return res.status(500).json({ message: 'Token generation failed' });
  }

  // Send token in response
  res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
};



// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.query
      // Assuming req.user contains the userId (from your auth middleware)
      // const userId = req.body;
  
      // Fetch the user data from the database by userId
      const user = await User.findById(userId).select('name email'); // Fetch only 'name' and 'email'
  
      // If no user is found, return an error
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Send the user profile data
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Error fetching user profile' });
    }
};
const getProviderProfile = async (req, res) => {
  try {
    // Fetch all users with the role "provider"
    const providers = await User.find({ role: 'provider' }).select('name email'); // Fetch only 'name' and 'email'

    // If no providers are found, return an appropriate message
    if (!providers || providers.length === 0) {
      return res.status(404).json({ message: 'No providers found' });
    }

    // Send the list of provider profiles
    res.status(200).json(providers);
  } catch (error) {
    console.error('Error fetching provider profiles:', error);
    res.status(500).json({ message: 'Error fetching provider profiles' });
  }
};


module.exports = { registerUser, loginUser, getUserProfile, getProviderProfile };
