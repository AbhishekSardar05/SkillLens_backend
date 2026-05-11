// const User = require('../models/User')
// const Resume = require('../models/Resume')
// const Analysis = require('../models/Analysis')

// // ─── DASHBOARD STATS ───
// exports.getDashboardStats = async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments({ isAdmin: false })
//     const totalResumes = await Resume.countDocuments()
//     const totalAnalyses = await Analysis.countDocuments()

//     // Avg resume score
//     const scoreAgg = await Resume.aggregate([
//       { $group: { _id: null, avg: { $avg: '$score' } } }
//     ])
//     const avgScore = scoreAgg[0] ? Math.round(scoreAgg[0].avg) : 0

//     // Most targeted roles
//     const roleAgg = await Analysis.aggregate([
//       { $group: { _id: '$jobRole', count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//       { $limit: 5 }
//     ])

//     // Users growth (last 7 days)
//     const last7Days = []
//     for (let i = 6; i >= 0; i--) {
//       const date = new Date()
//       date.setDate(date.getDate() - i)
//       const start = new Date(date.setHours(0, 0, 0, 0))
//       const end = new Date(date.setHours(23, 59, 59, 999))
//       const count = await User.countDocuments({ createdAt: { $gte: start, $lte: end } })
//       last7Days.push({
//         date: start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
//         count
//       })
//     }

//     // Top skills from resumes
//     const skillsAgg = await Resume.aggregate([
//       { $unwind: '$skills' },
//       { $group: { _id: '$skills', count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//       { $limit: 10 }
//     ])

//     res.json({
//       totalUsers,
//       totalResumes,
//       totalAnalyses,
//       avgScore,
//       topRoles: roleAgg.map(r => ({ role: r._id, count: r.count })),
//       usersGrowth: last7Days,
//       topSkills: skillsAgg.map(s => ({ skill: s._id, count: s.count }))
//     })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// }

// // ─── USER MANAGEMENT ───
// exports.getAllUsers = async (req, res) => {
//   try {
//     const { search } = req.query
//     let query = { isAdmin: false }
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } }
//       ]
//     }
//     const users = await User.find(query).select('-password -otp').sort({ createdAt: -1 })

//     // Add resume count for each user
//     const usersWithCount = await Promise.all(users.map(async (user) => {
//       const resumeCount = await Resume.countDocuments({ user: user._id })
//       const analysisCount = await Analysis.countDocuments({ user: user._id })
//       return { ...user.toObject(), resumeCount, analysisCount }
//     }))

//     res.json(usersWithCount)
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// }

// exports.deleteUser = async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id)
//     await Resume.deleteMany({ user: req.params.id })
//     await Analysis.deleteMany({ user: req.params.id })
//     res.json({ message: 'User deleted successfully' })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// }

// exports.blockUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id)
//     if (!user) return res.status(404).json({ message: 'User not found' })
//     user.isBlocked = !user.isBlocked
//     await user.save()
//     res.json({ message: user.isBlocked ? 'User blocked' : 'User unblocked', isBlocked: user.isBlocked })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// }

// // ─── RESUME MANAGEMENT ───
// exports.getAllResumes = async (req, res) => {
//   try {
//     const resumes = await Resume.find()
//       .populate('user', 'name email')
//       .sort({ createdAt: -1 })
//     res.json(resumes)
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// }

// exports.deleteResume = async (req, res) => {
//   try {
//     await Resume.findByIdAndDelete(req.params.id)
//     res.json({ message: 'Resume deleted' })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// }

// // ─── ANALYSIS MONITORING ───
// exports.getAllAnalyses = async (req, res) => {
//   try {
//     const { role, userId } = req.query
//     let query = {}
//     if (role) query.jobRole = role
//     if (userId) query.user = userId
//     const analyses = await Analysis.find(query)
//       .populate('user', 'name email')
//       .sort({ createdAt: -1 })
//     res.json(analyses)
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// }

// // ─── SKILL ANALYTICS ───
// exports.getSkillAnalytics = async (req, res) => {
//   try {
//     // Most common skills
//     const commonSkills = await Resume.aggregate([
//       { $unwind: '$skills' },
//       { $group: { _id: '$skills', count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//       { $limit: 15 }
//     ])

//     // Most missing skills
//     const missingSkills = await Resume.aggregate([
//       { $unwind: '$feedback.missing' },
//       { $group: { _id: '$feedback.missing', count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//       { $limit: 10 }
//     ])

