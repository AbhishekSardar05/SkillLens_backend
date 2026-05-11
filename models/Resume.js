// const mongoose = require('mongoose');

// const resumeSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   fileName: String,
//   extractedText: String,
//   skills: [String],
//   score: Number,
//   atsScore: { type: Number, default: 0 },
//   placementReadiness: { type: Number, default: 0 },
// }, { timestamps: true });

// module.exports = mongoose.model('Resume', resumeSchema);


const mongoose = require('mongoose')

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileName: String,
  extractedText: String,
  skills: [String],
  education: [{
    degree: String,
    institution: String,
    year: String
  }],
  experience: [{
    title: String,
    company: String,
    duration: String
  }],
  projects: [{
    name: String,
    tech: [String],
    description: String
  }],
  score: { type: Number, default: 0 },
  atsScore: { type: Number, default: 0 },
  placementReadiness: { type: Number, default: 0 },
  sectionScores: {
    skills: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    education: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    formatting: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  feedback: {
    missing: [String],
    weak: [String],
    suggestions: [String]
  }
}, { timestamps: true })

module.exports = mongoose.model('Resume', resumeSchema)
