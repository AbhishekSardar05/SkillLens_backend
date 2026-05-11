const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const fs = require('fs')
const path = require('path')
const session = require('express-session')
const passport = require('passport')

dotenv.config()
connectDB()

const app = express()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

// Session for Google Auth
app.use(session({
  secret: process.env.SESSION_SECRET || 'skilllens_secret_2026',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Create folders
// if (!fs.existsSync('uploads')) fs.mkdirSync('uploads')
// if (!fs.existsSync('uploads/profiles')) fs.mkdirSync('uploads/profiles', { recursive: true })

// Routes
const authRoutes = require('./routes/authRoutes')
const resumeRoutes = require('./routes/resumeRoutes')
const skillGapRoutes = require('./routes/skillGapRoutes')
const adminRoutes = require('./routes/adminRoutes')
const aiRoutes = require('./routes/aiRoutes')

app.use('/api/auth', authRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/skillgap', skillGapRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/ai', aiRoutes)

app.get('/', (req, res) => res.json({ message: 'SkillLens API Running! 🚀' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
