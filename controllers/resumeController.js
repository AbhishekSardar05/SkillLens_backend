const Resume = require('../models/Resume')
const fs = require('fs')
const PDFParser = require('pdf2json')
const PDFDocument = require('pdfkit')

const SKILLS_LIST = [
  'javascript', 'python', 'java', 'c++', 'c#', 'typescript', 'php', 'ruby', 'swift', 'kotlin', 'go', 'rust', 'r', 'matlab',
  'react', 'vue', 'angular', 'html', 'css', 'sass', 'tailwind', 'bootstrap', 'nextjs', 'next.js', 'gatsby', 'redux', 'jquery', 'webpack', 'vite', 'html5', 'css3',
  'nodejs', 'node.js', 'express', 'django', 'flask', 'spring', 'fastapi', 'laravel', 'spring boot', 'asp.net',
  'mongodb', 'mysql', 'postgresql', 'redis', 'firebase', 'sqlite', 'dynamodb', 'sql', 'nosql', 'oracle',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'github', 'gitlab', 'linux', 'ci/cd', 'devops', 'terraform',
  'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn',
  'data analysis', 'data science', 'nlp', 'computer vision', 'tableau', 'power bi', 'excel',
  'graphql', 'rest api', 'restful', 'microservices', 'figma', 'system design', 'selenium', 'jest', 'mocha', 'cypress',
  'agile', 'scrum', 'jira', 'postman', 'bash', 'shell', 'problem solving', 'communication', 'leadership', 'teamwork'
]

const ATS_KEYWORDS = ['achieved', 'improved', 'developed', 'managed', 'led', 'created', 'designed', 'implemented', 'built', 'launched', 'increased', 'reduced', 'optimized', 'collaborated', 'delivered', 'maintained', 'analyzed', 'tested', 'deployed']

const PERSONAL_INFO_PATTERN = /\b(gender|marital|address|phone|mobile|email|nationality|dob|date of birth|father|mother|religion|caste|blood group|height|weight|languages known|hobby|hobbies|declaration|passport)\b/i

const extractTextFromPDF = (filePath) => {
  return new Promise((resolve) => {
    try {
      const pdfParser = new PDFParser()
      pdfParser.on('pdfParser_dataError', () => resolve(''))
      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        try {
          let text = ''
          pdfData.Pages.forEach(page => {
            page.Texts.forEach(t => t.R.forEach(r => { text += decodeURIComponent(r.T) + ' ' }))
            text += '\n'
          })
          resolve(text)
        } catch { resolve('') }
      })
      pdfParser.loadPDF(filePath)
    } catch { resolve('') }
  })
}

// Find where each section starts/ends
const getSectionBounds = (lines) => {
  const patterns = {
    education: /^(education|academic background|qualifications?)$/i,
    experience: /^(experience|work experience|employment history|internship|professional experience)$/i,
    projects: /^(projects?|personal projects?|academic projects?|key projects?|work\/projects?)$/i,
    skills: /^(skills?|technical skills?|core competencies|key skills?)$/i,
    summary: /^(summary|objective|career objective|professional summary|about me|profile)$/i,
    certifications: /^(certifications?|courses?|achievements?|awards?|accomplishments?)$/i,
    interests: /^(interests?|hobbies|extra.?curricular|activities)$/i,
    personal: /^(personal (details?|information|data)|declaration|references?)$/i,
  }
  const bounds = {}
  lines.forEach((line, idx) => {
    const t = line.trim()
    if (t.length < 2 || t.length > 60) return
    for (const [section, pat] of Object.entries(patterns)) {
      if (pat.test(t)) {
        if (!bounds[section]) {
          bounds[section] = { start: idx, end: lines.length }
          // Close previous open sections
          for (const [s, b] of Object.entries(bounds)) {
            if (b.end === lines.length && b.start < idx) bounds[s].end = idx
          }
        }
      }
    }
  })
  return bounds
}

