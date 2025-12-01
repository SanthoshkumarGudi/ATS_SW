const express = require('express');
const router = express.Router();
const User=require('../models/User');
const { authorize } = require('../middleware/auth');

router.get('/me', authorize, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});