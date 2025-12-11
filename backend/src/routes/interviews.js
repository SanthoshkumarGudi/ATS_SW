// backend/routes/interviews.js
const User = require('../models/User');

const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const Application = require('../models/Application');
const { protect, authorize } = require('../middleware/auth');

// Schedule Interview (HM/Admin only)
router.post('/', protect, authorize('hiring_manager', 'admin'), async (req, res) => {
  try {
    console.log("inside scheduling interview");
    
    const { applicationId, scheduledAt, interviewerId, round = 1 } = req.body;
    console.log("values are ", applicationId, scheduledAt, interviewerId );
    
    const interview = new Interview({
      application: applicationId,
      scheduledAt,
      interviewer: interviewerId,
      round
    });

    await interview.save();

    // Update application status
    await Application.findByIdAndUpdate(applicationId, { status: 'in-interview' });
    console.log("scheuled interview is", interview);
    
    res.status(201).json(interview);
  } catch (err) {
    console.log("error has occured ", err);
    
    res.status(500).json({ message: err.message });
  }
});

// Submit Feedback (Only the assigned interviewer)
router.post('/:id/feedback', protect, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    console.log("Interview Feedback details ", interview);
    
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    if (interview.interviewer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    interview.feedback = req.body;
    interview.feedbackBy = req.user.id;
    interview.feedbackAt = new Date();
    interview.status = 'completed';
    // interview.feedback={ratings:req.body.ratings, notes:req.body.notes, recommendation:req.body.recommendation};
    await interview.save();

    res.json({ message: 'Feedback submitted', interview });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all interviews for a candidate (for interviewer dashboard)
router.get('/my-interviews', protect, async (req, res) => {
  try {
    const interviews = await Interview.find({ interviewer: req.user.id })
      .populate('application', 'resumeUrl')
      .populate({ path: 'application', populate: { path: 'candidate', select: 'name email' } })
      .populate({ path: 'application', populate: { path: 'job', select: 'title' } });

    res.json(interviews);
    console.log("interviews are ",interviews);
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET MY INTERVIEWS — Only for interviewer role
router.get('/my', protect, async (req, res) => {
  try {
    const interviews = await Interview.find({ interviewer: req.user.id })
      .populate({
        path: 'application',
        populate: [
          { path: 'candidate', select: 'name email' },
          { path: 'job', select: 'title' }
        ]
      })
      .sort({ scheduledAt: -1 });

    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET MY INTERVIEWS AS CANDIDATE
router.get('/candidate/my', protect, async (req, res) => {
  try {
    // Find applications belonging to this candidate
    console.log("inside fetching scheduled interview details");
  
    
    const applications = await Application.find({ candidate: req.user.id }).select('_id');

    const applicationIds = applications.map(app => app._id);

    const interviews = await Interview.find({ application: { $in: applicationIds } })
      .populate('interviewer', 'name')
      .populate('application', null)
      .populate({
        path: 'application',
        populate: { path: 'job', select: 'title' }
      })
      .sort({ scheduledAt: 1 });

    res.json(interviews);
    console.log("==>",interviews)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all users who can take interviews
router.get('/interviewers', protect, authorize('hiring_manager', 'admin'), async (req, res) => {
  try {
    console.log("inside interviews route backend test===")
    const users = await User.find({
      role: { $in: ['interviewer'] }
    }).select('name');

    res.json(users);
    console.log(users)
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET interview for a specific application (candidate only)
router.get('/application/:applicationId', protect, async (req, res) => {
  try {
    const interview = await Interview.findOne({ 
      application: req.params.applicationId 
    })
      .populate('interviewer', 'name')
      .populate({
        path: 'application',
        populate: { path: 'job', select: 'title' }
      });

    if (!interview) {
      return res.status(404).json({ message: 'No interview found' });
    }

    // Security: Only candidate of this application can see
    const application = await Application.findById(req.params.applicationId);
    if (application.candidate.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(interview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;