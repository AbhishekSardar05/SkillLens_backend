const Analysis = require('../models/Analysis')

const JOB_ROLES = {
  'Frontend Developer': {
    required: [
      { skill: 'html', level: 'Advanced', priority: 'High' },
      { skill: 'css', level: 'Advanced', priority: 'High' },
      { skill: 'javascript', level: 'Advanced', priority: 'High' },
      { skill: 'react', level: 'Advanced', priority: 'High' },
      { skill: 'typescript', level: 'Intermediate', priority: 'High' },
      { skill: 'git', level: 'Intermediate', priority: 'High' },
      { skill: 'redux', level: 'Intermediate', priority: 'Medium' },
      { skill: 'tailwind', level: 'Intermediate', priority: 'Medium' },
      { skill: 'webpack', level: 'Beginner', priority: 'Medium' },
      { skill: 'testing', level: 'Beginner', priority: 'Low' },
      { skill: 'figma', level: 'Beginner', priority: 'Low' },
      { skill: 'nextjs', level: 'Intermediate', priority: 'Medium' },
    ],
    roadmap: [
      { week: '1–2', task: 'Master HTML5, CSS3 & Flexbox/Grid layouts', type: 'foundation' },
      { week: '3–4', task: 'Deep dive into JavaScript ES6+ concepts', type: 'core' },
      { week: '5–6', task: 'Build 3 React.js projects with hooks', type: 'framework' },
      { week: '7', task: 'Learn TypeScript basics and integrate with React', type: 'advanced' },
      { week: '8', task: 'State management with Redux Toolkit', type: 'advanced' },
      { week: '9–10', task: 'Build and deploy portfolio + apply for jobs', type: 'job_prep' },
    ],
    projects: [
      { name: 'Portfolio Website', desc: 'Build a responsive portfolio with React & Tailwind', skills: ['react', 'tailwind', 'html', 'css'] },
      { name: 'E-Commerce Frontend', desc: 'Full shopping cart with Redux state management', skills: ['react', 'redux', 'javascript'] },
      { name: 'Real-time Dashboard', desc: 'Admin dashboard with charts and live data', skills: ['react', 'typescript', 'css'] },
    ],
    interviews: [
      'What is the Virtual DOM and how does React use it?',
      'Explain the difference between useState and useReducer.',
      'How does CSS specificity work?',
      'What are React hooks and why were they introduced?',
      'Explain event delegation in JavaScript.',
      'What is the difference between == and === in JavaScript?',
      'How do you optimize React application performance?',
      'What is Flexbox and when would you use Grid instead?',
      'Explain closure in JavaScript with an example.',
      'What is the purpose of the key prop in React lists?',
    ]
  },
  'Backend Developer': {
    required: [
      { skill: 'nodejs', level: 'Advanced', priority: 'High' },
      { skill: 'express', level: 'Advanced', priority: 'High' },
      { skill: 'mongodb', level: 'Advanced', priority: 'High' },
      { skill: 'sql', level: 'Intermediate', priority: 'High' },
      { skill: 'rest api', level: 'Advanced', priority: 'High' },
      { skill: 'git', level: 'Intermediate', priority: 'High' },
      { skill: 'docker', level: 'Intermediate', priority: 'Medium' },
      { skill: 'aws', level: 'Beginner', priority: 'Medium' },
      { skill: 'redis', level: 'Beginner', priority: 'Medium' },
      { skill: 'testing', level: 'Intermediate', priority: 'Medium' },
      { skill: 'microservices', level: 'Beginner', priority: 'Low' },
    ],
    roadmap: [
      { week: '1–2', task: 'Master Node.js core concepts and async programming', type: 'foundation' },
      { week: '3–4', task: 'Build REST APIs with Express.js', type: 'core' },
      { week: '5–6', task: 'MongoDB, Mongoose, and database design', type: 'database' },
      { week: '7', task: 'JWT Authentication and security best practices', type: 'security' },
      { week: '8', task: 'Docker basics and deployment on AWS/Railway', type: 'devops' },
      { week: '9–10', task: 'Build 2 complete backend projects + GitHub showcase', type: 'job_prep' },
    ],
    projects: [
      { name: 'REST API Server', desc: 'Full CRUD API with auth, pagination, and validation', skills: ['nodejs', 'express', 'mongodb'] },
      { name: 'Real-time Chat Backend', desc: 'WebSocket chat server with rooms and history', skills: ['nodejs', 'redis', 'mongodb'] },
      { name: 'Microservices API', desc: 'Split monolith into microservices with Docker', skills: ['docker', 'nodejs', 'microservices'] },
    ],
    interviews: [
      'What is the event loop in Node.js?',
      'Explain the difference between SQL and NoSQL databases.',
      'How do you handle authentication with JWT?',
      'What are middleware functions in Express.js?',
      'How do you prevent SQL injection attacks?',
      'Explain database indexing and why it matters.',
      'What is REST and what are its principles?',
      'How do you scale a Node.js application?',
      'What is the difference between PUT and PATCH?',
      'Explain CORS and how to handle it.',
    ]
  },
  'Full Stack Developer': {
    required: [
      { skill: 'react', level: 'Advanced', priority: 'High' },
      { skill: 'nodejs', level: 'Advanced', priority: 'High' },
      { skill: 'mongodb', level: 'Intermediate', priority: 'High' },
      { skill: 'javascript', level: 'Advanced', priority: 'High' },
      { skill: 'rest api', level: 'Advanced', priority: 'High' },
      { skill: 'git', level: 'Intermediate', priority: 'High' },
      { skill: 'html', level: 'Advanced', priority: 'Medium' },
      { skill: 'css', level: 'Advanced', priority: 'Medium' },
      { skill: 'typescript', level: 'Intermediate', priority: 'Medium' },
      { skill: 'docker', level: 'Beginner', priority: 'Low' },
      { skill: 'aws', level: 'Beginner', priority: 'Low' },
    ],
    roadmap: [
      { week: '1–2', task: 'Solidify HTML, CSS & JavaScript fundamentals', type: 'foundation' },
      { week: '3–4', task: 'React.js with hooks and state management', type: 'frontend' },
      { week: '5–6', task: 'Node.js + Express REST API development', type: 'backend' },
      { week: '7', task: 'Connect frontend + backend + MongoDB integration', type: 'integration' },
      { week: '8–9', task: 'Build 2 complete full-stack MERN projects', type: 'projects' },
      { week: '10', task: 'Deploy on Vercel + Railway, prepare portfolio', type: 'job_prep' },
    ],
    projects: [
      { name: 'MERN Blog Platform', desc: 'Full blog with auth, CRUD, comments & rich editor', skills: ['react', 'nodejs', 'mongodb'] },
      { name: 'Task Management App', desc: 'Kanban board with drag-drop and real-time updates', skills: ['react', 'nodejs', 'websocket'] },
      { name: 'E-Commerce Platform', desc: 'Complete shop with payment and admin dashboard', skills: ['react', 'nodejs', 'mongodb', 'stripe'] },
    ],
    interviews: [
      'How does the MERN stack work together?',
      'Explain the difference between SSR and CSR.',
      'How do you handle state in large React applications?',
      'What is the purpose of middleware in Express?',
      'How do you optimize API performance?',
      'Explain database schema design for a social media app.',
      'What is CORS and how do you handle it?',
      'How would you implement real-time features?',
      'What are React performance optimization techniques?',
      'Explain JWT vs Session-based authentication.',
    ]
  },
  'Data Scientist': {
    required: [
      { skill: 'python', level: 'Advanced', priority: 'High' },
      { skill: 'pandas', level: 'Advanced', priority: 'High' },
      { skill: 'numpy', level: 'Advanced', priority: 'High' },
      { skill: 'machine learning', level: 'Advanced', priority: 'High' },
      { skill: 'sql', level: 'Intermediate', priority: 'High' },
      { skill: 'data analysis', level: 'Advanced', priority: 'High' },
      { skill: 'tensorflow', level: 'Intermediate', priority: 'Medium' },
      { skill: 'tableau', level: 'Intermediate', priority: 'Medium' },
      { skill: 'deep learning', level: 'Intermediate', priority: 'Medium' },
      { skill: 'git', level: 'Beginner', priority: 'Low' },
    ],
    roadmap: [
      { week: '1–2', task: 'Python programming and data structures', type: 'foundation' },
      { week: '3–4', task: 'Data manipulation with Pandas & NumPy', type: 'data' },
      { week: '5–6', task: 'Machine learning algorithms with Scikit-learn', type: 'ml' },
      { week: '7', task: 'Data visualization: Matplotlib, Seaborn, Tableau', type: 'visualization' },
      { week: '8–9', task: 'Deep learning with TensorFlow/PyTorch', type: 'advanced' },
      { week: '10', task: '2 Kaggle projects + GitHub portfolio', type: 'job_prep' },
    ],
    projects: [
      { name: 'Sales Prediction Model', desc: 'ML model to predict sales with 85%+ accuracy', skills: ['python', 'pandas', 'machine learning'] },
      { name: 'Customer Segmentation', desc: 'K-means clustering for customer analysis', skills: ['python', 'numpy', 'data analysis'] },
      { name: 'NLP Sentiment Analyzer', desc: 'Analyze tweet sentiment with deep learning', skills: ['python', 'deep learning', 'nlp'] },
    ],
    interviews: [
      'What is the difference between supervised and unsupervised learning?',
      'Explain overfitting and how to prevent it.',
      'What is the bias-variance tradeoff?',
      'How do you handle missing data?',
      'Explain the difference between correlation and causation.',
      'What is cross-validation and why is it used?',
      'How does gradient descent work?',
      'What are the steps in a data science project?',
      'Explain precision vs recall.',
      'What is feature engineering?',
    ]
  },
  'DevOps Engineer': {
    required: [
      { skill: 'docker', level: 'Advanced', priority: 'High' },
      { skill: 'kubernetes', level: 'Advanced', priority: 'High' },
      { skill: 'linux', level: 'Advanced', priority: 'High' },
      { skill: 'ci/cd', level: 'Advanced', priority: 'High' },
      { skill: 'aws', level: 'Advanced', priority: 'High' },
      { skill: 'git', level: 'Advanced', priority: 'High' },
      { skill: 'bash', level: 'Intermediate', priority: 'High' },
      { skill: 'terraform', level: 'Intermediate', priority: 'Medium' },
      { skill: 'jenkins', level: 'Intermediate', priority: 'Medium' },
      { skill: 'python', level: 'Beginner', priority: 'Low' },
    ],
    roadmap: [
      { week: '1–2', task: 'Linux fundamentals and bash scripting', type: 'foundation' },
      { week: '3–4', task: 'Docker containerization and Docker Compose', type: 'containers' },
      { week: '5–6', task: 'Kubernetes orchestration and deployment', type: 'orchestration' },
      { week: '7', task: 'CI/CD pipelines with Jenkins/GitHub Actions', type: 'automation' },
      { week: '8–9', task: 'AWS services: EC2, S3, RDS, EKS', type: 'cloud' },
      { week: '10', task: 'Infrastructure as Code with Terraform', type: 'iac' },
    ],
    projects: [
      { name: 'CI/CD Pipeline', desc: 'Automated pipeline for MERN app deployment', skills: ['docker', 'jenkins', 'aws'] },
      { name: 'Kubernetes Cluster', desc: 'Multi-service app deployed on K8s cluster', skills: ['kubernetes', 'docker', 'linux'] },
      { name: 'IaC with Terraform', desc: 'Full AWS infrastructure with Terraform', skills: ['terraform', 'aws', 'ci/cd'] },
    ],
    interviews: [
      'What is the difference between Docker and Kubernetes?',
      'How does CI/CD work?',
      'Explain the difference between blue-green and canary deployments.',
      'What is Infrastructure as Code?',
      'How do you monitor a production application?',
      'What is a Kubernetes Pod?',
      'Explain load balancing strategies.',
      'How do you handle secrets in DevOps?',
      'What is the purpose of a reverse proxy?',
      'Explain horizontal vs vertical scaling.',
    ]
  },
  'Data Analyst': {
    required: [
      { skill: 'sql', level: 'Advanced', priority: 'High' },
      { skill: 'excel', level: 'Advanced', priority: 'High' },
      { skill: 'python', level: 'Intermediate', priority: 'High' },
      { skill: 'data analysis', level: 'Advanced', priority: 'High' },
      { skill: 'tableau', level: 'Advanced', priority: 'High' },
      { skill: 'power bi', level: 'Intermediate', priority: 'Medium' },
      { skill: 'pandas', level: 'Intermediate', priority: 'Medium' },
      { skill: 'communication', level: 'Advanced', priority: 'High' },
    ],
    roadmap: [
      { week: '1–2', task: 'SQL mastery: joins, subqueries, window functions', type: 'foundation' },
      { week: '3–4', task: 'Excel advanced: pivot tables, VLOOKUP, macros', type: 'tools' },
      { week: '5–6', task: 'Python with Pandas for data analysis', type: 'programming' },
      { week: '7–8', task: 'Data visualization with Tableau/Power BI', type: 'visualization' },
      { week: '9–10', task: 'Real datasets + portfolio dashboard projects', type: 'job_prep' },
    ],
    projects: [
      { name: 'Sales Analytics Dashboard', desc: 'Tableau dashboard with 10+ KPI metrics', skills: ['tableau', 'sql', 'excel'] },
      { name: 'Customer Churn Analysis', desc: 'Python analysis to find churn patterns', skills: ['python', 'pandas', 'data analysis'] },
      { name: 'Revenue Forecasting', desc: 'Predict monthly revenue with historical data', skills: ['python', 'sql', 'power bi'] },
    ],
    interviews: [
      'What is the difference between INNER and LEFT JOIN?',
      'How do you handle null values in SQL?',
      'What is a pivot table used for?',
      'Explain the difference between OLAP and OLTP.',
      'How would you find the top 3 products by sales?',
      'What metrics would you track for an e-commerce business?',
      'How do you deal with duplicate data?',
      'What is data normalization?',
      'Explain a time you found an insight from data.',
      'What is the difference between mean, median, and mode?',
    ]
  },
  'Mobile Developer': {
    required: [
      { skill: 'react native', level: 'Advanced', priority: 'High' },
      { skill: 'javascript', level: 'Advanced', priority: 'High' },
      { skill: 'typescript', level: 'Intermediate', priority: 'High' },
      { skill: 'git', level: 'Intermediate', priority: 'High' },
      { skill: 'rest api', level: 'Advanced', priority: 'High' },
      { skill: 'redux', level: 'Intermediate', priority: 'Medium' },
      { skill: 'firebase', level: 'Intermediate', priority: 'Medium' },
    ],
    roadmap: [
      { week: '1–2', task: 'JavaScript and React fundamentals review', type: 'foundation' },
      { week: '3–4', task: 'React Native core components and navigation', type: 'framework' },
      { week: '5–6', task: 'State management with Redux + API integration', type: 'advanced' },
      { week: '7–8', task: 'Firebase backend + push notifications', type: 'backend' },
      { week: '9–10', task: 'Publish app to Play Store + portfolio', type: 'job_prep' },
    ],
    projects: [
      { name: 'Social Media App', desc: 'Instagram-like app with feed, stories and chat', skills: ['react native', 'firebase', 'redux'] },
      { name: 'E-Commerce Mobile App', desc: 'Shop app with payments and cart', skills: ['react native', 'rest api', 'javascript'] },
      { name: 'Fitness Tracker', desc: 'Track workouts with charts and local storage', skills: ['react native', 'typescript'] },
    ],
    interviews: [
      'What is the difference between React Native and React?',
      'How does React Native bridge work?',
      'Explain FlatList vs ScrollView.',
      'How do you handle navigation in React Native?',
      'What is AsyncStorage?',
      'How do you optimize React Native performance?',
      'Explain the difference between iOS and Android handling in RN.',
      'How do you handle device permissions?',
      'What is Expo and when would you use it?',
      'How do you debug React Native apps?',
    ]
  },
  'UI/UX Designer': {
    required: [
      { skill: 'figma', level: 'Advanced', priority: 'High' },
      { skill: 'html', level: 'Intermediate', priority: 'High' },
      { skill: 'css', level: 'Intermediate', priority: 'High' },
      { skill: 'communication', level: 'Advanced', priority: 'High' },
      { skill: 'problem solving', level: 'Advanced', priority: 'High' },
    ],
    roadmap: [
      { week: '1–2', task: 'Design principles: color, typography, layout', type: 'foundation' },
      { week: '3–4', task: 'Figma mastery: components, auto-layout, prototyping', type: 'tools' },
      { week: '5–6', task: 'User research methods and persona creation', type: 'research' },
      { week: '7–8', task: 'HTML/CSS basics for developer handoff', type: 'coding' },
      { week: '9–10', task: '5 case studies portfolio + job applications', type: 'job_prep' },
    ],
    projects: [
      { name: 'Banking App Redesign', desc: 'Redesign existing banking app with better UX', skills: ['figma', 'communication'] },
      { name: 'SaaS Dashboard Design', desc: 'Complete design system for a SaaS product', skills: ['figma', 'css', 'html'] },
      { name: 'Mobile App Design', desc: 'End-to-end app design with user research', skills: ['figma', 'problem solving'] },
    ],
    interviews: [
      'What is your design process?',
      'How do you handle conflicting stakeholder feedback?',
      'What is the difference between UX and UI?',
      'How do you measure design success?',
      'What is accessibility in design?',
      'Explain the concept of design systems.',
      'How do you conduct user research?',
      'What is information architecture?',
      'How do you collaborate with developers?',
      'Walk me through a design decision you made.',
    ]
  }
}

