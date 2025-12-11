const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'hiring_manager', 'candidate', 'interviewer'], default: 'candidate' }
});

module.exports = mongoose.model('User', userSchema);