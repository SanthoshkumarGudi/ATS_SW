    // backend/src/routes/applications.js
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

// POST /api/applications/:jobId  → Apply with resume
router.post('/:jobId', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job || job.status !== 'published') {
      return res.status(404).json({ message: 'Job not found or not open' });
    }

    // Prevent duplicate application
    const existing = await Application.findOne({
      job: req.params.jobId,
      candidate: req.user.id
    });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const application = await Application.create({
      job: req.params.jobId,
      candidate: req.user.id,
      resumeUrl: req.file.path,        // Cloudinary URL
      resumePublicId: req.file.filename // for deletion later
    });

    res.status(201).json({
      message: 'Application submitted successfully!',
      application
    });
  } catch (err) {
    console.error('Apply error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Optional: GET applications for candidate
router.get('/my', protect, async (req, res) => {
  const apps = await Application.find({ candidate: req.user.id })
    .populate('job', 'title department location')
    .sort({ appliedAt: -1 });
  res.json(apps);
});

module.exports = router;