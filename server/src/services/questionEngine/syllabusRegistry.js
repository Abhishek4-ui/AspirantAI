/**
 * AspirantAI — Competitive Examination Syllabus & Universal Blueprint Registry
 * Defines real syllabus blueprints, subject-wise question weightages, negative marking rules,
 * and test durations for all supported Indian and global examinations.
 */

const { getGatePaperByCode, getAllGatePapers } = require('../gate/gateRegistry');

const SYLLABUS_REGISTRY = {
  // ==========================================
  // A. UPSC & CIVIL SERVICES
  // ==========================================
  UPSC_CSE: {
    code: 'UPSC_CSE',
    name: 'UPSC Civil Services Examination (IAS/IPS/IFS)',
    category: 'Civil Services',
    group: 'UPSC & Civil Services',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 2,
    negativeMarks: 0.66,
    subjects: [
      {
        name: 'Indian Polity & Governance',
        weight: 0.22,
        topics: [
          'Preamble & Constitutional Philosophy',
          'Fundamental Rights & Duties',
          'Directive Principles of State Policy',
          'Parliament & State Legislature',
          'Judiciary & Landmark Judgments',
          'Panchayati Raj & Local Self Governance',
          'Constitutional & Statutory Bodies'
        ]
      },
      {
        name: 'Indian & World Geography',
        weight: 0.18,
        topics: [
          'Physical Geography of India',
          'Drainage & River Basin Systems',
          'Indian Monsoon & Climate Dynamics',
          'Soil Resources & Agriculture',
          'Economic & Human Geography',
          'Ocean Currents & Atmosphere'
        ]
      },
      {
        name: 'History of India & National Movement',
        weight: 0.20,
        topics: [
          'Indus Valley Civilization',
          'Vedic Period & Religious Movements',
          'Mauryan & Gupta Empires',
          'Medieval India & Architecture',
          'Revolt of 1857',
          'Freedom Struggle & Gandhian Phase',
          'Constitutional Development Under British Rule'
        ]
      },
      {
        name: 'Indian Economy & Development',
        weight: 0.18,
        topics: [
          'Monetary Policy & RBI Instruments',
          'Fiscal Policy, Budget & Taxation',
          'Inflation & Price Indices (CPI/WPI)',
          'Banking Sector Reforms & NPA Management',
          'External Sector, Balance of Payments & Trade',
          'Poverty, Inequality & Employment'
        ]
      },
      {
        name: 'Environment, Ecology & Science',
        weight: 0.22,
        topics: [
          'Biodiversity Hotspots & Conservation in India',
          'Climate Change, Conventions & Protocols',
          'Wildlife Protection Act & National Parks',
          'Biotechnology, Genetics & CRISPR',
          'Space Technology & Satellite Missions',
          'Artificial Intelligence & Quantum Computing'
        ]
      }
    ]
  },

  UPSC_IFS: {
    code: 'UPSC_IFS',
    name: 'UPSC Indian Forest Service Examination',
    category: 'Civil Services',
    group: 'UPSC & Civil Services',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 2,
    negativeMarks: 0.66,
    subjects: [
      {
        name: 'Forest Ecology & Silviculture',
        weight: 0.30,
        topics: ['Forest Types of India', 'Silvicultural Systems', 'Forest Mensuration & Management', 'Forest Protection & Fire Management']
      },
      {
        name: 'Environmental Science & Wildlife',
        weight: 0.30,
        topics: ['Wildlife Conservation & Protected Area Network', 'Biodiversity Act', 'Climate Adaptation', 'Ecological Succession']
      },
      {
        name: 'General Studies & Current Events',
        weight: 0.40,
        topics: ['Indian Geography & Forest Resources', 'Economy & Green Budgeting', 'International Environmental Protocols']
      }
    ]
  },

  UPSC_CDS: {
    code: 'UPSC_CDS',
    name: 'UPSC Combined Defence Services (CDS)',
    category: 'Defence',
    group: 'UPSC & Civil Services',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.33,
    subjects: [
      {
        name: 'General Knowledge',
        weight: 0.40,
        topics: ['Indian Constitution & Defence Forces', 'Modern Indian History', 'World Geography & Strategic Straits', 'General Science & Defence Tech']
      },
      {
        name: 'Elementary Mathematics',
        weight: 0.30,
        topics: ['Arithmetic & Number Systems', 'Trigonometry & Heights', 'Geometry & Mensuration', 'Algebra & Statistics']
      },
      {
        name: 'English Language',
        weight: 0.30,
        topics: ['Spotting Errors', 'Sentence Arrangement', 'Synonyms & Antonyms', 'Comprehension']
      }
    ]
  },

  UPSC_NDA: {
    code: 'UPSC_NDA',
    name: 'UPSC National Defence Academy (NDA & NA)',
    category: 'Defence',
    group: 'UPSC & Civil Services',
    defaultDurationMinutes: 150,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 2.5,
    negativeMarks: 0.83,
    subjects: [
      {
        name: 'Mathematics',
        weight: 0.50,
        topics: ['Algebra, Matrices & Determinants', 'Trigonometry', 'Analytical Geometry & Vectors', 'Calculus (Differential & Integral)', 'Probability & Statistics']
      },
      {
        name: 'General Ability Test (GAT) - English',
        weight: 0.20,
        topics: ['Grammar & Usage', 'Vocabulary & Idioms', 'Comprehension']
      },
      {
        name: 'General Ability Test (GAT) - General Science & GK',
        weight: 0.30,
        topics: ['Physics & Mechanics', 'Chemistry & Daily Compounds', 'General Science', 'History, Freedom Movement & Geography']
      }
    ]
  },

  UPSC_CAPF: {
    code: 'UPSC_CAPF',
    name: 'UPSC Central Armed Police Forces (Assistant Commandant)',
    category: 'Defence',
    group: 'UPSC & Civil Services',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 2,
    negativeMarks: 0.66,
    subjects: [
      {
        name: 'General Mental Ability',
        weight: 0.25,
        topics: ['Quantitative Aptitude', 'Logical Reasoning', 'Data Interpretation']
      },
      {
        name: 'General Science & Internal Security',
        weight: 0.25,
        topics: ['General Science', 'Internal Security Challenges', 'Border Management & CAPF Roles']
      },
      {
        name: 'Indian Polity & Economy',
        weight: 0.25,
        topics: ['Constitution of India', 'Public Administration', 'Economic Development & Planning']
      },
      {
        name: 'History & World Geography',
        weight: 0.25,
        topics: ['Indian Freedom Struggle', 'Physical Geography', 'Current National & Global Events']
      }
    ]
  },

  UPSC_ESE: {
    code: 'UPSC_ESE',
    name: 'UPSC Engineering Services Examination (ESE / IES)',
    category: 'Engineering Services',
    group: 'UPSC & Civil Services',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 2,
    negativeMarks: 0.66,
    subjects: [
      {
        name: 'General Studies & Engineering Aptitude',
        weight: 0.50,
        topics: ['Current Issues in National & International Importance', 'Engineering Ethics', 'Project Management & Quality Control', 'Basics of Energy & Environment', 'Information & Communication Technologies (ICT)']
      },
      {
        name: 'Engineering Mathematics & Reasoning',
        weight: 0.50,
        topics: ['Linear Algebra & Calculus', 'Differential Equations', 'Numerical Methods', 'Analytical & Logical Reasoning']
      }
    ]
  },

  UPSC_CMS: {
    code: 'UPSC_CMS',
    name: 'UPSC Combined Medical Services Examination',
    category: 'Medical Services',
    group: 'UPSC & Civil Services',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 2,
    negativeMarks: 0.66,
    subjects: [
      {
        name: 'General Medicine',
        weight: 0.40,
        topics: ['Cardiology & Pulmonology', 'Gastroenterology & Hepatology', 'Neurology & Endocrinology', 'Infectious Diseases & Dermatology']
      },
      {
        name: 'Paediatrics',
        weight: 0.20,
        topics: ['Growth & Development', 'Neonatology', 'Immunization & Nutritional Deficiencies']
      },
      {
        name: 'Surgery, Gynaecology & Obstetrics',
        weight: 0.25,
        topics: ['General Surgery & Trauma', 'Antenatal Care & Complications', 'Common Gynaecological Disorders']
      },
      {
        name: 'Preventive & Social Medicine (PSM)',
        weight: 0.15,
        topics: ['Epidemiology', 'National Health Programs', 'Biostatistics & Demography']
      }
    ]
  },

  // ==========================================
  // B. STATE PSC EXAMINATIONS
  // ==========================================
  BPSC_CCE: {
    code: 'BPSC_CCE',
    name: 'BPSC Combined Competitive Examination (70th CCE)',
    category: 'State PSC',
    group: 'State PSC Examinations',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.33,
    subjects: [
      {
        name: 'Bihar Special History & Culture',
        weight: 0.25,
        topics: [
          'Ancient Bihar: Magadha, Maurya & Nalanda',
          'Champaran Satyagraha 1917 & Mahatma Gandhi',
          'Role of Babu Kunwar Singh in 1857',
          'Tribal Revolts in Bihar (Santhal & Munda)',
          'Folk Art & Madhubani Paintings',
          'Freedom Fighters of Bihar & Bihar Kesari'
        ]
      },
      {
        name: 'Bihar Special Geography & Economy',
        weight: 0.25,
        topics: [
          'Physiography & Someshwar Range of Bihar',
          'River Ganga & Tributaries in Bihar (Kosi, Gandak, Son)',
          'Agro-climatic Zones & Crops of Bihar',
          'Seven Resolves (Saat Nischay-2) Scheme',
          'Bihar Economic Survey & Budget Highlights',
          'Industrial Development & Infrastructure in Bihar'
        ]
      },
      {
        name: 'General Science & Mental Ability',
        weight: 0.25,
        topics: [
          'Everyday Physics & Laws of Motion',
          'Chemical Compounds & Acid-Bases in Daily Life',
          'Human Physiology, Vitamins & Diseases',
          'Basic Mental Aptitude & Reasoning'
        ]
      },
      {
        name: 'Indian Polity & Modern History',
        weight: 0.25,
        topics: [
          'Panchayati Raj in Bihar (50% Women Reservation)',
          'Bihar Legislative Assembly & Council',
          'Fundamental Rights & Constitutional Amendments',
          'Indian Freedom Movement 1885-1947'
        ]
      }
    ]
  },

  UPPSC_PCS: {
    code: 'UPPSC_PCS',
    name: 'UPPSC Provincial Civil Services (PCS Prelims)',
    category: 'State PSC',
    group: 'State PSC Examinations',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1.33,
    negativeMarks: 0.44,
    subjects: [
      {
        name: 'Uttar Pradesh Special GK',
        weight: 0.25,
        topics: ['UP History, Art & Culture', 'UP Geography, Rivers & Canals', 'UP Economy, Budget & One District One Product (ODOP)', 'UP Governance & Schemes']
      },
      {
        name: 'Indian Polity & Governance',
        weight: 0.25,
        topics: ['Preamble & Fundamental Rights', 'Governor & State Executive', 'Local Self Government in UP', 'Judiciary & Public Policy']
      },
      {
        name: 'History of India & National Movement',
        weight: 0.25,
        topics: ['Ancient & Medieval India', '1857 Revolt in UP (Awadh, Jhansi, Kanpur)', 'National Movement & Revolutionary Activities']
      },
      {
        name: 'General Science, Environment & Economy',
        weight: 0.25,
        topics: ['Environmental Ecology & Tiger Reserves in UP', 'Everyday Science', 'Indian Economy & Agriculture']
      }
    ]
  },

  MPPSC_SET: {
    code: 'MPPSC_SET',
    name: 'MPPSC State Services Examination (Madhya Pradesh)',
    category: 'State PSC',
    group: 'State PSC Examinations',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 2,
    negativeMarks: 0,
    subjects: [
      {
        name: 'MP History, Culture & Literature',
        weight: 0.30,
        topics: ['Major Dynasties of MP (Chandela, Paramara, Holkar, Scindia)', 'Tribal Personalities of MP (Tantya Bhil, Birsa Munda)', 'Folk Dances, Songs & Arts of MP']
      },
      {
        name: 'Geography & Natural Resources of MP',
        weight: 0.25,
        topics: ['Rivers of MP (Narmada, Tapti, Chambal)', 'National Parks & Wildlife (Kanha, Bandhavgarh, Kuno)', 'Soil, Forests & Minerals in MP']
      },
      {
        name: 'Constitutional System & Economy of MP',
        weight: 0.25,
        topics: ['Panchayati Raj & Urban Administration in MP', 'Demography & Census of MP', 'Major Welfare Schemes of MP Govt']
      },
      {
        name: 'Information & Communication Technology & Science',
        weight: 0.20,
        topics: ['Robotics, AI & Cyber Security', 'E-Governance in MP', 'Basic Physics, Chemistry & Biology']
      }
    ]
  },

  RPSC_RAS: {
    code: 'RPSC_RAS',
    name: 'RPSC Rajasthan Administrative Services (RAS/RTS)',
    category: 'State PSC',
    group: 'State PSC Examinations',
    defaultDurationMinutes: 180,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1.33,
    negativeMarks: 0.44,
    subjects: [
      {
        name: 'History, Art & Culture of Rajasthan',
        weight: 0.30,
        topics: ['Forts, Palaces & Temples of Rajasthan', 'Rajasthani Paintings & Handicrafts', 'Folk Deities & Peasant Movements (Bijolia, Bengu)', 'Integration of Rajasthan']
      },
      {
        name: 'Geography of Rajasthan & India',
        weight: 0.25,
        topics: ['Aravalli Range & Thar Desert', 'Drainage System (Luni, Chambal, Banas)', 'Indira Gandhi Canal Project (IGNP)', 'Mineral Resources & Climate of Rajasthan']
      },
      {
        name: 'Polity & Administrative Setup of Rajasthan',
        weight: 0.25,
        topics: ['Governor, Chief Minister & State Human Rights Commission', 'RPSC & State Election Commission', 'Rajasthan Panchayati Raj System']
      },
      {
        name: 'Economy of Rajasthan & General Science',
        weight: 0.20,
        topics: ['Rajasthan Budget & Economic Review', 'Flagship Schemes of Rajasthan', 'Applied Science & Daily Technology']
      }
    ]
  },

  JPSC_CCE: {
    code: 'JPSC_CCE',
    name: 'JPSC Combined Civil Services (Jharkhand)',
    category: 'State PSC',
    group: 'State PSC Examinations',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 2,
    negativeMarks: 0,
    subjects: [
      {
        name: 'Jharkhand History, Culture & Tribal Society',
        weight: 0.40,
        topics: ['Tribal Governance (Munda, Manki-Munda, Doklo-Sohor)', 'Santhal Insurrection & Birsa Movement', 'CNTA & SPTA Land Tenancy Acts', 'Folk Art, Festivals (Sarhul, Karma) & Literature']
      },
      {
        name: 'Jharkhand Geography & Mineral Wealth',
        weight: 0.30,
        topics: ['Chota Nagpur Plateau & Damodar River', 'Mineral Deposits (Coal, Iron, Uranium, Mica)', 'Forests & National Parks (Betla)']
      },
      {
        name: 'General Studies & Indian Polity',
        weight: 0.30,
        topics: ['Constitution of India', 'Indian Economy', 'Science & Technology']
      }
    ]
  },

  WBPSC_WBCS: {
    code: 'WBPSC_WBCS',
    name: 'WBPSC West Bengal Civil Service (WBCS Executive)',
    category: 'State PSC',
    group: 'State PSC Examinations',
    defaultDurationMinutes: 150,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.33,
    subjects: [
      {
        name: 'History of India & National Movement in Bengal',
        weight: 0.35,
        topics: ['Bengal Renaissance (Raja Ram Mohan Roy, Vidyasagar)', 'Swadeshi Movement & Partition of Bengal 1905', 'Revolutionary Nationalism (Anushilan Samiti, Masterda Surya Sen)']
      },
      {
        name: 'Geography of West Bengal & India',
        weight: 0.25,
        topics: ['Physiography of West Bengal (Darjeeling Hills, Rarh, Sundarbans)', 'River Systems (Hooghly, Teesta, Damodar)', 'Agriculture & Jute Industry']
      },
      {
        name: 'Indian Polity & Economy',
        weight: 0.20,
        topics: ['Panchayati Raj in West Bengal', 'Indian Constitution', 'Economic Planning & Welfare Schemes (Kanyashree, Lakshmir Bhandar)']
      },
      {
        name: 'English Composition & General Mental Ability',
        weight: 0.20,
        topics: ['English Vocabulary & Grammar', 'Logical Reasoning & Arithmetic']
      }
    ]
  },

  OPSC_OAS: {
    code: 'OPSC_OAS',
    name: 'OPSC Odisha Administrative Services (OAS Prelims)',
    category: 'State PSC',
    group: 'State PSC Examinations',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 2,
    negativeMarks: 0.66,
    subjects: [
      {
        name: 'Odisha History, Art & Heritage',
        weight: 0.30,
        topics: ['Kalinga War & Ashoka Inscriptions', 'Temple Architecture (Konark, Puri Jagannath, Lingaraj)', 'Paika Rebellion 1817', 'Utkal Sammilani & Formation of Odisha']
      },
      {
        name: 'Odisha Geography & Natural Resources',
        weight: 0.30,
        topics: ['Mahanadi River Basin & Hirakud Dam', 'Chilika Lake & Coastal Wetlands', 'Mineral Belt (Bauxite, Iron, Chromite)', 'Simlipal Biosphere Reserve']
      },
      {
        name: 'Indian Polity, Economy & General Science',
        weight: 0.40,
        topics: ['Constitution of India', 'Odisha Economic Survey', 'Disaster Management & Cyclone Mitigation in Odisha']
      }
    ]
  },

  MPSC_STATE: {
    code: 'MPSC_STATE',
    name: 'MPSC Maharashtra State Services Examination (Rajyaseva)',
    category: 'State PSC',
    group: 'State PSC Examinations',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 2,
    negativeMarks: 0.50,
    subjects: [
      {
        name: 'History of Maharashtra & Social Reformers',
        weight: 0.30,
        topics: ['Chhatrapati Shivaji Maharaj & Maratha Empire', 'Social Reformers (Jyotirao Phule, Savitribai Phule, Dr. B.R. Ambedkar, Shahu Maharaj)', 'Samyukta Maharashtra Movement']
      },
      {
        name: 'Geography of Maharashtra',
        weight: 0.25,
        topics: ['Western Ghats (Sahyadri) & Konkan Coast', 'Deccan Plateau & Godavari-Krishna Basins', 'Black Cotton Soil & Agriculture in Maharashtra']
      },
      {
        name: 'Maharashtra Polity & Economy',
        weight: 0.25,
        topics: ['73rd & 74th Amendments in Maharashtra', 'Industrial Development & SEZs in Maharashtra', 'Co-operative Movement & Sugar Sector']
      },
      {
        name: 'General Science & Environment',
        weight: 0.20,
        topics: ['Applied Physics, Chemistry & Biology', 'Biodiversity of Western Ghats', 'Environmental Issues']
      }
    ]
  },

  HPSC_HCS: {
    code: 'HPSC_HCS',
    name: 'HPSC Haryana Civil Services (HCS Prelims)',
    category: 'State PSC',
    group: 'State PSC Examinations',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.25,
    subjects: [
      {
        name: 'Haryana Special GK, History & Culture',
        weight: 0.30,
        topics: ['Battle of Panipat & 1857 in Haryana', 'Harappan Sites in Haryana (Rakhigarhi, Banawali)', 'Folk Culture, Ragini & Dances', 'Sports & Medals from Haryana']
      },
      {
        name: 'Haryana Economy & Agriculture',
        weight: 0.25,
        topics: ['Green Revolution in Haryana', 'Industrial Hubs (Gurugram, Faridabad, Manesar)', 'Canal Irrigation (Western Yamuna Canal)']
      },
      {
        name: 'General Studies & Science',
        weight: 0.45,
        topics: ['Indian Polity & Constitution', 'General Science & Everyday Technology', 'Modern Indian History & Geography']
      }
    ]
  },

  UKPSC_PCS: {
    code: 'UKPSC_PCS',
    name: 'UKPSC Uttarakhand Combined State Civil Services',
    category: 'State PSC',
    group: 'State PSC Examinations',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.25,
    subjects: [
      {
        name: 'Uttarakhand History & Statehood Movement',
        weight: 0.35,
        topics: ['Garhwal & Kumaon Dynasties (Panwar, Chand, Katyuri)', 'Chipko Movement & Gaura Devi', 'Uttarakhand Statehood Movement & Martyrs', 'Panch Prayag, Chardham & Folk Lore']
      },
      {
        name: 'Uttarakhand Geography & Himalayan Ecology',
        weight: 0.30,
        topics: ['Himalayan Glaciers & Rivers (Ganga, Yamuna, Alaknanda, Bhagirathi)', 'Jim Corbett & Valley of Flowers National Parks', 'Landslides, Seismic Zones & Disaster Management']
      },
      {
        name: 'General Studies & Indian Constitution',
        weight: 0.35,
        topics: ['Indian Polity', 'Economic Development', 'General Science & Mental Ability']
      }
    ]
  },

  // ==========================================
  // C. SSC EXAMINATIONS
  // ==========================================
  SSC_CGL: {
    code: 'SSC_CGL',
    name: 'SSC Combined Graduate Level (CGL Tier 1)',
    category: 'SSC',
    group: 'SSC Examinations',
    defaultDurationMinutes: 60,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 2,
    negativeMarks: 0.50,
    subjects: [
      {
        name: 'Quantitative Aptitude',
        weight: 0.30,
        topics: [
          'Profit, Loss & Discount',
          'Time, Speed & Distance (Trains & Boats)',
          'Simple & Compound Interest',
          'Time & Work (Pipes & Cisterns)',
          'Ratio, Proportion & Percentages',
          'Trigonometry & Heights & Distances',
          'Algebra & Geometry Identities'
        ]
      },
      {
        name: 'General Intelligence & Reasoning',
        weight: 0.25,
        topics: [
          'Syllogism & Deductive Logic',
          'Coding-Decoding & Pattern Shifts',
          'Blood Relations & Family Trees',
          'Number Series & Missing Terms',
          'Direction Sense & Venn Diagrams',
          'Analogies & Odd One Out'
        ]
      },
      {
        name: 'English Comprehension',
        weight: 0.25,
        topics: [
          'Idioms & Phrases',
          'One-Word Substitution',
          'Error Detection & Subject-Verb Agreement',
          'Synonyms & Antonyms',
          'Cloze Test & Sentence Improvement'
        ]
      },
      {
        name: 'General Awareness',
        weight: 0.20,
        topics: [
          'Indian Constitution & Fundamental Duties',
          'Indian History & First in India',
          'General Science & Endocrine System',
          'Economic Terms & NITI Aayog',
          'Static GK, National Parks & Sports Trophies'
        ]
      }
    ]
  },

  SSC_CHSL: {
    code: 'SSC_CHSL',
    name: 'SSC Combined Higher Secondary Level (CHSL 10+2)',
    category: 'SSC',
    group: 'SSC Examinations',
    defaultDurationMinutes: 60,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 2,
    negativeMarks: 0.50,
    subjects: [
      {
        name: 'Quantitative Aptitude',
        weight: 0.30,
        topics: ['Percentages & Averages', 'Profit & Loss', 'Mensuration & Geometry', 'Algebraic Identities', 'Data Interpretation']
      },
      {
        name: 'General Intelligence',
        weight: 0.25,
        topics: ['Analogy & Classification', 'Series Completion', 'Coding-Decoding', 'Embedded Figures & Paper Folding']
      },
      {
        name: 'English Language',
        weight: 0.25,
        topics: ['Spotting the Error', 'Fill in the Blanks', 'Synonyms, Antonyms & Spelling', 'Active/Passive Voice']
      },
      {
        name: 'General Awareness',
        weight: 0.20,
        topics: ['Current Affairs & Awards', 'Indian Polity & History', 'Everyday Science & Geography']
      }
    ]
  },

  SSC_MTS: {
    code: 'SSC_MTS',
    name: 'SSC Multi-Tasking Staff & Havaldar (MTS)',
    category: 'SSC',
    group: 'SSC Examinations',
    defaultDurationMinutes: 90,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 3,
    negativeMarks: 1,
    subjects: [
      {
        name: 'General Awareness',
        weight: 0.35,
        topics: ['Indian Culture, Art & Dance', 'Basic History & Freedom Fighters', 'General Science & Environment', 'Indian Constitution Basics']
      },
      {
        name: 'English Language & Comprehension',
        weight: 0.35,
        topics: ['Vocabulary & Grammar', 'Sentence Structure & Synonyms', 'Short Reading Passage']
      },
      {
        name: 'Numerical & Mathematical Ability',
        weight: 0.15,
        topics: ['Integers & Whole Numbers', 'LCM & HCF', 'Percentages & Ratio', 'Work & Time']
      },
      {
        name: 'Reasoning Ability & Problem Solving',
        weight: 0.15,
        topics: ['Alpha-Numeric Series', 'Coding-Decoding', 'Directions & Order', 'Non-Verbal Reasoning']
      }
    ]
  },

  SSC_GD: {
    code: 'SSC_GD',
    name: 'SSC GD Constable (CAPF, SSF, Rifleman GD)',
    category: 'SSC',
    group: 'SSC Examinations',
    defaultDurationMinutes: 60,
    dailyQuizQuestions: 80,
    cbtMockQuestions: 40,
    positiveMarks: 2,
    negativeMarks: 0.50,
    subjects: [
      {
        name: 'General Intelligence and Reasoning',
        weight: 0.25,
        topics: ['Analogies & Similarities', 'Spatial Visualization', 'Arithmetical Reasoning', 'Figural Classification']
      },
      {
        name: 'General Knowledge and General Awareness',
        weight: 0.25,
        topics: ['India & Neighboring Countries', 'Sports, History & Culture', 'Economic Scene & Constitution']
      },
      {
        name: 'Elementary Mathematics',
        weight: 0.25,
        topics: ['Number Systems & Decimals', 'Percentages & Averages', 'Profit, Loss & Discount', 'Mensuration']
      },
      {
        name: 'English / Hindi Language',
        weight: 0.25,
        topics: ['Comprehension & Vocabulary', 'Error Identification', 'Sentence Correction & Grammar']
      }
    ]
  },

  SSC_CPO: {
    code: 'SSC_CPO',
    name: 'SSC Central Police Organisation (SI in Delhi Police & CAPF)',
    category: 'SSC',
    group: 'SSC Examinations',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.25,
    subjects: [
      {
        name: 'General Intelligence and Reasoning',
        weight: 0.25,
        topics: ['Symbolic Operations', 'Space Orientation', 'Venn Diagrams', 'Critical Thinking']
      },
      {
        name: 'General Knowledge and Awareness',
        weight: 0.25,
        topics: ['History & Geography of India', 'Scientific Research & Polity', 'Economic Affairs']
      },
      {
        name: 'Quantitative Aptitude',
        weight: 0.25,
        topics: ['Algebra, Geometry & Trigonometry', 'Heights & Distances', 'Bar Diagrams & Histograms']
      },
      {
        name: 'English Comprehension',
        weight: 0.25,
        topics: ['Grammar & Error Detection', 'Idiomatic Usage & Phrases', 'Comprehension Passages']
      }
    ]
  },

  SSC_STENOGRAPHER: {
    code: 'SSC_STENOGRAPHER',
    name: 'SSC Stenographer Grade C & D Examination',
    category: 'SSC',
    group: 'SSC Examinations',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.25,
    subjects: [
      {
        name: 'English Language and Comprehension',
        weight: 0.50,
        topics: ['Grammar, Synonyms & Antonyms', 'Sentence Completion & Phrases', 'Comprehension Passages']
      },
      {
        name: 'General Intelligence and Reasoning',
        weight: 0.25,
        topics: ['Analogies & Relationships', 'Visual Memory', 'Discriminating Observation']
      },
      {
        name: 'General Awareness',
        weight: 0.25,
        topics: ['Current Events', 'India & Neighboring Countries', 'History & Constitution']
      }
    ]
  },

  SSC_JE: {
    code: 'SSC_JE',
    name: 'SSC Junior Engineer (Civil / Electrical / Mechanical)',
    category: 'SSC',
    group: 'SSC Examinations',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.25,
    subjects: [
      {
        name: 'Engineering Domain (Civil/Elec/Mech)',
        weight: 0.50,
        topics: ['Structural & Material Engineering', 'Thermodynamics & Fluid Mechanics', 'Electrical Circuits & Machines', 'Surveying & Estimation']
      },
      {
        name: 'General Intelligence & Reasoning',
        weight: 0.25,
        topics: ['Arithmetical Computations', 'Relationship Concepts', 'Spatial Orientation']
      },
      {
        name: 'General Awareness',
        weight: 0.25,
        topics: ['General Science', 'Indian Polity & Geography', 'Everyday Discoveries']
      }
    ]
  },

  SSC_SELECTION_POST: {
    code: 'SSC_SELECTION_POST',
    name: 'SSC Selection Post Examination (Phase XII/XIII)',
    category: 'SSC',
    group: 'SSC Examinations',
    defaultDurationMinutes: 60,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 2,
    negativeMarks: 0.50,
    subjects: [
      {
        name: 'General Intelligence',
        weight: 0.25,
        topics: ['Matrix & Coding', 'Paper Cutting & Folding', 'Syllogism', 'Blood Relations']
      },
      {
        name: 'General Awareness',
        weight: 0.25,
        topics: ['Static GK & Geography', 'Indian Polity & Economy', 'Modern History & Science']
      },
      {
        name: 'Quantitative Aptitude',
        weight: 0.25,
        topics: ['Arithmetic & Percentages', 'Algebra & Mensuration', 'Speed & Distance']
      },
      {
        name: 'English Language',
        weight: 0.25,
        topics: ['Grammar & Error Spotting', 'Vocabulary & Cloze Test', 'Reading Comprehension']
      }
    ]
  },

  // ==========================================
  // D. BANKING & INSURANCE
  // ==========================================
  IBPS_PO: {
    code: 'IBPS_PO',
    name: 'IBPS Probationary Officer (PO / Management Trainee)',
    category: 'Banking',
    group: 'Banking & Insurance',
    defaultDurationMinutes: 60,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.25,
    subjects: [
      {
        name: 'Banking & Financial Awareness',
        weight: 0.25,
        topics: [
          'RBI Monetary Policy (Repo, CRR, SLR)',
          'Priority Sector Lending (PSL) Norms',
          'DICGC Deposit Insurance Provisions',
          'UPI, NEFT, RTGS & NPCI Ecosystem',
          'NPA Classification & Basel III Accords',
          'Money Market & Treasury Bills (T-Bills)'
        ]
      },
      {
        name: 'Quantitative Aptitude',
        weight: 0.25,
        topics: [
          'Data Interpretation (Table, Pie, Bar Graphs)',
          'Quadratic Equation Comparison',
          'Number Series & Missing Values',
          'Approximation & Simplification',
          'Arithmetic Word Problems'
        ]
      },
      {
        name: 'Reasoning Ability',
        weight: 0.25,
        topics: [
          'Seating Arrangement (Circular & Linear)',
          'Floor & Box Puzzles',
          'Syllogism (Only a Few Concepts)',
          'Coded Inequalities',
          'Input-Output Machine Reasoning'
        ]
      },
      {
        name: 'English Language',
        weight: 0.25,
        topics: [
          'Reading Comprehension & Inferences',
          'Parajumbles & Sentence Rearrangement',
          'Error Detection & Phrasal Verbs',
          'Cloze Test & Fillers'
        ]
      }
    ]
  },

  IBPS_CLERK: {
    code: 'IBPS_CLERK',
    name: 'IBPS Clerk (Customer Support Associate)',
    category: 'Banking',
    group: 'Banking & Insurance',
    defaultDurationMinutes: 60,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.25,
    subjects: [
      {
        name: 'Numerical Ability',
        weight: 0.35,
        topics: ['Simplification & Approximation', 'Number Series', 'Data Interpretation', 'Arithmetic Word Problems']
      },
      {
        name: 'Reasoning Ability',
        weight: 0.35,
        topics: ['Puzzles & Seating Arrangements', 'Inequalities & Syllogism', 'Alphanumeric Series', 'Coding-Decoding']
      },
      {
        name: 'English Language',
        weight: 0.30,
        topics: ['Reading Comprehension', 'Error Spotting', 'Sentence Correction', 'Fill in the Blanks']
      }
    ]
  },

  IBPS_SO: {
    code: 'IBPS_SO',
    name: 'IBPS Specialist Officer (IT / Agriculture / Rajbhasha / HR)',
    category: 'Banking',
    group: 'Banking & Insurance',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.25,
    subjects: [
      {
        name: 'Professional Knowledge (Specialization)',
        weight: 0.40,
        topics: ['Database & Networking (IT)', 'Agricultural Economy & Agronomy (AFO)', 'Labor Laws & HR Management (HR)', 'Banking Law & Regulations (Law)']
      },
      {
        name: 'Reasoning Ability',
        weight: 0.20,
        topics: ['Logical Deductions', 'Puzzles & Analytical Reasoning', 'Input-Output']
      },
      {
        name: 'Quantitative Aptitude',
        weight: 0.20,
        topics: ['Data Interpretation', 'Arithmetic Equations', 'Number Sequences']
      },
      {
        name: 'English Language',
        weight: 0.20,
        topics: ['Professional Vocabulary', 'Comprehension', 'Grammar Correction']
      }
    ]
  },

  IBPS_RRB_PO: {
    code: 'IBPS_RRB_PO',
    name: 'IBPS Regional Rural Banks Officer Scale 1',
    category: 'Banking',
    group: 'Banking & Insurance',
    defaultDurationMinutes: 45,
    dailyQuizQuestions: 80,
    cbtMockQuestions: 40,
    positiveMarks: 1,
    negativeMarks: 0.25,
    subjects: [
      {
        name: 'Quantitative Aptitude',
        weight: 0.50,
        topics: ['Data Interpretation (Tables, Line, Pie)', 'Simplification', 'Quadratic Equations', 'Arithmetic Word Problems']
      },
      {
        name: 'Reasoning Ability',
        weight: 0.50,
        topics: ['Puzzles & Seating Arrangements', 'Syllogisms & Direction Sense', 'Blood Relations', 'Inequality']
      }
    ]
  },

  IBPS_RRB_CLERK: {
    code: 'IBPS_RRB_CLERK',
    name: 'IBPS Regional Rural Banks Office Assistant',
    category: 'Banking',
    group: 'Banking & Insurance',
    defaultDurationMinutes: 45,
    dailyQuizQuestions: 80,
    cbtMockQuestions: 40,
    positiveMarks: 1,
    negativeMarks: 0.25,
    subjects: [
      {
        name: 'Numerical Ability',
        weight: 0.50,
        topics: ['Basic Simplification & BODMAS', 'Number Series', 'Percentages & Profit/Loss', 'Simple Interest']
      },
      {
        name: 'Reasoning Ability',
        weight: 0.50,
        topics: ['Alphabet & Number Series', 'Linear Puzzles', 'Syllogism', 'Direction & Distance']
      }
    ]
  },

  SBI_PO: {
    code: 'SBI_PO',
    name: 'State Bank of India Probationary Officer (SBI PO)',
    category: 'Banking',
    group: 'Banking & Insurance',
    defaultDurationMinutes: 60,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.25,
    subjects: [
      {
        name: 'Quantitative Aptitude',
        weight: 0.35,
        topics: ['High-Level Data Interpretation', 'Data Sufficiency', 'Probability & Permutations', 'Caselet DI']
      },
      {
        name: 'Reasoning Ability',
        weight: 0.35,
        topics: ['Advanced Floor/Box Puzzles', 'Critical Reasoning & Inferences', 'Machine Input-Output', 'Coded Direction & Blood Relations']
      },
      {
        name: 'English Language',
        weight: 0.30,
        topics: ['Advanced Reading Comprehension', 'Connectors & Column Matching', 'Sentence Fillers & Cloze Tests']
      }
    ]
  },

  SBI_CLERK: {
    code: 'SBI_CLERK',
    name: 'State Bank of India Junior Associates (SBI Clerk)',
    category: 'Banking',
    group: 'Banking & Insurance',
    defaultDurationMinutes: 60,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.25,
    subjects: [
      {
        name: 'Numerical Ability',
        weight: 0.35,
        topics: ['Simplification & Rounding', 'Missing & Wrong Series', 'Table & Bar DI', 'Basic Word Problems']
      },
      {
        name: 'Reasoning Ability',
        weight: 0.35,
        topics: ['Circular/Square Seating', 'Inequality & Order Ranking', 'Syllogisms', 'Coding']
      },
      {
        name: 'English Language',
        weight: 0.30,
        topics: ['Comprehension Passages', 'Error Detection', 'Sentence Rearrangement', 'Vocabulary']
      }
    ]
  },

  RBI_GRADE_B: {
    code: 'RBI_GRADE_B',
    name: 'Reserve Bank of India Grade B Officers (Phase 1)',
    category: 'Banking',
    group: 'Banking & Insurance',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.25,
    subjects: [
      {
        name: 'General Awareness & Economic News',
        weight: 0.40,
        topics: ['RBI Annual Report & Financial Stability Report', 'Monetary Policy & International Institutions (IMF/World Bank)', 'Union Budget & Economic Survey', 'Banking Current Affairs']
      },
      {
        name: 'Reasoning',
        weight: 0.30,
        topics: ['High-Level Analytical Puzzles', 'Critical Reasoning & Arguments', 'Statement-Assumption', 'Data Sufficiency']
      },
      {
        name: 'Quantitative Aptitude',
        weight: 0.15,
        topics: ['Complex DI & Radar Graphs', 'Arithmetic Word Problems', 'Number Series']
      },
      {
        name: 'English Language',
        weight: 0.15,
        topics: ['Editorial Comprehension', 'Vocabulary & Sentence Improvement', 'Parajumbles']
      }
    ]
  },

  RBI_ASSISTANT: {
    code: 'RBI_ASSISTANT',
    name: 'Reserve Bank of India Assistant Examination',
    category: 'Banking',
    group: 'Banking & Insurance',
    defaultDurationMinutes: 60,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.25,
    subjects: [
      {
        name: 'Numerical Ability',
        weight: 0.35,
        topics: ['Simplification', 'Number Sequences', 'Arithmetic Concepts', 'Data Interpretation']
      },
      {
        name: 'Reasoning Ability',
        weight: 0.35,
        topics: ['Puzzles & Arrangements', 'Syllogisms', 'Coding-Decoding', 'Blood Relations']
      },
      {
        name: 'English Language',
        weight: 0.30,
        topics: ['Reading Comprehension', 'Sentence Correction', 'Spellings', 'Vocabulary']
      }
    ]
  },

  NABARD_GRADE_A: {
    code: 'NABARD_GRADE_A',
    name: 'NABARD Assistant Manager (Grade A Prelims)',
    category: 'Banking',
    group: 'Banking & Insurance',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.25,
    subjects: [
      {
        name: 'Agriculture and Rural Development (ARD)',
        weight: 0.30,
        topics: ['Soil & Water Conservation', 'Agronomy & Crops of India', 'Farm Engineering & Animal Husbandry', 'Rural Credit & Microfinance']
      },
      {
        name: 'Economic and Social Issues (ESI)',
        weight: 0.30,
        topics: ['Nature of Indian Economy', 'Poverty Alleviation Schemes', 'Sustainable Development & Climate Change', 'Social Structure & Demography']
      },
      {
        name: 'General Awareness & Reasoning',
        weight: 0.40,
        topics: ['Government Schemes for Rural India', 'Quantitative & Analytical Aptitude', 'English Language']
      }
    ]
  },

  LIC_AAO: {
    code: 'LIC_AAO',
    name: 'Life Insurance Corporation Assistant Administrative Officer',
    category: 'Insurance',
    group: 'Banking & Insurance',
    defaultDurationMinutes: 60,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.25,
    subjects: [
      {
        name: 'Quantitative Aptitude',
        weight: 0.35,
        topics: ['Data Interpretation', 'Percentages & Profit/Loss', 'Time, Work & Distance', 'Quadratic Equations']
      },
      {
        name: 'Reasoning Ability',
        weight: 0.35,
        topics: ['Seating Arrangements', 'Puzzles & Syllogism', 'Blood Relations', 'Inequality']
      },
      {
        name: 'English Language',
        weight: 0.30,
        topics: ['Reading Comprehension', 'Cloze Test', 'Error Detection', 'Sentence Rearrangement']
      }
    ]
  },

  // ==========================================
  // E. RAILWAY EXAMINATIONS
  // ==========================================
  RRB_NTPC: {
    code: 'RRB_NTPC',
    name: 'Railway Non-Technical Popular Categories (NTPC)',
    category: 'Railway',
    group: 'Railway Examinations',
    defaultDurationMinutes: 90,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.33,
    subjects: [
      {
        name: 'General Awareness & Railways',
        weight: 0.40,
        topics: [
          'History & Heritage of Indian Railways',
          'Railway Zones, Headquarters & Divisions',
          'UNESCO Heritage Sites in India',
          'National & International Current Events',
          'Inventions, Discoveries & General Science'
        ]
      },
      {
        name: 'Mathematics',
        weight: 0.30,
        topics: [
          'LCM & HCF of Numbers',
          'Time, Work & Pipes',
          'Speed, Distance & Relative Motion',
          'Simple & Compound Interest',
          'Elementary Algebra & Statistics'
        ]
      },
      {
        name: 'General Intelligence & Reasoning',
        weight: 0.30,
        topics: [
          'Direction Sense & Distance',
          'Venn Diagrams & Syllogism',
          'Coding-Decoding & Mathematical Operations',
          'Statement & Conclusion',
          'Analogies & Blood Relations'
        ]
      }
    ]
  },

  RRB_GROUP_D: {
    code: 'RRB_GROUP_D',
    name: 'Railway Group D Level 1 Examination',
    category: 'Railway',
    group: 'Railway Examinations',
    defaultDurationMinutes: 90,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.33,
    subjects: [
      {
        name: 'General Science',
        weight: 0.30,
        topics: ['Class 10 Physics (Mechanics, Optics, Electricity)', 'Chemistry (Periodic Table, Chemical Reactions)', 'Life Sciences (Human Organ Systems, Genetics)']
      },
      {
        name: 'Mathematics',
        weight: 0.25,
        topics: ['BODMAS & Decimals', 'Percentages & Ratio', 'Time & Work', 'Distance & Speed']
      },
      {
        name: 'General Intelligence & Reasoning',
        weight: 0.25,
        topics: ['Analogies & Classification', 'Series Completion', 'Data Interpretation', 'Conclusions']
      },
      {
        name: 'General Awareness & Current Affairs',
        weight: 0.20,
        topics: ['Science & Tech Advances', 'Sports, Personalities & Indian Culture', 'Indian Railways']
      }
    ]
  },

  RRB_ALP: {
    code: 'RRB_ALP',
    name: 'Railway Assistant Loco Pilot & Technician (ALP CBT 1)',
    category: 'Railway',
    group: 'Railway Examinations',
    defaultDurationMinutes: 60,
    dailyQuizQuestions: 75,
    cbtMockQuestions: 40,
    positiveMarks: 1,
    negativeMarks: 0.33,
    subjects: [
      {
        name: 'Mathematics',
        weight: 0.30,
        topics: ['Number System & Fractions', 'Square Roots & Age Calculations', 'Time, Work & Distance', 'Trigonometry & Mensuration']
      },
      {
        name: 'General Intelligence & Reasoning',
        weight: 0.30,
        topics: ['Venn Diagrams & Syllogism', 'Jumbling & Venn Diagrams', 'Coding-Decoding', 'Mathematical Operations']
      },
      {
        name: 'Basic Science and Engineering',
        weight: 0.25,
        topics: ['Units & Measurements', 'Mass, Weight & Density', 'Work, Power & Energy', 'Speed & Velocity', 'Heat & Temperature']
      },
      {
        name: 'General Awareness',
        weight: 0.15,
        topics: ['Current Affairs', 'Science & Technology', 'Sports & Culture']
      }
    ]
  },

  RRB_JE: {
    code: 'RRB_JE',
    name: 'Railway Junior Engineer (RRB JE CBT 1)',
    category: 'Railway',
    group: 'Railway Examinations',
    defaultDurationMinutes: 90,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.33,
    subjects: [
      {
        name: 'General Science',
        weight: 0.30,
        topics: ['Physics (Laws of Motion, Work, Heat)', 'Chemistry (Acids/Bases, Metals/Non-metals)', 'Life Science (Cell Biology, Physiology)']
      },
      {
        name: 'Mathematics',
        weight: 0.30,
        topics: ['Algebra, Geometry & Trigonometry', 'Ratio & Proportion', 'Time, Work & Distance', 'Simple & Compound Interest']
      },
      {
        name: 'General Intelligence & Reasoning',
        weight: 0.25,
        topics: ['Analogies & Series', 'Blood Relations', 'Venn Diagrams', 'Direction Sense']
      },
      {
        name: 'General Awareness',
        weight: 0.15,
        topics: ['Indian Geography & Railways', 'Current Events', 'Indian Polity']
      }
    ]
  },

  RPF_SI: {
    code: 'RPF_SI',
    name: 'Railway Protection Force Sub-Inspector & Constable',
    category: 'Railway',
    group: 'Railway Examinations',
    defaultDurationMinutes: 90,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.33,
    subjects: [
      {
        name: 'General Awareness',
        weight: 0.40,
        topics: ['Indian History, Art & Culture', 'Geography & Economics', 'General Polity & Indian Constitution', 'Sports & General Science']
      },
      {
        name: 'Arithmetic',
        weight: 0.30,
        topics: ['Number Systems & Averages', 'Percentages & Ratio', 'Profit, Loss & Discount', 'Time & Distance']
      },
      {
        name: 'General Intelligence & Reasoning',
        weight: 0.30,
        topics: ['Spatial Visualization', 'Judgment & Decision Making', 'Visual Memory', 'Concept of Relationships']
      }
    ]
  },

  // ==========================================
  // F. ENGINEERING ENTRANCE & GATE
  // ==========================================
  JEE_MAIN: {
    code: 'JEE_MAIN',
    name: 'Joint Entrance Examination (JEE Main)',
    category: 'Engineering Entrance',
    group: 'Engineering & Technology',
    defaultDurationMinutes: 180,
    dailyQuizQuestions: 90,
    cbtMockQuestions: 45,
    positiveMarks: 4,
    negativeMarks: 1,
    subjects: [
      {
        name: 'Physics',
        weight: 0.33,
        topics: [
          'Kinematics & Laws of Motion',
          'Rotational Motion & Moment of Inertia',
          'Thermodynamics & Kinetic Theory of Gases',
          'Electrostatics & Current Electricity',
          'Optics (Wave & Ray)',
          'Modern Physics & Semiconductor Devices'
        ]
      },
      {
        name: 'Chemistry',
        weight: 0.33,
        topics: [
          'Chemical Bonding & Molecular Structure',
          'Thermodynamics & Chemical Equilibrium',
          'Coordination Compounds & Transition Elements',
          'Organic Reaction Mechanisms (Hydrocarbons, Haloalkanes)',
          'Aldehydes, Ketones & Biomolecules',
          'Electrochemistry & Chemical Kinetics'
        ]
      },
      {
        name: 'Mathematics',
        weight: 0.34,
        topics: [
          'Complex Numbers & Quadratic Equations',
          'Matrices & Determinants',
          'Calculus (Limits, Continuity, Differentiation & Integration)',
          'Vectors & 3-Dimensional Geometry',
          'Coordinate Geometry (Circles, Conics)',
          'Probability & Binomial Theorem'
        ]
      }
    ]
  },

  JEE_ADVANCED: {
    code: 'JEE_ADVANCED',
    name: 'IIT Joint Entrance Examination (JEE Advanced)',
    category: 'Engineering Entrance',
    group: 'Engineering & Technology',
    defaultDurationMinutes: 180,
    dailyQuizQuestions: 60,
    cbtMockQuestions: 36,
    positiveMarks: 4,
    negativeMarks: 2,
    subjects: [
      {
        name: 'Physics',
        weight: 0.33,
        topics: ['Rigid Body Dynamics & Fluid Mechanics', 'Electromagnetic Induction & AC Circuits', 'Wave Optics & Interference', 'Nuclear Physics & Quantum Phenomena']
      },
      {
        name: 'Chemistry',
        weight: 0.33,
        topics: ['Stereochemistry & Reaction Intermediates', 'Inorganic Qualitative Analysis', 'Chemical Thermodynamics & Electrochemistry', 'Coordination Chemistry & Isomerism']
      },
      {
        name: 'Mathematics',
        weight: 0.34,
        topics: ['Definite Integrals & Differential Equations', '3D Coordinate Geometry & Vector Calculus', 'Probability Distributions', 'Functional Equations & Continuity']
      }
    ]
  },

  WBJEE: {
    code: 'WBJEE',
    name: 'West Bengal Joint Entrance Examination (WBJEE)',
    category: 'Engineering Entrance',
    group: 'Engineering & Technology',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 2,
    negativeMarks: 0.50,
    subjects: [
      {
        name: 'Mathematics',
        weight: 0.50,
        topics: ['Algebra & Coordinate Geometry', 'Calculus & Vectors', 'Trigonometry & Probability']
      },
      {
        name: 'Physics',
        weight: 0.25,
        topics: ['Mechanics & Heat', 'Electrodynamics & Magnetism', 'Optics & Modern Physics']
      },
      {
        name: 'Chemistry',
        weight: 0.25,
        topics: ['Physical Chemistry', 'Organic Synthesis', 'Inorganic Trends & Periodic Table']
      }
    ]
  },

  MHT_CET: {
    code: 'MHT_CET',
    name: 'Maharashtra Common Entrance Test (MHT CET Engineering)',
    category: 'Engineering Entrance',
    group: 'Engineering & Technology',
    defaultDurationMinutes: 180,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 2,
    negativeMarks: 0,
    subjects: [
      {
        name: 'Mathematics',
        weight: 0.50,
        topics: ['Mathematical Logic & Matrices', 'Trigonometric Functions & Vectors', 'Calculus & Applications']
      },
      {
        name: 'Physics',
        weight: 0.25,
        topics: ['Rotational Dynamics & Oscillations', 'Wave Optics & Electrostatics', 'Current Electricity & Magnetic Effects']
      },
      {
        name: 'Chemistry',
        weight: 0.25,
        topics: ['Chemical Thermodynamics', 'Electrochemistry', 'Coordination Compounds', 'Organic Compounds with Functional Groups']
      }
    ]
  },

  GATE_CSE: {
    code: 'GATE_CSE',
    name: 'GATE Computer Science & Information Technology',
    category: 'GATE CSE',
    group: 'Engineering & Technology',
    defaultDurationMinutes: 180,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 2,
    negativeMarks: 0.66,
    subjects: [
      {
        name: 'Data Structures & Algorithms',
        weight: 0.25,
        topics: [
          'Asymptotic Complexity & Recurrence Relations',
          'Binary Search Trees, AVL & Heaps',
          'Graph Algorithms (Dijkstra, Prim, Kruskal)',
          'Dynamic Programming (Knapsack, LCS)',
          'Sorting & Searching Bounds'
        ]
      },
      {
        name: 'Operating Systems',
        weight: 0.20,
        topics: [
          'CPU Scheduling Algorithms (Round Robin, SRTF)',
          'Process Synchronization & Semaphores',
          'Deadlock Avoidance & Banker Algorithm',
          'Virtual Memory & Page Replacement (LRU, Belady)',
          'File Systems & Disk Scheduling'
        ]
      },
      {
        name: 'Database Management Systems',
        weight: 0.20,
        topics: [
          'ER Modeling & Relational Algebra',
          'SQL Queries & Subqueries',
          'Normalization (1NF, 2NF, 3NF, BCNF)',
          'Transaction Management & Serializability',
          'Indexing, B-Trees & B+ Trees'
        ]
      },
      {
        name: 'Computer Networks',
        weight: 0.18,
        topics: [
          'OSI & TCP/IP Model Layers',
          'Sliding Window Flow Control Protocols',
          'IPv4 Addressing, Subnetting & CIDR',
          'Routing Algorithms (Distance Vector, Link State)',
          'TCP Handshake & Congestion Control'
        ]
      },
      {
        name: 'Theory of Computation & Math',
        weight: 0.17,
        topics: [
          'Regular Expressions, DFA & NFA',
          'Context-Free Grammars & Pushdown Automata',
          'Turing Machines & Decidability',
          'Propositional & First-Order Logic',
          'Combinatorics & Graph Theory'
        ]
      }
    ]
  },

  // ==========================================
  // G. MEDICAL ENTRANCE
  // ==========================================
  NEET_UG: {
    code: 'NEET_UG',
    name: 'National Eligibility cum Entrance Test (NEET UG)',
    category: 'Medical Entrance',
    group: 'Medical & Healthcare',
    defaultDurationMinutes: 200,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 4,
    negativeMarks: 1,
    subjects: [
      {
        name: 'Biology (Botany & Zoology)',
        weight: 0.50,
        topics: [
          'Human Physiology (Digestion, Respiration, Circulation, Excretion, Nervous)',
          'Genetics & Evolution (Mendelian Genetics, DNA Replication, Transcription)',
          'Plant Physiology (Photosynthesis, Respiration in Plants)',
          'Cell: Structure & Function (Cell Cycle & Mitosis/Meiosis)',
          'Ecology & Environment (Ecosystems, Biodiversity Conservation)',
          'Reproduction in Organisms & Human Reproduction'
        ]
      },
      {
        name: 'Chemistry',
        weight: 0.25,
        topics: [
          'Chemical Bonding & Molecular Structure',
          'Organic Chemistry: Hydrocarbons & Functional Groups',
          'Biomolecules, Polymers & Daily Chemistry',
          'Equilibrium & Thermodynamics',
          'Coordination Chemistry & p-Block Elements'
        ]
      },
      {
        name: 'Physics',
        weight: 0.25,
        topics: [
          'Mechanics & Laws of Motion',
          'Electrostatics, Capacitors & Current Electricity',
          'Optics (Ray & Wave Optics)',
          'Thermodynamics & Kinetic Theory',
          'Dual Nature of Radiation & Atoms/Nuclei'
        ]
      }
    ]
  },

  NEET_PG: {
    code: 'NEET_PG',
    name: 'National Eligibility cum Entrance Test (NEET PG Medical)',
    category: 'Medical Entrance',
    group: 'Medical & Healthcare',
    defaultDurationMinutes: 210,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 4,
    negativeMarks: 1,
    subjects: [
      {
        name: 'Clinical Subjects (Medicine, Surgery, OBGY)',
        weight: 0.50,
        topics: ['Internal Medicine & Emergency Protocol', 'General Surgery & Trauma', 'Obstetrics & Gynaecological Emergencies', 'Paediatrics & Neonatology']
      },
      {
        name: 'Para-Clinical Subjects (Pathology, Pharma, Micro)',
        weight: 0.30,
        topics: ['General Pathology & Neoplasia', 'Pharmacology & Drug Interactions', 'Bacteriology & Virology', 'Forensic Medicine & Toxicology']
      },
      {
        name: 'Pre-Clinical Subjects (Anatomy, Physio, Biochem)',
        weight: 0.20,
        topics: ['Gross Anatomy & Neuroanatomy', 'General Physiology & Organ Functions', 'Enzyme Kinetics & Molecular Biology']
      }
    ]
  },

  // ==========================================
  // H. TEACHING & ELIGIBILITY
  // ==========================================
  CTET_PAPER_1: {
    code: 'CTET_PAPER_1',
    name: 'Central Teacher Eligibility Test (CTET Paper 1: Class 1-5)',
    category: 'Teaching',
    group: 'Teaching & Education',
    defaultDurationMinutes: 150,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0,
    subjects: [
      {
        name: 'Child Development & Pedagogy (CDP)',
        weight: 0.30,
        topics: [
          'Piaget, Vygotsky & Kohlberg Constructivism',
          'Concept of Inclusive Education & Children with Special Needs',
          'Learning & Motivational Theories',
          'Assessment for Learning vs. Assessment of Learning'
        ]
      },
      {
        name: 'Environmental Studies (EVS)',
        weight: 0.25,
        topics: ['Family & Friends', 'Food, Shelter & Water', 'Travel & Things We Make and Do', 'EVS Pedagogical Issues']
      },
      {
        name: 'Mathematics & Pedagogy',
        weight: 0.25,
        topics: ['Number Concepts & Basic Operations', 'Shapes & Spatial Understanding', 'Measurement, Weight & Time', 'Place of Mathematics in Curriculum']
      },
      {
        name: 'Language 1 & Language 2 (Hindi/English)',
        weight: 0.20,
        topics: ['Reading Unseen Passages', 'Pedagogy of Language Development', 'Role of Listening & Speaking', 'Remedial Teaching']
      }
    ]
  },

  CTET_PAPER_2: {
    code: 'CTET_PAPER_2',
    name: 'Central Teacher Eligibility Test (CTET Paper 2: Class 6-8)',
    category: 'Teaching',
    group: 'Teaching & Education',
    defaultDurationMinutes: 150,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0,
    subjects: [
      {
        name: 'Child Development & Pedagogy',
        weight: 0.30,
        topics: ['Cognition & Emotions', 'Principles of Child Development', 'Socialization Processes', 'Individual Differences among Learners']
      },
      {
        name: 'Mathematics & Science / Social Studies',
        weight: 0.40,
        topics: ['Algebra, Geometry & Mensuration', 'Physics, Chemistry & Biology Basics', 'History, Geography, Social and Political Life', 'Pedagogical Issues in Subject Teaching']
      },
      {
        name: 'Language 1 & 2',
        weight: 0.30,
        topics: ['Comprehension & Grammar', 'Language Skills (LSRW)', 'Teaching Learning Materials (TLM)', 'Error Analysis']
      }
    ]
  },

  UGC_NET_PAPER_1: {
    code: 'UGC_NET_PAPER_1',
    name: 'UGC NET Paper 1 (General Paper on Teaching & Research Aptitude)',
    category: 'Teaching',
    group: 'Teaching & Education',
    defaultDurationMinutes: 60,
    dailyQuizQuestions: 50,
    cbtMockQuestions: 50,
    positiveMarks: 2,
    negativeMarks: 0,
    subjects: [
      {
        name: 'Teaching Aptitude',
        weight: 0.20,
        topics: ['Teaching Concepts, Objectives & Levels of Teaching (Memory, Understanding, Reflective)', 'Characteristics of Adolescent and Adult Learners', 'Support Systems: Traditional, Modern & ICT Based', 'Evaluation Systems in Higher Education']
      },
      {
        name: 'Research Aptitude',
        weight: 0.20,
        topics: ['Research Meaning, Types & Characteristics', 'Positivism and Post-Positivistic Approach', 'Methods of Research: Experimental, Descriptive, Historical', 'Research Ethics, Thesis Writing & APA/MLA Referencing']
      },
      {
        name: 'Communication & ICT in Higher Education',
        weight: 0.20,
        topics: ['Types of Communication & Barriers', 'ICT: General Abbreviations & Terminology', 'Digital Initiatives in Higher Education (SWAYAM, MOOCs)', 'ICT and Governance']
      },
      {
        name: 'Higher Education System & People, Development, Environment',
        weight: 0.20,
        topics: ['Institutions of Higher Learning in Ancient India', 'Oriental, Conventional and Non-conventional Learning Programs', 'Millennium & Sustainable Development Goals (SDGs)', 'National Action Plan on Climate Change']
      },
      {
        name: 'Mathematical & Logical Reasoning',
        weight: 0.20,
        topics: ['Number Series & Coding', 'Formal and Informal Fallacies', 'Pramanas: Pratyaksha, Anumana, Upamana, Shabda', 'Syllogistic Deductions']
      }
    ]
  },

  STATE_TET: {
    code: 'STATE_TET',
    name: 'State Teacher Eligibility Test (State TET / BTET / UPTET / REET)',
    category: 'Teaching',
    group: 'Teaching & Education',
    defaultDurationMinutes: 150,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0,
    subjects: [
      {
        name: 'Child Development & Learning Psychology',
        weight: 0.30,
        topics: ['Child Growth & Development', 'Theories of Learning (Thorndike, Pavlov, Skinner)', 'Inclusive Education & Classroom Management']
      },
      {
        name: 'Subject Pedagogy & Methodology',
        weight: 0.40,
        topics: ['Methods of Teaching', 'Curriculum Design & NCF/NEP Guidelines', 'Evaluation & Continuous Assessment']
      },
      {
        name: 'Language & General Content',
        weight: 0.30,
        topics: ['Grammar & Composition', 'Environmental Science & Arithmetic']
      }
    ]
  },

  // ==========================================
  // I. DEFENCE & POLICE RECRUITMENT
  // ==========================================
  AFCAT: {
    code: 'AFCAT',
    name: 'Air Force Common Admission Test (AFCAT)',
    category: 'Defence',
    group: 'Defence & Police',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 3,
    negativeMarks: 1,
    subjects: [
      {
        name: 'General Awareness',
        weight: 0.25,
        topics: ['Defence Acquisitions & IAF Airbases', 'Indian History & World Geography', 'National & International Sports', 'Basic Science & Environment']
      },
      {
        name: 'Verbal Ability in English',
        weight: 0.25,
        topics: ['Comprehension Passages', 'Error Detection & Sentence Completion', 'Synonyms, Antonyms & Idioms']
      },
      {
        name: 'Numerical Ability',
        weight: 0.25,
        topics: ['Decimal Fractions & Time/Work', 'Average, Profit & Loss', 'Percentage, Ratio & Simple Interest', 'Speed, Time & Distance']
      },
      {
        name: 'Reasoning and Military Aptitude',
        weight: 0.25,
        topics: ['Odd One Out & Analogy', 'Figure Series & Spatial Ability', 'Venn Diagrams & Pattern Completion']
      }
    ]
  },

  STATE_POLICE_SI: {
    code: 'STATE_POLICE_SI',
    name: 'State Police Sub-Inspector (Bihar SI, UP SI, MP SI, Rajasthan SI)',
    category: 'Police',
    group: 'Defence & Police',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 2,
    negativeMarks: 0.40,
    subjects: [
      {
        name: 'General Knowledge & Current Affairs',
        weight: 0.40,
        topics: ['Indian Constitution & Fundamental Rights', 'Indian History & Freedom Struggle', 'Indian Geography & Environment', 'State Specific Police & Administrative Law']
      },
      {
        name: 'General Science & Mental Ability',
        weight: 0.30,
        topics: ['Everyday Physics, Chemistry & Biology', 'Numerical Aptitude & Profit/Loss', 'Logical Reasoning & Coding']
      },
      {
        name: 'General Hindi / Regional Language',
        weight: 0.30,
        topics: ['Hindi Grammar (Sandhi, Samas, Muhavare)', 'Synonyms & Antonyms', 'Sentence Correction & Unseen Passage']
      }
    ]
  },

  // ==========================================
  // J. SCHOOL BOARD EXAMINATIONS
  // ==========================================
  CLASS_10: {
    code: 'CLASS_10',
    name: 'Class 10 Board Examinations (CBSE, ICSE & State Boards)',
    category: 'Board Exams',
    group: 'School Education',
    defaultDurationMinutes: 90,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0,
    subjects: [
      {
        name: 'Science (Physics, Chemistry, Biology)',
        weight: 0.50,
        topics: [
          'Electricity, Ohm Law & Resistance',
          'Light: Reflection & Refraction (Mirrors & Lenses)',
          'Chemical Reactions & Balancing Equations',
          'Acids, Bases, Salts & pH Scale',
          'Carbon & its Compounds (Hydrocarbons)',
          'Life Processes: Nutrition, Respiration & Circulation',
          'Heredity & Mendel Laws of Inheritance'
        ]
      },
      {
        name: 'Mathematics',
        weight: 0.50,
        topics: [
          'Real Numbers & Fundamental Theorem of Arithmetic',
          'Quadratic Equations & Roots',
          'Arithmetic Progressions (AP)',
          'Trigonometric Ratios & Identities',
          'Coordinate Geometry & Distance Formula',
          'Surface Areas & Volumes of Solids',
          'Statistics & Probability Basics'
        ]
      }
    ]
  },

  CLASS_12_SCIENCE: {
    code: 'CLASS_12_SCIENCE',
    name: 'Class 12 Board - Science Stream (CBSE & State Boards)',
    category: 'Board Exams',
    group: 'School Education',
    defaultDurationMinutes: 180,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0,
    subjects: [
      {
        name: 'Physics',
        weight: 0.35,
        topics: ['Electrostatics & Current Electricity', 'Magnetic Effects & EMI', 'Optics & Wave Optics', 'Dual Nature & Semiconductor Devices']
      },
      {
        name: 'Chemistry',
        weight: 0.35,
        topics: ['Solutions & Electrochemistry', 'Chemical Kinetics', 'd- and f-Block Elements & Coordination Compounds', 'Haloalkanes, Alcohols, Aldehydes & Amines']
      },
      {
        name: 'Mathematics / Biology',
        weight: 0.30,
        topics: ['Calculus, Vectors & 3D Geometry', 'Genetics, Molecular Biology & Biotechnology', 'Human Health & Diseases']
      }
    ]
  },

  CLASS_12_COMMERCE: {
    code: 'CLASS_12_COMMERCE',
    name: 'Class 12 Board - Commerce Stream (CBSE & State Boards)',
    category: 'Board Exams',
    group: 'School Education',
    defaultDurationMinutes: 180,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0,
    subjects: [
      {
        name: 'Accountancy',
        weight: 0.35,
        topics: ['Accounting for Partnership Firms', 'Accounting for Companies (Issue of Shares & Debentures)', 'Financial Statement Analysis & Cash Flow Statements']
      },
      {
        name: 'Business Studies',
        weight: 0.35,
        topics: ['Principles and Functions of Management', 'Financial Markets & Financial Management', 'Marketing Management & Consumer Protection']
      },
      {
        name: 'Economics',
        weight: 0.30,
        topics: ['Introductory Macroeconomics (National Income, Money & Banking)', 'Government Budget & Balance of Payments', 'Indian Economic Development (Reforms, Poverty, Human Capital)']
      }
    ]
  },

  // ==========================================
  // K. LAW & MANAGEMENT ENTRANCE
  // ==========================================
  CLAT_UG: {
    code: 'CLAT_UG',
    name: 'Common Law Admission Test (CLAT UG for NLUs)',
    category: 'Law Entrance',
    group: 'Law & Management',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 1,
    negativeMarks: 0.25,
    subjects: [
      {
        name: 'Legal Reasoning',
        weight: 0.30,
        topics: [
          'Constitutional Principles & Public Interest',
          'Law of Torts (Negligence, Strict Liability, Defamation)',
          'Law of Contracts (Offer, Acceptance, Consideration, Breach)',
          'Criminal Law & Landmark Legal Precedents'
        ]
      },
      {
        name: 'Current Affairs & General Knowledge',
        weight: 0.25,
        topics: [
          'National & International Socio-Legal Events',
          'Judicial Pronouncements & Constitution Amendments',
          'International Treaties & Conventions'
        ]
      },
      {
        name: 'Logical Reasoning',
        weight: 0.25,
        topics: [
          'Critical Reasoning & Flaws in Arguments',
          'Statement, Premises & Inferences',
          'Cause & Effect Analysis'
        ]
      },
      {
        name: 'English Language & Quantitative Techniques',
        weight: 0.20,
        topics: [
          'Comprehension from Legal & Policy Literature',
          'Basic Numerical Data Analysis & Percentages'
        ]
      }
    ]
  },

  CAT_MBA: {
    code: 'CAT_MBA',
    name: 'Common Admission Test (CAT for IIMs)',
    category: 'Management Entrance',
    group: 'Law & Management',
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 66,
    cbtMockQuestions: 33,
    positiveMarks: 3,
    negativeMarks: 1,
    subjects: [
      {
        name: 'Quantitative Ability (QA)',
        weight: 0.33,
        topics: [
          'Arithmetic (Percentages, Profit/Loss, Time-Speed-Distance, Averages)',
          'Algebra (Linear & Quadratic Equations, Logarithms, Functions)',
          'Geometry & Mensuration (Triangles, Circles, Polygons)',
          'Number Systems & Modern Math (Permutations, Probability)'
        ]
      },
      {
        name: 'Data Interpretation & Logical Reasoning (DILR)',
        weight: 0.33,
        topics: [
          'Complex Caselets & Matrix Arrangements',
          'Games and Tournaments',
          'Bar, Line, Radar & Scatter Plots',
          'Venn Diagrams & Binary Logic'
        ]
      },
      {
        name: 'Verbal Ability & Reading Comprehension (VARC)',
        weight: 0.34,
        topics: [
          'Reading Comprehension from Philosophy, Science & Sociology',
          'Parajumbles & Out of Context Sentences',
          'Paragraph Summary & Completion'
        ]
      }
    ]
  },

  CUET_UG: {
    code: 'CUET_UG',
    name: 'Common University Entrance Test (CUET UG)',
    category: 'University Entrance',
    group: 'Law & Management',
    defaultDurationMinutes: 60,
    dailyQuizQuestions: 60,
    cbtMockQuestions: 30,
    positiveMarks: 5,
    negativeMarks: 1,
    subjects: [
      {
        name: 'General Test (GK, Reasoning, Quantitative)',
        weight: 0.50,
        topics: [
          'General Knowledge & Current Affairs',
          'General Mental Ability & Numerical Ability',
          'Reasoning (Simple Application of Basic Math)',
          'Logical and Analytical Reasoning'
        ]
      },
      {
        name: 'Language (English / Hindi)',
        weight: 0.50,
        topics: [
          'Reading Comprehension (Factual, Narrative, Literary)',
          'Verbal Ability & Rearranging Parts',
          'Choosing the Correct Word & Synonyms/Antonyms',
          'Vocabulary & Idioms'
        ]
      }
    ]
  }
};

