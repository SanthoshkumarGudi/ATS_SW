// backend/routes/interviews.js
const User = require("../models/User");

const express = require("express");
const router = express.Router();
const Interview = require("../models/Interview");
const Application = require("../models/Application");
const { protect, authorize } = require("../middleware/auth");

// Schedule Interview (HM/Admin only)
// routes/interviews.js - POST /
router.post(
  "/",
  protect,
  authorize("hiring_manager", "admin"),
  async (req, res) => {
    try {
      const { applicationId, scheduledAt, interviewerId, round } = req.body;

      if (!applicationId || !scheduledAt || !interviewerId || !round) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const app = await Application.findById(applicationId);
      if (!app) return res.status(404).json({ message: "Application not found" });

      // Determine expected next round
     // Find all interviews for this application, sorted by round ascending
  const existingInterviews = await Interview.find({ application: applicationId })
    .sort({ round: 1 });  // ascending: 1, 2, 3...

  // Determine the highest completed round
  let highestCompletedRound = 0;
  for (const intv of existingInterviews) {
    if (intv.status === 'completed') {
      highestCompletedRound = Math.max(highestCompletedRound, intv.round);
    }
  }

  // Next round should be highest completed + 1
  const nextExpectedRound = highestCompletedRound + 1;

  // Validate the requested round
  if (round !== nextExpectedRound) {
    return res.status(400).json({
      message: `Invalid round. Please schedule round ${nextExpectedRound} next.`
    });
  }

  // Prevent scheduling a round that's already scheduled (but not completed)
  const alreadyScheduled = await Interview.findOne({
    application: applicationId,
    round: nextExpectedRound,
    status: 'scheduled'
  });

  if (alreadyScheduled) {
    return res.status(400).json({
      success: false,
      type: "ROUND_ALREADY_SCHEDULED",
      message: `Round ${nextExpectedRound} is already scheduled.`
    });
  }

      const interview = new Interview({
        application: applicationId,
        scheduledAt,
        interviewer: interviewerId,
        round,
      });

      await interview.save();

      // Update application status based on round
      let newStatus;
      if (round === 1) newStatus = 'first-round';
      else if (round === 2) newStatus = 'second-round';
      else if (round === 3) newStatus = 'final-round';

      app.status = newStatus;
      await app.save();

      res.status(201).json(interview);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Submit Feedback (Only the assigned interviewer)
// router.post('/:id/feedback', protect, async (req, res) => {
//   try {
//     const interview = await Interview.findById(req.params.id);
//     console.log("Interview Feedback details ", interview);

//     if (!interview) return res.status(404).json({ message: 'Interview not found' });
//     if (interview.interviewer.toString() !== req.user.id) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }

//     interview.feedback = req.body;
//     interview.feedbackBy = req.user.id;
//     interview.feedbackAt = new Date();
//     interview.status = 'completed';
//     // interview.feedback={ratings:req.body.ratings, notes:req.body.notes, recommendation:req.body.recommendation};
//     await interview.save();

//     res.json({ message: 'Feedback submitted', interview });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// routes/interviews.js - POST /:id/feedback
// routes/interviews.js - POST /:id/feedback
router.post(
  "/:id/feedback",
  protect,
  async (req, res) => {
    try {
      const interviewId = req.params.id;
      const { rating, notes, recommendation, negotiatedSalary, noticePeriod } = req.body;

      if (!recommendation) {
        return res.status(400).json({ message: "Recommendation is required" });
      }

      const interview = await Interview.findById(interviewId)
        .populate({
          path: 'application',
          populate: { path: 'job' }
        });

      if (!interview) return res.status(404).json({ message: "Interview not found" });

      if (interview.interviewer.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      if (interview.status === "completed") {
        return res.status(400).json({ message: "Feedback already submitted" });
      }

      // Mark interview as completed
      interview.status = "completed";
      interview.feedback = {
        rating,
        notes,
        recommendation,
        negotiatedSalary,
        noticePeriod,
        submittedBy: req.user.id,
        submittedAt: new Date(),
      };
      await interview.save();

      const app = interview.application;

      // Progress application based on recommendation and current round
      if (recommendation === "next-round") {
        if (interview.round === 1) {
          app.status = "second-round";
        } else if (interview.round === 2) {
          app.status = "final-round";
        }
        // If already in final-round, stay there or auto-schedule next if needed
      } else if (recommendation === "hire") {
        app.status = "offered";  // or 'hired' if you prefer
      } else if (recommendation === "reject") {
        app.status = "rejected";
      }
      // "hold" → no status change

      await app.save();

      res.json({
        message: "Feedback submitted and candidate progressed",
        interview,
        applicationStatus: app.status
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);
// Get all interviews for a candidate (for interviewer dashboard)
router.get("/my-interviews", protect, async (req, res) => {
  try {
    const interviews = await Interview.find({ interviewer: req.user.id })
      .populate("application", "resumeUrl")
      .populate({
        path: "application",
        populate: { path: "candidate", select: "name email" },
      })
      .populate({
        path: "application",
        populate: { path: "job", select: "title" },
      });

    res.json(interviews);
    console.log("interviews are ", interviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET MY INTERVIEWS — Only for interviewer role
router.get("/my", protect, async (req, res) => {
  try {
    const interviews = await Interview.find({ interviewer: req.user.id })
      .populate({
        path: "application",
        populate: [
          { path: "candidate", select: "name email" },
          { path: "job", select: "title" },
        ],
      })
      .sort({ scheduledAt: -1 });

    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET MY INTERVIEWS AS CANDIDATE
router.get("/candidate/my", protect, async (req, res) => {
  try {
    // Find applications belonging to this candidate
    console.log("inside fetching scheduled interview details");

    const applications = await Application.find({
      candidate: req.user.id,
    }).select("_id");

    const applicationIds = applications.map((app) => app._id);

    const interviews = await Interview.find({
      application: { $in: applicationIds },
    })
      .populate("interviewer", "name")
      .populate("application", null)
      .populate({
        path: "application",
        populate: { path: "job", select: "title" },
      })
      .sort({ scheduledAt: 1 });

    res.json(interviews);
    console.log("==>", interviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all users who can take interviews
router.get(
  "/interviewers",
  protect,
  authorize("hiring_manager", "admin"),
  async (req, res) => {
    try {
      console.log("inside interviews route backend test===");
      const users = await User.find({
        role: { $in: ["interviewer"] },
      }).select("name");

      res.json(users);
      console.log(users);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET interview for a specific application 
router.get(
  "/application/:applicationId",
  protect,
  authorize("admin", "hiring_manager", "candidate"),
  async (req, res) => {
    try {
      const { applicationId } = req.params;
      console.log("applicationID is ", applicationId);

      const interview = await Interview.find({
        application: req.params.applicationId,
      })
        .populate("interviewer", "name")
        .populate({
          path: "application",
          populate: { path: "job", select: "title" },
        });

      if (!interview) {
        return res.status(404).json({ message: "No interview found" });
      }

      // Security: Only candidate of this application can see
      const application = await Application.findById(req.params.applicationId);
      console.log("inside view details route", application);

      console.log("user id is ", req.user.id);

      // if (application.candidate.toString() !== req.user.id) {
      //   return res.status(403).json({ message: 'Not authorized' });
      // }

      res.json(interview);
      console.log("interview details are ==>>>>>>", interview);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get all rejected Applications
// Get all rejected candidates (where feedback recommendation is "reject")
router.get(
  "/rejected",
  protect,
  authorize("hiring_manager", "admin"),
  async (req, res) => {
    try {
      console.log("Fetching rejected applications...");

      const rejectedInterviews = await Interview.find({
        "feedback.recommendation": { $regex: /^reject$/i }, // Matches "reject" or "Reject"
      })
        .populate({
          path: "application",
          populate: [
            { path: "candidate", select: "name email" },
            { path: "job", select: "title department" },
          ],
        })
        .populate("feedbackBy", "name") // optional: interviewer name
        .sort({ updatedAt: -1 })
        .lean(); // improves performance

      // Transform data to match what frontend expects
      const applications = rejectedInterviews.map((interview) => {
        const app = interview.application;
        return {
          _id: interview._id,
          candidate: {
            name: app?.parsedData?.name || app?.candidate?.name,
            email: app?.parsedData?.email || app?.candidate?.email,
          },
          job: {
            title: app?.job?.title || "Unknown Job",
            department: app?.job?.department || "N/A",
          },
          appliedAt: app?.createdAt || interview.createdAt,
          resumeUrl: app?.resumeUrl || "", // assuming resumeUrl is on application
          status: interview.status,
          feedback: interview.feedback, // optional: if you want to show notes/rating
        };
      });

      res.status(200).json(applications);
    } catch (err) {
      console.error("Error fetching rejected candidates:", err);
      res
        .status(500)
        .json({ message: "Server error while fetching rejected candidates" });
    }
  }
);

module.exports = router;
