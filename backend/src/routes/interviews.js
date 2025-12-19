// backend/routes/interviews.js
const User = require("../models/User");

const express = require("express");
const router = express.Router();
const Interview = require("../models/Interview");
const Application = require("../models/Application");
const { protect, authorize } = require("../middleware/auth");

// Schedule Interview (HM/Admin only)
router.post(
  "/",
  protect,
  authorize("hiring_manager", "admin"),
  async (req, res) => {
    try {
      console.log("inside scheduling interview");

      const { applicationId, scheduledAt, interviewerId, round = 1 } = req.body;
      console.log("values are ", applicationId, scheduledAt, interviewerId);

      const interview = new Interview({
        application: applicationId,
        scheduledAt,
        interviewer: interviewerId,
        round,
      });

      await interview.save();

      // Update application status
      await Application.findByIdAndUpdate(applicationId, {
        status: "in-interview",
      });
      console.log("scheuled interview is", interview);

      res.status(201).json(interview);
    } catch (err) {
      console.log("error has occured ", err);
      console.log("checking =====>");

      res.status(500).json({ message: err.message });
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

router.post("/:id/feedback", protect, async (req, res) => {
  try {
    // Find interview WITHOUT populate first
    console.log("inside feedback route ====17th");
    const interview = await Interview.findById(req.params.id);
    console.log("interview =============== ", interview);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Authorization check
    if (interview.interviewer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Prevent duplicate feedback
    // if (interview.feedback) {
    //   return res.status(400).json({ message: 'Feedback already submitted' });
    // }

    const { rating, notes, recommendation, negotiatedSalary, noticePeriod } =
      req.body;

    // Basic validation
    if (!recommendation) {
      return res.status(400).json({ message: "Recommendation is required" });
    }

    // Save feedback — your way that already works
    interview.feedback = {
      rating,
      notes,
      recommendation,
      negotiatedSalary,
      noticePeriod,
    };
    interview.feedbackBy = req.user.id;
    interview.feedbackAt = new Date();
    interview.status = "completed";

    await interview.save();

    // NOW safely update the Application status
    // We do a separate query — safer than populate
    const application = await Application.findById(interview.application);
    console.log("application ========================..", application);

    if (!application) {
      console.error("Application not found for interview:", interview._id);
      // Still return success for feedback, just log the issue
    } else {
      switch (recommendation) {
        case "hire":
          application.status = "offered";
          break;
        case "next-round":
          application.status = "shortlisted";
          break;
        case "reject":
          application.status = "rejected";
          break;
        case "hold":
          application.status = "on-hold";
          break;
        default:
          // Do nothing if unknown
          break;
      }
      await application.save();
    }

    res.json({
      message: "Feedback submitted successfully",
      interview,
      applicationStatus: application ? application.status : "unknown",
    });
  } catch (err) {
    console.error("Feedback submission error:", err);
    res.status(500).json({
      message: "Server error while saving feedback",
      error: err.message,
    });
  }
});

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

// GET interview for a specific application (candidate only)
router.get(
  "/application/:applicationId",
  protect,
  authorize("admin", "hiring_manager", "candidate"),
  async (req, res) => {
    try {
      const { applicationId } = req.params;
      console.log("applicationID is ", applicationId);

      const interview = await Interview.findOne({
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