/**
 * Universal dynamic fallback blueprint generator:
 * If a candidate enters an exam not explicitly listed, this generates
 * an authentic, realistic blueprint using the exam name/code instead of
 * blindly falling back to UPSC CSE.
 */
function generateDynamicExamBlueprint(rawInput) {
  const clean = String(rawInput || 'Competitive Exam').trim();
  const upper = clean.toUpperCase().replace(/\s+/g, '_');
  const displayName = clean.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Determine intelligent category & subject inferences
  let category = 'Competitive Examination';
  let subjects = [
    {
      name: 'General Awareness & Core Concepts',
      weight: 0.40,
      topics: ['Fundamentals of the Syllabus', 'Key Principles & Rules', 'Current Developments', 'Standard Concepts']
    },
    {
      name: 'Analytical & Problem-Solving Ability',
      weight: 0.30,
      topics: ['Logical Deduction', 'Problem Solving Methods', 'Applied Concepts', 'Analytical Case Studies']
    },
    {
      name: 'Language & Comprehension',
      weight: 0.30,
      topics: ['Reading Comprehension', 'Conceptual Definitions', 'Terminologies & Definitions']
    }
  ];

  if (/ENGINEER|TECH|GATE|JE|POLYTECHNIC|BTECH/i.test(clean)) {
    category = 'Engineering';
    subjects = [
      {
        name: 'Core Technical Engineering Subject',
        weight: 0.50,
        topics: ['Fundamental Engineering Theorems', 'System Design & Calculations', 'Applied Engineering Problems', 'Standards & Specifications']
      },
      {
        name: 'Engineering Mathematics & Logic',
        weight: 0.30,
        topics: ['Linear Algebra & Calculus', 'Applied Numerical Analysis', 'Logical Problem Solving']
      },
      {
        name: 'General Aptitude',
        weight: 0.20,
        topics: ['Numerical Ability', 'Verbal Reasoning', 'Data Analysis']
      }
    ];
  } else if (/MEDICAL|NEET|HEALTH|NURSE|PHARMA|DOCTOR|AIIMS/i.test(clean)) {
    category = 'Medical & Healthcare';
    subjects = [
      {
        name: 'Clinical & Biomedical Sciences',
        weight: 0.50,
        topics: ['Human Anatomy & Physiology', 'Pathology & Pharmacology', 'Clinical Diagnoses & Principles', 'Biochemical Pathways']
      },
      {
        name: 'Applied Life Sciences',
        weight: 0.30,
        topics: ['Microbiology & Genetics', 'Public Health & Epidemiology', 'Medical Ethics & Safety']
      },
      {
        name: 'General Medical Aptitude',
        weight: 0.20,
        topics: ['Scientific Deductions', 'Clinical Case Reasoning', 'Diagnostic Data Interpretation']
      }
    ];
  } else if (/TEACH|TET|CTET|BED|PRT|TGT|PGT|KVS|NVS/i.test(clean)) {
    category = 'Teaching & Education';
    subjects = [
      {
        name: 'Pedagogy & Child Psychology',
        weight: 0.40,
        topics: ['Theories of Learning & Cognition', 'Classroom Management', 'Inclusive Education', 'Curricular Assessment']
      },
      {
        name: 'Domain Content Knowledge',
        weight: 0.40,
        topics: ['Core Curriculum Concepts', 'Pedagogical Content Methodology', 'Learning Materials']
      },
      {
        name: 'Language & Communication',
        weight: 0.20,
        topics: ['Grammar & Comprehension', 'Communication in Education', 'Literacy Skills']
      }
    ];
  } else if (/POLICE|DEFENCE|ARMY|NAVY|AIRFORCE|SI|CONSTABLE/i.test(clean)) {
    category = 'Defence & Police';
    subjects = [
      {
        name: 'General Knowledge & Law/Constitution',
        weight: 0.40,
        topics: ['Indian Constitution & Governance', 'National Security & Police Procedures', 'Indian History & Geography', 'Current National Events']
      },
      {
        name: 'Reasoning & Mental Ability',
        weight: 0.30,
        topics: ['Logical Sequences & Series', 'Direction & Distance', 'Coding-Decoding', 'Decision Making']
      },
      {
        name: 'Basic Mathematics & Language',
        weight: 0.30,
        topics: ['Arithmetic Word Problems', 'Percentages & Ratios', 'Language Grammar & Comprehension']
      }
    ];
  }

  return {
    code: upper,
    name: displayName,
    category,
    group: category,
    defaultDurationMinutes: 120,
    dailyQuizQuestions: 100,
    cbtMockQuestions: 50,
    positiveMarks: 2,
    negativeMarks: 0.66,
    subjects
  };
}

