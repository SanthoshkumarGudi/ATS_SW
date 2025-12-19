// backend/models/Interview.js
const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    round: { type: Number, default: 1 }, // 1=Technical, 2=HR, etc.
    scheduledAt: { type: Date, required: true },
    // interviewer: { type: String, ref: 'User', required: true },
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "no-show"],
      default: "scheduled",
    },
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      notes: String,
      recommendation: {
        type: String,
        enum: ["hire", "reject", "next-round", "hold"],
      },
      negotiatedSalary: { type: String },
      noticePeriod: { type: String },
    },
    feedbackBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    feedbackAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
