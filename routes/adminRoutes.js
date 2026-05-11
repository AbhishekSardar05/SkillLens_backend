// const express = require('express')
// const router = express.Router()
// const adminProtect = require('../middleware/adminMiddleware')
// const {
//   getDashboardStats,
//   getAllUsers, deleteUser, blockUser,
//   getAllResumes, deleteResume,
//   getAllAnalyses,
//   getSkillAnalytics
// } = require('../controllers/adminController')

// router.get('/stats', adminProtect, getDashboardStats)

// router.get('/users', adminProtect, getAllUsers)
// router.delete('/users/:id', adminProtect, deleteUser)
// router.put('/users/:id/block', adminProtect, blockUser)

// router.get('/resumes', adminProtect, getAllResumes)
// router.delete('/resumes/:id', adminProtect, deleteResume)

// router.get('/analyses', adminProtect, getAllAnalyses)

// router.get('/analytics', adminProtect, getSkillAnalytics)

// module.exports = router

const express = require('express')
const router = express.Router()
const adminProtect = require('../middleware/adminMiddleware')
const protect = require('../middleware/authMiddleware')
const {
  getDashboardStats,
  getAllUsers, deleteUser, blockUser, toggleAdmin,
  getAllResumes, deleteResume,
  getAllAnalyses,
  getAnalytics,
  getActivityLogs,
  getFeedback, submitFeedback
} = require('../controllers/adminController')

router.get('/stats', adminProtect, getDashboardStats)

router.get('/users', adminProtect, getAllUsers)
router.delete('/users/:id', adminProtect, deleteUser)
router.put('/users/:id/block', adminProtect, blockUser)
router.put('/users/:id/toggle-admin', adminProtect, toggleAdmin)

router.get('/resumes', adminProtect, getAllResumes)
router.delete('/resumes/:id', adminProtect, deleteResume)

router.get('/analyses', adminProtect, getAllAnalyses)
router.get('/analytics', adminProtect, getAnalytics)
router.get('/logs', adminProtect, getActivityLogs)

router.get('/feedback', adminProtect, getFeedback)
router.post('/feedback', protect, submitFeedback)

module.exports = router
