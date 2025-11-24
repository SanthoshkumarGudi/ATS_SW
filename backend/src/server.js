  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  require('dotenv').config();
  const router = express.Router();
  // At the top with other imports
const path = require('path');


  const app = express();

  // ==================== CORS FIX (WORKS 100%) ====================
  app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174','http://127.0.0.1:5174', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(express.json());

  app.use('/api/applications', require('./routes/applications'));
  app.use('/api/candidate', require('./routes/candidate'));
  // ==================== MODELS ====================
  const User = require('./models/User');
  const Job = require('./models/Job');

  // ==================== JWT & BCRYPT ====================
  const jwt = require('jsonwebtoken');
  const bcryptjs = require('bcryptjs');

  // ==================== MONGO DB CONNECTION ====================
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Locally (atsdb)'))
    .catch(err => {
      console.error('❌ MongoDB Connection Error:', err.message);
      process.exit(1);
    });

  // ==================== ROUTES ====================

  // Jobs Route (protected)
  app.use('/api/jobs', require('./routes/jobs'));

  // ==================== REGISTER ====================
  app.post('/api/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcryptjs.hash(password, 12);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'candidate' // default role
      });

      const token = jwt.sign(
        { id: user._id, name:user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // ==================== LOGIN ====================
  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user._id, name:user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // After app setup, before listen()
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  
  // ==================== SERVER START ====================
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
  });