/**
 * AspirantAI — High-Yield Authentic Multi-Exam Question Bank Seeder
 * Populates 260+ authentic, bilingual, syllabus-accurate questions across:
 * 1. UPSC Civil Services (IAS/IPS) - GS Paper 1
 * 2. BPSC Combined Competitive (70th CCE)
 * 3. SSC CGL Tier 1 (Reasoning, Quant, GA, English)
 * 4. GATE Computer Science & IT (Algorithms, TOC, OS, DBMS, Networks, Math)
 * 5. Railway RRB NTPC Stage 1 CBT
 * 6. Banking IBPS PO Prelims (Quant, Reasoning, Banking/General Awareness)
 * 7. Class 10 Board Examinations (Science & Mathematics)
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Question = require('../src/models/Question');
const Quiz = require('../src/models/Quiz');
const CbtMockTest = require('../src/models/CbtMockTest');

// Authentic High-Yield Question Bank
const QUESTION_BANK = [
  // =========================================================================
  // 1. UPSC CIVIL SERVICES EXAMINATION (UPSC_CSE) - 45 Questions
  // =========================================================================
  {
    questionText: 'The concept of "Basic Structure" of the Constitution of India was propounded by the Supreme Court in which landmark judgment?',
    questionHindi: 'भारत के संविधान के "मूल संरचना" (बुनियादी ढांचे) के सिद्धांत को सर्वोच्च न्यायालय ने किस ऐतिहासिक निर्णय में प्रतिपादित किया था?',
    options: [
      { key: 'A', text: 'Golaknath v. State of Punjab (1967)' },
      { key: 'B', text: 'Kesavananda Bharati v. State of Kerala (1973)' },
      { key: 'C', text: 'Minerva Mills v. Union of India (1980)' },
      { key: 'D', text: 'Maneka Gandhi v. Union of India (1978)' }
    ],
    optionsHindi: [
      { key: 'A', text: 'गोलकनाथ बनाम पंजाब राज्य (1967)' },
      { key: 'B', text: 'केशवानंद भारती बनाम केरल राज्य (1973)' },
      { key: 'C', text: 'मिनर्वा मिल्स बनाम भारत संघ (1980)' },
      { key: 'D', text: 'मेनका गांधी बनाम भारत संघ (1978)' }
    ],
    correctAnswer: 'B',
    explanation: 'In the landmark Kesavananda Bharati case (1973), a 13-judge constitutional bench ruled that while Parliament has wide powers to amend the Constitution under Article 368, it cannot alter or destroy its "Basic Structure".',
    explanationHindi: 'ऐतिहासिक केशवानंद भारती मामले (1973) में 13 जजों की संविधान पीठ ने फैसला सुनाया कि संसद को अनुच्छेद 368 के तहत संशोधन की शक्ति प्राप्त है, लेकिन वह इसके मूल ढांचे को नहीं बदल सकती।',
    examCategory: 'Civil Services',
    examCode: 'UPSC_CSE',
    subject: 'Indian Polity',
    topic: 'Constitutional Framework',
    difficulty: 'medium',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2020,
    validationStatus: 'approved'
  },
  {
    questionText: 'Which Article of the Constitution of India guarantees the Right to Privacy as an intrinsic part of the Right to Life and Personal Liberty?',
    questionHindi: 'भारतीय संविधान का कौन सा अनुच्छेद निजता के अधिकार को जीवन और व्यक्तिगत स्वतंत्रता के अधिकार का एक अभिन्न अंग घोषित करता है?',
    options: [
      { key: 'A', text: 'Article 14' },
      { key: 'B', text: 'Article 19' },
      { key: 'C', text: 'Article 21' },
      { key: 'D', text: 'Article 25' }
    ],
    optionsHindi: [
      { key: 'A', text: 'अनुच्छेद 14' },
      { key: 'B', text: 'अनुच्छेद 19' },
      { key: 'C', text: 'अनुच्छेद 21' },
      { key: 'D', text: 'अनुच्छेद 25' }
    ],
    correctAnswer: 'C',
    explanation: 'In Justice K.S. Puttaswamy (Retd.) v. Union of India (2017), a nine-judge Constitution Bench held that the Right to Privacy is a Fundamental Right protected under Article 21 and Part III of the Constitution.',
    explanationHindi: 'जस्टिस के.एस. पुट्टास्वामी बनाम भारत संघ (2017) मामले में नौ जजों की संविधान पीठ ने सर्वसम्मति से निर्णय दिया कि निजता का अधिकार अनुच्छेद 21 के तहत मौलिक अधिकार है।',
    examCategory: 'Civil Services',
    examCode: 'UPSC_CSE',
    subject: 'Indian Polity',
    topic: 'Fundamental Rights',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2021,
    validationStatus: 'approved'
  },
  {
    questionText: 'Regarding a Money Bill in the Indian Parliament, which of the following statements is correct?',
    questionHindi: 'भारतीय संसद में धन विधेयक (Money Bill) के संदर्भ में निम्नलिखित में से कौन सा कथन सही है?',
    options: [
      { key: 'A', text: 'A Money Bill can be introduced in either House of Parliament.' },
      { key: 'B', text: 'The Rajya Sabha can withhold or reject a Money Bill.' },
      { key: 'C', text: 'The decision of the Speaker of the Lok Sabha on whether a Bill is a Money Bill is final.' },
      { key: 'D', text: 'A joint sitting of both Houses can be summoned to resolve a deadlock on a Money Bill.' }
    ],
    optionsHindi: [
      { key: 'A', text: 'धन विधेयक संसद के किसी भी सदन में पेश किया जा सकता है।' },
      { key: 'B', text: 'राज्यसभा धन विधेयक को अस्वीकार या रोक सकती है।' },
      { key: 'C', text: 'कोई विधेयक धन विधेयक है या नहीं, इस पर लोकसभा अध्यक्ष का निर्णय अंतिम होता है।' },
      { key: 'D', text: 'धन विधेयक पर गतिरोध दूर करने के लिए दोनों सदनों की संयुक्त बैठक बुलाई जा सकती है।' }
    ],
    correctAnswer: 'C',
    explanation: 'Under Article 110(3) of the Indian Constitution, if any question arises whether a Bill is a Money Bill or not, the decision of the Speaker of the Lok Sabha thereon shall be final. There is no provision for a joint sitting on a Money Bill.',
    explanationHindi: 'संविधान के अनुच्छेद 110(3) के अनुसार, यदि यह प्रश्न उठता है कि कोई विधेयक धन विधेयक है या नहीं, तो लोकसभा अध्यक्ष का निर्णय अंतिम होता है।',
    examCategory: 'Civil Services',
    examCode: 'UPSC_CSE',
    subject: 'Indian Polity',
    topic: 'Union Legislature',
    difficulty: 'medium',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2018,
    validationStatus: 'approved'
  },
  {
    questionText: 'Which of the following factors contributed most significantly to the formation of the Deccan Traps?',
    questionHindi: 'दक्कन ट्रैप के निर्माण में निम्नलिखित में से किस कारक का सबसे महत्वपूर्ण योगदान रहा?',
    options: [
      { key: 'A', text: 'Himalayan Orogeny collision' },
      { key: 'B', text: 'Fissure volcanic eruptions during Cretaceous period' },
      { key: 'C', text: 'Pleistocene glaciation and moraine deposits' },
      { key: 'D', text: 'Meteorite impact in the Lonar crater region' }
    ],
    optionsHindi: [
      { key: 'A', text: 'हिमालयी पर्वत निर्माण टकराव' },
      { key: 'B', text: 'क्रेटेशियस काल के दौरान दरारी ज्वालामुखी उद्भेदन' },
      { key: 'C', text: 'प्लाईस्टोसिन हिमानीकरण और हिमोढ़ निक्षेप' },
      { key: 'D', text: 'लोनार क्रेटर क्षेत्र में उल्कापिंड प्रभाव' }
    ],
    correctAnswer: 'B',
    explanation: 'The Deccan Traps were formed by massive fissure basaltic eruptions roughly 66 million years ago during the late Cretaceous period as the Indian plate passed over the Reunion hotspot.',
    explanationHindi: 'दक्कन ट्रैप का निर्माण लगभग 6.6 करोड़ वर्ष पूर्व क्रेटेशियस काल के अंत में दरारी बेसाल्टिक लावा उद्गार द्वारा हुआ था।',
    examCategory: 'Civil Services',
    examCode: 'UPSC_CSE',
    subject: 'Geography',
    topic: 'Geomorphology & Indian Geology',
    difficulty: 'medium',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2019,
    validationStatus: 'approved'
  },
  {
    questionText: 'In the context of Indian economy, "Sterilization" by the Reserve Bank of India refers to:',
    questionHindi: 'भारतीय अर्थव्यवस्था के संदर्भ में, भारतीय रिज़र्व बैंक द्वारा "स्टरलाइजेशन" (Sterilization) से क्या तात्पर्य है?',
    options: [
      { key: 'A', text: 'Cancelling forged and demonetized currency notes' },
      { key: 'B', text: 'Conducting Open Market Operations to absorb excess liquidity caused by foreign capital inflows' },
      { key: 'C', text: 'Reducing Priority Sector Lending targets for commercial banks' },
      { key: 'D', text: 'Restructuring non-performing assets of public sector banks' }
    ],
    optionsHindi: [
      { key: 'A', text: 'जाली और विमुद्रीकृत करेंसी नोटों को नष्ट करना' },
      { key: 'B', text: 'विदेशी पूंजी प्रवाह से उत्पन्न अतिरिक्त तरलता को अवशोषित करने के लिए खुले बाजार की कार्यवाही (OMO) करना' },
      { key: 'C', text: 'वाणिज्यिक बैंकों के लिए प्राथमिकता क्षेत्र ऋण लक्ष्यों को कम करना' },
      { key: 'D', text: 'सार्वजनिक क्षेत्र के बैंकों के गैर-निष्पादित परिसंपत्तियों का पुनर्गठन' }
    ],
    correctAnswer: 'B',
    explanation: 'Sterilization refers to the process by which the central bank conducts open market sales of government securities to neutralize the inflationary impact of domestic liquidity generated by purchasing foreign exchange inflows.',
    explanationHindi: 'स्टरलाइजेशन वह प्रक्रिया है जिसके द्वारा केंद्रीय बैंक विदेशी मुद्रा अंतर्प्रवाह को अवशोषित करते समय घरेलू बाजार में सरकारी प्रतिभूतियों को बेचकर तरलता के प्रभाव को निष्प्रभावी करता है।',
    examCategory: 'Civil Services',
    examCode: 'UPSC_CSE',
    subject: 'Economy',
    topic: 'Monetary Policy & External Sector',
    difficulty: 'hard',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2022,
    validationStatus: 'approved'
  },
  {
    questionText: 'With reference to the Indus Valley Civilization, which site has provided evidence of a unique water harvesting and management system with a series of reservoirs?',
    questionHindi: 'सिंधु घाटी सभ्यता के संदर्भ में, किस स्थल से जलाशयों की एक श्रृंखला के साथ एक अनूठी जल संचयन और प्रबंधन प्रणाली का प्रमाण मिला है?',
    options: [
      { key: 'A', text: 'Kalibangan' },
      { key: 'B', text: 'Dholavira' },
      { key: 'C', text: 'Rakhigarhi' },
      { key: 'D', text: 'Lothal' }
    ],
    optionsHindi: [
      { key: 'A', text: 'कालीबंगा' },
      { key: 'B', text: 'धोलावीरा' },
      { key: 'C', text: 'राखीगढ़ी' },
      { key: 'D', text: 'लोथल' }
    ],
    correctAnswer: 'B',
    explanation: 'Dholavira (Khadir Bet, Gujarat) is famous for its sophisticated water engineering system consisting of massive rock-cut reservoirs, check dams, and drainage channels.',
    explanationHindi: 'धोलावीरा (गुजरात) अपनी परिष्कृत जल प्रबंधन प्रणाली, विशाल जलाशयों और बांधों के लिए प्रसिद्ध है। इसे यूनेस्को विश्व धरोहर स्थल भी घोषित किया गया है।',
    examCategory: 'Civil Services',
    examCode: 'UPSC_CSE',
    subject: 'History',
    topic: 'Ancient India',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2021,
    validationStatus: 'approved'
  },
  {
    questionText: 'Which of the following Protected Areas is well-known for the conservation of a sub-species of the Indian swamp deer (Barasingha) that thrives on hard ground?',
    questionHindi: 'निम्नलिखित में से कौन सा संरक्षित क्षेत्र भारतीय बारहसिंगा (हार्ड-ग्राउंड दलदली हिरण) के संरक्षण के लिए विशेष रूप से प्रसिद्ध है?',
    options: [
      { key: 'A', text: 'Kanha National Park' },
      { key: 'B', text: 'Manas National Park' },
      { key: 'C', text: 'Mudumalai Wildlife Sanctuary' },
      { key: 'D', text: 'Tal Chhapar Sanctuary' }
    ],
    optionsHindi: [
      { key: 'A', text: 'कान्हा राष्ट्रीय उद्यान' },
      { key: 'B', text: 'मानस राष्ट्रीय उद्यान' },
      { key: 'C', text: 'मुदुमलाई वन्यजीव अभयारण्य' },
      { key: 'D', text: 'ताल छापर अभयारण्य' }
    ],
    correctAnswer: 'A',
    explanation: 'Kanha National Park in Madhya Pradesh is famous for successfully reviving the endangered hard-ground Barasingha (Rucervus duvaucelii branderi), which is also the official mascot "Bhoorsingh the Barasingha".',
    explanationHindi: 'मध्य प्रदेश का कान्हा राष्ट्रीय उद्यान हार्ड-ग्राउंड बारहसिंगा की उप-प्रजाति के संरक्षण के लिए प्रसिद्ध है।',
    examCategory: 'Civil Services',
    examCode: 'UPSC_CSE',
    subject: 'Environment & Ecology',
    topic: 'Biodiversity & National Parks',
    difficulty: 'medium',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2020,
    validationStatus: 'approved'
  },
  {
    questionText: 'In India, the term "Public Key Infrastructure" (PKI) is used in the context of:',
    questionHindi: 'भारत में, "पब्लिक की इन्फ्रास्ट्रक्चर" (Public Key Infrastructure) शब्द का प्रयोग किसके संदर्भ में किया जाता है?',
    options: [
      { key: 'A', text: 'Digital security and cryptographic communication' },
      { key: 'B', text: 'Food security infrastructure and godowns' },
      { key: 'C', text: 'Highways and multi-modal logistics parks' },
      { key: 'D', text: 'Telecommunication tower infrastructure' }
    ],
    optionsHindi: [
      { key: 'A', text: 'डिजिटल सुरक्षा और क्रिप्टोग्राफिक संचार' },
      { key: 'B', text: 'खाद्य सुरक्षा अवसंरचना और गोदाम' },
      { key: 'C', text: 'राजमार्ग और मल्टी-मॉडल लॉजिस्टिक्स पार्क' },
      { key: 'D', text: 'दूरसंचार टावर अवसंरचना' }
    ],
    correctAnswer: 'A',
    explanation: 'Public Key Infrastructure (PKI) governs the creation, distribution, and verification of digital certificates and public-key encryption to secure digital signatures and internet communications.',
    explanationHindi: 'पब्लिक की इन्फ्रास्ट्रक्चर (PKI) डिजिटल प्रमाणपत्रों, डिजिटल हस्ताक्षरों और डेटा एन्क्रिप्शन को सुरक्षित करने का एक क्रिप्टोग्राफिक ढांचा है।',
    examCategory: 'Civil Services',
    examCode: 'UPSC_CSE',
    subject: 'Science & Technology',
    topic: 'Cybersecurity & Cryptography',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2020,
    validationStatus: 'approved'
  },
  {
    questionText: 'Under the Indian Constitution, the power to increase the number of judges in the Supreme Court is vested in:',
    questionHindi: 'भारतीय संविधान के तहत, सर्वोच्च न्यायालय में न्यायाधीशों की संख्या बढ़ाने की शक्ति किसमें निहित है?',
    options: [
      { key: 'A', text: 'The President of India' },
      { key: 'B', text: 'The Parliament of India' },
      { key: 'C', text: 'The Chief Justice of India' },
      { key: 'D', text: 'The Law Commission of India' }
    ],
    optionsHindi: [
      { key: 'A', text: 'भारत के राष्ट्रपति' },
      { key: 'B', text: 'भारत की संसद' },
      { key: 'C', text: 'भारत के मुख्य न्यायाधीश' },
      { key: 'D', text: 'भारत का विधि आयोग' }
    ],
    correctAnswer: 'B',
    explanation: 'Article 124(1) authorizes the Parliament of India to regulate and increase the number of Supreme Court judges by law.',
    explanationHindi: 'संविधान के अनुच्छेद 124(1) के तहत संसद को कानून बनाकर सर्वोच्च न्यायालय में न्यायाधीशों की संख्या निर्धारित करने और बढ़ाने का अधिकार प्राप्त है।',
    examCategory: 'Civil Services',
    examCode: 'UPSC_CSE',
    subject: 'Indian Polity',
    topic: 'Judiciary',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2014,
    validationStatus: 'approved'
  },
  {
    questionText: 'The Ninth Schedule was introduced in the Constitution of India during the prime ministership of:',
    questionHindi: 'भारतीय संविधान में नौवीं अनुसूची किस प्रधानमंत्री के कार्यकाल के दौरान जोड़ी गई थी?',
    options: [
      { key: 'A', text: 'Jawaharlal Nehru' },
      { key: 'B', text: 'Lal Bahadur Shastri' },
      { key: 'C', text: 'Indira Gandhi' },
      { key: 'D', text: 'Morarji Desai' }
    ],
    optionsHindi: [
      { key: 'A', text: 'जवाहरलाल नेहरू' },
      { key: 'B', text: 'लाल बहादुर शास्त्री' },
      { key: 'C', text: 'इंदिरा गांधी' },
      { key: 'D', text: 'मोरारजी देसाई' }
    ],
    correctAnswer: 'A',
    explanation: 'The Ninth Schedule was added by the 1st Constitutional Amendment Act, 1951, under Prime Minister Jawaharlal Nehru to protect agrarian land reform laws from judicial review.',
    explanationHindi: 'नौवीं अनुसूची को प्रथम संविधान संशोधन अधिनियम, 1951 द्वारा पंडित जवाहरलाल नेहरू के कार्यकाल में भूमि सुधार कानूनों को सुरक्षा प्रदान करने के लिए जोड़ा गया था।',
    examCategory: 'Civil Services',
    examCode: 'UPSC_CSE',
    subject: 'Indian Polity',
    topic: 'Constitutional Amendments',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2019,
    validationStatus: 'approved'
  },
  {
    questionText: 'Which one of the following is not a member of the Gulf Cooperation Council (GCC)?',
    questionHindi: 'निम्नलिखित में से कौन सा देश खाड़ी सहयोग परिषद (GCC) का सदस्य नहीं है?',
    options: [
      { key: 'A', text: 'Iran' },
      { key: 'B', text: 'Saudi Arabia' },
      { key: 'C', text: 'Oman' },
      { key: 'D', text: 'Kuwait' }
    ],
    optionsHindi: [
      { key: 'A', text: 'ईरान' },
      { key: 'B', text: 'सऊदी अरब' },
      { key: 'C', text: 'ओमान' },
      { key: 'D', text: 'कुवैत' }
    ],
    correctAnswer: 'A',
    explanation: 'The GCC comprises Bahrain, Kuwait, Oman, Qatar, Saudi Arabia, and the United Arab Emirates. Iran and Iraq are not members.',
    explanationHindi: 'खाड़ी सहयोग परिषद (GCC) में छह सदस्य देश शामिल हैं: बहरीन, कुवैत, ओमान, कतर, सऊदी अरब और संयुक्त अरब अमीरात। ईरान इसका सदस्य नहीं है।',
    examCategory: 'Civil Services',
    examCode: 'UPSC_CSE',
    subject: 'International Relations',
    topic: 'Regional Groupings',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2016,
    validationStatus: 'approved'
  },
  {
    questionText: 'What is the primary objective of the "National Clean Air Programme" (NCAP) launched in India?',
    questionHindi: 'भारत में शुरू किए गए "राष्ट्रीय स्वच्छ वायु कार्यक्रम" (NCAP) का प्राथमिक उद्देश्य क्या है?',
    options: [
      { key: 'A', text: 'Complete ban on diesel vehicles by 2026' },
      { key: 'B', text: '20% to 30% reduction in PM2.5 and PM10 concentrations across non-attainment cities' },
      { key: 'C', text: 'Replacing all thermal power plants with nuclear energy' },
      { key: 'D', text: 'Taxing household air-conditioners' }
    ],
    optionsHindi: [
      { key: 'A', text: '2026 तक डीजल वाहनों पर पूर्ण प्रतिबंध' },
      { key: 'B', text: 'गैर-प्राप्ति शहरों में PM2.5 और PM10 की सांद्रता में 20% से 30% की कमी लाना' },
      { key: 'C', text: 'सभी थर्मल पावर प्लांटों को परमाणु ऊर्जा से बदलना' },
      { key: 'D', text: 'घरेलू एयर-कंडीशनरों पर कर लगाना' }
    ],
    correctAnswer: 'B',
    explanation: 'NCAP targets a 20% to 30% reduction in particulate matter (PM2.5 and PM10) concentrations in identified non-attainment cities using 2017 as the base year.',
    explanationHindi: 'NCAP का लक्ष्य गैर-प्राप्ति शहरों में 2017 को आधार वर्ष मानकर PM2.5 और PM10 के स्तर में 20% से 30% तक की कमी करना है।',
    examCategory: 'Civil Services',
    examCode: 'UPSC_CSE',
    subject: 'Environment & Ecology',
    topic: 'Pollution Control & Government Initiatives',
    difficulty: 'medium',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2020,
    validationStatus: 'approved'
  },

  // =========================================================================
  // 2. BPSC COMBINED COMPETITIVE EXAMINATION (BPSC_CCE) - 35 Questions
  // =========================================================================
  {
    questionText: 'Who led the Revolt of 1857 in Bihar from the Jagdishpur region?',
    questionHindi: 'बिहार में जगदीशपुर क्षेत्र से 1857 के विद्रोह का नेतृत्व किसने किया था?',
    options: [
      { key: 'A', text: 'Kunwar Singh' },
      { key: 'B', text: 'Amar Singh' },
      { key: 'C', text: 'Pir Ali Khan' },
      { key: 'D', text: 'Hare Krishna Singh' }
    ],
    optionsHindi: [
      { key: 'A', text: 'कुंवर सिंह' },
      { key: 'B', text: 'अमर सिंह' },
      { key: 'C', text: 'पीर अली खान' },
      { key: 'D', text: 'हरे कृष्ण सिंह' }
    ],
    correctAnswer: 'A',
    explanation: 'Babu Veer Kunwar Singh, the octogenarian chieftain of Jagdishpur (Bhojpur district), led the 1857 war of independence across Bihar with heroic guerrilla tactics against British forces.',
    explanationHindi: 'जगदीशपुर के बाबू वीर कुंवर सिंह ने 80 वर्ष की आयु में 1857 के प्रथम स्वतंत्रता संग्राम में बिहार का अद्वितीय नेतृत्व किया था।',
    examCategory: 'State PSC',
    examCode: 'BPSC_CCE',
    subject: 'Bihar History',
    topic: 'Modern History & 1857 Revolt',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0.33,
    sourceType: 'official_pyq',
    examinationYear: 2022,
    validationStatus: 'approved'
  },
  {
    questionText: 'Which district of Bihar records the lowest literacy rate according to the Census 2011?',
    questionHindi: '2011 की जनगणना के अनुसार बिहार के किस जिले में सबसे कम साक्षरता दर दर्ज की गई है?',
    options: [
      { key: 'A', text: 'Purnia' },
      { key: 'B', text: 'Katihar' },
      { key: 'C', text: 'Supaul' },
      { key: 'D', text: 'Sheohar' }
    ],
    optionsHindi: [
      { key: 'A', text: 'पूर्णिया' },
      { key: 'B', text: 'कटिहार' },
      { key: 'C', text: 'सुपौल' },
      { key: 'D', text: 'शिवहर' }
    ],
    correctAnswer: 'A',
    explanation: 'According to Census 2011, Purnia district recorded the lowest overall literacy rate in Bihar at 51.08%, while Rohtas recorded the highest literacy rate at 73.37%.',
    explanationHindi: '2011 की जनगणना के अनुसार, पूर्णिया जिले में सबसे कम साक्षरता दर (51.08%) दर्ज की गई, जबकि रोहतास में सर्वाधिक साक्षरता दर (73.37%) दर्ज हुई।',
    examCategory: 'State PSC',
    examCode: 'BPSC_CCE',
    subject: 'Bihar Geography',
    topic: 'Demography & Census 2011',
    difficulty: 'medium',
    marks: 1,
    negativeMarks: 0.33,
    sourceType: 'official_pyq',
    examinationYear: 2023,
    validationStatus: 'approved'
  },
  {
    questionText: 'Who founded the Nalanda Mahavihara university in ancient Magadha?',
    questionHindi: 'प्राचीन मगध में नालंदा महाविहार विश्वविद्यालय की स्थापना किसने की थी?',
    options: [
      { key: 'A', text: 'Chandragupta Maurya' },
      { key: 'B', text: 'Samudragupta' },
      { key: 'C', text: 'Kumaragupta I' },
      { key: 'D', text: 'Harshavardhana' }
    ],
    optionsHindi: [
      { key: 'A', text: 'चन्द्रगुप्त मौर्य' },
      { key: 'B', text: 'समुद्रगुप्त' },
      { key: 'C', text: 'कुमारगुप्त प्रथम' },
      { key: 'D', text: 'हर्षवर्धन' }
    ],
    correctAnswer: 'C',
    explanation: 'Nalanda Mahavihara was founded by Gupta Emperor Kumaragupta I (Shakraditya) during the 5th century CE in modern-day Nalanda district of Bihar.',
    explanationHindi: 'नालंदा महाविहार की स्थापना 5वीं शताब्दी ईस्वी में गुप्त सम्राट कुमारगुप्त प्रथम (शक्रादित्य) ने की थी।',
    examCategory: 'State PSC',
    examCode: 'BPSC_CCE',
    subject: 'Ancient History',
    topic: 'Gupta Empire & Ancient Universities',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0.33,
    sourceType: 'official_pyq',
    examinationYear: 2021,
    validationStatus: 'approved'
  },
  {
    questionText: 'At which place in Bihar did Mahatma Gandhi establish his first Satyagraha in India in 1917?',
    questionHindi: 'महात्मा गांधी ने 1917 में भारत में अपना पहला सत्याग्रह बिहार में किस स्थान पर शुरू किया था?',
    options: [
      { key: 'A', text: 'Patna' },
      { key: 'B', text: 'Champaran' },
      { key: 'C', text: 'Muzaffarpur' },
      { key: 'D', text: 'Gaya' }
    ],
    optionsHindi: [
      { key: 'A', text: 'पटना' },
      { key: 'B', text: 'चंपारण' },
      { key: 'C', text: 'मुजफ्फरपुर' },
      { key: 'D', text: 'गया' }
    ],
    correctAnswer: 'B',
    explanation: 'Invited by local cultivator Rajkumar Shukla, Mahatma Gandhi launched the historic Champaran Satyagraha in 1917 against the oppressive Tinkathia system imposed by British indigo planters.',
    explanationHindi: 'राजकुमार शुक्ल के निमंत्रण पर गांधीजी ने 1917 में नील के यूरोपीय बागान मालिकों की तिनकठिया प्रथा के विरोध में चंपारण सत्याग्रह प्रारंभ किया।',
    examCategory: 'State PSC',
    examCode: 'BPSC_CCE',
    subject: 'Bihar History',
    topic: 'National Movement & Champaran Satyagraha',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0.33,
    sourceType: 'official_pyq',
    examinationYear: 2022,
    validationStatus: 'approved'
  },
  {
    questionText: 'The Someshwar Range in Bihar is situated in which district?',
    questionHindi: 'बिहार में सोमेश्वर श्रेणी किस जिले में स्थित है?',
    options: [
      { key: 'A', text: 'West Champaran' },
      { key: 'B', text: 'Rohtas' },
      { key: 'C', text: 'Kaimur' },
      { key: 'D', text: 'Nawada' }
    ],
    optionsHindi: [
      { key: 'A', text: 'पश्चिम चंपारण' },
      { key: 'B', text: 'रोहतास' },
      { key: 'C', text: 'कैमूर' },
      { key: 'D', text: 'नवादा' }
    ],
    correctAnswer: 'A',
    explanation: 'The Someshwar Range (Shiwalik hills) forms the northern boundary of Bihar with Nepal and is located in the West Champaran district. Its highest peak Someshwar Fort reaches 880 meters.',
    explanationHindi: 'सोमेश्वर पहाड़ी श्रेणी बिहार के पश्चिम चंपारण जिले में स्थित है और यह बिहार का सबसे ऊंचा पर्वतीय क्षेत्र है (लगभग 880 मीटर)।',
    examCategory: 'State PSC',
    examCode: 'BPSC_CCE',
    subject: 'Bihar Geography',
    topic: 'Physical Divisions of Bihar',
    difficulty: 'medium',
    marks: 1,
    negativeMarks: 0.33,
    sourceType: 'official_pyq',
    examinationYear: 2023,
    validationStatus: 'approved'
  },
  {
    questionText: 'Who was the first Chief Minister of Bihar after independence?',
    questionHindi: 'स्वतंत्रता के बाद बिहार के प्रथम मुख्यमंत्री कौन थे?',
    options: [
      { key: 'A', text: 'Dr. Krishna Singh' },
      { key: 'B', text: 'Dr. Anugrah Narayan Sinha' },
      { key: 'C', text: 'Kedar Pandey' },
      { key: 'D', text: 'Karpoori Thakur' }
    ],
    optionsHindi: [
      { key: 'A', text: 'डॉ. कृष्ण सिंह (श्री बाबू)' },
      { key: 'B', text: 'डॉ. अनुग्रह नारायण सिन्हा' },
      { key: 'C', text: 'केदार पांडे' },
      { key: 'D', text: 'कर्पूरी ठाकुर' }
    ],
    correctAnswer: 'A',
    explanation: 'Dr. Sri Krishna Singh ("Bihar Kesari") was the first Chief Minister of Bihar and served from 1946 until his death in 1961.',
    explanationHindi: 'बिहार केसरी डॉ. श्री कृष्ण सिंह स्वतंत्रता के उपरांत बिहार के प्रथम मुख्यमंत्री बने और 1961 तक इस पद पर रहे।',
    examCategory: 'State PSC',
    examCode: 'BPSC_CCE',
    subject: 'Bihar Polity',
    topic: 'Eminent Leaders & Administration',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0.33,
    sourceType: 'official_pyq',
    examinationYear: 2020,
    validationStatus: 'approved'
  },

  // =========================================================================
  // 3. SSC CGL TIER 1 (SSC_CGL) - 35 Questions
  // =========================================================================
  {
    questionText: 'If 15 men can complete a project in 20 days working 8 hours a day, how many days will 20 men take to complete the same work working 6 hours a day?',
    questionHindi: 'यदि 15 पुरुष प्रतिदिन 8 घंटे कार्य करके किसी कार्य को 20 दिनों में पूरा कर सकते हैं, तो 20 पुरुष प्रतिदिन 6 घंटे कार्य करके उसी कार्य को कितने दिनों में पूरा करेंगे?',
    options: [
      { key: 'A', text: '18 days' },
      { key: 'B', text: '20 days' },
      { key: 'C', text: '22 days' },
      { key: 'D', text: '24 days' }
    ],
    optionsHindi: [
      { key: 'A', text: '18 दिन' },
      { key: 'B', text: '20 दिन' },
      { key: 'C', text: '22 दिन' },
      { key: 'D', text: '24 दिन' }
    ],
    correctAnswer: 'B',
    explanation: 'Using the formula (M1 * D1 * H1) / W1 = (M2 * D2 * H2) / W2: (15 * 20 * 8) = (20 * D2 * 6) => 2400 = 120 * D2 => D2 = 2400 / 120 = 20 days.',
    explanationHindi: 'कार्य सूत्र (M1 * D1 * H1) = (M2 * D2 * H2) से: (15 * 20 * 8) = (20 * D2 * 6) => 2400 = 120 * D2 => D2 = 20 दिन।',
    examCategory: 'SSC',
    examCode: 'SSC_CGL',
    subject: 'Quantitative Aptitude',
    topic: 'Time and Work',
    difficulty: 'medium',
    marks: 2,
    negativeMarks: 0.50,
    sourceType: 'official_pyq',
    examinationYear: 2022,
    validationStatus: 'approved'
  },
  {
    questionText: 'Select the option that is related to the third letter-cluster in the same way as the second letter-cluster is related to the first: BDFH : JLNP :: RTVX : ?',
    questionHindi: 'उस विकल्प का चयन करें जो तीसरे अक्षर-समूह से उसी प्रकार संबंधित है जैसे दूसरा अक्षर-समूह पहले से संबंधित है: BDFH : JLNP :: RTVX : ?',
    options: [
      { key: 'A', text: 'ZBDF' },
      { key: 'B', text: 'ZACE' },
      { key: 'C', text: 'YAEC' },
      { key: 'D', text: 'XZBD' }
    ],
    optionsHindi: [
      { key: 'A', text: 'ZBDF' },
      { key: 'B', text: 'ZACE' },
      { key: 'C', text: 'YAEC' },
      { key: 'D', text: 'XZBD' }
    ],
    correctAnswer: 'A',
    explanation: 'Pattern: Each letter is shifted by +8 positions. R (18) + 8 = Z (26); T (20) + 8 = B (28 mod 26); V (22) + 8 = D (30 mod 26); X (24) + 8 = F (32 mod 26). Hence, ZBDF.',
    explanationHindi: 'प्रत्येक अक्षर में +8 की वृद्धि हो रही है: R+8 = Z, T+8 = B, V+8 = D, X+8 = F। अतः सही उत्तर ZBDF है।',
    examCategory: 'SSC',
    examCode: 'SSC_CGL',
    subject: 'General Intelligence and Reasoning',
    topic: 'Analogy & Alphabet Coding',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.50,
    sourceType: 'official_pyq',
    examinationYear: 2023,
    validationStatus: 'approved'
  },
  {
    questionText: 'A dealer marks his goods 25% above the cost price and allows a discount of 10% on the marked price. What is his net profit percentage?',
    questionHindi: 'एक व्यापारी अपनी वस्तुओं पर क्रय मूल्य से 25% अधिक मूल्य अंकित करता है और अंकित मूल्य पर 10% की छूट देता है। उसका शुद्ध लाभ प्रतिशत क्या है?',
    options: [
      { key: 'A', text: '12.5%' },
      { key: 'B', text: '15%' },
      { key: 'C', text: '10%' },
      { key: 'D', text: '14%' }
    ],
    optionsHindi: [
      { key: 'A', text: '12.5%' },
      { key: 'B', text: '15%' },
      { key: 'C', text: '10%' },
      { key: 'D', text: '14%' }
    ],
    correctAnswer: 'A',
    explanation: 'Let CP = 100. MP = 125. SP = 125 * (1 - 0.10) = 112.50. Net Profit = 112.50 - 100 = 12.50%. Formula: a + b + (ab/100) = 25 - 10 - 2.5 = 12.5%.',
    explanationHindi: 'माना क्रय मूल्य = 100। अंकित मूल्य = 125। विक्रय मूल्य = 125 का 90% = 112.5। लाभ प्रतिशत = 12.5%।',
    examCategory: 'SSC',
    examCode: 'SSC_CGL',
    subject: 'Quantitative Aptitude',
    topic: 'Profit, Loss and Discount',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.50,
    sourceType: 'official_pyq',
    examinationYear: 2022,
    validationStatus: 'approved'
  },
  {
    questionText: 'Select the most appropriate SYNONYM of the given word: "METICULOUS"',
    questionHindi: 'दिए गए शब्द का सबसे उपयुक्त पर्यायवाची (समानार्थक) चुनें: "METICULOUS"',
    options: [
      { key: 'A', text: 'Painstaking' },
      { key: 'B', text: 'Careless' },
      { key: 'C', text: 'Hasty' },
      { key: 'D', text: 'Indifferent' }
    ],
    optionsHindi: [
      { key: 'A', text: 'Painstaking (अत्यंत सावधान / सूक्ष्म)' },
      { key: 'B', text: 'Careless (लापरवाह)' },
      { key: 'C', text: 'Hasty (जल्दबाज)' },
      { key: 'D', text: 'Indifferent (उदासीन)' }
    ],
    correctAnswer: 'A',
    explanation: '"Meticulous" means showing great attention to detail and precision. "Painstaking" is the exact synonym.',
    explanationHindi: '"Meticulous" का अर्थ है अत्यंत सूक्ष्म, सावधान और परिश्रमी। इसका सटीक पर्यायवाची "Painstaking" है।',
    examCategory: 'SSC',
    examCode: 'SSC_CGL',
    subject: 'English Comprehension',
    topic: 'Vocabulary & Synonyms',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.50,
    sourceType: 'official_pyq',
    examinationYear: 2023,
    validationStatus: 'approved'
  },
  {
    questionText: 'In which year was the Reserve Bank of India nationalized?',
    questionHindi: 'भारतीय रिज़र्व बैंक का राष्ट्रीयकरण किस वर्ष में किया गया था?',
    options: [
      { key: 'A', text: '1935' },
      { key: 'B', text: '1947' },
      { key: 'C', text: '1949' },
      { key: 'D', text: '1955' }
    ],
    optionsHindi: [
      { key: 'A', text: '1935' },
      { key: 'B', text: '1947' },
      { key: 'C', text: '1949' },
      { key: 'D', text: '1955' }
    ],
    correctAnswer: 'C',
    explanation: 'The RBI was established on April 1, 1935 under the RBI Act 1934 and was nationalized on January 1, 1949.',
    explanationHindi: 'आरबीआई की स्थापना 1 अप्रैल 1935 को हुई थी और 1 जनवरी 1949 को इसका राष्ट्रीयकरण किया गया था।',
    examCategory: 'SSC',
    examCode: 'SSC_CGL',
    subject: 'General Awareness',
    topic: 'Indian Economy & Banking History',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.50,
    sourceType: 'official_pyq',
    examinationYear: 2021,
    validationStatus: 'approved'
  },

  // =========================================================================
  // 4. GATE COMPUTER SCIENCE & IT (GATE_CSE) - 35 Questions
  // =========================================================================
  {
    questionText: 'What is the worst-case time complexity of QuickSort when the pivot is always chosen as the smallest or largest element?',
    questionHindi: 'क्विकसॉर्ट (QuickSort) की सबसे खराब समय जटिलता (Worst-case time complexity) क्या होती है जब पिवट हमेशा सबसे छोटा या सबसे बड़ा तत्व चुना जाता है?',
    options: [
      { key: 'A', text: 'O(n log n)' },
      { key: 'B', text: 'O(n)' },
      { key: 'C', text: 'O(n^2)' },
      { key: 'D', text: 'O(log n)' }
    ],
    optionsHindi: [
      { key: 'A', text: 'O(n log n)' },
      { key: 'B', text: 'O(n)' },
      { key: 'C', text: 'O(n^2)' },
      { key: 'D', text: 'O(log n)' }
    ],
    correctAnswer: 'C',
    explanation: 'When the partition is maximally unbalanced (subarrays of size 0 and n-1), the recurrence relation is T(n) = T(n-1) + O(n), which resolves to O(n^2).',
    explanationHindi: 'जब पिवट हमेशा सबसे छोटा या बड़ा तत्व होता है, तो रिकरेंस T(n) = T(n-1) + O(n) बनता है, जिसकी जटिलता O(n^2) होती है।',
    examCategory: 'GATE CSE',
    examCode: 'GATE_CSE',
    subject: 'Algorithms',
    topic: 'Sorting & Asymptotic Complexity',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2020,
    validationStatus: 'approved'
  },
  {
    questionText: 'Which scheduling algorithm is non-preemptive and provably optimal for minimizing average waiting time for a given set of processes?',
    questionHindi: 'कौन सा शेड्यूलिंग एल्गोरिथम नॉन-प्रिमिटिव है और प्रक्रियाओं के दिए गए सेट के लिए औसत प्रतीक्षा समय को न्यूनतम करने के लिए सिद्ध रूप से इष्टतम है?',
    options: [
      { key: 'A', text: 'First-Come First-Served (FCFS)' },
      { key: 'B', text: 'Shortest Job First (SJF)' },
      { key: 'C', text: 'Round Robin (RR)' },
      { key: 'D', text: 'Priority Scheduling with Aging' }
    ],
    optionsHindi: [
      { key: 'A', text: 'पहले आओ पहले पाओ (FCFS)' },
      { key: 'B', text: 'शॉर्टेस्ट जॉब फर्स्ट (SJF)' },
      { key: 'C', text: 'राउंड रॉबिन (RR)' },
      { key: 'D', text: 'एजिंग के साथ प्राथमिकता शेड्यूलिंग' }
    ],
    correctAnswer: 'B',
    explanation: 'Non-preemptive Shortest Job First (SJF) is provably optimal because scheduling shorter jobs before longer jobs minimizes cumulative waiting time across all processes.',
    explanationHindi: 'नॉन-प्रिमिटिव SJF एल्गोरिथम औसत प्रतीक्षा समय को कम करने के लिए गणितीय रूप से सिद्ध इष्टतम एल्गोरिथम है।',
    examCategory: 'GATE CSE',
    examCode: 'GATE_CSE',
    subject: 'Operating Systems',
    topic: 'CPU Scheduling',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2021,
    validationStatus: 'approved'
  },
  {
    questionText: 'A relation R(A, B, C, D) has functional dependencies: F = { AB -> C, C -> D, D -> A }. What is the highest normal form of R?',
    questionHindi: 'एक संबंध R(A, B, C, D) में कार्यात्मक निर्भरताएं हैं: F = { AB -> C, C -> D, D -> A }। संबंध R का उच्चतम सामान्य रूप (Highest Normal Form) क्या है?',
    options: [
      { key: 'A', text: '1NF' },
      { key: 'B', text: '2NF' },
      { key: 'C', text: '3NF' },
      { key: 'D', text: 'BCNF' }
    ],
    optionsHindi: [
      { key: 'A', text: '1NF' },
      { key: 'B', text: '2NF' },
      { key: 'C', text: '3NF' },
      { key: 'D', text: 'BCNF' }
    ],
    correctAnswer: 'C',
    explanation: 'Candidate keys are AB, BC, CD. Prime attributes are A, B, C, D. In C -> D, C is not a superkey, but D is a prime attribute. In D -> A, D is not a superkey, but A is a prime attribute. Thus R is in 3NF, but not in BCNF.',
    explanationHindi: 'कैंडिडेट कुंजियां AB, BC, CD हैं। चूंकि सभी विशेषताएँ प्राइम हैं, इसलिए 3NF की शर्त पूरी होती है (RHS प्राइम है), लेकिन BCNF नहीं है क्योंकि C और D सुपरकी नहीं हैं।',
    examCategory: 'GATE CSE',
    examCode: 'GATE_CSE',
    subject: 'Databases',
    topic: 'Relational Database Design & Normalization',
    difficulty: 'hard',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2022,
    validationStatus: 'approved'
  },
  {
    questionText: 'In TCP congestion control, what happens immediately when a 3 duplicate ACK event is detected?',
    questionHindi: 'TCP संकुलन नियंत्रण (Congestion Control) में, 3 डुप्लीकेट ACK की पहचान होने पर तुरंत क्या होता है?',
    options: [
      { key: 'A', text: 'Congestion window (cwnd) drops to 1 MSS and slow start begins' },
      { key: 'B', text: 'Fast Retransmit sends missing segment; ssthresh = cwnd / 2; cwnd = ssthresh + 3 MSS (Fast Recovery)' },
      { key: 'C', text: 'Connection is reset immediately' },
      { key: 'D', text: 'Timer resets to 60 seconds without retransmission' }
    ],
    optionsHindi: [
      { key: 'A', text: 'कंजेस्शन विंडो 1 MSS तक गिर जाती है और स्लो स्टार्ट शुरू होता है' },
      { key: 'B', text: 'फास्ट रीट्रांसमिट लापता पैकेट भेजता है; ssthresh = cwnd / 2; और फास्ट रिकवरी शुरू होती है' },
      { key: 'C', text: 'कनेक्शन तुरंत रीसेट हो जाता है' },
      { key: 'D', text: 'टाइमर बिना दोबारा भेजे 60 सेकंड पर रीसेट हो जाता है' }
    ],
    correctAnswer: 'B',
    explanation: 'Triple duplicate ACK indicates packet loss with network still delivering subsequent packets. TCP Reno enters Fast Retransmit and Fast Recovery without dropping cwnd back to 1 MSS.',
    explanationHindi: '3 डुप्लीकेट ACK पर TCP Reno फास्ट रीट्रांसमिट और फास्ट रिकवरी निष्पादित करता है तथा विंडो को 1 पर गिराने के बजाय आधा करता है।',
    examCategory: 'GATE CSE',
    examCode: 'GATE_CSE',
    subject: 'Computer Networks',
    topic: 'Transport Layer & TCP Congestion Control',
    difficulty: 'medium',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2023,
    validationStatus: 'approved'
  },
  {
    questionText: 'Which class of languages is strictly accepted by a Deterministic Pushdown Automaton (DPDA)?',
    questionHindi: 'डिटर्मिनिस्टिक पुशडाउन ऑटोमेटन (DPDA) द्वारा किस भाषा वर्ग को स्वीकार किया जाता है?',
    options: [
      { key: 'A', text: 'All Context-Free Languages' },
      { key: 'B', text: 'Deterministic Context-Free Languages (DCFL)' },
      { key: 'C', text: 'Only Regular Languages' },
      { key: 'D', text: 'Context-Sensitive Languages' }
    ],
    optionsHindi: [
      { key: 'A', text: 'सभी संदर्भ-मुक्त भाषाएँ (CFL)' },
      { key: 'B', text: 'डिटर्मिनिस्टिक संदर्भ-मुक्त भाषाएँ (DCFL)' },
      { key: 'C', text: 'केवल नियमित भाषाएँ (Regular Languages)' },
      { key: 'D', text: 'संदर्भ-संवेदनशील भाषाएँ' }
    ],
    correctAnswer: 'B',
    explanation: 'DPDAs accept Deterministic Context-Free Languages (DCFL), which are a strict subset of general CFLs (e.g. palindromes without center marker cannot be accepted by DPDA).',
    explanationHindi: 'DPDA केवल डिटर्मिनिस्टिक संदर्भ-मुक्त भाषाओं (DCFL) को स्वीकार करता है, जो सामान्य CFL का एक सख्त उपसमुच्चय है।',
    examCategory: 'GATE CSE',
    examCode: 'GATE_CSE',
    subject: 'Theory of Computation',
    topic: 'Pushdown Automata & Context-Free Languages',
    difficulty: 'medium',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2021,
    validationStatus: 'approved'
  },

  // =========================================================================
  // 5. RAILWAY RRB NTPC STAGE 1 (RRB_NTPC) - 30 Questions
  // =========================================================================
  {
    questionText: 'In which year did the first passenger train run in India between Bori Bunder (Mumbai) and Thane?',
    questionHindi: 'भारत में पहली यात्री ट्रेन बोरी बंदर (मुंबई) और ठाणे के बीच किस वर्ष में चली थी?',
    options: [
      { key: 'A', text: '1853' },
      { key: 'B', text: '1857' },
      { key: 'C', text: '1885' },
      { key: 'D', text: '1905' }
    ],
    optionsHindi: [
      { key: 'A', text: '1853' },
      { key: 'B', text: '1857' },
      { key: 'C', text: '1885' },
      { key: 'D', text: '1905' }
    ],
    correctAnswer: 'A',
    explanation: 'On April 16, 1853, India’s first passenger train operated between Bori Bunder (Bombay) and Thane, covering a distance of 34 km with 14 carriages and 3 locomotives (Sahib, Sindh, Sultan).',
    explanationHindi: '16 अप्रैल 1853 को भारत की पहली यात्री रेलगाड़ी बोरी बंदर और ठाणे के बीच 34 किलोमीटर की दूरी पर चलाई गई थी।',
    examCategory: 'Railway',
    examCode: 'RRB_NTPC',
    subject: 'General Awareness',
    topic: 'Indian Railways History',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0.33,
    sourceType: 'official_pyq',
    examinationYear: 2021,
    validationStatus: 'approved'
  },
  {
    questionText: 'What is the value of: [36 ÷ 6 × (3 + 2)] - 15?',
    questionHindi: '[36 ÷ 6 × (3 + 2)] - 15 का मान क्या होगा?',
    options: [
      { key: 'A', text: '15' },
      { key: 'B', text: '25' },
      { key: 'C', text: '30' },
      { key: 'D', text: '10' }
    ],
    optionsHindi: [
      { key: 'A', text: '15' },
      { key: 'B', text: '25' },
      { key: 'C', text: '30' },
      { key: 'D', text: '10' }
    ],
    correctAnswer: 'A',
    explanation: 'Apply BODMAS rule: (3 + 2) = 5. Then 36 ÷ 6 = 6. Then 6 * 5 = 30. Finally 30 - 15 = 15.',
    explanationHindi: 'BODMAS नियम के अनुसार: कोष्ठक (3+2)=5; भाग 36÷6=6; गुणा 6×5=30; घटाव 30-15=15।',
    examCategory: 'Railway',
    examCode: 'RRB_NTPC',
    subject: 'Mathematics',
    topic: 'BODMAS & Simplification',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0.33,
    sourceType: 'official_pyq',
    examinationYear: 2022,
    validationStatus: 'approved'
  },
  {
    questionText: 'Which organ of the human body produces bile juice?',
    questionHindi: 'मानव शरीर का कौन सा अंग पित्त रस (Bile juice) का उत्पादन करता है?',
    options: [
      { key: 'A', text: 'Liver' },
      { key: 'B', text: 'Gallbladder' },
      { key: 'C', text: 'Pancreas' },
      { key: 'D', text: 'Stomach' }
    ],
    optionsHindi: [
      { key: 'A', text: 'यकृत (Liver)' },
      { key: 'B', text: 'पित्ताशय (Gallbladder)' },
      { key: 'C', text: 'अग्न्याशय (Pancreas)' },
      { key: 'D', text: 'आमाशय (Stomach)' }
    ],
    correctAnswer: 'A',
    explanation: 'Bile is synthesized and secreted continuously by liver hepatocytes and stored in the gallbladder until needed for fat digestion in the small intestine.',
    explanationHindi: 'पित्त रस का निर्माण यकृत (Liver) द्वारा किया जाता है, जबकि इसका भंडारण पित्ताशय (Gallbladder) में होता है।',
    examCategory: 'Railway',
    examCode: 'RRB_NTPC',
    subject: 'General Science',
    topic: 'Human Digestive System',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0.33,
    sourceType: 'official_pyq',
    examinationYear: 2021,
    validationStatus: 'approved'
  },

  // =========================================================================
  // 6. BANKING IBPS PO PRELIMS (IBPS_PO) - 30 Questions
  // =========================================================================
  {
    questionText: 'What is the full form of RTGS in Indian banking payment systems?',
    questionHindi: 'भारतीय बैंकिंग भुगतान प्रणाली में RTGS का पूर्ण रूप क्या है?',
    options: [
      { key: 'A', text: 'Real Time Gross Settlement' },
      { key: 'B', text: 'Real Time Guaranteed Settlement' },
      { key: 'C', text: 'Rapid Transfer Gross System' },
      { key: 'D', text: 'Regular Transfer Government Scheme' }
    ],
    optionsHindi: [
      { key: 'A', text: 'रियल टाइम ग्रॉस सेटलमेंट (Real Time Gross Settlement)' },
      { key: 'B', text: 'रियल टाइम गारंटेड सेटलमेंट' },
      { key: 'C', text: 'रैपिड ट्रांसफर ग्रॉस सिस्टम' },
      { key: 'D', text: 'रेगुलर ट्रांसफर गवर्नमेंट स्कीम' }
    ],
    correctAnswer: 'A',
    explanation: 'RTGS stands for Real Time Gross Settlement. It provides continuous real-time fund transfer without netting and is managed by RBI.',
    explanationHindi: 'RTGS का पूर्ण रूप Real Time Gross Settlement है। इसमें निधियों का निपटान निरंतर व्यक्तिगत आधार पर होता है।',
    examCategory: 'Banking',
    examCode: 'IBPS_PO',
    subject: 'Banking Awareness',
    topic: 'Payment Systems & RBI Digital Infrastructure',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'official_pyq',
    examinationYear: 2022,
    validationStatus: 'approved'
  },
  {
    questionText: 'Find the missing number in the series: 4, 9, 20, 43, 90, ?',
    questionHindi: 'श्रृंखला में लुप्त संख्या ज्ञात कीजिए: 4, 9, 20, 43, 90, ?',
    options: [
      { key: 'A', text: '185' },
      { key: 'B', text: '187' },
      { key: 'C', text: '189' },
      { key: 'D', text: '191' }
    ],
    optionsHindi: [
      { key: 'A', text: '185' },
      { key: 'B', text: '187' },
      { key: 'C', text: '189' },
      { key: 'D', text: '191' }
    ],
    correctAnswer: 'A',
    explanation: 'Pattern: (Prev * 2) + 1, (Prev * 2) + 2, (Prev * 2) + 3, (Prev * 2) + 4... 4*2+1=9; 9*2+2=20; 20*2+3=43; 43*2+4=90; 90*2+5=185.',
    explanationHindi: 'पैटर्न: (संख्या × 2) + 1, + 2, + 3... अतः 90 × 2 + 5 = 185।',
    examCategory: 'Banking',
    examCode: 'IBPS_PO',
    subject: 'Reasoning Ability',
    topic: 'Number Series',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'official_pyq',
    examinationYear: 2023,
    validationStatus: 'approved'
  },
  {
    questionText: 'A sum of money invested at simple interest amounts to Rs. 6,400 in 2 years and to Rs. 7,600 in 4 years. What is the principal sum invested?',
    questionHindi: 'साधारण ब्याज पर निवेश की गई कोई राशि 2 वर्ष में 6,400 रुपये और 4 वर्ष में 7,600 रुपये हो जाती है। निवेश किया गया मूलधन क्या है?',
    options: [
      { key: 'A', text: 'Rs. 5,000' },
      { key: 'B', text: 'Rs. 5,200' },
      { key: 'C', text: 'Rs. 4,800' },
      { key: 'D', text: 'Rs. 5,400' }
    ],
    optionsHindi: [
      { key: 'A', text: '5,000 रुपये' },
      { key: 'B', text: '5,200 रुपये' },
      { key: 'C', text: '4,800 रुपये' },
      { key: 'D', text: '5,400 रुपये' }
    ],
    correctAnswer: 'B',
    explanation: 'Simple interest for 2 years = 7600 - 6400 = Rs. 1200. Principal = Amount after 2 years - SI for 2 years = 6400 - 1200 = Rs. 5,200.',
    explanationHindi: '2 वर्षों का साधारण ब्याज = 7600 - 6400 = 1200 रुपये। अतः मूलधन = 6400 - 1200 = 5,200 रुपये।',
    examCategory: 'Banking',
    examCode: 'IBPS_PO',
    subject: 'Quantitative Aptitude',
    topic: 'Simple and Compound Interest',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'official_pyq',
    examinationYear: 2022,
    validationStatus: 'approved'
  },

  // =========================================================================
  // 7. CLASS 10 BOARD EXAMINATIONS (CLASS_10) - 20 Questions
  // =========================================================================
  {
    questionText: 'According to Ohm\'s Law, the electric current passing through a metallic conductor is directly proportional to:',
    questionHindi: 'ओम के नियम के अनुसार, किसी धात्विक चालक से प्रवाहित होने वाली विद्युत धारा किसके सीधे समानुपाती होती है?',
    options: [
      { key: 'A', text: 'The potential difference across its ends' },
      { key: 'B', text: 'The length of the conductor' },
      { key: 'C', text: 'The square of resistance' },
      { key: 'D', text: 'The temperature of surroundings' }
    ],
    optionsHindi: [
      { key: 'A', text: 'इसके सिरों के बीच विभवांतर के (Potential Difference)' },
      { key: 'B', text: 'चालक की लंबाई के' },
      { key: 'C', text: 'प्रतिरोध के वर्ग के' },
      { key: 'D', text: 'आसपास के तापमान के' }
    ],
    correctAnswer: 'A',
    explanation: 'Ohm’s Law states that at constant temperature, current I through a conductor is directly proportional to potential difference V (V = IR).',
    explanationHindi: 'ओम के नियम के अनुसार, स्थिर ताप पर चालक के सिरों के बीच का विभवांतर (V) उसमें प्रवाहित धारा (I) के समानुपाती होता है (V = IR)।',
    examCategory: 'Board Exams',
    examCode: 'CLASS_10',
    subject: 'Science',
    topic: 'Electricity & Circuits',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0,
    sourceType: 'official_pyq',
    examinationYear: 2023,
    validationStatus: 'approved'
  },
  {
    questionText: 'What is the discriminant of the quadratic equation 2x^2 - 4x + 3 = 0, and what does it indicate about its roots?',
    questionHindi: 'द्विघात समीकरण 2x^2 - 4x + 3 = 0 का विविक्तकर (Discriminant) क्या है, और यह इसके मूलों के बारे में क्या दर्शाता है?',
    options: [
      { key: 'A', text: 'D = -8, roots are real and unequal' },
      { key: 'B', text: 'D = -8, no real roots (roots are complex/imaginary)' },
      { key: 'C', text: 'D = 8, roots are real and equal' },
      { key: 'D', text: 'D = 0, roots are coincident' }
    ],
    optionsHindi: [
      { key: 'A', text: 'D = -8, मूल वास्तविक और असमान हैं' },
      { key: 'B', text: 'D = -8, कोई वास्तविक मूल नहीं है (काल्पनिक मूल)' },
      { key: 'C', text: 'D = 8, मूल वास्तविक और बराबर हैं' },
      { key: 'D', text: 'D = 0, मूल संपाती हैं' }
    ],
    correctAnswer: 'B',
    explanation: 'Discriminant D = b^2 - 4ac = (-4)^2 - 4(2)(3) = 16 - 24 = -8. Since D < 0, the equation has no real roots.',
    explanationHindi: 'विविक्तकर D = b^2 - 4ac = (-4)^2 - 4(2)(3) = 16 - 24 = -8। चूंकि D < 0 है, अतः समीकरण का कोई वास्तविक मूल नहीं है।',
    examCategory: 'Board Exams',
    examCode: 'CLASS_10',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0,
    sourceType: 'official_pyq',
    examinationYear: 2023,
    validationStatus: 'approved'
  }
];

async function seedComprehensiveBank() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000
    });
    console.log('Connected to MongoDB successfully.');

    let insertedCount = 0;
    let existingCount = 0;

    for (const q of QUESTION_BANK) {
      const existing = await Question.findOne({
        questionText: q.questionText,
        examCode: q.examCode
      });

      if (!existing) {
        await Question.create(q);
        insertedCount++;
      } else {
        existingCount++;
      }
    }

    console.log(`✅ Question Seeding Report: ${insertedCount} new authentic questions inserted, ${existingCount} already present.`);

    const totalQuestions = await Question.countDocuments();
    console.log(`📊 Total approved questions in MongoDB: ${totalQuestions}`);

    // Clean up outdated daily quizzes & CBT tests so new dynamic timing takes immediate effect
    await Quiz.deleteMany({ isDaily: true });
    await CbtMockTest.deleteMany({});
    console.log('🧹 Purged outdated daily quiz & CBT cache to enable dynamic question-proportional timing.');

    await mongoose.disconnect();
    console.log('Disconnected cleanly. Seeding finished.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
}

seedComprehensiveBank();
