    // backend/src/routes/applications.js
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');
const CandidateProfile = require('../models/CandidateProfile')

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

// GET applications for a specific job (for HM/Admin dashboard)
// backend/src/routes/applications.js

router.get('/job/:jobId', protect, authorize('admin', 'hiring_manager'), async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('job', 'title department location skills clearanceLevel')
      .populate({
        path: 'candidate',
        select: 'name email'  // from User model
      })
      .sort({ appliedAt: -1 });

    // Now separately fetch CandidateProfile for each candidate
    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const profile = await CandidateProfile.findOne({ user: app.candidate._id });
        
        // Also compute match % if not already there (optional improvement)
        const jobSkills = app.job.skills || [];
        const candidateSkills = profile?.skills || [];
        const matchedSkills = candidateSkills.filter(s => 
          jobSkills.some(js => js.toLowerCase() === s.toLowerCase())
        );
        const matchPercentage = jobSkills.length > 0 
          ? Math.round((matchedSkills.length / jobSkills.length) * 100)
          : 0;

        return {
          ...app.toObject(),
          candidateProfile: profile ? profile.toObject() : null,
          parsedData: {
            name: profile?.name || app.candidate.name || 'Unknown', 
            email: app.candidate.email,
            phone: profile?.phone || '',
            matchedSkills,
            missingSkills: jobSkills.filter(js => 
              !candidateSkills.some(cs => cs.toLowerCase() === js.toLowerCase())
            ),
            matchPercentage,
            isShortlisted: matchPercentage >= 70
          }
        };
      })
    );

    res.json(enrichedApplications);
  } catch (err) {
    console.error('Error fetching job applications:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;