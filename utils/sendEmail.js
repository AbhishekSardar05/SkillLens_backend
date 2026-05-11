const nodemailer = require('nodemailer')

const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  await transporter.sendMail({
    from: `"SkillLens" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your SkillLens OTP Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #09090f; color: #f1f0ff; padding: 40px; border-radius: 16px;">
        <h1 style="color: #7c3aed; margin-bottom: 8px;">✦ SkillLens</h1>
        <p style="color: #8b8aad; margin-bottom: 32px;">AI Career Intelligence</p>
        
        <h2 style="margin-bottom: 16px;">Verify Your Email</h2>
        <p style="color: #8b8aad; margin-bottom: 24px;">Use this OTP to complete your registration:</p>
        
        <div style="background: #1a1a2e; border: 1px solid #7c3aed; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <div style="font-size: 2.5rem; font-weight: 800; letter-spacing: 0.5rem; color: #7c3aed;">${otp}</div>
        </div>
        
        <p style="color: #8b8aad; font-size: 0.85rem;">This OTP expires in <strong style="color: #f1f0ff;">10 minutes</strong>.</p>
        <p style="color: #8b8aad; font-size: 0.85rem;">If you didn't request this, ignore this email.</p>
        
        <hr style="border-color: rgba(255,255,255,0.07); margin: 24px 0;" />
        <p style="color: #555577; font-size: 0.78rem;">© 2026 SkillLens. All rights reserved.</p>
      </div>
    `
  })
}

module.exports = sendEmail