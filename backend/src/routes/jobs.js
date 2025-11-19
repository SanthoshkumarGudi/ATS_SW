const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');

// CREATE JOB - Only Admin & Hiring Manager
router.post('/', protect, authorize('admin', 'hiring_manager'), async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      createdBy: req.user.id
    });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL JOBS (for dashboard)
router.get('/', protect, async (req, res) => {
  try {
    let jobs;
    if (req.user.role === 'candidate') {
      jobs = await Job.find({ status: 'published' });
    } else {
      jobs = await Job.find(); // admin/hiring manager see all
    }
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;