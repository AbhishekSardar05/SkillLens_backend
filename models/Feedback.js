const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  type: { type: String, enum: ['bug', 'feature', 'general'], default: 'general' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Feedback', feedbackSchema)