const SKILL_LEVELS = {
  beginner: { multiplier: 0.5, label: 'Beginner' },
  intermediate: { multiplier: 1.0, label: 'Intermediate' },
  advanced: { multiplier: 1.5, label: 'Advanced' }
}

const generateAIFeedback = (matched, missing, role, matchPct, experience) => {
  const feedbacks = []
  const strength = matched.slice(0, 3).map(s => s.skill).join(', ')
  const gaps = missing.filter(s => s.priority === 'High').slice(0, 3).map(s => s.skill).join(', ')

  if (matchPct >= 80) {
    feedbacks.push(`🎉 Excellent! You're highly qualified for the ${role} role with a ${matchPct}% match score.`)
    feedbacks.push(`Your proficiency in ${strength} gives you a strong competitive advantage.`)
    feedbacks.push(`Focus on deepening your expertise and building impressive portfolio projects to stand out.`)
  } else if (matchPct >= 60) {
    feedbacks.push(`👍 You have solid foundational skills for ${role} (${matchPct}% match).`)
    feedbacks.push(`Your strengths in ${strength} are highly valued by employers.`)
    if (gaps) feedbacks.push(`Prioritize learning ${gaps} to significantly boost your employability.`)
    feedbacks.push(`With 4-6 weeks of focused practice, you could reach job-ready status.`)
  } else if (matchPct >= 40) {
    feedbacks.push(`⚡ You're on the right path for ${role} with ${matchPct}% of required skills.`)
    feedbacks.push(strength ? `Good start with ${strength} — build on these foundations.` : `Focus on building core skills first.`)
    if (gaps) feedbacks.push(`Critical gaps: ${gaps}. These are must-haves for most employers.`)
    feedbacks.push(`Dedicate 2-3 hours daily for 8-10 weeks to bridge the skill gap.`)
  } else {
    feedbacks.push(`🚀 You're at the beginning of your ${role} journey (${matchPct}% match).`)
    feedbacks.push(`Every expert was once a beginner — start with the fundamentals.`)
    feedbacks.push(`Follow the learning roadmap below systematically for best results.`)
    feedbacks.push(`With consistent daily practice (2-3 hrs), you can be job-ready in 3-4 months.`)
  }

  if (experience === 'beginner') feedbacks.push(`As a beginner, focus on projects over theory — build things to learn faster.`)
  if (experience === 'advanced') feedbacks.push(`At your level, system design and leadership skills will differentiate you.`)

  return feedbacks
}

