const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const router = express.Router();
// At the top with other imports
const path = require("path");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const app = express();

// ==================== CORS FIX (WORKS 100%) ====================
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/applications", require("./routes/applications"));
app.use("/api/candidate", require("./routes/candidate"));
app.use("/api/users", require("./routes/interviews"));
// ==================== MODELS ====================
const User = require("./models/User");
const Job = require("./models/Job");

// ==================== JWT & BCRYPT ====================
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

// ==================== MONGO DB CONNECTION ====================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Locally (atsdb)"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// ==================== ROUTES ====================

// Jobs Route (protected)
app.use("/api/jobs", require("./routes/jobs"));
// Add this line with your other routes
app.use("/api/interviews", require("./routes/interviews"));
// ==================== REGISTER ====================
app.post("/api/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "candidate", // default role
    });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== LOGIN ====================
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Google Login Endpoint
app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;

  try {
    console.log("inside google authentication");
    
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { email, name, picture, sub: googleId } = payload;
    console.log("email name ", email, name);
    

    let user = await User.findOne({ email });
    console.log("user is ---- ",user);
    
    if(user){
      console.log("user is present");
            console.log("user id is ", user._id);
            console.log("user name is ", user.name);
console.log("user email is ", user.email);
      
    }else{
      console.log("user being created");
      
    }
    
    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: null, // Google users have no local password
        role: 'candidate', // Default; you can add role selection later
      });
      console.log('New Google user created:', user.email);
    } else {
      console.log('Existing user logged in via Google:', user.email);
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Google auth error:', error.message);
    res.status(401).json({ message: 'Invalid Google token' });
  }
});

// After app setup, before listen()
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==================== SERVER START ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
