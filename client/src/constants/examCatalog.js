/**
 * AspirantAI — Universal Exam Catalog
 * Master catalog of all supported Indian examinations for dropdowns, simulators, and dashboard widgets.
 */

export const EXAM_CATEGORIES = [
  'All',
  'Civil Services',
  'State PSC',
  'SSC',
  'Banking',
  'Railway',
  'Engineering Entrance',
  'Medical Entrance',
  'Teaching',
  'Defence & Police',
  'Board Exams',
  'Law & Management'
];

export const MASTER_EXAM_CATALOG = [
  // --- UPSC & CIVIL SERVICES ---
  {
    code: 'UPSC_CSE',
    name: 'UPSC Civil Services (IAS/IPS/IFS)',
    category: 'Civil Services',
    group: 'Civil Services',
    negative: '0.66',
    time: '120 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'UPSC_IFS',
    name: 'UPSC Indian Forest Service',
    category: 'Civil Services',
    group: 'Civil Services',
    negative: '0.66',
    time: '120 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'UPSC_CAPF',
    name: 'UPSC CAPF (Assistant Commandant)',
    category: 'Civil Services',
    group: 'Civil Services',
    negative: '0.66',
    time: '120 Min',
    marks: 2,
    negativeVal: 0.66
  },

  // --- STATE PSC EXAMINATIONS ---
  {
    code: 'BPSC_CCE',
    name: 'BPSC 70th CCE (Bihar Public Service)',
    category: 'State PSC',
    group: 'State PSC',
    negative: '0.33',
    time: '120 Min',
    marks: 1,
    negativeVal: 0.33
  },
  {
    code: 'UPPSC_PCS',
    name: 'UPPSC Provincial Civil Services (UP PCS)',
    category: 'State PSC',
    group: 'State PSC',
    negative: '0.44',
    time: '120 Min',
    marks: 1.33,
    negativeVal: 0.44
  },
  {
    code: 'MPPSC_SET',
    name: 'MPPSC State Services (Madhya Pradesh)',
    category: 'State PSC',
    group: 'State PSC',
    negative: 'None',
    time: '120 Min',
    marks: 2,
    negativeVal: 0
  },
  {
    code: 'RPSC_RAS',
    name: 'RPSC Rajasthan Administrative Services (RAS)',
    category: 'State PSC',
    group: 'State PSC',
    negative: '0.44',
    time: '180 Min',
    marks: 1.33,
    negativeVal: 0.44
  },
  {
    code: 'JPSC_CCE',
    name: 'JPSC Combined Civil Services (Jharkhand)',
    category: 'State PSC',
    group: 'State PSC',
    negative: 'None',
    time: '120 Min',
    marks: 2,
    negativeVal: 0
  },
  {
    code: 'WBPSC_WBCS',
    name: 'WBPSC West Bengal Civil Service (WBCS)',
    category: 'State PSC',
    group: 'State PSC',
    negative: '0.33',
    time: '150 Min',
    marks: 1,
    negativeVal: 0.33
  },
  {
    code: 'OPSC_OAS',
    name: 'OPSC Odisha Administrative Services (OAS)',
    category: 'State PSC',
    group: 'State PSC',
    negative: '0.66',
    time: '120 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'MPSC_STATE',
    name: 'MPSC Maharashtra State Services (Rajyaseva)',
    category: 'State PSC',
    group: 'State PSC',
    negative: '0.50',
    time: '120 Min',
    marks: 2,
    negativeVal: 0.50
  },

  // --- SSC EXAMINATIONS ---
  {
    code: 'SSC_CGL',
    name: 'SSC Combined Graduate Level (CGL Tier 1)',
    category: 'SSC',
    group: 'SSC',
    negative: '0.50',
    time: '60 Min',
    marks: 2,
    negativeVal: 0.50
  },
  {
    code: 'SSC_CHSL',
    name: 'SSC Combined Higher Secondary (CHSL 10+2)',
    category: 'SSC',
    group: 'SSC',
    negative: '0.50',
    time: '60 Min',
    marks: 2,
    negativeVal: 0.50
  },
  {
    code: 'SSC_MTS',
    name: 'SSC Multi-Tasking Staff & Havaldar (MTS)',
    category: 'SSC',
    group: 'SSC',
    negative: '1.00',
    time: '90 Min',
    marks: 3,
    negativeVal: 1.00
  },
  {
    code: 'SSC_GD',
    name: 'SSC GD Constable (CAPF / Rifleman)',
    category: 'SSC',
    group: 'SSC',
    negative: '0.50',
    time: '60 Min',
    marks: 2,
    negativeVal: 0.50
  },
  {
    code: 'SSC_CPO',
    name: 'SSC CPO (Sub-Inspector Delhi Police / CAPF)',
    category: 'SSC',
    group: 'SSC',
    negative: '0.25',
    time: '120 Min',
    marks: 1,
    negativeVal: 0.25
  },
  {
    code: 'SSC_JE',
    name: 'SSC Junior Engineer (Civil / Mech / Elec)',
    category: 'SSC',
    group: 'SSC',
    negative: '0.25',
    time: '120 Min',
    marks: 1,
    negativeVal: 0.25
  },

  // --- BANKING & INSURANCE ---
  {
    code: 'IBPS_PO',
    name: 'Banking IBPS PO Prelims',
    category: 'Banking',
    group: 'Banking',
    negative: '0.25',
    time: '60 Min',
    marks: 1,
    negativeVal: 0.25
  },
  {
    code: 'IBPS_CLERK',
    name: 'Banking IBPS Clerk',
    category: 'Banking',
    group: 'Banking',
    negative: '0.25',
    time: '60 Min',
    marks: 1,
    negativeVal: 0.25
  },
  {
    code: 'SBI_PO',
    name: 'State Bank of India PO (SBI PO)',
    category: 'Banking',
    group: 'Banking',
    negative: '0.25',
    time: '60 Min',
    marks: 1,
    negativeVal: 0.25
  },
  {
    code: 'SBI_CLERK',
    name: 'State Bank of India Clerk (Junior Associates)',
    category: 'Banking',
    group: 'Banking',
    negative: '0.25',
    time: '60 Min',
    marks: 1,
    negativeVal: 0.25
  },
  {
    code: 'RBI_GRADE_B',
    name: 'Reserve Bank of India Grade B Officers',
    category: 'Banking',
    group: 'Banking',
    negative: '0.25',
    time: '120 Min',
    marks: 1,
    negativeVal: 0.25
  },
  {
    code: 'IBPS_RRB_PO',
    name: 'IBPS RRB Officer Scale 1 (Gramin Bank)',
    category: 'Banking',
    group: 'Banking',
    negative: '0.25',
    time: '45 Min',
    marks: 1,
    negativeVal: 0.25
  },
  {
    code: 'LIC_AAO',
    name: 'Life Insurance Corporation AAO',
    category: 'Banking',
    group: 'Banking',
    negative: '0.25',
    time: '60 Min',
    marks: 1,
    negativeVal: 0.25
  },

  // --- RAILWAY EXAMINATIONS ---
  {
    code: 'RRB_NTPC',
    name: 'Railway RRB NTPC Stage 1 CBT',
    category: 'Railway',
    group: 'Railway',
    negative: '0.33',
    time: '90 Min',
    marks: 1,
    negativeVal: 0.33
  },
  {
    code: 'RRB_GROUP_D',
    name: 'Railway Group D Level 1 CBT',
    category: 'Railway',
    group: 'Railway',
    negative: '0.33',
    time: '90 Min',
    marks: 1,
    negativeVal: 0.33
  },
  {
    code: 'RRB_ALP',
    name: 'Railway Assistant Loco Pilot (ALP)',
    category: 'Railway',
    group: 'Railway',
    negative: '0.33',
    time: '60 Min',
    marks: 1,
    negativeVal: 0.33
  },
  {
    code: 'RRB_JE',
    name: 'Railway Junior Engineer (RRB JE)',
    category: 'Railway',
    group: 'Railway',
    negative: '0.33',
    time: '90 Min',
    marks: 1,
    negativeVal: 0.33
  },
  {
    code: 'RPF_SI',
    name: 'Railway Protection Force (RPF SI / Constable)',
    category: 'Railway',
    group: 'Railway',
    negative: '0.33',
    time: '90 Min',
    marks: 1,
    negativeVal: 0.33
  },

  // --- ENGINEERING ENTRANCE & GATE ---
  {
    code: 'JEE_MAIN',
    name: 'NTA JEE Main (Physics, Chemistry, Maths)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '1.00',
    time: '180 Min',
    marks: 4,
    negativeVal: 1.00
  },
  {
    code: 'JEE_ADVANCED',
    name: 'IIT JEE Advanced',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '2.00',
    time: '180 Min',
    marks: 4,
    negativeVal: 2.00
  },
  {
    code: 'GATE_CSE',
    name: 'GATE Computer Science & IT (CS)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_DA',
    name: 'GATE Data Science & Artificial Intelligence (DA)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_EC',
    name: 'GATE Electronics & Communication (EC)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_EE',
    name: 'GATE Electrical Engineering (EE)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_ME',
    name: 'GATE Mechanical Engineering (ME)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_CE',
    name: 'GATE Civil Engineering (CE)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_CH',
    name: 'GATE Chemical Engineering (CH)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_IN',
    name: 'GATE Instrumentation Engineering (IN)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_BM',
    name: 'GATE Biomedical Engineering (BM)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_BT',
    name: 'GATE Biotechnology (BT)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_AE',
    name: 'GATE Aerospace Engineering (AE)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_AG',
    name: 'GATE Agricultural Engineering (AG)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_AR',
    name: 'GATE Architecture and Planning (AR)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_CY',
    name: 'GATE Chemistry (CY)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_ES',
    name: 'GATE Environmental Science and Engineering (ES)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_EY',
    name: 'GATE Ecology and Evolution (EY)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_GE',
    name: 'GATE Geomatics Engineering (GE)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_GG',
    name: 'GATE Geology and Geophysics (GG)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_MA',
    name: 'GATE Mathematics (MA)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_MN',
    name: 'GATE Mining Engineering (MN)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_MT',
    name: 'GATE Metallurgical Engineering (MT)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_NM',
    name: 'GATE Naval Architecture and Marine Engineering (NM)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_PE',
    name: 'GATE Petroleum Engineering (PE)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_PH',
    name: 'GATE Physics (PH)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_PI',
    name: 'GATE Production and Industrial Engineering (PI)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_ST',
    name: 'GATE Statistics (ST)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_TF',
    name: 'GATE Textile Engineering and Fibre Science (TF)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_XE',
    name: 'GATE Engineering Sciences (XE)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_XH',
    name: 'GATE Humanities and Social Sciences (XH)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },
  {
    code: 'GATE_XL',
    name: 'GATE Life Sciences (XL)',
    category: 'Engineering Entrance',
    group: 'Engineering Entrance',
    negative: '0.66',
    time: '180 Min',
    marks: 2,
    negativeVal: 0.66
  },

  // --- MEDICAL ENTRANCE ---
  {
    code: 'NEET_UG',
    name: 'NEET UG Medical Entrance (Biology, Chem, Phys)',
    category: 'Medical Entrance',
    group: 'Medical Entrance',
    negative: '1.00',
    time: '200 Min',
    marks: 4,
    negativeVal: 1.00
  },
  {
    code: 'NEET_PG',
    name: 'NEET PG Medical Examination',
    category: 'Medical Entrance',
    group: 'Medical Entrance',
    negative: '1.00',
    time: '210 Min',
    marks: 4,
    negativeVal: 1.00
  },

  // --- TEACHING & ELIGIBILITY ---
  {
    code: 'CTET_PAPER_1',
    name: 'CTET Paper 1 (Primary Class 1-5)',
    category: 'Teaching',
    group: 'Teaching',
    negative: 'None',
    time: '150 Min',
    marks: 1,
    negativeVal: 0
  },
  {
    code: 'CTET_PAPER_2',
    name: 'CTET Paper 2 (Elementary Class 6-8)',
    category: 'Teaching',
    group: 'Teaching',
    negative: 'None',
    time: '150 Min',
    marks: 1,
    negativeVal: 0
  },
  {
    code: 'UGC_NET_PAPER_1',
    name: 'UGC NET Paper 1 (Teaching & Research)',
    category: 'Teaching',
    group: 'Teaching',
    negative: 'None',
    time: '60 Min',
    marks: 2,
    negativeVal: 0
  },

  // --- DEFENCE & POLICE ---
  {
    code: 'UPSC_CDS',
    name: 'Combined Defence Services (UPSC CDS)',
    category: 'Defence & Police',
    group: 'Defence & Police',
    negative: '0.33',
    time: '120 Min',
    marks: 1,
    negativeVal: 0.33
  },
  {
    code: 'UPSC_NDA',
    name: 'National Defence Academy (UPSC NDA)',
    category: 'Defence & Police',
    group: 'Defence & Police',
    negative: '0.83',
    time: '150 Min',
    marks: 2.5,
    negativeVal: 0.83
  },
  {
    code: 'AFCAT',
    name: 'Air Force Common Admission Test (AFCAT)',
    category: 'Defence & Police',
    group: 'Defence & Police',
    negative: '1.00',
    time: '120 Min',
    marks: 3,
    negativeVal: 1.00
  },
  {
    code: 'STATE_POLICE_SI',
    name: 'State Police Sub-Inspector (SI)',
    category: 'Defence & Police',
    group: 'Defence & Police',
    negative: '0.40',
    time: '120 Min',
    marks: 2,
    negativeVal: 0.40
  },

  // --- BOARD EXAMINATIONS ---
  {
    code: 'CLASS_10',
    name: 'Class 10 Board Assessment (Science & Maths)',
    category: 'Board Exams',
    group: 'Board Exams',
    negative: 'None',
    time: '90 Min',
    marks: 1,
    negativeVal: 0
  },
  {
    code: 'CLASS_12_SCIENCE',
    name: 'Class 12 Board (Physics, Chemistry, Maths/Bio)',
    category: 'Board Exams',
    group: 'Board Exams',
    negative: 'None',
    time: '180 Min',
    marks: 1,
    negativeVal: 0
  },
  {
    code: 'CLASS_12_COMMERCE',
    name: 'Class 12 Board (Accounts, Business, Economics)',
    category: 'Board Exams',
    group: 'Board Exams',
    negative: 'None',
    time: '180 Min',
    marks: 1,
    negativeVal: 0
  },

  // --- LAW & MANAGEMENT ---
  {
    code: 'CLAT_UG',
    name: 'Common Law Admission Test (CLAT UG)',
    category: 'Law & Management',
    group: 'Law & Management',
    negative: '0.25',
    time: '120 Min',
    marks: 1,
    negativeVal: 0.25
  },
  {
    code: 'CAT_MBA',
    name: 'Common Admission Test (CAT for IIMs)',
    category: 'Law & Management',
    group: 'Law & Management',
    negative: '1.00',
    time: '120 Min',
    marks: 3,
    negativeVal: 1.00
  },
  {
    code: 'CUET_UG',
    name: 'Common University Entrance Test (CUET UG)',
    category: 'Law & Management',
    group: 'Law & Management',
    negative: '1.00',
    time: '60 Min',
    marks: 5,
    negativeVal: 1.00
  }
];

export function getExamMeta(code) {
  return MASTER_EXAM_CATALOG.find(e => e.code === code) || MASTER_EXAM_CATALOG[0];
}