const getJobReadyDays = (matchPct, missingCount, experience) => {
  const base = missingCount * (experience === 'beginner' ? 10 : experience === 'intermediate' ? 7 : 4)
  const gap = ((100 - matchPct) / 100) * (experience === 'beginner' ? 120 : experience === 'intermediate' ? 90 : 60)
  const days = Math.max(Math.round((base + gap) / 2), 7)
  return { min: days, max: Math.round(days * 1.4) }
}

// ── ANALYZE SKILL GAP ──
exports.analyzeSkillGap = async (req, res) => {
  try {
    const { jobRole, userSkills, experience = 'intermediate' } = req.body

    if (!jobRole || !userSkills || userSkills.length === 0) {
      return res.status(400).json({ message: 'Job role and skills required' })
    }

    const roleData = JOB_ROLES[jobRole]
    if (!roleData) return res.status(400).json({ message: 'Invalid job role' })

    const userSkillsLower = userSkills.map(s => s.toLowerCase().trim())
    const required = roleData.required

    // Matched skills
    const matchedSkills = required.filter(r =>
      userSkillsLower.some(us => us.includes(r.skill) || r.skill.includes(us))
    ).map(r => ({ ...r, userLevel: experience }))

    // Missing skills
    const missingSkills = required.filter(r =>
      !userSkillsLower.some(us => us.includes(r.skill) || r.skill.includes(us))
    )

    // Skills user has but not in required (extra skills)
    const extraSkills = userSkillsLower.filter(us =>
      !required.some(r => us.includes(r.skill) || r.skill.includes(us))
    )

    const matchPercentage = Math.round((matchedSkills.length / required.length) * 100)
    const jobReadyDays = getJobReadyDays(matchPercentage, missingSkills.length, experience)
    const feedback = generateAIFeedback(matchedSkills, missingSkills, jobRole, matchPercentage, experience)

    const analysis = await Analysis.create({
      user: req.user.id,
      jobRole,
      userSkills: userSkillsLower,
      requiredSkills: required.map(r => r.skill),
      missingSkills: missingSkills.map(r => r.skill),
      matchPercentage,
      roadmap: roleData.roadmap.map(r => r.task)
    })

    res.json({
      jobRole,
      experience,
      matchPercentage,
      matchedSkills,
      missingSkills,
      extraSkills,
      totalRequired: required.length,
      roadmap: roleData.roadmap,
      projects: roleData.projects,
      interviews: roleData.interviews,
      feedback,
      jobReadyDays,
      analysisId: analysis._id
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getJobRoles = async (req, res) => {
  res.json({ roles: Object.keys(JOB_ROLES) })
}

exports.getMyAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(analyses)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