/**
 * Universal helper to fetch examination blueprint by code, category or name
 */
function getExamBlueprint(examCodeOrCategory) {
  if (!examCodeOrCategory) return SYLLABUS_REGISTRY.UPSC_CSE;
  const raw = String(examCodeOrCategory).trim();
  const upper = raw.toUpperCase().replace(/\s+/g, '_');

  // 1. Direct key match in SYLLABUS_REGISTRY
  if (SYLLABUS_REGISTRY[upper]) {
    return SYLLABUS_REGISTRY[upper];
  }

  // 2. Check official GATE multi-branch registry
  if (upper.startsWith('GATE_') || upper.startsWith('GATE')) {
    const branchCode = upper.replace(/^GATE_?/, '');
    const gatePaper = getGatePaperByCode(branchCode);
    if (gatePaper) {
      return {
        code: `GATE_${gatePaper.code}`,
        name: `GATE ${gatePaper.name} (${gatePaper.code})`,
        category: `GATE ${gatePaper.code}`,
        group: 'Engineering & Technology',
        defaultDurationMinutes: gatePaper.durationMinutes || 180,
        dailyQuizQuestions: 50,
        cbtMockQuestions: 65,
        positiveMarks: 2,
        negativeMarks: 0.66,
        subjects: gatePaper.sections.map(s => ({
          name: s.name,
          weight: s.weight,
          topics: s.topics
        }))
      };
    }
  }

  // 3. Search by category or partial name match across predefined registry
  for (const key of Object.keys(SYLLABUS_REGISTRY)) {
    const bp = SYLLABUS_REGISTRY[key];
    if (
      bp.code.toUpperCase() === upper ||
      bp.category.toUpperCase().replace(/\s+/g, '_') === upper ||
      bp.name.toUpperCase().includes(upper) ||
      upper.includes(bp.code.toUpperCase())
    ) {
      return bp;
    }
  }

  // 4. Fallback: Dynamically generate an accurate blueprint for this custom/unlisted exam
  // (Never fall back to DBMS or UPSC CSE when an unrelated exam was requested)
  return generateDynamicExamBlueprint(raw);
}

