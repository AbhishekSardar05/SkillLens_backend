const OpenAI = require('openai')

// OpenRouter uses OpenAI compatible API
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5173',
    'X-Title': 'SkillLens AI Career Assistant'
  }
})

exports.chat = async (req, res) => {
  try {
    const { message, skills, missingSkills, role, score } = req.body

    const systemPrompt = `You are an expert AI Career Assistant for SkillLens, a career intelligence platform for students and professionals.

User Profile:
- Target Role: ${role || 'Not specified'}
- Current Skills: ${Array.isArray(skills) ? skills.join(', ') : 'None'}
- Missing Skills: ${Array.isArray(missingSkills) ? missingSkills.join(', ') : 'None'}
- Match Score: ${score || 0}%

Your job is to help users with:
1. Skill gap analysis and what to learn next
2. Personalized learning roadmaps with timelines
3. Project suggestions based on their skill level
4. Interview preparation questions and tips
5. Free learning resources (YouTube, documentation, freeCodeCamp, etc.)
6. Career guidance and job search strategies
7. Salary expectations and market trends

Response Guidelines:
- Be concise but comprehensive (max 250 words)
- Use bullet points and emojis for readability
- Always mention FREE resources (YouTube, official docs, freeCodeCamp, MDN, etc.)
- Give specific time estimates for learning
- Be encouraging and motivating
- Format with clear sections`

    const response = await client.chat.completions.create({
      model: 'meta-llama/llama-3.2-3b-instruct:free',
      max_tokens: 500,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ]
    })

    const reply = response.choices[0]?.message?.content || 'Sorry, could not generate response.'
    res.json({ reply })

  } catch (err) {
    console.log('AI error:', err.message)

    // Fallback response if API fails
    const { message: userMsg, skills, missingSkills, role } = req.body
    const fallback = generateFallbackResponse(userMsg, skills, missingSkills, role)
    res.json({ reply: fallback })
  }
}

// Smart fallback without any API
const generateFallbackResponse = (message, skills, missingSkills, role) => {
  const msg = (message || '').toLowerCase()

  if (msg.includes('roadmap') || msg.includes('learn') || msg.includes('plan')) {
    return `## 🗺️ Learning Roadmap for ${role || 'Your Target Role'}

${missingSkills?.length > 0 ? `**Priority Skills to Learn:**
${missingSkills.slice(0, 5).map((s, i) => `${i + 1}. **${s}** — Week ${(i + 1) * 2 - 1}-${(i + 1) * 2}`).join('\n')}` : ''}

**Free Resources:**
• 📺 YouTube — Search each skill + "full course"
• 🌐 freeCodeCamp.org — Free structured courses
• 📘 Official Documentation — Most accurate source
• 🎓 The Odin Project — Free full-stack curriculum

**Timeline:** 2-3 hours daily = job-ready in 60-90 days`
  }

  if (msg.includes('project') || msg.includes('build')) {
    return `## 🚀 Project Suggestions

**Based on your skills & target role:**

1. **Portfolio Website** — Showcase your work (1-2 weeks)
2. **CRUD Application** — Full database integration (2-3 weeks)
3. **API Integration Project** — Connect to real APIs (1-2 weeks)
4. **Clone a popular app** — Twitter/Notion/Trello clone (3-4 weeks)

**Tips:**
• Push every project to GitHub
• Deploy on Vercel/Netlify (free)
• Write a README with screenshots
• Add the live link to your portfolio`
  }

  if (msg.includes('interview') || msg.includes('question')) {
    return `## ❓ Interview Preparation Tips

**Technical Round:**
• Practice on LeetCode (Easy problems first)
• Review fundamentals of ${role || 'your target role'}
• Build 2-3 strong portfolio projects

**Common Questions:**
1. Tell me about yourself
2. Why do you want this role?
3. Explain a challenging project you built
4. What are your strengths and weaknesses?

**Resources:**
• 🔥 Pramp.com — Free mock interviews
• 📚 InterviewBit — Topic-wise preparation
• 🎯 Glassdoor — Company-specific questions`
  }

  if (msg.includes('resource') || msg.includes('course') || msg.includes('where')) {
    return `## 📚 Best FREE Learning Resources

**By Platform:**
• 📺 **YouTube** — Traversy Media, Fireship, CS50
• 🎓 **freeCodeCamp** — Structured curriculum
• 🌐 **MDN Web Docs** — Web development bible
• 📘 **The Odin Project** — Full-stack for free
• 🔥 **Codecademy** — Interactive coding
• 📊 **Kaggle** — Data science & ML

**For ${role || 'your target role'}:**
• Search: "${role || 'web development'} full course 2024 free"
• Filter YouTube by "This year" for latest content
• Join Discord communities for your tech stack`
  }

  return `## 🤖 AI Career Assistant

I'm here to help with your career journey!

**Your Current Status:**
• Skills: ${Array.isArray(skills) && skills.length > 0 ? skills.join(', ') : 'Add your skills'}
• Target: ${role || 'Select a target role'}
• Missing: ${Array.isArray(missingSkills) && missingSkills.length > 0 ? missingSkills.slice(0, 3).join(', ') : 'Complete skill analysis first'}

**Try asking me:**
• "Give me a 30-day roadmap"
• "What projects should I build?"
• "Prepare me for interviews"
• "What free resources should I use?"`
}
