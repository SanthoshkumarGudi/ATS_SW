const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills: [{ type: String }],
  clearanceLevel: { type: String, enum: ['None', 'Confidential', 'Secret', 'Top Secret'], default: 'None' },
  department: String,
  location: String,
  status: { type: String, enum: ['draft', 'published', 'closed'], default: 'published' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});                                                                                           

module.exports = mongoose.model('Job', jobSchema);      