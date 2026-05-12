const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail')

// ── 6 digit OTP ──
const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000)
  return otp.toString().padStart(6, '0')
}

// ── SIGNUP ──
exports.signup = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body

    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'Email already registered' })

    const hashed = await bcrypt.hash(password, 10)
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    console.log(`Generated OTP for ${email}: ${otp}`) // debug

    await User.create({
      name,
      email,
      password: hashed,
      otp,
      otpExpiry,
      isAdmin: isAdmin === true
    })

   try {
  await sendEmail(email, otp)
  console.log(`OTP email sent to: ${email}`)
} catch (emailErr) {
  console.log('Email send failed:', emailErr.message) // 👈 log the actual error
}

    res.status(201).json({ message: 'OTP sent to email', email })
  } catch (err) {
    console.log('Signup error:', err.message)
    res.status(500).json({ message: err.message })
  }
}

// ── VERIFY OTP ──
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.otp !== otp.toString()) return res.status(400).json({ message: 'Invalid OTP' })
    if (user.otpExpiry < Date.now()) return res.status(400).json({ message: 'OTP expired. Request new one.' })

    user.isVerified = true
    user.otp = null
    user.otpExpiry = null
    await user.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePhoto: user.profilePhoto || '',
        createdAt: user.createdAt
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ── LOGIN ──
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email first' })
    if (user.isBlocked) return res.status(403).json({ message: 'Your account has been blocked' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Wrong password' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePhoto: user.profilePhoto || '',
        createdAt: user.createdAt
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ── FORGOT PASSWORD ──
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'No account found with this email' })

    const otp = generateOTP()
    user.otp = otp
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
    await user.save()

    console.log(`Forgot password OTP for ${email}: ${otp}`)

    try {
      await sendEmail(email, otp)
    } catch {
      console.log('Email failed, OTP:', otp)
    }

    res.json({ message: 'OTP sent to email' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ── VERIFY RESET OTP ──
exports.verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.otp !== otp.toString()) return res.status(400).json({ message: 'Invalid OTP' })
    if (user.otpExpiry < Date.now()) return res.status(400).json({ message: 'OTP expired' })
    res.json({ message: 'OTP verified' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ── RESET PASSWORD ──
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.otp !== otp.toString()) return res.status(400).json({ message: 'Invalid OTP' })

    user.password = await bcrypt.hash(newPassword, 10)
    user.otp = null
    user.otpExpiry = null
    await user.save()

    res.json({ message: 'Password reset successful' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ── GET PROFILE ──
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpiry')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ── UPDATE PROFILE ──
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, bio } = req.body
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, bio },
      { new: true }
    ).select('-password -otp -otpExpiry')
    res.json({ message: 'Profile updated successfully', user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ── UPLOAD PROFILE PHOTO (Cloudinary) ──
exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

    // Cloudinary se URL milega
    const photoUrl = req.file.path

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePhoto: photoUrl },
      { new: true }
    ).select('-password -otp -otpExpiry')

    res.json({ message: 'Profile photo updated!', user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
