// backend/routes/users.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

// GET all interviewers + hiring managers (so they can be assigned)
router.get('/interviewers', protect, authorize('hiring_manager', 'admin'), async (req, res) => {
  try {
    console.log("inside fetching interviewers")
    const users = await User.find({
      role: { $in: ['interviewer'] }
    }).select('name'); // only send what we need

    res.json(users);
  } catch (err) {
    console.error('Error fetching interviewers:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;