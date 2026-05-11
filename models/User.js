const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  blockReason: { type: String, default: '' },
  phone: { type: String, default: '' },
  bio: { type: String, default: '' },
  profilePhoto: { type: String, default: '' },
  otp: { type: String },
  otpExpiry: { type: Date },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
