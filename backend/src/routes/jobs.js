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

// GET SINGLE JOB BY ID - REQUIRED FOR EDIT PAGE
router.get('/:id', protect, authorize('admin', 'hiring_manager'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Optional: Restrict access to only creator or admin
    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this job' });
    }

    res.json(job);
  } catch (err) {
    console.error('Error fetching job:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE JOB
router.put('/:id', protect, authorize('admin', 'hiring_manager'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        skills: req.body.skills || job.skills
      },
      { new: true, runValidators: true }
    );
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;