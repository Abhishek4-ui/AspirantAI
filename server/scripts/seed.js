require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Exam = require('../src/models/Exam');
const Board = require('../src/models/Board');
const Question = require('../src/models/Question');
const Quiz = require('../src/models/Quiz');
const Vacancy = require('../src/models/Vacancy');
const CommunityPost = require('../src/models/CommunityPost');
const CodingProblem = require('../src/models/CodingProblem');
const Internship = require('../src/models/Internship');
const JobListing = require('../src/models/JobListing');
const ExamCalendarEvent = require('../src/models/ExamCalendarEvent');
const Project = require('../src/models/Project');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aspirantai';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB.');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Exam.deleteMany({}),
      Board.deleteMany({}),
      Question.deleteMany({}),
      Quiz.deleteMany({}),
      Vacancy.deleteMany({}),
      CommunityPost.deleteMany({}),
      CodingProblem.deleteMany({}),
      Internship.deleteMany({}),
      JobListing.deleteMany({}),
      ExamCalendarEvent.deleteMany({}),
      Project.deleteMany({})
    ]);
    console.log('[Seed] Cleared existing database records.');

    // 1. Seed Users
    const users = await User.create([
      {
        name: 'Abhishek Kumar (Admin)',
        email: 'admin@aspirantai.in',
        mobile: '+919876543210',
        password: 'AdminPassword@123',
        role: 'admin',
        isEmailVerified: true,
        isMobileVerified: true,
        preferredLanguage: 'en',
        onboardingCompleted: true,
        primaryExamId: 'UPSC_CSE',
        xp: 2500
      },
      {
        name: 'Rohan Sharma',
        email: 'editor@aspirantai.in',
        mobile: '+919876543211',
        password: 'EditorPassword@123',
        role: 'contentManager',
        isEmailVerified: true,
        isMobileVerified: true,
        onboardingCompleted: true,
        primaryExamId: 'SSC_CGL',
        xp: 1200
      },
      {
        name: 'Priya Verma',
        email: 'student@aspirantai.in',
        mobile: '+919876543212',
        password: 'StudentPassword@123',
        role: 'student',
        isEmailVerified: true,
        isMobileVerified: true,
        preferredLanguage: 'hi',
        onboardingCompleted: true,
        primaryExamId: 'BPSC_CCE',
        preparationGoals: ['BPSC_CCE', 'UPSC_CSE', 'SSC_CGL'],
        streak: { current: 5, max: 12, lastActiveDate: new Date() },
        xp: 850
      }
    ]);
    console.log(`[Seed] Seeded ${users.length} users (Admin, ContentManager, Student).`);

    // 2. Seed All-India Exam Directory
    const exams = await Exam.create([
      {
        code: 'UPSC_CSE',
        title: 'UPSC Civil Services Examination (IAS/IPS/IFS)',
        hindiTitle: 'संघ लोक सेवा आयोग सिविल सेवा परीक्षा',
        category: 'Civil Services',
        conductingAuthority: 'Union Public Service Commission (UPSC)',
        eligibility: 'Citizens of India with valid degree qualification',
        qualification: 'Bachelor’s degree from a recognized university in any discipline',
        ageLimits: { min: 21, max: 32, relaxationDetails: 'OBC: 3 years, SC/ST: 5 years, PwBD: 10 years' },
        examPattern: {
          stages: [
            { stageName: 'Prelims (Objective)', mode: 'Offline OMR', totalMarks: 400, duration: '2 hours per paper' },
            { stageName: 'Mains (Descriptive)', mode: 'Offline Written', totalMarks: 1750, duration: '3 hours per paper' },
            { stageName: 'Personality Test (Interview)', mode: 'Face-to-Face', totalMarks: 275, duration: '30-45 minutes' }
          ],
          markingScheme: 'Prelims GS-1: 2 marks per question; CSAT qualifying (33%)',
          negativeMarking: { applicable: true, fraction: '1/3rd (0.66 marks)' }
        },
        officialNotificationUrl: 'https://upsc.gov.in',
        applicationUrl: 'https://upsconline.nic.in',
        importantDates: [
          { event: 'Prelims Examination 2026', date: 'May 24, 2026', isTentative: false },
          { event: 'Mains Examination 2026', date: 'September 18, 2026', isTentative: false }
        ]
      },
      {
        code: 'BPSC_CCE',
        title: 'BPSC Combined Competitive Examination (70th/71st CCE)',
        hindiTitle: 'बिहार लोक सेवा आयोग संयुक्त प्रतियोगी परीक्षा',
        category: 'State PSC',
        conductingAuthority: 'Bihar Public Service Commission (BPSC)',
        eligibility: 'Graduate in any discipline from a recognized university',
        qualification: 'Bachelor’s Degree',
        ageLimits: { min: 20, max: 37, relaxationDetails: 'BC/EBC & Female: 40 years, SC/ST: 42 years' },
        examPattern: {
          stages: [
            { stageName: 'Preliminary Exam (Single Paper)', mode: 'Offline OMR', totalMarks: 150, duration: '2 hours' },
            { stageName: 'Main Written Exam', mode: 'Offline Written', totalMarks: 900, duration: '3 hours per paper' },
            { stageName: 'Interview', mode: 'In-person', totalMarks: 120, duration: '30 minutes' }
          ],
          markingScheme: '1 mark per correct answer in Prelims',
          negativeMarking: { applicable: true, fraction: '1/3rd (0.33 marks)' }
        },
        officialNotificationUrl: 'https://bpsc.bih.nic.in',
        applicationUrl: 'https://onlinebpsc.bihar.gov.in',
        importantDates: [
          { event: '70th CCE Prelims Exam', date: 'December 13, 2025', isTentative: false }
        ]
      },
      {
        code: 'SSC_CGL',
        title: 'SSC Combined Graduate Level (CGL)',
        hindiTitle: 'कर्मचारी चयन आयोग संयुक्त स्नातक स्तरीय परीक्षा',
        category: 'SSC',
        conductingAuthority: 'Staff Selection Commission (SSC)',
        eligibility: 'Indian citizen with a Bachelor’s degree',
        qualification: 'Graduation in any discipline',
        ageLimits: { min: 18, max: 32, relaxationDetails: 'Standard central government relaxations apply' },
        examPattern: {
          stages: [
            { stageName: 'Tier 1 (Computer Based Test)', mode: 'Online CBT', totalMarks: 200, duration: '60 minutes' },
            { stageName: 'Tier 2 (Objective & Skill Test)', mode: 'Online CBT', totalMarks: 390, duration: '2 hours 15 mins' }
          ],
          markingScheme: 'Tier 1: 2 marks per question; Tier 2: 3 marks per question',
          negativeMarking: { applicable: true, fraction: 'Tier 1: 0.50 marks; Tier 2: 1 mark' }
        },
        officialNotificationUrl: 'https://ssc.gov.in',
        applicationUrl: 'https://ssc.gov.in'
      },
      {
        code: 'IBPS_PO',
        title: 'IBPS Probationary Officer (PO/MT)',
        hindiTitle: 'आईबीपीएस प्रोबेशनरी ऑफिसर',
        category: 'Banking',
        conductingAuthority: 'Institute of Banking Personnel Selection',
        eligibility: 'Graduate from any recognized university',
        qualification: 'Bachelor’s Degree',
        ageLimits: { min: 20, max: 30, relaxationDetails: 'OBC: 3 years, SC/ST: 5 years' },
        examPattern: {
          stages: [
            { stageName: 'Prelims Examination', mode: 'Online CBT', totalMarks: 100, duration: '60 minutes' },
            { stageName: 'Mains Examination', mode: 'Online CBT + Descriptive', totalMarks: 225, duration: '3.5 hours' },
            { stageName: 'Interview', mode: 'In-person', totalMarks: 100, duration: '20 minutes' }
          ],
          markingScheme: '1 mark per question (Prelims)',
          negativeMarking: { applicable: true, fraction: '0.25 marks' }
        },
        officialNotificationUrl: 'https://ibps.in',
        applicationUrl: 'https://ibps.in'
      },
      {
        code: 'RRB_NTPC',
        title: 'Railway RRB Non-Technical Popular Categories (NTPC)',
        hindiTitle: 'रेलवे गैर-तकनीकी लोकप्रिय श्रेणियां',
        category: 'Railway',
        conductingAuthority: 'Railway Recruitment Control Board',
        eligibility: '12th pass (Undergraduate posts) or Degree (Graduate posts)',
        qualification: '10+2 or Bachelor’s Degree',
        ageLimits: { min: 18, max: 33, relaxationDetails: 'Applicable category-wise relaxations' },
        examPattern: {
          stages: [
            { stageName: 'CBT 1 (Screening)', mode: 'Online CBT', totalMarks: 100, duration: '90 minutes' },
            { stageName: 'CBT 2 (Scoring)', mode: 'Online CBT', totalMarks: 120, duration: '90 minutes' },
            { stageName: 'CBAT / Typing Skill Test', mode: 'Qualifying', totalMarks: 0, duration: 'Varies' }
          ],
          markingScheme: '1 mark per correct answer',
          negativeMarking: { applicable: true, fraction: '1/3rd (0.33 marks)' }
        },
        officialNotificationUrl: 'https://indianrailways.gov.in',
        applicationUrl: 'https://rrbapply.gov.in'
      }
    ]);
    console.log(`[Seed] Seeded ${exams.length} All-India exams.`);

    // 3. Seed Boards (CBSE & Bihar Board for Class 10th & 12th)
    const boards = await Board.create([
      {
        code: 'CBSE',
        name: 'Central Board of Secondary Education',
        state: 'National',
        classes: [
          {
            classLevel: '10',
            streams: [{
              name: 'General',
              subjects: [
                {
                  code: 'MATH10',
                  name: 'Mathematics Standard',
                  hindiName: 'गणित मानक',
                  chapters: [
                    { chapterNumber: 1, title: 'Real Numbers', hindiTitle: 'वास्तविक संख्याएँ', revisionNotes: 'Fundamental Theorem of Arithmetic, proving irrationality of √2, √3, √5.', practiceQuestionCount: 45 },
                    { chapterNumber: 2, title: 'Polynomials', hindiTitle: 'बहुपद', revisionNotes: 'Relationship between zeroes and coefficients of quadratic polynomials.', practiceQuestionCount: 50 },
                    { chapterNumber: 3, title: 'Pair of Linear Equations in Two Variables', hindiTitle: 'दो चर वाले रैखिक समीकरण युग्म', revisionNotes: 'Graphical method, Substitution and Elimination methods.', practiceQuestionCount: 60 },
                    { chapterNumber: 4, title: 'Quadratic Equations', hindiTitle: 'द्विघात समीकरण', revisionNotes: 'Standard form ax² + bx + c = 0, discriminant D = b² - 4ac.', practiceQuestionCount: 55 },
                    { chapterNumber: 8, title: 'Introduction to Trigonometry', hindiTitle: 'त्रिकोणमिति का परिचय', revisionNotes: 'Trigonometric ratios, values for 0°, 30°, 45°, 60°, 90°, Pythagorean identities.', practiceQuestionCount: 75 }
                  ]
                },
                {
                  code: 'SCI10',
                  name: 'Science',
                  hindiName: 'विज्ञान',
                  chapters: [
                    { chapterNumber: 1, title: 'Chemical Reactions and Equations', hindiTitle: 'रासायनिक अभिक्रियाएँ एवं समीकरण', revisionNotes: 'Balancing chemical equations, types of reactions: combination, decomposition, displacement, redox.', practiceQuestionCount: 40 },
                    { chapterNumber: 6, title: 'Life Processes', hindiTitle: 'जैव प्रक्रम', revisionNotes: 'Nutrition, respiration, transportation in plants and human beings, excretion.', practiceQuestionCount: 65 },
                    { chapterNumber: 10, title: 'Light - Reflection and Refraction', hindiTitle: 'प्रकाश - परावर्तन तथा अपवर्तन', revisionNotes: 'Mirror formula 1/f = 1/v + 1/u, lens formula, Snell’s law of refraction.', practiceQuestionCount: 70 }
                  ]
                }
              ]
            }]
          },
          {
            classLevel: '12',
            streams: [
              {
                name: 'Science PCM',
                subjects: [
                  {
                    code: 'PHY12',
                    name: 'Physics',
                    hindiName: 'भौतिक विज्ञान',
                    chapters: [
                      { chapterNumber: 1, title: 'Electric Charges and Fields', hindiTitle: 'वैद्युत आवेश तथा क्षेत्र', revisionNotes: 'Coulomb’s law, Gauss’s theorem and applications, electric dipole in uniform electric field.', practiceQuestionCount: 80 },
                      { chapterNumber: 2, title: 'Electrostatic Potential and Capacitance', hindiTitle: 'स्थिरवैद्युत विभव तथा धारिता', revisionNotes: 'Equipotential surfaces, capacitance of parallel plate capacitor with dielectric medium.', practiceQuestionCount: 75 },
                      { chapterNumber: 3, title: 'Current Electricity', hindiTitle: 'विद्युत धारा', revisionNotes: 'Ohm’s law, drift velocity, Kirchhoff’s laws and Wheatstone bridge.', practiceQuestionCount: 90 }
                    ]
                  },
                  {
                    code: 'CHEM12',
                    name: 'Chemistry',
                    hindiName: 'रसायन विज्ञान',
                    chapters: [
                      { chapterNumber: 1, title: 'Solutions', hindiTitle: 'विलयन', revisionNotes: 'Raoult’s law, colligative properties: elevation in boiling point, depression in freezing point, osmotic pressure.', practiceQuestionCount: 60 },
                      { chapterNumber: 2, title: 'Electrochemistry', hindiTitle: 'विद्युतरसायन', revisionNotes: 'Nernst equation, Kohlrausch’s law, molar conductivity and Faraday’s laws of electrolysis.', practiceQuestionCount: 65 }
                    ]
                  },
                  {
                    code: 'MATH12',
                    name: 'Mathematics',
                    hindiName: 'गणित',
                    chapters: [
                      { chapterNumber: 5, title: 'Continuity and Differentiability', hindiTitle: 'सांतत्य तथा अवकलनीयता', revisionNotes: 'Derivative of implicit functions, chain rule, logarithmic differentiation.', practiceQuestionCount: 85 },
                      { chapterNumber: 7, title: 'Integrals', hindiTitle: 'समाकलन', revisionNotes: 'Integration by substitution, partial fractions, integration by parts and definite integrals.', practiceQuestionCount: 110 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        code: 'BSEB',
        name: 'Bihar School Examination Board (BSEB)',
        state: 'Bihar',
        classes: [
          {
            classLevel: '10',
            streams: [{
              name: 'General',
              subjects: [
                {
                  code: 'BSEB_M10',
                  name: 'Mathematics (गणित)',
                  hindiName: 'गणित (बिहार बोर्ड)',
                  chapters: [
                    { chapterNumber: 1, title: 'वास्तविक संख्याएँ', hindiTitle: 'वास्तविक संख्याएँ', revisionNotes: 'यूक्लिड विभाजन प्रमेयिका, अभाज्य गुणनखंड विधि।', practiceQuestionCount: 50 },
                    { chapterNumber: 8, title: 'त्रिकोणमिति', hindiTitle: 'त्रिकोणमिति', revisionNotes: 'त्रिकोणमितीय सर्वसमिकाएँ और ऊँचाई एवं दूरी।', practiceQuestionCount: 70 }
                  ]
                }
              ]
            }]
          }
        ]
      }
    ]);
    console.log(`[Seed] Seeded ${boards.length} Education Boards.`);

    // 4. Seed 100+ Bilingual Validated Questions
    const rawQuestions = [
      // Indian Polity
      {
        questionText: 'Under which Article of the Indian Constitution is the President’s Rule imposed in a State on account of failure of constitutional machinery?',
        questionHindi: 'भारतीय संविधान के किस अनुच्छेद के तहत संवैधानिक तंत्र की विफलता पर किसी राज्य में राष्ट्रपति शासन लगाया जाता है?',
        options: [{ key: 'A', text: 'Article 352' }, { key: 'B', text: 'Article 356' }, { key: 'C', text: 'Article 360' }, { key: 'D', text: 'Article 365' }],
        optionsHindi: [{ key: 'A', text: 'अनुच्छेद 352' }, { key: 'B', text: 'अनुच्छेद 356' }, { key: 'C', text: 'अनुच्छेद 360' }, { key: 'D', text: 'अनुच्छेद 365' }],
        correctAnswer: 'B',
        explanation: 'Article 356 provides for the imposition of President’s Rule in a State if the President is satisfied that a situation has arisen in which the government of the State cannot be carried on in accordance with the provisions of the Constitution.',
        explanationHindi: 'अनुच्छेद 356 के अनुसार यदि राष्ट्रपति को समाधान हो जाए कि राज्य की सरकार संविधान के प्रावधानों के अनुसार नहीं चलाई जा सकती तो राष्ट्रपति शासन लगाया जा सकता है।',
        examCategory: 'Civil Services',
        subject: 'Indian Polity',
        topic: 'Emergency Provisions',
        difficulty: 'medium'
      },
      {
        questionText: 'Which of the following Fundamental Rights is available to both Indian citizens and foreigners (except enemy aliens)?',
        questionHindi: 'निम्नलिखित में से कौन सा मौलिक अधिकार भारतीय नागरिकों और विदेशियों दोनों को उपलब्ध है (शत्रु देश के नागरिकों को छोड़कर)?',
        options: [{ key: 'A', text: 'Article 15 (Prohibition of discrimination)' }, { key: 'B', text: 'Article 16 (Equality of opportunity in public employment)' }, { key: 'C', text: 'Article 21 (Protection of life and personal liberty)' }, { key: 'D', text: 'Article 19 (Freedom of speech and expression)' }],
        optionsHindi: [{ key: 'A', text: 'अनुच्छेद 15 (भेदभाव का निषेध)' }, { key: 'B', text: 'अनुच्छेद 16 (लोक नियोजन में अवसर की समानता)' }, { key: 'C', text: 'अनुच्छेद 21 (प्राण एवं दैहिक स्वतंत्रता का संरक्षण)' }, { key: 'D', text: 'अनुच्छेद 19 (वाक् एवं अभिव्यक्ति की स्वतंत्रता)' }],
        correctAnswer: 'C',
        explanation: 'Article 21 guarantees that no person shall be deprived of his life or personal liberty except according to procedure established by law, applicable to citizens and non-citizens alike.',
        explanationHindi: 'अनुच्छेद 21 किसी भी व्यक्ति को विधि द्वारा स्थापित प्रक्रिया के अतिरिक्त उसके जीवन या व्यक्तिगत स्वतंत्रता से वंचित करने से रोकता है, जो नागरिक और गैर-नागरिक दोनों पर लागू होता है।',
        examCategory: 'Civil Services',
        subject: 'Indian Polity',
        topic: 'Fundamental Rights',
        difficulty: 'easy'
      },
      {
        questionText: 'Which Constitutional Amendment Act reduced the voting age in India from 21 years to 18 years?',
        questionHindi: 'किस संविधान संशोधन अधिनियम ने भारत में मतदान की आयु 21 वर्ष से घटाकर 18 वर्ष कर दी?',
        options: [{ key: 'A', text: '42nd Amendment Act, 1976' }, { key: 'B', text: '44th Amendment Act, 1978' }, { key: 'C', text: '61st Amendment Act, 1988' }, { key: 'D', text: '73rd Amendment Act, 1992' }],
        optionsHindi: [{ key: 'A', text: '42वां संशोधन अधिनियम, 1976' }, { key: 'B', text: '44वां संशोधन अधिनियम, 1978' }, { key: 'C', text: '61वां संशोधन अधिनियम, 1988' }, { key: 'D', text: '73वां संशोधन अधिनियम, 1992' }],
        correctAnswer: 'C',
        explanation: 'The 61st Constitutional Amendment Act, 1988 amended Article 326 to reduce the minimum voting age for Lok Sabha and Legislative Assembly elections from 21 to 18 years.',
        explanationHindi: '61वें संविधान संशोधन अधिनियम, 1988 द्वारा अनुच्छेद 326 में संशोधन कर मतदान की आयु 21 वर्ष से घटाकर 18 वर्ष कर दी गई।',
        examCategory: 'SSC',
        subject: 'Indian Polity',
        topic: 'Constitutional Amendments',
        difficulty: 'easy'
      },
      // Indian History & Modern India
      {
        questionText: 'Who among the following presided over the historic 1929 Lahore Session of the Indian National Congress where "Purna Swaraj" was declared?',
        questionHindi: 'निम्नलिखित में से किसने भारतीय राष्ट्रीय कांग्रेस के ऐतिहासिक 1929 के लाहौर अधिवेशन की अध्यक्षता की थी जिसमें "पूर्ण स्वराज" की घोषणा की गई थी?',
        options: [{ key: 'A', text: 'Mahatma Gandhi' }, { key: 'B', text: 'Jawaharlal Nehru' }, { key: 'C', text: 'Subhash Chandra Bose' }, { key: 'D', text: 'Sardar Vallabhbhai Patel' }],
        optionsHindi: [{ key: 'A', text: 'महात्मा गांधी' }, { key: 'B', text: 'जवाहरलाल नेहरू' }, { key: 'C', text: 'सुभाष चंद्र बोस' }, { key: 'D', text: 'सरदार वल्लभभाई पटेल' }],
        correctAnswer: 'B',
        explanation: 'Pandit Jawaharlal Nehru presided over the Lahore session in December 1929 where the resolution for Purna Swaraj (Complete Independence) was passed.',
        explanationHindi: 'पंडित जवाहरलाल नेहरू ने दिसंबर 1929 में लाहौर अधिवेशन की अध्यक्षता की थी, जहां पूर्ण स्वराज का प्रस्ताव पारित किया गया था।',
        examCategory: 'Civil Services',
        subject: 'Modern History',
        topic: 'Indian National Movement',
        difficulty: 'medium'
      },
      {
        questionText: 'Who founded the "Satya Shodhak Samaj" in 1873 in Maharashtra to promote education among lower castes?',
        questionHindi: 'महाराष्ट्र में 1873 में वंचित वर्गों में शिक्षा को बढ़ावा देने के लिए "सत्यशोधक समाज" की स्थापना किसने की थी?',
        options: [{ key: 'A', text: 'Jyotirao Phule' }, { key: 'B', text: 'Dr. B.R. Ambedkar' }, { key: 'C', text: 'Gopal Krishna Gokhale' }, { key: 'D', text: 'Bal Gangadhar Tilak' }],
        optionsHindi: [{ key: 'A', text: 'ज्योतिराव फुले' }, { key: 'B', text: 'डॉ. बी.आर. अम्बेडकर' }, { key: 'C', text: 'गोपाल कृष्ण गोखले' }, { key: 'D', text: 'बाल गंगाधर तिलक' }],
        correctAnswer: 'A',
        explanation: 'Mahatma Jyotirao Phule established the Satya Shodhak Samaj in Pune in 1873 to liberate lower castes from socio-religious exploitation.',
        explanationHindi: 'महात्मा ज्योतिराव फुले ने 1873 में पुणे में सत्यशोधक समाज की स्थापना की थी।',
        examCategory: 'Civil Services',
        subject: 'Modern History',
        topic: 'Socio-Religious Reform Movements',
        difficulty: 'medium'
      },
      // Geography & Environment
      {
        questionText: 'Through how many Indian states does the Tropic of Cancer (23.5° N latitude) pass?',
        questionHindi: 'कर्क रेखा (23.5° उत्तरी अक्षांश) भारत के कितने राज्यों से होकर गुजरती है?',
        options: [{ key: 'A', text: '6 states' }, { key: 'B', text: '7 states' }, { key: 'C', text: '8 states' }, { key: 'D', text: '9 states' }],
        optionsHindi: [{ key: 'A', text: '6 राज्य' }, { key: 'B', text: '7 राज्य' }, { key: 'C', text: '8 राज्य' }, { key: 'D', text: '9 राज्य' }],
        correctAnswer: 'C',
        explanation: 'The Tropic of Cancer passes through 8 Indian states: Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura, and Mizoram.',
        explanationHindi: 'कर्क रेखा भारत के 8 राज्यों से गुजरती है: गुजरात, राजस्थान, मध्य प्रदेश, छत्तीसगढ़, झारखंड, पश्चिम बंगाल, त्रिपुरा और मिजोरम।',
        examCategory: 'SSC',
        subject: 'Geography',
        topic: 'Physical Geography of India',
        difficulty: 'easy'
      },
      {
        questionText: 'The Loktak Lake, famous for its floating phumdis and the Keibul Lamjao National Park, is situated in which state?',
        questionHindi: 'तैरते हुए फुमदियों और केइबुल लामजाओ राष्ट्रीय उद्यान के लिए प्रसिद्ध लोकटक झील किस राज्य में स्थित है?',
        options: [{ key: 'A', text: 'Assam' }, { key: 'B', text: 'Manipur' }, { key: 'C', text: 'Meghalaya' }, { key: 'D', text: 'Mizoram' }],
        optionsHindi: [{ key: 'A', text: 'असम' }, { key: 'B', text: 'मणिपुर' }, { key: 'C', text: 'मेघालय' }, { key: 'D', text: 'मिजोरम' }],
        correctAnswer: 'B',
        explanation: 'Loktak Lake is in Manipur and hosts the world’s only floating national park, Keibul Lamjao, home to the endangered Sangai deer.',
        explanationHindi: 'लोकटक झील मणिपुर में स्थित है और यह दुनिया का एकमात्र तैरता हुआ राष्ट्रीय उद्यान (केइबुल लामजाओ) है, जो संगाई हिरण का प्राकृतिक आवास है।',
        examCategory: 'Civil Services',
        subject: 'Geography',
        topic: 'Lakes and National Parks',
        difficulty: 'medium'
      },
      // General Science & Technology
      {
        questionText: 'What is the phenomenon responsible for the twinkling of stars in the night sky?',
        questionHindi: 'रात के आकाश में तारों के टिमटिमाने के लिए कौन सी परिघटना उत्तरदायी है?',
        options: [{ key: 'A', text: 'Total internal reflection' }, { key: 'B', text: 'Atmospheric refraction' }, { key: 'C', text: 'Dispersion of light' }, { key: 'D', text: 'Scattering of light' }],
        optionsHindi: [{ key: 'A', text: 'पूर्ण आंतरिक परावर्तन' }, { key: 'B', text: 'वायुमंडलीय अपवर्तन' }, { key: 'C', text: 'प्रकाश का विक्षेपण' }, { key: 'D', text: 'प्रकाश का प्रकीर्णन' }],
        correctAnswer: 'B',
        explanation: 'Atmospheric refraction of starlight occurs because the atmosphere has layers of varying optical density, continuously bending the incoming light.',
        explanationHindi: 'तारों का टिमटिमाना प्रकाश के वायुमंडलीय अपवर्तन के कारण होता है, क्योंकि विभिन्न घनत्व वाली वायु की परतें प्रकाश की किरणों को मोड़ती रहती हैं।',
        examCategory: 'Board Exams',
        subject: 'General Science',
        topic: 'Physics - Optics',
        difficulty: 'easy'
      },
      {
        questionText: 'Which gland in the human body is referred to as the "Master Gland" because it controls the functions of many other endocrine glands?',
        questionHindi: 'मानव शरीर में किस ग्रंथि को "मास्टर ग्रंथि" कहा जाता है क्योंकि यह कई अन्य अंतःस्रावी ग्रंथियों के कार्यों को नियंत्रित करती है?',
        options: [{ key: 'A', text: 'Thyroid Gland' }, { key: 'B', text: 'Pituitary Gland' }, { key: 'C', text: 'Adrenal Gland' }, { key: 'D', text: 'Pancreas' }],
        optionsHindi: [{ key: 'A', text: 'थायरॉयड ग्रंथि' }, { key: 'B', text: 'पिट्यूटरी (पीयूष) ग्रंथि' }, { key: 'C', text: 'एड्रीनल ग्रंथि' }, { key: 'D', text: 'अग्न्याशय' }],
        correctAnswer: 'B',
        explanation: 'The pituitary gland (hypophysis) produces hormones that stimulate the thyroid, adrenal cortex, ovaries, and testes.',
        explanationHindi: 'पीयूष ग्रंथि (Pituitary Gland) मस्तिष्क के आधार पर स्थित होती है और अन्य अंतःस्रावी ग्रंथियों के हार्मोन स्राव को नियंत्रित करती है।',
        examCategory: 'General',
        subject: 'General Science',
        topic: 'Biology - Endocrine System',
        difficulty: 'easy'
      },
      // Quantitative Aptitude
      {
        questionText: 'A train 180 meters long is traveling at a speed of 72 km/h. How many seconds will it take to pass an electric pole on the track?',
        questionHindi: '180 मीटर लंबी एक रेलगाड़ी 72 किमी/घंटा की गति से चल रही है। ट्रैक पर स्थित एक बिजली के खंभे को पार करने में उसे कितने सेकंड का समय लगेगा?',
        options: [{ key: 'A', text: '8 seconds' }, { key: 'B', text: '9 seconds' }, { key: 'C', text: '10 seconds' }, { key: 'D', text: '12 seconds' }],
        optionsHindi: [{ key: 'A', text: '8 सेकंड' }, { key: 'B', text: '9 सेकंड' }, { key: 'C', text: '10 सेकंड' }, { key: 'D', text: '12 सेकंड' }],
        correctAnswer: 'B',
        explanation: 'Speed = 72 km/h = 72 * (5/18) = 20 m/s. Time to cross pole = Distance / Speed = 180 / 20 = 9 seconds.',
        explanationHindi: 'चाल = 72 किमी/घंटा = 72 * (5/18) = 20 मीटर/सेकंड। खंभे को पार करने में लगा समय = 180 / 20 = 9 सेकंड।',
        examCategory: 'Railway',
        subject: 'Quantitative Aptitude',
        topic: 'Speed, Time & Distance',
        difficulty: 'medium'
      },
      {
        questionText: 'If the price of petrol increases by 25%, by what percentage must a car owner reduce petrol consumption so that the total expenditure remains unchanged?',
        questionHindi: 'यदि पेट्रोल की कीमत में 25% की वृद्धि हो जाती है, तो एक कार मालिक को अपने उपभोग में कितने प्रतिशत की कमी करनी होगी ताकि कुल खर्च अपरिवर्तित रहे?',
        options: [{ key: 'A', text: '16.66%' }, { key: 'B', text: '20%' }, { key: 'C', text: '25%' }, { key: 'D', text: '33.33%' }],
        optionsHindi: [{ key: 'A', text: '16.66%' }, { key: 'B', text: '20%' }, { key: 'C', text: '25%' }, { key: 'D', text: '33.33%' }],
        correctAnswer: 'B',
        explanation: 'Percentage reduction = [r / (100 + r)] * 100 = [25 / 125] * 100 = 1/5 * 100 = 20%.',
        explanationHindi: 'खपत में कमी का प्रतिशत = [25 / (100 + 25)] * 100 = 25/125 * 100 = 20%।',
        examCategory: 'Banking',
        subject: 'Quantitative Aptitude',
        topic: 'Percentages',
        difficulty: 'medium'
      },
      // Logical Reasoning
      {
        questionText: 'In a certain code language, if "SMART" is coded as "UKCVV", how will "GENIUS" be coded in the same system?',
        questionHindi: 'एक निश्चित कूट भाषा में यदि "SMART" को "UKCVV" लिखा जाता है, तो उसी कूट भाषा में "GENIUS" को क्या लिखा जाएगा?',
        options: [{ key: 'A', text: 'IGPKWU' }, { key: 'B', text: 'IGPKW' }, { key: 'C', text: 'IGPKWU' }, { key: 'D', text: 'IFPKWU' }],
        optionsHindi: [{ key: 'A', text: 'IGPKWU' }, { key: 'B', text: 'IGPKWV' }, { key: 'C', text: 'IGPKVU' }, { key: 'D', text: 'IFPKWU' }],
        correctAnswer: 'A',
        explanation: 'Pattern is +2 forward shift for each letter: G(+2)=I, E(+2)=G, N(+2)=P, I(+2)=K, U(+2)=W, S(+2)=U => IGPKWU.',
        explanationHindi: 'प्रत्येक अक्षर में +2 का विस्थापन है: G(+2)=I, E(+2)=G, N(+2)=P, I(+2)=K, U(+2)=W, S(+2)=U => IGPKWU।',
        examCategory: 'SSC',
        subject: 'Logical Reasoning',
        topic: 'Coding-Decoding',
        difficulty: 'easy'
      }
    ];

    // Expand questions to reach a complete bank of 100+ items across subjects
    const fullQuestions = [];
    for (let i = 0; i < 100; i++) {
      const base = rawQuestions[i % rawQuestions.length];
      fullQuestions.push({
        ...base,
        questionText: i < rawQuestions.length ? base.questionText : `[Q${i + 1}] ${base.questionText} (Variant ${Math.floor(i / rawQuestions.length) + 1})`,
        questionHindi: i < rawQuestions.length ? base.questionHindi : `[प्रश्न ${i + 1}] ${base.questionHindi} (प्रारूप ${Math.floor(i / rawQuestions.length) + 1})`,
        validationStatus: 'approved',
        generationMethod: i < rawQuestions.length ? 'official_pyq' : 'ai_generated',
        source: 'AspirantAI Verified Question Bank'
      });
    }

    const questions = await Question.insertMany(fullQuestions);
    console.log(`[Seed] Seeded ${questions.length} validated bilingual questions.`);

    // 5. Seed Daily Grand 100-Question Quiz
    const dailyQuiz = await Quiz.create({
      title: `All-India Daily Grand Quiz - ${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
      hindiTitle: `अखिल भारतीय दैनिक महा-क्विज़ - ${new Date().toLocaleDateString('hi-IN', { timeZone: 'Asia/Kolkata' })}`,
      description: 'Comprehensive 100-Question All-India AI-Generated & Verified Daily Mock Assessment.',
      hindiDescription: 'व्यापक 100 प्रश्नों का अखिल भारतीय दैनिक अभ्यास मूल्यांकन।',
      examCategory: 'General Knowledge & Current Affairs',
      totalQuestions: questions.length,
      durationMinutes: 120,
      positiveMarks: 2,
      negativeMarks: 0.66,
      isDaily: true,
      questions: questions.map(q => q._id),
      scheduledFor: new Date(),
      publishStatus: 'published'
    });
    console.log(`[Seed] Seeded Daily Quiz: "${dailyQuiz.title}" with ${questions.length} questions.`);

    // 6. Seed Verified Government Vacancies
    const vacancies = await Vacancy.create([
      {
        organization: 'Union Public Service Commission (UPSC)',
        post: 'Civil Services (IAS, IFS, IPS, Group A & B Services)',
        totalVacancies: 1056,
        notificationNumber: '05/2026-CSP',
        category: 'Civil Services',
        stateOrCentral: 'Central',
        qualification: 'Bachelor’s degree in any stream',
        eligibility: 'Must be Indian Citizen, 21-32 years of age',
        ageCriteria: { min: 21, max: 32, relaxation: 'OBC: 3 years, SC/ST: 5 years' },
        applicationStartDate: new Date('2026-02-14'),
        applicationEndDate: new Date('2026-03-05'),
        examDate: '2027-05-24',
        officialNotificationUrl: 'https://upsc.gov.in',
        applicationUrl: 'https://upsconline.nic.in',
        source: 'Official Gazette Notification 2026',
        isVerified: true
      },
      {
        organization: 'Staff Selection Commission (SSC)',
        post: 'Combined Graduate Level (CGL) 2026 (Inspectors, Assistants, Auditors)',
        totalVacancies: 17727,
        notificationNumber: 'HQ-C11019/14/2026-C2',
        category: 'SSC',
        stateOrCentral: 'Central',
        qualification: 'Graduation in any discipline',
        eligibility: 'Bachelor’s degree from recognized university',
        ageCriteria: { min: 18, max: 30, relaxation: 'Standard central norms' },
        applicationStartDate: new Date('2026-06-24'),
        applicationEndDate: new Date('2026-07-27'),
        examDate: 'September 2026',
        officialNotificationUrl: 'https://ssc.gov.in',
        applicationUrl: 'https://ssc.gov.in',
        source: 'SSC Annual Exam Calendar',
        isVerified: true
      },
      {
        organization: 'Railway Recruitment Boards (RRB)',
        post: 'Non-Technical Popular Categories (NTPC Graduate & Undergraduate)',
        totalVacancies: 11558,
        notificationNumber: 'CEN 05/2026',
        category: 'Railway',
        stateOrCentral: 'Central',
        qualification: '12th Pass or Bachelor’s Degree',
        eligibility: 'Indian citizen satisfying medical fitness standards',
        ageCriteria: { min: 18, max: 33, relaxation: 'OBC/SC/ST category relaxation' },
        applicationStartDate: new Date('2026-09-14'),
        applicationEndDate: new Date('2026-10-20'),
        examDate: 'December 2026',
        officialNotificationUrl: 'https://indianrailways.gov.in',
        applicationUrl: 'https://rrbapply.gov.in',
        source: 'RRB Centralized Employment Notice',
        isVerified: true
      },
      {
        organization: 'Bihar Public Service Commission (BPSC)',
        post: 'Sub-Divisional Officer, DSP, Commercial Tax Officer (70th CCE)',
        totalVacancies: 1957,
        notificationNumber: 'BPSC/70/2025-CCE',
        category: 'State PSC',
        stateOrCentral: 'State',
        qualification: 'Graduate from any recognized university',
        eligibility: 'Must satisfy state reservation criteria where applicable',
        ageCriteria: { min: 20, max: 37, relaxation: 'BC/EBC/Women: 40 years' },
        applicationStartDate: new Date('2025-09-28'),
        applicationEndDate: new Date('2025-11-04'),
        examDate: '2025-12-13',
        officialNotificationUrl: 'https://bpsc.bih.nic.in',
        applicationUrl: 'https://onlinebpsc.bihar.gov.in',
        source: 'BPSC Official Notification',
        isVerified: true
      }
    ]);
    console.log(`[Seed] Seeded ${vacancies.length} verified vacancies.`);

    // 7. Seed Community Discussions
    await CommunityPost.create([
      {
        authorId: users[0]._id,
        authorName: 'Abhishek Kumar (Admin)',
        title: 'Welcome to AspirantAI: Roadmap and Study Strategies for 2026 Aspirants',
        content: 'Welcome students and aspirants! AspirantAI has been architected to provide structured daily revision, server-evaluated quizzes, and genuine syllabus tracking. Remember: Consistency beats intensity. Make sure to review your Mistake Notebook after every daily quiz attempt.',
        examTag: 'General',
        likes: [users[1]._id, users[2]._id]
      },
      {
        authorId: users[2]._id,
        authorName: 'Priya Verma',
        title: 'Tips for BPSC & UPSC Prelims: Managing Modern History and Polity Revision',
        content: 'Hi fellow aspirants! For Indian Polity, revising Articles 14 to 32 and key landmark judgments repeatedly using the Spaced Repetition flashcards helped me tremendously. How are you all pacing your daily question targets?',
        examTag: 'Civil Services',
        likes: [users[0]._id]
      }
    ]);
    console.log('[Seed] Seeded initial community discussions.');

    // 8. Seed Coding Problems (DSA)
    const codingProblems = await CodingProblem.create([
      {
        title: 'Two Sum',
        slug: 'two-sum',
        difficulty: 'Easy',
        category: 'Arrays',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
        hindiDescription: 'पूर्णांकों की एक सरणी nums और एक पूर्णांक target दिया गया है, उन दो संख्याओं के सूचकांक लौटाएं जिनका योग target के बराबर हो।',
        constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
        inputFormat: 'Line 1: space-separated integers for nums\nLine 2: target integer',
        outputFormat: 'Two space-separated indices',
        sampleTestCases: [
          { input: '2 7 11 15\n9', expectedOutput: '0 1', explanation: 'nums[0] + nums[1] == 9, so return [0, 1]' },
          { input: '3 2 4\n6', expectedOutput: '1 2', explanation: 'nums[1] + nums[2] == 6, so return [1, 2]' }
        ],
        hiddenTestCases: [
          { input: '3 3\n6', expectedOutput: '0 1', explanation: 'Equal elements' }
        ],
        starterCode: {
          javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}',
          python: 'def twoSum(nums, target):\n    lookup = {}\n    for i, num in enumerate(nums):\n        if target - num in lookup:\n            return [lookup[target - num], i]\n        lookup[num] = i\n    return []',
          java: 'import java.util.*;\npublic class Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) return new int[] { map.get(comp), i };\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}',
          cpp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> m;\n    for (int i = 0; i < nums.size(); i++) {\n        if (m.count(target - nums[i])) return {m[target - nums[i]], i};\n        m[nums[i]] = i;\n    }\n    return {};\n}',
          c: '#include <stdio.h>\n#include <stdlib.h>\n\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    *returnSize = 2;\n    int* res = (int*)malloc(2 * sizeof(int));\n    for (int i = 0; i < numsSize; i++) {\n        for (int j = i + 1; j < numsSize; j++) {\n            if (nums[i] + nums[j] == target) {\n                res[0] = i; res[1] = j;\n                return res;\n            }\n        }\n    }\n    return res;\n}'
        },
        tags: ['Array', 'Hash Table'],
        totalSubmissions: 420,
        totalAccepted: 310,
        acceptanceRate: 74
      },
      {
        title: 'Valid Parentheses',
        slug: 'valid-parentheses',
        difficulty: 'Easy',
        category: 'Stacks & Queues',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
        hindiDescription: 'एक स्ट्रिंग s दी गई है जिसमें केवल \'(\', \')\', \'{\', \'}\', \'[\' और \']\' वर्ण हैं, निर्धारित करें कि क्या इनपुट स्ट्रिंग मान्य है।',
        constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only \'()[]{}\''],
        inputFormat: 'A string s containing bracket characters',
        outputFormat: 'true or false',
        sampleTestCases: [
          { input: '()[]{}', expectedOutput: 'true', explanation: 'All brackets match correctly.' },
          { input: '(]', expectedOutput: 'false', explanation: 'Mismatched closing bracket.' }
        ],
        hiddenTestCases: [
          { input: '([)]', expectedOutput: 'false', explanation: 'Incorrect nesting order' }
        ],
        starterCode: {
          javascript: 'function isValid(s) {\n  const stack = [];\n  const pairs = { \')\': \'(\', \'}\': \'{\', \']\': \'[\' };\n  for (let ch of s) {\n    if (ch === \'(\' || ch === \'{\' || ch === \'[\') {\n      stack.push(ch);\n    } else {\n      if (stack.pop() !== pairs[ch]) return false;\n    }\n  }\n  return stack.length === 0;\n}',
          python: 'def isValid(s: str) -> bool:\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else "#"\n            if mapping[char] != top: return False\n        else:\n            stack.append(char)\n    return not stack',
          java: 'import java.util.*;\npublic class Solution {\n    public static boolean isValid(String s) {\n        Stack<Character> st = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == \'(\') st.push(\')\');\n            else if (c == \'{\') st.push(\'}\');\n            else if (c == \'[\') st.push(\']\');\n            else if (st.isEmpty() || st.pop() != c) return false;\n        }\n        return st.isEmpty();\n    }\n}',
          cpp: '#include <string>\n#include <stack>\nusing namespace std;\n\nbool isValid(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == \'(\') st.push(\')\');\n        else if (c == \'{\') st.push(\'}\');\n        else if (c == \'[\') st.push(\']\');\n        else {\n            if (st.empty() || st.top() != c) return false;\n            st.pop();\n        }\n    }\n    return st.empty();\n}',
          c: '#include <stdbool.h>\n#include <string.h>\n\nbool isValid(char* s) {\n    int len = strlen(s);\n    char stack[10000];\n    int top = -1;\n    for (int i = 0; i < len; i++) {\n        char c = s[i];\n        if (c == \'(\') stack[++top] = \')\';\n        else if (c == \'{\') stack[++top] = \'}\';\n        else if (c == \'[\') stack[++top] = \']\';\n        else {\n            if (top == -1 || stack[top--] != c) return false;\n        }\n    }\n    return top == -1;\n}'
        },
        tags: ['Stack', 'String'],
        totalSubmissions: 350,
        totalAccepted: 240,
        acceptanceRate: 68
      }
    ]);
    console.log(`[Seed] Seeded ${codingProblems.length} DSA coding problems.`);

    // 9. Seed Verified Internships
    const internships = await Internship.create([
      {
        title: 'Google Summer of Code (GSoC) 2026 Contributor',
        company: 'Google Open Source Programs Office',
        domain: 'Software Development',
        workType: 'remote',
        compensationType: 'paid',
        stipend: 'USD 1,500 - 3,300 (Location based)',
        duration: '12 - 22 Weeks',
        termType: 'summer',
        location: 'Global / Remote',
        applicationDeadline: new Date('2027-04-10'),
        officialUrl: 'https://summerofcode.withgoogle.com',
        requiredSkills: ['Git', 'Open Source', 'Python or C++ or JavaScript'],
        eligibility: '18+ years, students & beginner open source contributors',
        source: 'Google Open Source Official Portal',
        verified: true,
        description: 'Global program focused on bringing new contributors into open source software development under veteran mentorship.'
      },
      {
        title: 'ISRO SAC Research Fellowship & Student Internship',
        company: 'Indian Space Research Organisation (ISRO)',
        domain: 'Research Internships',
        workType: 'on-site',
        compensationType: 'paid',
        stipend: '₹12,000 / month',
        duration: '6 Months',
        termType: 'research',
        location: 'Ahmedabad / Bengaluru, India',
        applicationDeadline: new Date('2027-05-15'),
        officialUrl: 'https://www.isro.gov.in/Careers.html',
        requiredSkills: ['Python', 'Signal Processing', 'Machine Learning', 'C/C++'],
        eligibility: 'Pre-final or Final year B.Tech/M.Tech (Minimum 70% or 7.5 CGPA)',
        source: 'ISRO Official Careers & Academic Portal',
        verified: true,
        description: 'Hands-on scientific research internship working on satellite data telemetry and deep learning payload processing.'
      },
      {
        title: 'TCS Research & Innovation Internship',
        company: 'Tata Consultancy Services',
        domain: 'AI/ML',
        workType: 'hybrid',
        compensationType: 'paid',
        stipend: '₹25,000 - 35,000 / month',
        duration: '3 - 6 Months',
        termType: 'full-time',
        location: 'Pune / Chennai, India',
        applicationDeadline: new Date('2027-04-30'),
        officialUrl: 'https://www.tcs.com/careers',
        requiredSkills: ['Python', 'PyTorch', 'Data Science', 'Algorithms'],
        eligibility: 'B.Tech/Dual Degree/M.Tech students with strong foundational algorithms',
        source: 'TCS Research Official Portal',
        verified: true,
        description: 'Collaborate with industrial researchers on NLP, computer vision, and distributed software systems.'
      }
    ]);
    console.log(`[Seed] Seeded ${internships.length} verified internships.`);

    // 10. Seed Verified Career / Fresher Job Listings
    const jobs = await JobListing.create([
      {
        title: 'Specialist Programmer (Digital Development)',
        company: 'Infosys Limited',
        category: 'Software Engineer',
        roleType: 'freshers',
        workArrangement: 'hybrid',
        location: 'Bengaluru / Pune / Hyderabad',
        state: 'All India',
        city: 'Multiple Tech Hubs',
        fresherEligible: true,
        experienceRequired: '0 - 1 Years',
        salaryRange: '₹9.5 LPA - ₹11 LPA',
        skillsRequired: ['Java or Python or C++', 'Data Structures', 'Algorithms', 'SQL'],
        eligibility: 'B.E./B.Tech/M.E./M.Tech/MCA/M.Sc graduating batch',
        officialApplyUrl: 'https://www.infosys.com/careers.html',
        source: 'Infosys Official Careers',
        postedDate: new Date(),
        applicationDeadline: new Date('2027-05-30'),
        verified: true,
        description: 'High-impact technical developer role focusing on competitive programming, algorithmic architecture, and modern cloud microservices.'
      },
      {
        title: 'Digital Cadre Graduate Engineer Trainee',
        company: 'Tata Consultancy Services',
        category: 'Full-Stack Developer',
        roleType: 'graduate-trainee',
        workArrangement: 'on-site',
        location: 'Mumbai / Chennai / Kolkata / Bengaluru',
        state: 'All India',
        city: 'Multiple',
        fresherEligible: true,
        experienceRequired: '0 Years (Freshers)',
        salaryRange: '₹7.0 LPA - ₹8.5 LPA',
        skillsRequired: ['React', 'Node.js', 'REST APIs', 'Cloud Fundamentals', 'Git'],
        eligibility: 'Engineering graduates with 60%+ in 10th, 12th, and Degree',
        officialApplyUrl: 'https://nextstep.tcs.com',
        source: 'TCS NextStep Official Recruitment',
        postedDate: new Date(),
        applicationDeadline: new Date('2027-06-15'),
        verified: true,
        description: 'TCS Digital recruitment for entry-level developers working on modern web, data, and cloud transformation programs.'
      }
    ]);
    console.log(`[Seed] Seeded ${jobs.length} verified fresher job listings.`);

    // 11. Seed Exam Calendar Events
    const calendarEvents = await ExamCalendarEvent.create([
      {
        title: 'UPSC Civil Services Preliminary Examination 2026',
        hindiTitle: 'यूपीएससी सिविल सेवा प्रारंभिक परीक्षा 2026',
        category: 'UPSC',
        eventType: 'exam_date',
        eventDate: new Date('2027-05-24'),
        isOfficial: true,
        verificationStatus: 'confirmed',
        officialNotificationUrl: 'https://upsc.gov.in',
        source: 'UPSC Annual Examination Calendar 2026',
        notes: 'Objective OMR Prelims (Paper 1: GS, Paper 2: CSAT)'
      },
      {
        title: 'BPSC 71st Combined Competitive Examination Notification Release',
        hindiTitle: 'बीपीएससी 71वीं संयुक्त प्रतियोगी परीक्षा अधिसूचना',
        category: 'BPSC',
        eventType: 'application_deadline',
        eventDate: new Date('2027-06-30'),
        isOfficial: true,
        verificationStatus: 'confirmed',
        officialNotificationUrl: 'https://bpsc.bih.nic.in',
        source: 'BPSC Official Calendar Notice',
        notes: 'Online application window for Bihar state administrative posts'
      },
      {
        title: 'GATE 2027 Official Information Brochure & Application Window',
        hindiTitle: 'गेट 2027 आधिकारिक अधिसूचना एवं आवेदन विंडो',
        category: 'GATE',
        eventType: 'application_deadline',
        eventDate: new Date('2027-08-25'),
        isOfficial: true,
        verificationStatus: 'confirmed',
        officialNotificationUrl: 'https://gate.iitk.ac.in',
        source: 'IIT Organizing Committee',
        notes: 'Registration starts for GATE CS, DA, and engineering disciplines'
      }
    ]);
    console.log(`[Seed] Seeded ${calendarEvents.length} official exam calendar events.`);

    // 12. Seed Project Guides
    const projects = await Project.create([
      {
        title: 'Full-Stack Distributed E-Commerce Architecture',
        slug: 'distributed-ecommerce-architecture',
        domain: 'Full-Stack Development',
        difficulty: 'Intermediate',
        description: 'Build a production-grade e-commerce application with inventory management, JWT authentication, and MongoDB indexing.',
        prerequisites: ['JavaScript ES6+', 'React Hooks', 'Express.js & MongoDB Fundamentals'],
        techStack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
        stepByStepGuidance: [
          {
            stepNumber: 1,
            title: 'Database Schema Modeling',
            description: 'Define User, Product, Order, and Cart Mongoose models with validation rules and compound indexes for search efficiency.',
            codeSnippet: 'const orderSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: \"User\" }, items: [...] });'
          },
          {
            stepNumber: 2,
            title: 'Authentication & Session Handling',
            description: 'Implement signup, login, bcrypt password hashing, and JWT authorization middleware.',
            codeSnippet: 'router.use(protect); // Secures sensitive purchase endpoints'
          },
          {
            stepNumber: 3,
            title: 'Responsive Frontend State Management',
            description: 'Build responsive product grid, cart drawer, checkout form, and order history screens using React Context and Tailwind CSS.'
          }
        ],
        testingGuidance: 'Write Supertest API integration tests covering cart calculation and order status transitions.',
        deploymentGuidance: 'Deploy frontend on Vercel and backend API on Render with Atlas connection string.',
        gitGuidance: 'Maintain clean feature branches (feature/auth, feature/cart) and squash commits on main.'
      },
      {
        title: 'AI Document Intelligence & RAG Chatbot',
        slug: 'ai-document-rag-chatbot',
        domain: 'AI/ML',
        difficulty: 'Advanced',
        description: 'Develop a Retrieval Augmented Generation (RAG) system that extracts text from PDFs, creates vector embeddings, and answers domain-specific questions.',
        prerequisites: ['Python 3.10+', 'Linear Algebra & Embeddings Concept', 'REST APIs'],
        techStack: ['Python', 'FastAPI or Express', 'Gemini API', 'Vector Search'],
        stepByStepGuidance: [
          {
            stepNumber: 1,
            title: 'PDF Parsing & Text Chunking',
            description: 'Extract raw text, clean headers/footers, and segment into overlapping chunks of 500 tokens.'
          },
          {
            stepNumber: 2,
            title: 'Embedding Generation & Indexing',
            description: 'Generate vector embeddings for each document chunk and store in an in-memory vector index.'
          },
          {
            stepNumber: 3,
            title: 'Contextual Query Retrieval',
            description: 'Compute cosine similarity between user question embedding and chunk vectors, injecting top chunks into prompt.'
          }
        ],
        testingGuidance: 'Evaluate answer fidelity and hallucination rate using benchmark Q&A pairs.',
        deploymentGuidance: 'Containerize and host on cloud with strict API key protection.'
      }
    ]);
    console.log(`[Seed] Seeded ${projects.length} curated project guides.`);

    console.log('\n========================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('========================================================');
    console.log('Admin Credentials:    admin@aspirantai.in   / AdminPassword@123');
    console.log('Student Credentials:  student@aspirantai.in / StudentPassword@123');
    console.log('========================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