const extractSkills = (text) => {
  const lower = text.toLowerCase()
  return SKILLS_LIST.filter(s => lower.includes(s.toLowerCase()))
}

const extractEducation = (text) => {
  const lines = text.split(/[\n\r]+/).map(l => l.trim()).filter(Boolean)
  const bounds = getSectionBounds(lines)
  const results = []

  const degreeRe = /\b(b\.?tech|b\.?e\.?|b\.?sc\.?|b\.?com|bca|bba|bachelor|b\.?a\.?|m\.?tech|m\.?e\.?|m\.?sc\.?|mca|mba|master|m\.?a\.?|ph\.?d|10th|12th|hsc|ssc|intermediate|diploma)\b/i
  const instRe = /\b(university|college|institute|school|iit|nit|bits|iiit|academy|polytechnic)\b/i
  const yearRe = /\b(19|20)\d{2}\b/

  // Only search within education section
  let searchStart = 0
  let searchEnd = lines.length
  if (bounds.education) { searchStart = bounds.education.start + 1; searchEnd = bounds.education.end }
  // Stop before personal section
  if (bounds.personal && bounds.personal.start < searchEnd) searchEnd = bounds.personal.start
  if (bounds.interests && bounds.interests.start < searchEnd) searchEnd = bounds.interests.start

  const searchLines = lines.slice(searchStart, searchEnd)

  searchLines.forEach((line, i) => {
    if (PERSONAL_INFO_PATTERN.test(line)) return
    if (/@/.test(line)) return
    if (/\+?\d{10,}/.test(line)) return
    if (line.split(',').length > 3) return // Likely an address

    const isDegree = degreeRe.test(line)
    const isInst = instRe.test(line)
    if (!isDegree && !isInst) return

    const year = (line + ' ' + (searchLines[i + 1] || '')).match(yearRe)?.[0] || ''
    const dup = results.some(r => r.degree?.slice(0, 20) === line.slice(0, 20) || r.institution?.slice(0, 20) === line.slice(0, 20))
    if (dup) return

    if (isDegree) {
      const nextLine = searchLines[i + 1] || ''
      results.push({
        degree: line.slice(0, 100),
        institution: instRe.test(nextLine) ? nextLine.slice(0, 100) : '',
        year
      })
    } else {
      results.push({ degree: '', institution: line.slice(0, 100), year })
    }
  })

  return results.slice(0, 5)
}

const extractExperience = (text) => {
  const lines = text.split(/[\n\r]+/).map(l => l.trim()).filter(Boolean)
  const bounds = getSectionBounds(lines)
  const results = []

  const jobRe = /\b(intern|engineer|developer|analyst|manager|designer|consultant|associate|lead|senior|junior|trainee|executive|architect|specialist)\b/i
  const dateRe = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,]*\d{4}|\d{4}\s*[-–]\s*(\d{4}|present|current)/i

  let searchStart = bounds.experience ? bounds.experience.start + 1 : 0
  let searchEnd = bounds.experience ? bounds.experience.end : lines.length

  const searchLines = lines.slice(searchStart, searchEnd)

  searchLines.forEach((line, i) => {
    if (PERSONAL_INFO_PATTERN.test(line)) return
    if (!jobRe.test(line) || line.length > 150) return
    const dup = results.some(r => r.title?.slice(0, 20) === line.slice(0, 20))
    if (dup) return

    const context = searchLines.slice(Math.max(0, i - 1), i + 4).join(' ')
    const dateMatch = context.match(dateRe)?.[0] || ''
    const nextLine = searchLines[i + 1] || ''
    const company = (!jobRe.test(nextLine) && !dateRe.test(nextLine) && nextLine.length > 2 && nextLine.length < 80) ? nextLine : ''

    results.push({ title: line.slice(0, 100), company: company.slice(0, 80), duration: dateMatch.slice(0, 50) })
  })

  return results.slice(0, 5)
}

