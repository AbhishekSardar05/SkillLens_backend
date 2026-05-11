const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

const {
  signup, verifyOTP, login,
  forgotPassword, verifyResetOTP, resetPassword,
  getProfile, updateProfile, uploadProfilePhoto
} = require('../controllers/authController')

// ── Cloudinary Config ──
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// ── Cloudinary Storage ──
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skilllens/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill' }]
  }
})

const photoUpload = multer({
  storage: profileStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only images allowed'))
  }
})

// ── Auth Routes ──
router.post('/signup', signup)
router.post('/verify-otp', verifyOTP)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/verify-reset-otp', verifyResetOTP)
router.post('/reset-password', resetPassword)

// ── Profile Routes ──
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)
router.post('/profile/photo', protect, photoUpload.single('photo'), uploadProfilePhoto)

// ── Google OAuth ──
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')
const jwt = require('jsonwebtoken')

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'dummy',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value })
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: 'google_' + Date.now(),
        isVerified: true,
        profilePhoto: profile.photos?.[0]?.value || ''
      })
    }
    done(null, user)
  } catch (err) {
    done(err, null)
  }
}))

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:5173/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    const user = encodeURIComponent(JSON.stringify({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      profilePhoto: req.user.profilePhoto || '',
      createdAt: req.user.createdAt
    }))
    res.redirect(`http://localhost:5173/auth/callback?token=${token}&user=${user}`)
  }
)

module.exports = router