// models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Cloudinary resume
  resumeUrl: { type: String, required: true },
  resumePublicId: String,

  // EXTRACTED & PARSED DATA (saved forever)
  parsedData: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
    skills: [{ type: String }],

    // Auto-calculated match
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    matchPercentage: { type: Number, default: 0 },
    isShortlisted: { type: Boolean, default: false }
  },

  status: { 
    type: String, 
    enum: ['applied', 'reviewed', 'shortlisted', 'rejected'], 
    default: 'applied' 
  },
  appliedAt: { type: Date, default: Date.now },

  //Cover Letter
  coverLetter:{type: String},
  expectedSalary:{type: String},
  availability: { type: mongoose.Schema.Types.Mixed }

});

module.exports = mongoose.model('Application', applicationSchema);