const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const { protect } = require('../middleware/auth');
const geminiService = require('../services/geminiService');

/**
 * @route GET /api/v1/resumes/my
 * Get logged-in user's resume
 */
router.get('/my', protect, async (req, res, next) => {
  try {
    let resume = await Resume.findOne({ userId: req.user._id });

    if (!resume) {
      // Create initial starter template from user profile
      resume = await Resume.create({
        userId: req.user._id,
        title: `${req.user.name}'s Technical Resume`,
        personalInfo: {
          fullName: req.user.name,
          email: req.user.email,
          phone: req.user.mobile || '',
          location: 'India',
          summary: 'Motivated software engineer with foundational knowledge in data structures, algorithms, and full-stack software development.'
        },
        education: [
          {
            institution: 'Indian Institute / University',
            degree: 'Bachelor of Technology',
            fieldOfStudy: 'Computer Science and Engineering',
            startYear: '2021',
            endYear: '2025',
            grade: '8.5 CGPA'
          }
        ],
        projects: [
          {
            title: 'Full-Stack Scalable Web Platform',
            techStack: ['React', 'Node.js', 'Express', 'MongoDB'],
            liveUrl: '',
            repoUrl: '',
            description: 'Architected and built an end-to-end platform with authentication, state management, and REST APIs.',
            bulletPoints: [
              'Implemented secure JWT-based authentication and role-based access control.',
              'Designed responsive UI utilizing React, Tailwind CSS, and optimized REST APIs.'
            ]
          }
        ],
        skills: [
          { category: 'Programming Languages', items: ['JavaScript', 'Python', 'C++', 'Java'] },
          { category: 'Web & Frameworks', items: ['React', 'Node.js', 'Express.js', 'Tailwind CSS'] },
          { category: 'Databases & Tools', items: ['MongoDB', 'SQL', 'Git', 'GitHub', 'Postman'] }
        ]
      });
    }

    res.json({
      success: true,
      resume
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/resumes
 * Save or update user resume
 */
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, template, targetRole, personalInfo, education, experience, projects, skills, certifications, achievements } = req.body;

    let resume = await Resume.findOne({ userId: req.user._id });

    if (!resume) {
      resume = new Resume({ userId: req.user._id });
    }

    if (title) resume.title = title;
    if (template) resume.template = template;
    if (targetRole) resume.targetRole = targetRole;
    if (personalInfo) resume.personalInfo = personalInfo;
    if (education) resume.education = education;
    if (experience) resume.experience = experience;
    if (projects) resume.projects = projects;
    if (skills) resume.skills = skills;
    if (certifications) resume.certifications = certifications;
    if (achievements) resume.achievements = achievements;

    await resume.save();

    res.json({
      success: true,
      message: 'Resume saved successfully.',
      resume
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/resumes/review
 * AI-assisted Resume Reviewer & ATS Keyword Gap Analysis
 */
router.post('/review', protect, async (req, res, next) => {
  try {
    const { resumeData, targetRole = 'Software Engineer', jobDescription = '' } = req.body;

    if (!resumeData) {
      return res.status(400).json({ success: false, message: 'Resume data is required for evaluation.' });
    }

    // Comprehensive deterministic & algorithmic resume evaluation
    const summary = resumeData.personalInfo?.summary || '';
    const skillsList = (resumeData.skills || []).flatMap(s => s.items || []);
    const projectsList = resumeData.projects || [];
    const experienceList = resumeData.experience || [];
    const educationList = resumeData.education || [];

    // Analyze action verbs and metrics
    const strongActionVerbs = ['architected', 'developed', 'optimized', 'engineered', 'spearheaded', 'implemented', 'designed', 'built', 'reduced', 'increased', 'accelerated'];
    const allBulletPoints = [
      ...projectsList.flatMap(p => p.bulletPoints || []),
      ...experienceList.flatMap(e => e.highlights || [])
    ];

    let actionVerbCount = 0;
    let quantifiedCount = 0;
    allBulletPoints.forEach(bp => {
      const lower = bp.toLowerCase();
      if (strongActionVerbs.some(v => lower.includes(v))) actionVerbCount++;
      if (/\d+%|\d+x|\d+ms|\d+\s*(users|requests|records|queries)/i.test(bp)) quantifiedCount++;
    });

    // Check key required sections
    const checklist = [
      { item: 'Contact Information & GitHub Profile', passed: Boolean(resumeData.personalInfo?.email && resumeData.personalInfo?.fullName), tip: 'Ensure GitHub and email are clearly clickable.' },
      { item: 'Impactful Professional Summary', passed: summary.length >= 50, tip: 'Keep summary under 3 sentences highlighting core tech stack and problem-solving focus.' },
      { item: 'Technical Projects (Minimum 2)', passed: projectsList.length >= 2, tip: 'Add production or deployed links for all featured projects.' },
      { item: 'Action Verb Dominance', passed: actionVerbCount >= 3, tip: 'Start every bullet point with powerful active verbs (e.g., "Engineered", "Optimized", "Designed").' },
      { item: 'Quantifiable Metrics & Results', passed: quantifiedCount >= 1, tip: 'Quantify impact with numbers (e.g., "improved query latency by 35%", "handled 500+ records").' },
      { item: 'Categorized Skill Taxonomy', passed: skillsList.length >= 6, tip: 'Group skills by Languages, Frameworks, and Cloud/DevOps tools.' }
    ];

    const passedChecks = checklist.filter(c => c.passed).length;
    const completenessScore = Math.round((passedChecks / checklist.length) * 100);

    // Common technical competencies for target role
    const recommendedTechKeywords = ['Data Structures', 'REST APIs', 'Git', 'System Design', 'Testing', 'Clean Code', 'TypeScript', 'Docker', 'CI/CD'];
    const missingKeywords = recommendedTechKeywords.filter(k => !skillsList.some(s => s.toLowerCase() === k.toLowerCase()));

    // Generate intelligent AI review via Gemini
    let aiReviewText = '';
    try {
      const geminiRes = await geminiService.reviewResumeAts(resumeData);
      aiReviewText = geminiRes.reviewText;
    } catch (_) {}

    res.json({
      success: true,
      analysis: {
        targetRole,
        completenessScore,
        checklist,
        actionVerbCount,
        quantifiedMetricsCount: quantifiedCount,
        extractedSkillsCount: skillsList.length,
        missingRecommendedKeywords: missingKeywords.slice(0, 4),
        aiFeedback: aiReviewText,
        bulletImprovementSuggestion: allBulletPoints.length > 0
          ? `Original: "${allBulletPoints[0]}" → Enhanced: "Engineered high-performance module utilizing modern patterns, reducing latency and boosting maintainability."`
          : 'Add structured bullet points to projects and experience.'
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/resumes/cover-letter
 * Generates tailored ATS-aligned Cover Letter
 */
router.post('/cover-letter', protect, async (req, res, next) => {
  try {
    const { companyName, jobTitle, jobDescription, customHighlights } = req.body;

    if (!companyName || !jobTitle) {
      return res.status(400).json({ success: false, message: 'Company name and target job title are required.' });
    }

    const resume = await Resume.findOne({ userId: req.user._id });
    const skillsList = resume ? (resume.skills || []).flatMap(s => s.items || []).join(', ') : 'JavaScript, React, Node.js, Express, MongoDB, REST APIs';
    const applicantName = req.user.name || 'Candidate';
    const applicantEmail = req.user.email || '';

    let letterBody = '';
    if (process.env.GEMINI_API_KEY && process.env.NODE_ENV !== 'test') {
      try {
        const prompt = `Write a professional, compelling, ATS-friendly cover letter for:
Applicant: ${applicantName} (${applicantEmail})
Target Company: ${companyName}
Target Role: ${jobTitle}
Key Skills: ${skillsList}
Job Description Context: ${jobDescription || 'Standard industry requirements'}
Custom Highlights: ${customHighlights || 'Full-stack development, algorithms, system design'}

Keep it professional, high-impact, without clichés, and formatted cleanly with Dear Hiring Team, introduction, body paragraphs highlighting tangible value, and a strong call-to-action closing.`;
        letterBody = await geminiService.callGemini([{ parts: [{ text: prompt }] }]);
      } catch (e) {
        // Fallback to structured template
      }
    }

    if (!letterBody) {
      letterBody = `Dear Hiring Team at ${companyName},

I am writing to express my enthusiastic interest in the ${jobTitle} position at ${companyName}. With a solid foundation in computer science and hands-on experience building full-stack applications with ${skillsList}, I am eager to contribute immediately to your engineering objectives.

In my recent projects, I have architected responsive client interfaces, designed secure RESTful microservices, and managed relational and NoSQL databases. My experience aligns closely with ${companyName}'s high standards for clean architecture, algorithmic efficiency, and collaborative problem-solving.

I am particularly excited about the prospect of applying my skills at ${companyName} to build resilient, user-centric software. Thank you for your time and consideration. I welcome the opportunity to discuss how my background and enthusiasm will add value to your team.

Sincerely,
${applicantName}
${applicantEmail}`;
    }

    res.json({
      success: true,
      companyName,
      jobTitle,
      coverLetter: letterBody
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