/**
 * Returns all officially configured examinations grouped for UI selectors and API consumers
 */
function getAllSupportedExams() {
  const exams = Object.values(SYLLABUS_REGISTRY).map(bp => ({
    code: bp.code,
    name: bp.name,
    category: bp.category,
    group: bp.group || bp.category,
    defaultDurationMinutes: bp.defaultDurationMinutes,
    dailyQuizQuestions: bp.dailyQuizQuestions,
    cbtMockQuestions: bp.cbtMockQuestions,
    positiveMarks: bp.positiveMarks,
    negativeMarks: bp.negativeMarks,
    subjectsCount: bp.subjects.length,
    subjects: bp.subjects.map(s => s.name)
  }));

  // Append all 30 GATE branches to the catalog
  const gatePapers = getAllGatePapers();
  for (const gp of gatePapers) {
    if (gp.code !== 'CS') { // CS already in main registry as GATE_CSE
      exams.push({
        code: `GATE_${gp.code}`,
        name: `GATE ${gp.name} (${gp.code})`,
        category: `GATE ${gp.code}`,
        group: 'Engineering & Technology',
        defaultDurationMinutes: gp.durationMinutes || 180,
        dailyQuizQuestions: 50,
        cbtMockQuestions: 65,
        positiveMarks: 2,
        negativeMarks: 0.66,
        subjectsCount: gp.sections.length,
        subjects: gp.sections.map(s => s.name)
      });
    }
  }

  return exams;
}

/**
 * Calculate dynamic test duration strictly based on the actual number of questions.
 * Standard examination seconds-per-question according to official blueprint.
 */
function calculateDynamicDuration(examCode, questionCount) {
  const count = Math.max(1, parseInt(questionCount, 10) || 1);
  const bp = getExamBlueprint(examCode);

  const baseQuestions = bp.dailyQuizQuestions || bp.cbtMockQuestions || 100;
  const baseDurationMins = bp.defaultDurationMinutes || 120;

  // Standard seconds per question based on official exam blueprint
  const secondsPerQuestion = baseQuestions > 0 ? (baseDurationMins * 60) / baseQuestions : 72;
  const calculatedSeconds = Math.round(count * secondsPerQuestion);
  const durationMinutes = Math.max(5, Math.round(calculatedSeconds / 60));

  return {
    questionCount: count,
    durationMinutes,
    totalSeconds: calculatedSeconds,
    secondsPerQuestion: Math.round(secondsPerQuestion)
  };
}

module.exports = {
  SYLLABUS_REGISTRY,
  getExamBlueprint,
  getAllSupportedExams,
  calculateDynamicDuration
};
