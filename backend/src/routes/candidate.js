// / backend/src/routes/candidate.js

const express = require('express');
const router = express.Router();
// const auth = require('../middleware/auth');                    // your JWT middleware
const CandidateProfile = require('../models/CandidateProfile'); // make sure this file exists
const { protect } = require('../middleware/auth');  // ← destructuring!

// POST /api/candidate/profile - Create profile (first time)
router.post('/profile', protect, async (req, res) => {
    console.log("inside creating profile");
        
  if (req.user.role !== 'candidate') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const {
    name,
    currentLocation,
    targetJobTitle,
    skills,
    preferredLocation,
    noticePeriod,
    experience
  } = req.body;

  if (!name || !currentLocation || !targetJobTitle || !skills || !preferredLocation || !noticePeriod || !experience) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingProfile = await CandidateProfile.findOne({ user: req.user.id });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const skillsArray = skills
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const profile = new CandidateProfile({
      user: req.user.id,
      name,
      currentLocation,
      targetJobTitle,
      skills: skillsArray,
      preferredLocation,
      noticePeriod: Number(noticePeriod),
      experience: Number(experience)
    });

    await profile.save();
    res.status(201).json({ message: 'Profile created successfully', profile });
  } catch (err) {
    console.error('Profile save error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/candidate/profile - Check if profile exists
router.get('/profile', protect, async (req, res) => {
    console.log("inside /profile checking")
  if (req.user.role !== 'candidate') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const profile = await CandidateProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
    console.log("profile is ", profile);
    
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;