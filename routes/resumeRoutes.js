const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const protect = require('../middleware/authMiddleware')
const { uploadResume, getResumes, generateReport } = require('../controllers/resumeController')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true)
    else cb(new Error('Only PDF files allowed'))
  }
})

router.post('/upload', protect, upload.single('resume'), uploadResume)
router.get('/my', protect, getResumes)
router.get('/report/:id', protect, generateReport)

module.exports = router