const mongoose = require('mongoose')

const analysisSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  jobRole: String,
  userSkills: [String],
  requiredSkills: [String],
  missingSkills: [String],
  matchPercentage: Number,
  roadmap: [String],
}, { timestamps: true })

module.exports = mongoose.model('Analysis', analysisSchema)