//     // Most targeted roles
//     const topRoles = await Analysis.aggregate([
//       { $group: { _id: '$jobRole', count: { $sum: 1 }, avgMatch: { $avg: '$matchPercentage' } } },
//       { $sort: { count: -1 } }
//     ])

//     res.json({
//       commonSkills: commonSkills.map(s => ({ skill: s._id, count: s.count })),
//       missingSkills: missingSkills.map(s => ({ skill: s._id, count: s.count })),
//       topRoles: topRoles.map(r => ({ role: r._id, count: r.count, avgMatch: Math.round(r.avgMatch || 0) }))
//     })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// }

const User = require('../models/User')
const Resume = require('../models/Resume')
const Analysis = require('../models/Analysis')
const ActivityLog = require('../models/ActivityLog')
const Feedback = require('../models/Feedback')

// ── DASHBOARD STATS ──
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false })
    const activeUsers = await User.countDocuments({ isAdmin: false, isBlocked: false })
    const blockedUsers = await User.countDocuments({ isBlocked: true })
    const adminUsers = await User.countDocuments({ isAdmin: true })
    const totalResumes = await Resume.countDocuments()
    const totalAnalyses = await Analysis.countDocuments()

    // Avg ATS Score
    const atsAgg = await Resume.aggregate([{ $group: { _id: null, avg: { $avg: '$atsScore' } } }])
    const avgATS = atsAgg[0] ? Math.round(atsAgg[0].avg) : 0

    // Avg Resume Score
    const scoreAgg = await Resume.aggregate([{ $group: { _id: null, avg: { $avg: '$score' } } }])
    const avgScore = scoreAgg[0] ? Math.round(scoreAgg[0].avg) : 0

    // Daily users last 7 days
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const start = new Date(date.setHours(0, 0, 0, 0))
      const end = new Date(date.setHours(23, 59, 59, 999))
      const count = await User.countDocuments({ createdAt: { $gte: start, $lte: end } })
      last7Days.push({ date: start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), count })
    }

    // Top 5 job roles
    const topRoles = await Analysis.aggregate([
      { $group: { _id: '$jobRole', count: { $sum: 1 }, avgMatch: { $avg: '$matchPercentage' } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])

    // Top skills
    const topSkills = await Resume.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])

    // ATS trend last 7 days
    const atsTrend = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const start = new Date(date.setHours(0, 0, 0, 0))
      const end = new Date(date.setHours(23, 59, 59, 999))
      const agg = await Resume.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end } } },
        { $group: { _id: null, avg: { $avg: '$atsScore' } } }
      ])
      atsTrend.push({ date: start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), avg: agg[0] ? Math.round(agg[0].avg) : 0 })
    }

    // AI Insights
    const missingSkillsAgg = await Resume.aggregate([
      { $unwind: '$feedback.missing' },
      { $group: { _id: '$feedback.missing', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ])

    const insights = []
    if (missingSkillsAgg[0]) insights.push(`Most users lack "${missingSkillsAgg[0]._id}" skill`)
    if (topRoles[0]) insights.push(`"${topRoles[0]._id}" is the most targeted role`)
    if (avgScore < 60) insights.push(`Average resume score is low (${avgScore}/100) — users need improvement`)
    else insights.push(`Average resume score is healthy at ${avgScore}/100`)
    if (avgATS < 60) insights.push(`ATS scores are below average — keyword optimization needed`)
    insights.push(`${blockedUsers} user${blockedUsers !== 1 ? 's' : ''} currently blocked`)

    res.json({
      totalUsers, activeUsers, blockedUsers, adminUsers,
      totalResumes, totalAnalyses, avgATS, avgScore,
      last7Days, atsTrend,
      topRoles: topRoles.map(r => ({ role: r._id, count: r.count, avgMatch: Math.round(r.avgMatch || 0) })),
      topSkills: topSkills.map(s => ({ skill: s._id, count: s.count })),
      insights
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ── USERS ──
exports.getAllUsers = async (req, res) => {
  try {
    const { search, filter, page = 1, limit = 10 } = req.query
    let query = {}

    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }]
    if (filter === 'active') query.isBlocked = false, query.isAdmin = false
    if (filter === 'blocked') query.isBlocked = true
    if (filter === 'admin') query.isAdmin = true

    const total = await User.countDocuments(query)
    const users = await User.find(query).select('-password -otp').sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(Number(limit))

    const enriched = await Promise.all(users.map(async u => {
      const resumeCount = await Resume.countDocuments({ user: u._id })
      const analysisCount = await Analysis.countDocuments({ user: u._id })
      return { ...u.toObject(), resumeCount, analysisCount }
    }))

    res.json({ users: enriched, total, pages: Math.ceil(total / limit), page: Number(page) })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    await Resume.deleteMany({ user: req.params.id })
    await Analysis.deleteMany({ user: req.params.id })
    await ActivityLog.create({ action: 'USER_DELETED', performedBy: req.user.id, targetId: req.params.id, details: 'User and all data deleted' })
    res.json({ message: 'User deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.blockUser = async (req, res) => {
  try {
    const { reason } = req.body
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    user.isBlocked = !user.isBlocked
    user.blockReason = user.isBlocked ? (reason || 'Blocked by admin') : ''
    await user.save()
    await ActivityLog.create({ action: user.isBlocked ? 'USER_BLOCKED' : 'USER_UNBLOCKED', performedBy: req.user.id, targetId: req.params.id, details: reason || '' })
    res.json({ message: user.isBlocked ? 'User blocked' : 'User unblocked', isBlocked: user.isBlocked })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.toggleAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    user.isAdmin = !user.isAdmin
    await user.save()
    await ActivityLog.create({ action: user.isAdmin ? 'MADE_ADMIN' : 'REMOVED_ADMIN', performedBy: req.user.id, targetId: req.params.id })
    res.json({ message: user.isAdmin ? 'User is now admin' : 'Admin removed', isAdmin: user.isAdmin })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// ── RESUMES ──
exports.getAllResumes = async (req, res) => {
  try {
    const { sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query
    const total = await Resume.countDocuments()
    const resumes = await Resume.find()
      .populate('user', 'name email profilePhoto')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit).limit(Number(limit))
    res.json({ resumes, total, pages: Math.ceil(total / limit), page: Number(page) })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.deleteResume = async (req, res) => {
  try {
    await Resume.findByIdAndDelete(req.params.id)
    await ActivityLog.create({ action: 'RESUME_DELETED', performedBy: req.user.id, targetId: req.params.id })
    res.json({ message: 'Resume deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// ── ANALYSES ──
exports.getAllAnalyses = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query
    let query = {}
    if (role) query.jobRole = role
    const total = await Analysis.countDocuments(query)
    const analyses = await Analysis.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(Number(limit))
    res.json({ analyses, total, pages: Math.ceil(total / limit), page: Number(page) })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// ── ANALYTICS ──
exports.getAnalytics = async (req, res) => {
  try {
    const commonSkills = await Resume.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } }, { $limit: 12 }
    ])

    const missingSkills = await Resume.aggregate([
      { $unwind: '$feedback.missing' },
      { $group: { _id: '$feedback.missing', count: { $sum: 1 } } },
      { $sort: { count: -1 } }, { $limit: 10 }
    ])

    const topRoles = await Analysis.aggregate([
      { $group: { _id: '$jobRole', count: { $sum: 1 }, avgMatch: { $avg: '$matchPercentage' } } },
      { $sort: { count: -1 } }
    ])

    const scoreDistribution = await Resume.aggregate([
      { $bucket: { groupBy: '$score', boundaries: [0, 20, 40, 60, 80, 100], default: '100+', output: { count: { $sum: 1 } } } }
    ])

    const matchDistribution = await Analysis.aggregate([
      { $bucket: { groupBy: '$matchPercentage', boundaries: [0, 20, 40, 60, 80, 100], default: '100+', output: { count: { $sum: 1 } } } }
    ])

    // Monthly user growth (last 6 months)
    const monthlyGrowth = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const start = new Date(d.getFullYear(), d.getMonth(), 1)
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59)
      const count = await User.countDocuments({ createdAt: { $gte: start, $lte: end } })
      monthlyGrowth.push({ month: start.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }), count })
    }

    res.json({
      commonSkills: commonSkills.map(s => ({ skill: s._id, count: s.count })),
      missingSkills: missingSkills.map(s => ({ skill: s._id, count: s.count })),
      topRoles: topRoles.map(r => ({ role: r._id, count: r.count, avgMatch: Math.round(r.avgMatch || 0) })),
      scoreDistribution,
      matchDistribution,
      monthlyGrowth
    })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// ── ACTIVITY LOGS ──
exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(50)
    res.json(logs)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// ── FEEDBACK ──
exports.getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
    res.json(feedbacks)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.submitFeedback = async (req, res) => {
  try {
    const { message, rating, type } = req.body
    const fb = await Feedback.create({ user: req.user.id, message, rating, type })
    res.json({ message: 'Feedback submitted!', fb })
  } catch (err) { res.status(500).json({ message: err.message }) }
}
