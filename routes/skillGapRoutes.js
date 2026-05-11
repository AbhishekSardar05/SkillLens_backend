const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const { analyzeSkillGap, getJobRoles, getMyAnalyses } = require('../controllers/skillGapController')

router.post('/analyze', protect, analyzeSkillGap)
router.get('/roles', protect, getJobRoles)
router.get('/my', protect, getMyAnalyses)

module.exports = router