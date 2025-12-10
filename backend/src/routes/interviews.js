// backend/routes/interviews.js
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
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    if (interview.interviewer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    interview.feedback = req.body;
    interview.feedbackBy = req.user.id;
    interview.feedbackAt = new Date();
    interview.status = 'completed';
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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;