const extractProjects = (text) => {
  const lines = text.split(/[\n\r]+/).map(l => l.trim()).filter(Boolean)
  const bounds = getSectionBounds(lines)
  const results = []

  const techRe = /\b(react|node|python|java|django|flask|mongodb|mysql|postgresql|aws|docker|next\.?js|vue|angular|typescript|javascript|express|spring|firebase|redis|graphql|html|css|tailwind|bootstrap|php|kotlin|swift|c\+\+|git|github)\b/gi
  const bulletRe = /^[•\-\*▪◦➤►→]\s*/

  if (bounds.projects) {
    const projLines = lines.slice(bounds.projects.start + 1, bounds.projects.end)
    let current = null

    projLines.forEach((line, i) => {
      if (PERSONAL_INFO_PATTERN.test(line) || !line || line.length < 2) return

      const clean = line.replace(bulletRe, '').trim()
      const techs = [...new Set((clean.match(techRe) || []).map(t => t.toLowerCase()))]
      const isBullet = bulletRe.test(line)
      const isTitle = clean.length > 3 && clean.length < 80 && (!isBullet || i === 0)

      if (isTitle && (!current || i === 0)) {
        if (current) results.push(current)
        current = { name: clean.slice(0, 100), tech: techs, description: '' }
      } else if (current) {
        current.tech = [...new Set([...current.tech, ...techs])]
        if (!current.description && clean.length > 20) current.description = clean.slice(0, 200)
      }
    })
    if (current) results.push(current)
  }

  // Fallback
  if (results.length === 0) {
    const indicators = /\b(built|developed|created|designed|implemented)\b/i
    lines.forEach((line, i) => {
      if (PERSONAL_INFO_PATTERN.test(line) || !indicators.test(line) || line.length > 150) return
      const techs = [...new Set((line.match(techRe) || []).map(t => t.toLowerCase()))]
      results.push({ name: line.slice(0, 100), tech: techs, description: lines[i + 1]?.slice(0, 200) || '' })
    })
  }

  return results.filter(p => p.name.length > 3).slice(0, 6)
}

const calcSectionScores = (text, skills, education, experience, projects) => {
  const lower = text.toLowerCase()
  const skillsS = Math.min(skills.length * 3, 25)
  let expS = 0
  if (experience.length > 0) expS += 10
  if (experience.length >= 2) expS += 8
  expS += Math.min(ATS_KEYWORDS.filter(k => lower.includes(k)).length * 1.5, 7)
  expS = Math.min(expS, 25)
  let eduS = education.length > 0 ? 12 : 0
  if (education.length >= 2) eduS += 5
  if (/cgpa|gpa|\d+\.\d+/.test(text)) eduS += 3
  eduS = Math.min(eduS, 20)
  let projS = 0
  if (projects.length > 0) projS += 8
  if (projects.length >= 2) projS += 7
  if (projects.length >= 3) projS += 5
  projS = Math.min(projS, 20)
  let fmtS = 0
  if (text.length > 500) fmtS += 3
  if (text.length > 1500) fmtS += 3
  if (/email|phone|linkedin|github/i.test(text)) fmtS += 4
  fmtS = Math.min(fmtS, 10)
  const total = Math.min(Math.round(skillsS + expS + eduS + projS + fmtS), 100)
  return { skills: Math.round(skillsS), experience: Math.round(expS), education: Math.round(eduS), projects: Math.round(projS), formatting: Math.round(fmtS), total }
}

const calcATS = (text, skills) => {
  let s = Math.min(skills.length * 3, 30)
  s += Math.min(ATS_KEYWORDS.filter(k => text.toLowerCase().includes(k)).length * 2, 20)
  if (/email|phone|linkedin/i.test(text)) s += 10
  if (text.length > 800) s += 10
  if (text.length > 1500) s += 5
  if (/\d+%|\d+x|\$\d+/i.test(text)) s += 10
  s += Math.floor(Math.random() * 8) + 5
  return Math.min(s, 100)
}

