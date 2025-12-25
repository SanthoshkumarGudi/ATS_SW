const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: [{ type: String }],
  department: String,
  location: String,
  status: {
    type: String,
    enum: ["draft", "published", "closed"],
    default: "published",
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },

  // NEW: Custom screening questions
  screeningQuestions: [
    {
      question: { type: String, required: true },
      type: { 
        type: String, 
        enum: ['text', 'yes-no', 'multiple-choice', 'number', 'salary'], 
        default: 'text' 
      },
      options: [{ type: String }], // for multiple-choice
      required: { type: Boolean, default: true }
    }
  ]
});



module.exports = mongoose.model("Job", jobSchema);