const genFeedback = (text, skills, education, experience, projects, scores) => {
  const missing = ['leadership', 'teamwork', 'communication', 'problem solving', 'agile', 'git'].filter(k => !text.toLowerCase().includes(k))
  const weak = []
  if (scores.skills < 15) weak.push('Skills section needs more technical keywords')
  if (scores.experience < 15) weak.push('Experience section lacks strong action verbs')
  if (scores.projects < 12) weak.push('Add more projects with tech stack details')
  if (scores.formatting < 7) weak.push('Add contact info: email, phone, LinkedIn, GitHub')
  const suggestions = []
  if (skills.length < 8) suggestions.push('Add more relevant technical skills (aim for 10+)')
  if (experience.length === 0) suggestions.push('Add internship or work experience')
  if (projects.length < 2) suggestions.push('Add 2-3 projects with GitHub links')
  if (!/\d+%|\d+x/i.test(text)) suggestions.push('Quantify achievements (e.g., "Improved performance by 40%")')
  if (!/linkedin/i.test(text)) suggestions.push('Add your LinkedIn profile URL')
  if (!/github/i.test(text)) suggestions.push('Add your GitHub profile URL')
  suggestions.push('Use strong action verbs: Led, Built, Optimized, Delivered')
  suggestions.push('Keep resume to 1-2 pages for best ATS results')
  return { missing: missing.slice(0, 6), weak: weak.slice(0, 4), suggestions: suggestions.slice(0, 6) }
}

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    const extractedText = await extractTextFromPDF(req.file.path)
    console.log('Text length:', extractedText.length)

    const skills = extractSkills(extractedText)
    const education = extractEducation(extractedText)
    const experience = extractExperience(extractedText)
    const projects = extractProjects(extractedText)
    const sectionScores = calcSectionScores(extractedText, skills, education, experience, projects)
    const atsScore = calcATS(extractedText, skills)
    const placementReadiness = Math.min(Math.round(sectionScores.total * 0.6 + atsScore * 0.4), 100)
    const feedback = genFeedback(extractedText, skills, education, experience, projects, sectionScores)

    console.log('Skills:', skills.length, '| Edu:', education.length, '| Exp:', experience.length, '| Proj:', projects.length)

    const resume = await Resume.create({
      user: req.user.id,
      fileName: req.file.originalname,
      extractedText: extractedText.slice(0, 5000),
      skills, education, experience, projects,
      score: sectionScores.total, atsScore, placementReadiness,
      sectionScores, feedback
    })

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path)

    res.json({
      message: 'Resume analyzed successfully!',
      resume: {
        id: resume._id, fileName: resume.fileName,
        skills, education, experience, projects,
        resumeScore: sectionScores.total, atsScore, placementReadiness,
        sectionScores, feedback, totalSkills: skills.length
      }
    })
  } catch (err) {
    console.log('Error:', err.message)
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path)
    res.status(500).json({ message: err.message })
  }
}

exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(resumes)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.generateReport = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id)
    if (!resume) return res.status(404).json({ message: 'Resume not found' })
    const doc = new PDFDocument({ margin: 50, size: 'A4' })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=SkillLens_Report.pdf`)
    doc.pipe(res)
    doc.rect(0, 0, 612, 110).fill('#0f0f1a')
    doc.fontSize(26).fillColor('#7c3aed').font('Helvetica-Bold').text('SkillLens', 50, 30)
    doc.fontSize(11).fillColor('#8b8aad').font('Helvetica').text('AI Resume Analysis Report', 50, 62)
    doc.fontSize(9).fillColor('#555577').text(`${new Date().toLocaleDateString()} | ${resume.fileName}`, 50, 82)
    let y = 130
    doc.fontSize(13).fillColor('#1a1a2e').font('Helvetica-Bold').text('Scores', 50, y); y += 25
    const cards = [{ l: 'Resume Score', v: `${resume.score}/100`, c: resume.score >= 70 ? '#22c55e' : '#f59e0b' }, { l: 'ATS Score', v: `${resume.atsScore}/100`, c: resume.atsScore >= 70 ? '#22c55e' : '#f59e0b' }, { l: 'Placement', v: `${resume.placementReadiness}%`, c: '#6366f1' }]
    cards.forEach((c, i) => { const x = 50 + i * 175; doc.roundedRect(x, y, 160, 70, 8).fill('#f8f9ff'); doc.fontSize(8).fillColor('#8b8aad').font('Helvetica').text(c.l.toUpperCase(), x + 12, y + 10); doc.fontSize(24).fillColor(c.c).font('Helvetica-Bold').text(c.v, x + 12, y + 26) })
    y += 90
    if (resume.skills?.length > 0) { doc.fontSize(13).fillColor('#1a1a2e').font('Helvetica-Bold').text(`Skills (${resume.skills.length})`, 50, y); y += 20; let x = 50; resume.skills.forEach(sk => { const w = sk.length * 6.5 + 18; if (x + w > 550) { x = 50; y += 26 }; doc.roundedRect(x, y, w, 20, 4).fill('#ede9fe'); doc.fontSize(8.5).fillColor('#7c3aed').font('Helvetica-Bold').text(sk, x + 7, y + 6); x += w + 6 }); y += 36 }
    if (resume.education?.length > 0) { doc.fontSize(13).fillColor('#1a1a2e').font('Helvetica-Bold').text('Education', 50, y); y += 20; resume.education.forEach(e => { doc.circle(58, y + 5, 3).fill('#7c3aed'); doc.fontSize(10).fillColor('#111827').font('Helvetica-Bold').text(e.degree || e.institution, 70, y, { width: 480 }); if (e.institution && e.degree) { y += 14; doc.fontSize(9).fillColor('#6b7280').font('Helvetica').text(e.institution, 70, y) }; y += 20 }); y += 5 }
    if (resume.experience?.length > 0) { doc.fontSize(13).fillColor('#1a1a2e').font('Helvetica-Bold').text('Experience', 50, y); y += 20; resume.experience.forEach(e => { doc.circle(58, y + 5, 3).fill('#6366f1'); doc.fontSize(10).fillColor('#111827').font('Helvetica-Bold').text(e.title, 70, y, { width: 480 }); if (e.company) { y += 14; doc.fontSize(9).fillColor('#6b7280').font('Helvetica').text(e.company, 70, y) }; y += 20 }); y += 5 }
    if (resume.projects?.length > 0) { doc.fontSize(13).fillColor('#1a1a2e').font('Helvetica-Bold').text('Projects', 50, y); y += 20; resume.projects.slice(0, 4).forEach(p => { doc.circle(58, y + 5, 3).fill('#3b82f6'); doc.fontSize(10).fillColor('#111827').font('Helvetica-Bold').text(p.name, 70, y, { width: 480 }); if (p.tech?.length > 0) { y += 14; doc.fontSize(9).fillColor('#6b7280').font('Helvetica').text(`Tech: ${p.tech.join(', ')}`, 70, y) }; y += 20 }); y += 5 }
    if (resume.feedback?.suggestions?.length > 0) { doc.fontSize(13).fillColor('#1a1a2e').font('Helvetica-Bold').text('Suggestions', 50, y); y += 16; resume.feedback.suggestions.forEach(s => { doc.circle(58, y + 4, 3).fill('#7c3aed'); doc.fontSize(9).fillColor('#374151').font('Helvetica').text(s, 70, y, { width: 490 }); y += 16 }) }
    doc.rect(0, 780, 612, 62).fill('#0f0f1a')
    doc.fontSize(9).fillColor('#7c3aed').font('Helvetica-Bold').text('SkillLens — AI Career Intelligence', 50, 793)
    doc.end()
  } catch (err) { res.status(500).json({ message: err.message }) }
}
