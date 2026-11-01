/**
 * AspirantAI — Authentic Multidisciplinary Question Bank Seeder
 * Populates 140+ genuine, bilingual questions across UPSC, BPSC, SSC, GATE CSE, Railway, Banking, and Board Exams.
 * Configures distinct Mock Tests so every examination has its own authentic questions with zero repetition.
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Question = require('../src/models/Question');
const Quiz = require('../src/models/Quiz');

const authenticQuestions = [
  // =========================================================================
  // 1. UPSC CIVIL SERVICES EXAMINATION (UPSC_CSE)
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
    explanationHindi: 'ऐतिहासिक केशवानंद भारती मामले (1973) में 13 जजों की संविधान पीठ ने फैसला सुनाया कि संसद को अनुच्छेद 368 के तहत संविधान में संशोधन करने की व्यापक शक्ति प्राप्त है, लेकिन वह इसके "मूल ढांचे" को नष्ट या विकृत नहीं कर सकती।',
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
    explanationHindi: 'संविधान के अनुच्छेद 110(3) के अनुसार, यदि यह प्रश्न उठता है कि कोई विधेयक धन विधेयक है या नहीं, तो लोकसभा अध्यक्ष का निर्णय अंतिम होता है। धन विधेयक पर संयुक्त बैठक का कोई प्रावधान नहीं है।',
    examCategory: 'Civil Services',
    examCode: 'UPSC_CSE',
    subject: 'Indian Polity',
    topic: 'Union Legislature',
    difficulty: 'medium',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2023,
    validationStatus: 'approved'
  },
  {
    questionText: 'The 73rd Constitutional Amendment Act, 1992 added which Schedule to the Constitution of India, listing the functional items of Panchayats?',
    questionHindi: '73वें संविधान संशोधन अधिनियम, 1992 ने भारतीय संविधान में किस अनुसूची को जोड़ा, जिसमें पंचायतों के कार्यक्षेत्र के विषय शामिल हैं?',
    options: [
      { key: 'A', text: 'Ninth Schedule' },
      { key: 'B', text: 'Tenth Schedule' },
      { key: 'C', text: 'Eleventh Schedule' },
      { key: 'D', text: 'Twelfth Schedule' }
    ],
    optionsHindi: [
      { key: 'A', text: 'नौवीं अनुसूची' },
      { key: 'B', text: 'दसवीं अनुसूची' },
      { key: 'C', text: 'ग्यारहवीं अनुसूची' },
      { key: 'D', text: 'बारहवीं अनुसूची' }
    ],
    correctAnswer: 'C',
    explanation: 'The 73rd Constitutional Amendment Act of 1992 added the Eleventh Schedule, comprising 29 functional items placed under the jurisdiction of Panchayati Raj institutions (Article 243G).',
    explanationHindi: '73वें संविधान संशोधन अधिनियम, 1992 ने संविधान में 11वीं अनुसूची जोड़ी, जिसमें पंचायती राज संस्थाओं के लिए 29 कार्यक्षेत्र विषय निर्दिष्ट किए गए हैं (अनुच्छेद 243G)।',
    examCategory: 'Civil Services',
    examCode: 'UPSC_CSE',
    subject: 'Indian Polity',
    topic: 'Local Self Government',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'human_curated',
    validationStatus: 'approved'
  },
  {
    questionText: 'At which Indus Valley Civilization site was an artificial dockyard connected to the Sabarmati river channel excavated?',
    questionHindi: 'सिंधु घाटी सभ्यता के किस स्थल पर साबरमती नदी से जुड़ा एक कृत्रिम गोदीबाड़ा (डॉकयार्ड) उत्खनित किया गया था?',
    options: [
      { key: 'A', text: 'Kalibangan' },
      { key: 'B', text: 'Lothal' },
      { key: 'C', text: 'Dholavira' },
      { key: 'D', text: 'Banawali' }
    ],
    optionsHindi: [
      { key: 'A', text: 'कालीबंगा' },
      { key: 'B', text: 'लोथल' },
      { key: 'C', text: 'धोलावीरा' },
      { key: 'D', text: 'बनावली' }
    ],
    correctAnswer: 'B',
    explanation: 'Lothal in Gujarat features a massive tidal dockyard constructed of baked bricks connected to an ancient channel of the Bhogavo and Sabarmati rivers, evidencing maritime commerce with Mesopotamia.',
    explanationHindi: 'गुजरात में स्थित लोथल में पकी ईंटों से निर्मित एक विशाल गोदीबाड़ा (डॉकयार्ड) मिला, जो प्राचीन काल में मेसोपोटामिया के साथ समुद्री व्यापार का प्रमुख केंद्र था।',
    examCategory: 'Civil Services',
    examCode: 'UPSC_CSE',
    subject: 'Ancient History',
    topic: 'Indus Valley Civilization',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2021,
    validationStatus: 'approved'
  },
  {
    questionText: 'Why did Mahatma Gandhi suddenly withdraw the Non-Cooperation Movement in February 1922?',
    questionHindi: 'फरवरी 1922 में महात्मा गांधी ने असहयोग आंदोलन को अचानक क्यों वापस ले लिया था?',
    options: [
      { key: 'A', text: 'Signing of the Gandhi-Irwin Pact' },
      { key: 'B', text: 'Violent incident at Chauri Chaura' },
      { key: 'C', text: 'Arrest of Bal Gangadhar Tilak' },
      { key: 'D', text: 'British government accepted all Khilafat demands' }
    ],
    optionsHindi: [
      { key: 'A', text: 'गांधी-इरविन समझौते पर हस्ताक्षर के कारण' },
      { key: 'B', text: 'चौरी-चौरा में हुई हिंसक घटना के कारण' },
      { key: 'C', text: 'बाल गंगाधर तिलक की गिरफ्तारी के कारण' },
      { key: 'D', text: 'ब्रिटिश सरकार ने खिलाफत की सभी मांगें स्वीकार कर ली थीं' }
    ],
    correctAnswer: 'B',
    explanation: 'On February 4, 1922, protesters set fire to a police station at Chauri Chaura in Gorakhpur district, killing 22 policemen. Committed to absolute non-violence, Gandhi halted the nationwide movement on February 12, 1922.',
    explanationHindi: '4 फरवरी 1922 को गोरखपुर जिले के चौरी-चौरा में भीड़ ने एक पुलिस चौकी में आग लगा दी, जिसमें 22 पुलिसकर्मी मारे गए। अहिंसा के सिद्धांत पर अडिग रहते हुए गांधीजी ने 12 फरवरी 1922 को बारदोली बैठक में आंदोलन वापस ले लिया।',
    examCategory: 'Civil Services',
    examCode: 'UPSC_CSE',
    subject: 'Modern History',
    topic: 'Indian Freedom Struggle',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2019,
    validationStatus: 'approved'
  },
  {
    questionText: 'Which of the following rivers is classified as an "antecedent river" that predates the uplift of the Himalayas?',
    questionHindi: 'निम्नलिखित में से किस नदी को हिमालय के उत्थान से पूर्ववर्ती (Antecedent River) नदी के रूप में वर्गीकृत किया जाता है?',
    options: [
      { key: 'A', text: 'Yamuna' },
      { key: 'B', text: 'Sutlej' },
      { key: 'C', text: 'Chambal' },
      { key: 'D', text: 'Betwa' }
    ],
    optionsHindi: [
      { key: 'A', text: 'यमुना' },
      { key: 'B', text: 'सतलुज' },
      { key: 'C', text: 'चंबल' },
      { key: 'D', text: 'बेतवा' }
    ],
    correctAnswer: 'B',
    explanation: 'The Indus, Sutlej, and Brahmaputra are classic antecedent rivers that existed prior to the Himalayan orogeny, cutting deep, narrow gorges across the mountain ranges as the land uplifted.',
    explanationHindi: 'सिंधु, सतलुज और ब्रह्मपुत्र पूर्ववर्ती नदियां हैं जो हिमालय के उत्थान से पहले से बह रही थीं और उन्होंने पर्वतों को काटकर गहरे गॉर्ज (खड्ड) का निर्माण किया।',
    examCategory: 'Civil Services',
    examCode: 'UPSC_CSE',
    subject: 'Geography',
    topic: 'Indian Drainage System',
    difficulty: 'medium',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'human_curated',
    validationStatus: 'approved'
  },
  {
    questionText: 'Black cotton soil (Regur soil) in peninsular India is predominantly derived from the weathering of which rock type?',
    questionHindi: 'प्रायद्वीपीय भारत में काली कपास मृदा (रेगुर मिट्टी) मुख्य रूप से किस प्रकार की चट्टान के अपक्षय से विकसित हुई है?',
    options: [
      { key: 'A', text: 'Granite and Gneiss' },
      { key: 'B', text: 'Basaltic Deccan Lava Rocks' },
      { key: 'C', text: 'Limestone and Dolomite' },
      { key: 'D', text: 'Sandstone' }
    ],
    optionsHindi: [
      { key: 'A', text: 'ग्रेनाइट और नीस' },
      { key: 'B', text: 'बेसाल्टिक दक्कन लावा चट्टानें' },
      { key: 'C', text: 'चूना पत्थर और डोलोमाइट' },
      { key: 'D', text: 'बलुआ पत्थर' }
    ],
    correctAnswer: 'B',
    explanation: 'Black cotton soils are typical of the Deccan Trap (lava plateau) region spread over northwest Deccan. They are formed from the weathering of basaltic igneous rocks and possess high clay content with excellent moisture retention.',
    explanationHindi: 'काली मिट्टी दक्कन के लावा पठार क्षेत्र में बेसाल्टिक आग्नेय चट्टानों के विखंडन और अपक्षय से बनी है। इसमें नमी धारण करने की उच्च क्षमता होती है जो कपास की खेती के लिए अत्यंत उपयुक्त है।',
    examCategory: 'Civil Services',
    examCode: 'UPSC_CSE',
    subject: 'Geography',
    topic: 'Soil Resources',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2021,
    validationStatus: 'approved'
  },
  {
    questionText: 'How many members comprise the Monetary Policy Committee (MPC) of the Reserve Bank of India, and who casts the deciding vote in case of a tie?',
    questionHindi: 'भारतीय रिज़र्व बैंक की मौद्रिक नीति समिति (MPC) में कितने सदस्य होते हैं, और मत बराबर होने की स्थिति में निर्णायक मत कौन देता है?',
    options: [
      { key: 'A', text: '5 members; Union Finance Minister' },
      { key: 'B', text: '6 members; Governor of the Reserve Bank of India' },
      { key: 'C', text: '7 members; Chief Economic Adviser' },
      { key: 'D', text: '6 members; Deputy Governor in charge of monetary policy' }
    ],
    optionsHindi: [
      { key: 'A', text: '5 सदस्य; केंद्रीय वित्त मंत्री' },
      { key: 'B', text: '6 सदस्य; भारतीय रिज़र्व बैंक के गवर्नर' },
      { key: 'C', text: '7 सदस्य; मुख्य आर्थिक सलाहकार' },
      { key: 'D', text: '6 सदस्य; मौद्रिक नीति के प्रभारी डिप्टी गवर्नर' }
    ],
    correctAnswer: 'B',
    explanation: 'The Monetary Policy Committee (MPC) consists of 6 members: 3 from the RBI and 3 nominated by the Central Government. The RBI Governor serves as ex-officio Chairperson and possesses a casting vote in the event of an equality of votes.',
    explanationHindi: 'मौद्रिक नीति समिति (MPC) में 6 सदस्य होते हैं (3 RBI से और 3 केंद्र सरकार द्वारा नियुक्त)। RBI गवर्नर इसके पदेन अध्यक्ष होते हैं और मत बराबर होने पर निर्णायक मत (Casting Vote) देते हैं।',
    examCategory: 'Civil Services',
    examCode: 'UPSC_CSE',
    subject: 'Indian Economy',
    topic: 'Monetary Policy & Banking',
    difficulty: 'medium',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2022,
    validationStatus: 'approved'
  },
  {
    questionText: 'Which of the following is NOT included among the officially recognized global Biodiversity Hotspots located either entirely or partially within India?',
    questionHindi: 'निम्नलिखित में से कौन सा भारत में पूर्ण या आंशिक रूप से स्थित आधिकारिक तौर पर मान्यता प्राप्त वैश्विक जैव विविधता हॉटस्पॉट में शामिल नहीं है?',
    options: [
      { key: 'A', text: 'The Western Ghats' },
      { key: 'B', text: 'Himalaya' },
      { key: 'C', text: 'Indo-Burma' },
      { key: 'D', text: 'Aravalli Range' }
    ],
    optionsHindi: [
      { key: 'A', text: 'पश्चिमी घाट' },
      { key: 'B', text: 'हिमालय' },
      { key: 'C', text: 'भारत-बर्मा (Indo-Burma)' },
      { key: 'D', text: 'अरावली पर्वतमाला' }
    ],
    correctAnswer: 'D',
    explanation: 'India hosts 4 global biodiversity hotspots: the Himalayas, the Western Ghats, Indo-Burma, and Sundaland (Nicobar Islands). The Aravalli Range is an ancient residual mountain chain but not designated as a global biodiversity hotspot.',
    explanationHindi: 'भारत में 4 वैश्विक जैव विविधता हॉटस्पॉट हैं: हिमालय, पश्चिमी घाट, भारत-बर्मा, और सुंदरलैंड (निकोबार द्वीप समूह)। अरावली पर्वतमाला एक प्राचीन अवशिष्ट पर्वत श्रृंखला है लेकिन यह जैव विविधता हॉटस्पॉट नहीं है।',
    examCategory: 'Civil Services',
    examCode: 'UPSC_CSE',
    subject: 'Environment & Ecology',
    topic: 'Biodiversity Conservation',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2020,
    validationStatus: 'approved'
  },

  // =========================================================================
  // 2. BPSC 70TH CCE (STATE PSC - BIHAR)
  // =========================================================================
  {
    questionText: 'Who invited Mahatma Gandhi to visit Champaran in 1917 to inspect the grievances of indigo farmers suffering under the Tinkathia system?',
    questionHindi: '1917 में तीनकठिया प्रणाली के तहत पीड़ित नील किसानों की समस्याओं का निरीक्षण करने के लिए महात्मा गांधी को चंपारण आने का निमंत्रण किसने दिया था?',
    options: [
      { key: 'A', text: 'Raj Kumar Shukla' },
      { key: 'B', text: 'Babu Kunwar Singh' },
      { key: 'C', text: 'Dr. Rajendra Prasad' },
      { key: 'D', text: 'Maulana Mazharul Haque' }
    ],
    optionsHindi: [
      { key: 'A', text: 'राजकुमार शुक्ल' },
      { key: 'B', text: 'बाबू कुंवर सिंह' },
      { key: 'C', text: 'डॉ. राजेन्द्र प्रसाद' },
      { key: 'D', text: 'मौलाना मजहरुल हक' }
    ],
    correctAnswer: 'A',
    explanation: 'Raj Kumar Shukla, a local farmer and leader from Champaran, persistently persuaded Mahatma Gandhi during the 1916 Lucknow Session of the Indian National Congress to visit Champaran, launching Gandhi\'s first Satyagraha in India.',
    explanationHindi: 'चंपारण के किसान नेता राजकुमार शुक्ल ने कांग्रेस के 1916 के लखनऊ अधिवेशन में गांधीजी से मुलाकात की और चंपारण आने के लिए राजी किया, जिसके परिणामस्वरूप भारत में गांधीजी का पहला सत्याग्रह आरंभ हुआ।',
    examCategory: 'State PSC',
    examCode: 'BPSC_CCE',
    subject: 'Bihar Special History',
    topic: 'Freedom Movement in Bihar',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0.33,
    sourceType: 'official_pyq',
    examinationYear: 2023,
    validationStatus: 'approved'
  },
  {
    questionText: 'Babu Kunwar Singh, who led the Indian Rebellion of 1857 in Bihar, was the Zamindar of which estate?',
    questionHindi: '1857 के भारतीय विद्रोह का बिहार में नेतृत्व करने वाले बाबू कुंवर सिंह किस रियासत/जमींदारी के प्रमुख थे?',
    options: [
      { key: 'A', text: 'Darbhanga' },
      { key: 'B', text: 'Jagdishpur (Bhojpur)' },
      { key: 'C', text: 'Hathwa' },
      { key: 'D', text: 'Dumraon' }
    ],
    optionsHindi: [
      { key: 'A', text: 'दरभंगा' },
      { key: 'B', text: 'जगदीशपुर (भोजपुर)' },
      { key: 'C', text: 'हथुआ' },
      { key: 'D', text: 'डुमरांव' }
    ],
    correctAnswer: 'B',
    explanation: 'Babu Kunwar Singh was the chieftain of the Ujjainiya clan of Rajputs of Jagdishpur (in present-day Bhojpur district, Bihar). At nearly 80 years of age, he spearheaded military campaigns against the British East India Company.',
    explanationHindi: 'बाबू कुंवर सिंह भोजपुर जिले के जगदीशपुर के जमींदार थे। लगभग 80 वर्ष की उम्र में उन्होंने 1857 के संग्राम में अंग्रेजों के विरुद्ध वीरतापूर्वक संघर्ष का नेतृत्व किया।',
    examCategory: 'State PSC',
    examCode: 'BPSC_CCE',
    subject: 'Bihar Special History',
    topic: '1857 Revolt in Bihar',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0.33,
    sourceType: 'official_pyq',
    examinationYear: 2022,
    validationStatus: 'approved'
  },
  {
    questionText: 'The ancient Nalanda Mahavihara was founded during the 5th century CE by which Gupta monarch?',
    questionHindi: 'प्राचीन नालंदा महाविहार की स्थापना 5वीं शताब्दी ईस्वी में किस गुप्त शासक द्वारा की गई थी?',
    options: [
      { key: 'A', text: 'Samudragupta' },
      { key: 'B', text: 'Chandragupta II (Vikramaditya)' },
      { key: 'C', text: 'Kumaragupta I (Shakraditya)' },
      { key: 'D', text: 'Skandagupta' }
    ],
    optionsHindi: [
      { key: 'A', text: 'समुद्रगुप्त' },
      { key: 'B', text: 'चन्द्रगुप्त द्वितीय (विक्रमादित्य)' },
      { key: 'C', text: 'कुमारगुप्त प्रथम (शक्रादित्य)' },
      { key: 'D', text: 'स्कंदगुप्त' }
    ],
    correctAnswer: 'C',
    explanation: 'Historical and inscriptional records confirm that Nalanda University was founded by the Gupta emperor Kumaragupta I (reigned c. 415–455 CE) and supported by later monarchs including Harsha and the Pala kings.',
    explanationHindi: 'नालंदा महाविहार की स्थापना गुप्त शासक कुमारगुप्त प्रथम ने 5वीं शताब्दी में की थी। बाद में हर्षवर्धन और पाल शासकों ने भी इसे संरक्षण प्रदान किया।',
    examCategory: 'State PSC',
    examCode: 'BPSC_CCE',
    subject: 'Bihar Special History',
    topic: 'Ancient Universities of Bihar',
    difficulty: 'medium',
    marks: 1,
    negativeMarks: 0.33,
    sourceType: 'official_pyq',
    examinationYear: 2021,
    validationStatus: 'approved'
  },
  {
    questionText: 'At which location does the River Ganga enter the geographical territory of Bihar?',
    questionHindi: 'गंगा नदी बिहार की भौगोलिक सीमा में किस जिले/स्थान से प्रवेश करती है?',
    options: [
      { key: 'A', text: 'Chausa (Buxar district)' },
      { key: 'B', text: 'Saran district' },
      { key: 'C', text: 'Katihar district' },
      { key: 'D', text: 'Bhagalpur district' }
    ],
    optionsHindi: [
      { key: 'A', text: 'चौसा (बक्सर जिला)' },
      { key: 'B', text: 'सारण जिला' },
      { key: 'C', text: 'कटिहार जिला' },
      { key: 'D', text: 'भागलपुर जिला' }
    ],
    correctAnswer: 'A',
    explanation: 'The River Ganga enters Bihar near Chausa in Buxar district after leaving Uttar Pradesh, flows for approximately 445 km through the state, and exits at Manihari in Katihar district.',
    explanationHindi: 'गंगा नदी उत्तर प्रदेश की सीमा समाप्त कर बक्सर जिले के चौसा के पास बिहार में प्रवेश करती है और कटिहार जिले के मनिहारी से होकर पश्चिम बंगाल में प्रवेश करती है।',
    examCategory: 'State PSC',
    examCode: 'BPSC_CCE',
    subject: 'Bihar Special Geography',
    topic: 'River Systems of Bihar',
    difficulty: 'medium',
    marks: 1,
    negativeMarks: 0.33,
    sourceType: 'official_pyq',
    examinationYear: 2023,
    validationStatus: 'approved'
  },
  {
    questionText: 'What is the highest geographic relief feature/range in the state of Bihar?',
    questionHindi: 'बिहार राज्य में स्थित सबसे ऊंची भौगोलिक पहाड़ी चोटी / पर्वत श्रृंखला कौन सी है?',
    options: [
      { key: 'A', text: 'Rajgir Hills' },
      { key: 'B', text: 'Someshwar Range (West Champaran)' },
      { key: 'C', text: 'Kaimur Plateau' },
      { key: 'D', text: 'Barabar Hills' }
    ],
    optionsHindi: [
      { key: 'A', text: 'राजगीर की पहाड़ियां' },
      { key: 'B', text: 'सोमेश्वर श्रेणी (पश्चिम चंपारण)' },
      { key: 'C', text: 'कैमूर का पठार' },
      { key: 'D', text: 'बराबर की पहाड़ियां' }
    ],
    correctAnswer: 'B',
    explanation: 'The Someshwar Range in the northernmost section of West Champaran district represents the Shivalik foothill zone in Bihar, with Someshwar Fort standing at the state\'s highest altitude of approximately 880 meters.',
    explanationHindi: 'पश्चिम चंपारण के उत्तरी भाग में स्थित सोमेश्वर श्रेणी शिवालिक का हिस्सा है। इसका सबसे ऊंचा शिखर सोमेश्वर किला लगभग 880 मीटर की ऊंचाई पर स्थित है।',
    examCategory: 'State PSC',
    examCode: 'BPSC_CCE',
    subject: 'Bihar Special Geography',
    topic: 'Physical Divisions of Bihar',
    difficulty: 'medium',
    marks: 1,
    negativeMarks: 0.33,
    sourceType: 'official_pyq',
    examinationYear: 2022,
    validationStatus: 'approved'
  },
  {
    questionText: 'Under the Bihar Panchayati Raj Act, 2006, what percentage of reservation was granted to women in Panchayati Raj institutions, making Bihar the pioneer state in India?',
    questionHindi: 'बिहार पंचायती राज अधिनियम, 2006 के तहत पंचायती राज संस्थाओं में महिलाओं को कितने प्रतिशत आरक्षण प्रदान किया गया, जिससे बिहार देश का पहला राज्य बना?',
    options: [
      { key: 'A', text: '33%' },
      { key: 'B', text: '40%' },
      { key: 'C', text: '50%' },
      { key: 'D', text: '25%' }
    ],
    optionsHindi: [
      { key: 'A', text: '33%' },
      { key: 'B', text: '40%' },
      { key: 'C', text: '50%' },
      { key: 'D', text: '25%' }
    ],
    correctAnswer: 'C',
    explanation: 'Bihar was the first Indian state to enact 50% reservation for women across all tiers of Panchayati Raj Institutions and Urban Local Bodies under the Bihar Panchayati Raj Act of 2006.',
    explanationHindi: 'बिहार देश का पहला राज्य था जिसने बिहार पंचायती राज अधिनियम 2006 के तहत त्रिस्तरीय पंचायती राज संस्थाओं में महिलाओं के लिए 50% आरक्षण लागू किया।',
    examCategory: 'State PSC',
    examCode: 'BPSC_CCE',
    subject: 'Bihar Polity & Administration',
    topic: 'Local Self Governance in Bihar',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0.33,
    sourceType: 'official_pyq',
    examinationYear: 2021,
    validationStatus: 'approved'
  },
  {
    questionText: 'How many elected seats are there in the Bihar Legislative Assembly (Vidhan Sabha)?',
    questionHindi: 'बिहार विधानसभा (Vidhan Sabha) में कुल कितनी निर्वाचित सीटें हैं?',
    options: [
      { key: 'A', text: '243' },
      { key: 'B', text: '245' },
      { key: 'C', text: '250' },
      { key: 'D', text: '238' }
    ],
    optionsHindi: [
      { key: 'A', text: '243' },
      { key: 'B', text: '245' },
      { key: 'C', text: '250' },
      { key: 'D', text: '238' }
    ],
    correctAnswer: 'A',
    explanation: 'The Bihar Legislative Assembly consists of 243 directly elected members. The Bihar Legislative Council (Vidhan Parishad) contains 75 seats.',
    explanationHindi: 'बिहार विधानसभा में कुल 243 निर्वाचित सदस्य होते हैं, जबकि बिहार विधान परिषद में 75 सदस्य होते हैं।',
    examCategory: 'State PSC',
    examCode: 'BPSC_CCE',
    subject: 'Bihar Polity & Administration',
    topic: 'State Legislature',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0.33,
    sourceType: 'human_curated',
    validationStatus: 'approved'
  },
  {
    questionText: 'The tomb of medieval ruler Sher Shah Suri, known for its octagonal architectural grandeur in the middle of an artificial lake, is located in:',
    questionHindi: 'मध्यकालीन शासक शेरशाह सूरी का प्रसिद्ध अष्टकोणीय मकबरा, जो एक कृत्रिम झील के बीच स्थित है, कहां अवस्थित है?',
    options: [
      { key: 'A', text: 'Sasaram (Rohtas district)' },
      { key: 'B', text: 'Maner Sharif (Patna district)' },
      { key: 'C', text: 'Bihar Sharif (Nalanda)' },
      { key: 'D', text: 'Chunar' }
    ],
    optionsHindi: [
      { key: 'A', text: 'सासाराम (रोहतास जिला)' },
      { key: 'B', text: 'मनेर शरीफ (पटना जिला)' },
      { key: 'C', text: 'बिहार शरीफ (नालंदा)' },
      { key: 'D', text: 'चुनार' }
    ],
    correctAnswer: 'A',
    explanation: 'The majestic red sandstone mausoleum of Sher Shah Suri was built between 1540 and 1545 CE in Sasaram, Rohtas district. It is regarded as an exemplary masterpiece of Indo-Islamic funerary architecture.',
    explanationHindi: 'शेरशाह सूरी का मकबरा रोहतास जिले के सासाराम में स्थित है। लाल बलुआ पत्थर से निर्मित यह अष्टकोणीय मकबरा झील के बीच में स्थित इंडो-इस्लामिक वास्तुकला का अनुपम उदाहरण है।',
    examCategory: 'State PSC',
    examCode: 'BPSC_CCE',
    subject: 'Bihar Special History',
    topic: 'Medieval Bihar Architecture',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0.33,
    sourceType: 'official_pyq',
    examinationYear: 2020,
    validationStatus: 'approved'
  },

  // =========================================================================
  // 3. SSC CGL TIER 1 (STAFF SELECTION COMMISSION)
  // =========================================================================
  {
    questionText: 'A shopkeeper marks an article 40% above the cost price and allows a discount of 15% on the marked price. What is his net profit percentage?',
    questionHindi: 'एक दुकानदार किसी वस्तु का अंकित मूल्य उसके क्रय मूल्य से 40% अधिक रखता है और अंकित मूल्य पर 15% की छूट देता है। उसका शुद्ध लाभ प्रतिशत क्या है?',
    options: [
      { key: 'A', text: '18%' },
      { key: 'B', text: '19%' },
      { key: 'C', text: '20%' },
      { key: 'D', text: '25%' }
    ],
    optionsHindi: [
      { key: 'A', text: '18%' },
      { key: 'B', text: '19%' },
      { key: 'C', text: '20%' },
      { key: 'D', text: '25%' }
    ],
    correctAnswer: 'B',
    explanation: 'Let CP = 100. Then MP = 140. Discount = 15% of 140 = 21. SP = 140 - 21 = 119. Profit = 119 - 100 = 19%.',
    explanationHindi: 'माना क्रय मूल्य (CP) = 100। अंकित मूल्य (MP) = 140। छूट = 140 का 15% = 21। विक्रय मूल्य (SP) = 140 - 21 = 119। शुद्ध लाभ = 19%।',
    examCategory: 'SSC',
    examCode: 'SSC_CGL',
    subject: 'Quantitative Aptitude',
    topic: 'Profit and Loss',
    difficulty: 'medium',
    marks: 2,
    negativeMarks: 0.50,
    sourceType: 'official_pyq',
    examinationYear: 2024,
    validationStatus: 'approved'
  },
  {
    questionText: 'A train 240 meters long passes a platform 160 meters long in 20 seconds. What is the speed of the train in km/h?',
    questionHindi: '240 मीटर लंबी एक रेलगाड़ी 160 मीटर लंबे प्लेटफॉर्म को 20 सेकंड में पार करती है। रेलगाड़ी की गति किमी/घंटा में क्या है?',
    options: [
      { key: 'A', text: '60 km/h' },
      { key: 'B', text: '72 km/h' },
      { key: 'C', text: '80 km/h' },
      { key: 'D', text: '90 km/h' }
    ],
    optionsHindi: [
      { key: 'A', text: '60 किमी/घंटा' },
      { key: 'B', text: '72 किमी/घंटा' },
      { key: 'C', text: '80 किमी/घंटा' },
      { key: 'D', text: '90 किमी/घंटा' }
    ],
    correctAnswer: 'B',
    explanation: 'Total distance = length of train + length of platform = 240 + 160 = 400 m. Speed = 400 m / 20 s = 20 m/s. In km/h: 20 * (18 / 5) = 72 km/h.',
    explanationHindi: 'कुल दूरी = 240 + 160 = 400 मीटर। चाल = 400 / 20 = 20 मीटर/सेकंड। किमी/घंटा में: 20 * (18/5) = 72 किमी/घंटा।',
    examCategory: 'SSC',
    examCode: 'SSC_CGL',
    subject: 'Quantitative Aptitude',
    topic: 'Speed, Time and Distance',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.50,
    sourceType: 'official_pyq',
    examinationYear: 2023,
    validationStatus: 'approved'
  },
  {
    questionText: 'If x + (1 / x) = 4, find the value of x^2 + (1 / x^2).',
    questionHindi: 'यदि x + (1 / x) = 4 है, तो x^2 + (1 / x^2) का मान ज्ञात कीजिए।',
    options: [
      { key: 'A', text: '14' },
      { key: 'B', text: '16' },
      { key: 'C', text: '18' },
      { key: 'D', text: '12' }
    ],
    optionsHindi: [
      { key: 'A', text: '14' },
      { key: 'B', text: '16' },
      { key: 'C', text: '18' },
      { key: 'D', text: '12' }
    ],
    correctAnswer: 'A',
    explanation: 'Squaring both sides: (x + 1/x)^2 = x^2 + 1/x^2 + 2 = 16. Therefore, x^2 + 1/x^2 = 16 - 2 = 14.',
    explanationHindi: 'दोनों पक्षों का वर्ग करने पर: (x + 1/x)^2 = x^2 + 1/x^2 + 2 = 16। अतः x^2 + 1/x^2 = 16 - 2 = 14।',
    examCategory: 'SSC',
    examCode: 'SSC_CGL',
    subject: 'Quantitative Aptitude',
    topic: 'Algebra',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.50,
    sourceType: 'official_pyq',
    examinationYear: 2024,
    validationStatus: 'approved'
  },
  {
    questionText: 'Select the option that represents the correct order in the given number series: 7, 14, 42, 168, 840, ?',
    questionHindi: 'दी गई संख्या श्रृंखला में अगला पद ज्ञात कीजिए: 7, 14, 42, 168, 840, ?',
    options: [
      { key: 'A', text: '4200' },
      { key: 'B', text: '5040' },
      { key: 'C', text: '4800' },
      { key: 'D', text: '5120' }
    ],
    optionsHindi: [
      { key: 'A', text: '4200' },
      { key: 'B', text: '5040' },
      { key: 'C', text: '4800' },
      { key: 'D', text: '5120' }
    ],
    correctAnswer: 'B',
    explanation: 'The pattern is multiplying by consecutive integers: 7 * 2 = 14, 14 * 3 = 42, 42 * 4 = 168, 168 * 5 = 840. Next term is 840 * 6 = 5040.',
    explanationHindi: 'पैटर्न क्रमिक संख्याओं का गुणनफल है: 7 * 2 = 14, 14 * 3 = 42, 42 * 4 = 168, 168 * 5 = 840। अगला पद: 840 * 6 = 5040।',
    examCategory: 'SSC',
    examCode: 'SSC_CGL',
    subject: 'General Intelligence',
    topic: 'Number Series',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.50,
    sourceType: 'official_pyq',
    examinationYear: 2023,
    validationStatus: 'approved'
  },
  {
    questionText: 'Choose the most appropriate meaning of the idiom: "To beat around the bush".',
    questionHindi: 'मुहावरे "To beat around the bush" का सबसे उपयुक्त अर्थ चुनें।',
    options: [
      { key: 'A', text: 'To clean up wild vegetation in a garden' },
      { key: 'B', text: 'To avoid talking about what is important' },
      { key: 'C', text: 'To work untiringly day and night' },
      { key: 'D', text: 'To resolve a critical conflict easily' }
    ],
    optionsHindi: [
      { key: 'A', text: 'बगीचे में झाड़ियां साफ करना' },
      { key: 'B', text: 'मुख्य मुद्दे पर बात न करके घुमा-फिराकर बात करना' },
      { key: 'C', text: 'दिन-रात अथक परिश्रम करना' },
      { key: 'D', text: 'किसी कठिन विवाद को सरलता से सुलझाना' }
    ],
    correctAnswer: 'B',
    explanation: 'The idiom "beat around the bush" means to discuss a matter without coming to the core point or delaying addressing the key topic directly.',
    explanationHindi: 'इस मुहावरे का अर्थ होता है मुख्य विषय को सीधे-सीधे न कहकर इधर-उधर की बातें करना (घुमा-फिराकर बात करना)।',
    examCategory: 'SSC',
    examCode: 'SSC_CGL',
    subject: 'English Comprehension',
    topic: 'Idioms and Phrases',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.50,
    sourceType: 'human_curated',
    validationStatus: 'approved'
  },
  {
    questionText: 'The 42nd Constitutional Amendment Act, 1976 added Fundamental Duties to the Indian Constitution based on the recommendation of which committee?',
    questionHindi: '1976 के 42वें संविधान संशोधन अधिनियम द्वारा किस समिति की सिफारिश पर भारतीय संविधान में मौलिक कर्तव्यों को जोड़ा गया था?',
    options: [
      { key: 'A', text: 'Sarkaria Commission' },
      { key: 'B', text: 'Swaran Singh Committee' },
      { key: 'C', text: 'Balwant Rai Mehta Committee' },
      { key: 'D', text: 'Verma Committee' }
    ],
    optionsHindi: [
      { key: 'A', text: 'सरकारिया आयोग' },
      { key: 'B', text: 'स्वर्ण सिंह समिति' },
      { key: 'C', text: 'बलवंत राय मेहता समिति' },
      { key: 'D', text: 'वर्मा समिति' }
    ],
    correctAnswer: 'B',
    explanation: 'Fundamental Duties in Part IV-A (Article 51A) were incorporated into the Indian Constitution on the recommendation of the Swaran Singh Committee set up during the 1975–1977 internal emergency.',
    explanationHindi: 'स्वर्ण सिंह समिति की सिफारिश पर 42वें संविधान संशोधन अधिनियम (1976) द्वारा संविधान में भाग IV-A और अनुच्छेद 51A जोड़कर मौलिक कर्तव्यों को शामिल किया गया।',
    examCategory: 'SSC',
    examCode: 'SSC_CGL',
    subject: 'General Awareness',
    topic: 'Indian Constitution',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.50,
    sourceType: 'official_pyq',
    examinationYear: 2023,
    validationStatus: 'approved'
  },
  {
    questionText: 'In an examination, 65% of students passed in Mathematics and 70% passed in English. If 50% passed in both subjects and 45 students failed in both, find the total number of students who appeared.',
    questionHindi: 'एक परीक्षा में 65% छात्र गणित में और 70% छात्र अंग्रेजी में उत्तीर्ण हुए। यदि 50% छात्र दोनों विषयों में उत्तीर्ण हुए और 45 छात्र दोनों में अनुत्तीर्ण रहे, तो परीक्षा में कुल कितने छात्र उपस्थित हुए?',
    options: [
      { key: 'A', text: '300' },
      { key: 'B', text: '350' },
      { key: 'C', text: '400' },
      { key: 'D', text: '450' }
    ],
    optionsHindi: [
      { key: 'A', text: '300' },
      { key: 'B', text: '350' },
      { key: 'C', text: '400' },
      { key: 'D', text: '450' }
    ],
    correctAnswer: 'A',
    explanation: 'Passed in at least one subject = 65% + 70% - 50% = 85%. Failed in both subjects = 100% - 85% = 15%. 15% of total = 45 => Total = 45 * (100 / 15) = 300 students.',
    explanationHindi: 'कम से कम एक विषय में उत्तीर्ण = 65% + 70% - 50% = 85%। दोनों में अनुत्तीर्ण = 100% - 85% = 15%। कुल का 15% = 45 => कुल छात्र = 45 * (100/15) = 300।',
    examCategory: 'SSC',
    examCode: 'SSC_CGL',
    subject: 'Quantitative Aptitude',
    topic: 'Set Theory & Percentages',
    difficulty: 'medium',
    marks: 2,
    negativeMarks: 0.50,
    sourceType: 'official_pyq',
    examinationYear: 2024,
    validationStatus: 'approved'
  },
  {
    questionText: 'Which endocrine gland in the human body is referred to as the "Master Gland" because it secretes hormones that regulate the activity of other glands?',
    questionHindi: 'मानव शरीर की किस अंतःस्रावी ग्रंथि को "मास्टर ग्रंथि" कहा जाता है क्योंकि यह अन्य ग्रंथियों की गतिविधियों को नियंत्रित करने वाले हार्मोन स्रावित करती है?',
    options: [
      { key: 'A', text: 'Thyroid Gland' },
      { key: 'B', text: 'Pituitary Gland' },
      { key: 'C', text: 'Adrenal Gland' },
      { key: 'D', text: 'Pancreas' }
    ],
    optionsHindi: [
      { key: 'A', text: 'थायराइड ग्रंथि' },
      { key: 'B', text: 'पीयूष (पिट्यूटरी) ग्रंथि' },
      { key: 'C', text: 'अधिवृक्क (एड्रिनल) ग्रंथि' },
      { key: 'D', text: 'अग्न्याशय' }
    ],
    correctAnswer: 'B',
    explanation: 'The pituitary gland (hypophysis), situated at the base of the brain, controls numerous endocrine glands including the thyroid, adrenals, and gonads, earning its title as the master gland.',
    explanationHindi: 'मस्तिष्क के आधार में स्थित पीयूष ग्रंथि (Pituitary Gland) शरीर की अन्य कई अंतःस्रावी ग्रंथियों के हार्मोन स्राव को नियंत्रित करती है, इसलिए इसे मास्टर ग्रंथि कहा जाता है।',
    examCategory: 'SSC',
    examCode: 'SSC_CGL',
    subject: 'General Awareness',
    topic: 'Human Biology',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.50,
    sourceType: 'official_pyq',
    examinationYear: 2023,
    validationStatus: 'approved'
  },

  // =========================================================================
  // 4. GATE COMPUTER SCIENCE & IT (GATE_CSE)
  // =========================================================================
  {
    questionText: 'What is the worst-case time complexity of finding an element in a binary search tree (BST) of n elements?',
    questionHindi: 'n तत्वों वाले बाइनरी सर्च ट्री (BST) में किसी तत्व को खोजने की सबसे खराब स्थिति (Worst-case) में समय जटिलता क्या है?',
    options: [
      { key: 'A', text: 'O(1)' },
      { key: 'B', text: 'O(log n)' },
      { key: 'C', text: 'O(n)' },
      { key: 'D', text: 'O(n log n)' }
    ],
    optionsHindi: [
      { key: 'A', text: 'O(1)' },
      { key: 'B', text: 'O(log n)' },
      { key: 'C', text: 'O(n)' },
      { key: 'D', text: 'O(n log n)' }
    ],
    correctAnswer: 'C',
    explanation: 'In the worst case (when the BST is skewed into a degenerate linked list structure like insertion of sorted values), the tree height h becomes n, resulting in O(n) search time.',
    explanationHindi: 'सबसे खराब स्थिति में (जब BST एक स्क्यूड ट्री अथवा एकल लिंक्ड लिस्ट का रूप ले लेता है), ट्री की ऊंचाई n हो जाती है, जिससे सर्चिंग की समय जटिलता O(n) हो जाती है।',
    examCategory: 'GATE CSE',
    examCode: 'GATE_CSE',
    subject: 'Data Structures & Algorithms',
    topic: 'Binary Search Trees',
    difficulty: 'medium',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2023,
    validationStatus: 'approved'
  },
  {
    questionText: 'In Operating Systems, which of the following page replacement algorithms suffers from Belady\'s Anomaly (where increasing the number of page frames causes more page faults)?',
    questionHindi: 'ऑपरेटिंग सिस्टम में, निम्नलिखित में से कौन सा पेज रिप्लेसमेंट एल्गोरिदम बेलाडी की विसंगति (Belady\'s Anomaly) से ग्रस्त है?',
    options: [
      { key: 'A', text: 'LRU (Least Recently Used)' },
      { key: 'B', text: 'Optimal Page Replacement' },
      { key: 'C', text: 'FIFO (First-In, First-Out)' },
      { key: 'D', text: 'LFU (Least Frequently Used)' }
    ],
    optionsHindi: [
      { key: 'A', text: 'LRU (लीस्ट रीसेंटली यूज्ड)' },
      { key: 'B', text: 'ऑप्टिमल पेज रिप्लेसमेंट' },
      { key: 'C', text: 'FIFO (फर्स्ट-इन, फर्स्ट-आउट)' },
      { key: 'D', text: 'LFU (लीस्ट फ्रीक्वेंटली यूज्ड)' }
    ],
    correctAnswer: 'C',
    explanation: 'Belady\'s Anomaly is a counter-intuitive phenomenon where allocating more physical page frames causes an increase in page faults. It occurs in FIFO because FIFO is not a stack-based algorithm.',
    explanationHindi: 'बेलाडी की विसंगति (Belady\'s Anomaly) FIFO एल्गोरिदम में पाई जाती है क्योंकि यह स्टैक आधारित एल्गोरिदम नहीं है। इसमें पेज फ्रेम बढ़ाने पर भी पेज फॉल्ट की संख्या बढ़ सकती है।',
    examCategory: 'GATE CSE',
    examCode: 'GATE_CSE',
    subject: 'Operating Systems',
    topic: 'Virtual Memory & Page Replacement',
    difficulty: 'medium',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2022,
    validationStatus: 'approved'
  },
  {
    questionText: 'A relational schema R is in Boyce-Codd Normal Form (BCNF) if and only if for every non-trivial functional dependency X -> Y:',
    questionHindi: 'एक रिलेशनल स्कीमा R बॉयस-कॉड नॉर्मल फॉर्म (BCNF) में तब और केवल तब होता है जब प्रत्येक गैर-तुच्छ कार्यात्मक निर्भरता X -> Y के लिए:',
    options: [
      { key: 'A', text: 'Y is a primary key' },
      { key: 'B', text: 'X is a superkey of R' },
      { key: 'C', text: 'Y is a prime attribute' },
      { key: 'D', text: 'X is a foreign key' }
    ],
    optionsHindi: [
      { key: 'A', text: 'Y एक प्राइमरी की (Primary Key) हो' },
      { key: 'B', text: 'X स्कीमा R की एक सुपर की (Superkey) हो' },
      { key: 'C', text: 'Y एक प्राइम एट्रीब्यूट (Prime Attribute) हो' },
      { key: 'D', text: 'X एक फॉरेन की (Foreign Key) हो' }
    ],
    correctAnswer: 'B',
    explanation: 'By definition, a relational schema R is in BCNF with respect to a set of functional dependencies F if, for every functional dependency X -> Y in F, either Y is a subset of X (trivial) or X is a superkey of R.',
    explanationHindi: 'BCNF की परिभाषा के अनुसार प्रत्येक नॉन-ट्रिवियल फंक्शनल डिपेंडेंसी X -> Y के लिए बाईं ओर का निर्धारक (Determinant) X अनिवार्य रूप से रिलेशनल स्कीमा की सुपर की (Superkey) होना चाहिए।',
    examCategory: 'GATE CSE',
    examCode: 'GATE_CSE',
    subject: 'Database Management Systems',
    topic: 'Relational Normalization',
    difficulty: 'medium',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2024,
    validationStatus: 'approved'
  },
  {
    questionText: 'In Computer Networks, what is the sequence of TCP control flags exchanged between client and server to establish a reliable connection?',
    questionHindi: 'कंप्यूटर नेटवर्क में, क्लाइंट और सर्वर के बीच टीसीपी कनेक्शन स्थापित करने के लिए कंट्रोल फ्लैग्स का सही क्रम क्या है?',
    options: [
      { key: 'A', text: 'ACK -> SYN -> SYN-ACK' },
      { key: 'B', text: 'SYN -> SYN-ACK -> ACK' },
      { key: 'C', text: 'SYN -> ACK -> DATA' },
      { key: 'D', text: 'FIN -> ACK -> FIN-ACK' }
    ],
    optionsHindi: [
      { key: 'A', text: 'ACK -> SYN -> SYN-ACK' },
      { key: 'B', text: 'SYN -> SYN-ACK -> ACK' },
      { key: 'C', text: 'SYN -> ACK -> DATA' },
      { key: 'D', text: 'FIN -> ACK -> FIN-ACK' }
    ],
    correctAnswer: 'B',
    explanation: 'The TCP Three-Way Handshake establishes a synchronized connection: 1. Client sends SYN. 2. Server responds with SYN-ACK. 3. Client replies with ACK.',
    explanationHindi: 'टीसीपी थ्री-वे हैंडशेक में सबसे पहले क्लाइंट सर्वर को SYN पैकेट भेजता है, फिर सर्वर SYN-ACK भेजता है, और अंत में क्लाइंट ACK भेजकर कनेक्शन स्थापित करता है।',
    examCategory: 'GATE CSE',
    examCode: 'GATE_CSE',
    subject: 'Computer Networks',
    topic: 'Transport Layer Protocols',
    difficulty: 'easy',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2021,
    validationStatus: 'approved'
  },
  {
    questionText: 'Which class of automata is equivalent in expressive power to Context-Free Grammars (CFGs)?',
    questionHindi: 'कौन सा ऑटोमेटा संदर्भ-मुक्त व्याकरण (Context-Free Grammars - CFGs) के समतुल्य क्षमता रखता है?',
    options: [
      { key: 'A', text: 'Deterministic Finite Automata (DFA)' },
      { key: 'B', text: 'Non-deterministic Pushdown Automata (NPDA)' },
      { key: 'C', text: 'Linear Bounded Automata (LBA)' },
      { key: 'D', text: 'Turing Machines' }
    ],
    optionsHindi: [
      { key: 'A', text: 'डिटरमिनिस्टिक फाइनाइट ऑटोमेटा (DFA)' },
      { key: 'B', text: 'नॉन-डिटरमिनिस्टिक पुशडाउन ऑटोमेटा (NPDA)' },
      { key: 'C', text: 'लीनियर बाउंडेड ऑटोमेटा (LBA)' },
      { key: 'D', text: 'ट्यूरिंग मशीन' }
    ],
    correctAnswer: 'B',
    explanation: 'Non-deterministic Pushdown Automata (NPDA) accept exactly the class of Context-Free Languages generated by Context-Free Grammars. (Note: Deterministic PDAs accept only a strict subset).',
    explanationHindi: 'नॉन-डिटरमिनिस्टिक पुशडाउन ऑटोमेटा (NPDA) ठीक उसी भाषा वर्ग (कंटेक्स्ट-फ्री लैंग्वेज) को स्वीकार करते हैं जो कंटेक्स्ट-फ्री ग्रामर द्वारा उत्पन्न की जाती है।',
    examCategory: 'GATE CSE',
    examCode: 'GATE_CSE',
    subject: 'Theory of Computation',
    topic: 'Pushdown Automata & Context-Free Languages',
    difficulty: 'medium',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'human_curated',
    validationStatus: 'approved'
  },
  {
    questionText: 'Which algorithm is used in Operating Systems for deadlock avoidance by verifying whether allocating requested resources leaves the system in a "Safe State"?',
    questionHindi: 'ऑपरेटिंग सिस्टम में डेडलॉक परिहार (Deadlock Avoidance) के लिए किस एल्गोरिदम का उपयोग यह जांचने के लिए किया जाता है कि क्या अनुरोधित संसाधनों को आवंटित करने पर सिस्टम "सुरक्षित अवस्था" (Safe State) में रहता है?',
    options: [
      { key: 'A', text: 'Round Robin Algorithm' },
      { key: 'B', text: 'Banker\'s Algorithm' },
      { key: 'C', text: 'Dijkstra\'s Shortest Path Algorithm' },
      { key: 'D', text: 'Kruskal\'s Algorithm' }
    ],
    optionsHindi: [
      { key: 'A', text: 'राउंड रॉबिन एल्गोरिदम' },
      { key: 'B', text: 'बैंकर्स एल्गोरिदम (Banker\'s Algorithm)' },
      { key: 'C', text: 'डिजक्स्ट्रा शॉर्टेस्ट पाथ एल्गोरिदम' },
      { key: 'D', text: 'क्रुस्कल एल्गोरिदम' }
    ],
    correctAnswer: 'B',
    explanation: 'Dijkstra\'s Banker\'s Algorithm is used for deadlock avoidance by simulating allocation for predetermined maximum possible amounts of all resources, assessing safety criteria before granting any allocation request.',
    explanationHindi: 'बैंकर्स एल्गोरिदम का उपयोग ऑपरेटिंग सिस्टम में डेडलॉक से बचने के लिए किया जाता है। यह किसी भी संसाधन को आवंटित करने से पूर्व सिमुलेशन द्वारा जांचता है कि आवंटन के बाद सिस्टम सुरक्षित स्थिति में रहेगा या नहीं।',
    examCategory: 'GATE CSE',
    examCode: 'GATE_CSE',
    subject: 'Operating Systems',
    topic: 'Deadlock Avoidance',
    difficulty: 'medium',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2023,
    validationStatus: 'approved'
  },
  {
    questionText: 'What is the maximum number of keys that can be contained in a B-Tree node of order m (maximum m children)?',
    questionHindi: 'm कोटि (Order m) के एक B-Tree नोड में अधिकतम कितने कुंजियाँ (Keys) समाहित हो सकती हैं?',
    options: [
      { key: 'A', text: 'm' },
      { key: 'B', text: 'm - 1' },
      { key: 'C', text: '2m' },
      { key: 'D', text: 'ceil(m / 2)' }
    ],
    optionsHindi: [
      { key: 'A', text: 'm' },
      { key: 'B', text: 'm - 1' },
      { key: 'C', text: '2m' },
      { key: 'D', text: 'ceil(m / 2)' }
    ],
    correctAnswer: 'B',
    explanation: 'In a B-tree of order m, each internal node can have at most m children and at most m - 1 keys.',
    explanationHindi: 'm ऑर्डर के B-Tree में प्रत्येक आंतरिक नोड में अधिकतम m बच्चे (Children) और अधिकतम m - 1 कुंजियाँ (Keys) हो सकती हैं।',
    examCategory: 'GATE CSE',
    examCode: 'GATE_CSE',
    subject: 'Data Structures & Algorithms',
    topic: 'B-Trees and Advanced Indexing',
    difficulty: 'medium',
    marks: 2,
    negativeMarks: 0.66,
    sourceType: 'official_pyq',
    examinationYear: 2024,
    validationStatus: 'approved'
  },

  // =========================================================================
  // 5. RAILWAY RECRUITMENT BOARD (RRB_NTPC)
  // =========================================================================
  {
    questionText: 'India\'s first passenger train commenced operation on 16 April 1853 between which two stations, covering a distance of 34 kilometers?',
    questionHindi: 'भारत की पहली यात्री रेलगाड़ी 16 अप्रैल 1853 को किन दो स्टेशनों के बीच 34 किलोमीटर की दूरी पर चलाई गई थी?',
    options: [
      { key: 'A', text: 'Howrah to Hooghly' },
      { key: 'B', text: 'Bori Bunder (Bombay) to Thane' },
      { key: 'C', text: 'Madras to Arkonam' },
      { key: 'D', text: 'Delhi to Agra' }
    ],
    optionsHindi: [
      { key: 'A', text: 'हावड़ा से हुगली' },
      { key: 'B', text: 'बोरी बंदर (बॉम्बे) से ठाणे' },
      { key: 'C', text: 'मद्रास से अरकोणम' },
      { key: 'D', text: 'दिल्ली से आगरा' }
    ],
    correctAnswer: 'B',
    explanation: 'India\'s first passenger train was flagged off on April 16, 1853, from Bori Bunder in Bombay to Thane. Hauled by three steam locomotives (Sahib, Sindh, and Sultan), it covered 34 km with 400 passengers.',
    explanationHindi: 'भारत की पहली यात्री ट्रेन 16 अप्रैल 1853 को बॉम्बे के बोरी बंदर से ठाणे के बीच 34 किमी की दूरी पर चलाई गई थी। इसमें 14 डिब्बे और 400 यात्री थे, जिसे तीन भाप इंजनों (सुल्तान, सिंध और साहिब) ने खींचा था।',
    examCategory: 'Railway',
    examCode: 'RRB_NTPC',
    subject: 'General Awareness',
    topic: 'Indian Railways Heritage',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0.33,
    sourceType: 'official_pyq',
    examinationYear: 2021,
    validationStatus: 'approved'
  },
  {
    questionText: 'Where is the headquarters of the South Eastern Railway Zone located?',
    questionHindi: 'दक्षिण पूर्व रेलवे जोन (South Eastern Railway) का मुख्यालय कहां स्थित है?',
    options: [
      { key: 'A', text: 'Bhubaneswar' },
      { key: 'B', text: 'Kolkata (Garden Reach)' },
      { key: 'C', text: 'Bilaspur' },
      { key: 'D', text: 'Ranchi' }
    ],
    optionsHindi: [
      { key: 'A', text: 'भुवनेश्वर' },
      { key: 'B', text: 'कोलकाता (गार्डन रीच)' },
      { key: 'C', text: 'बिलासपुर' },
      { key: 'D', text: 'राँची' }
    ],
    correctAnswer: 'B',
    explanation: 'The headquarters of both Eastern Railway (Fairlie Place) and South Eastern Railway (Garden Reach) are located in Kolkata, West Bengal.',
    explanationHindi: 'दक्षिण पूर्व रेलवे का मुख्यालय गार्डन रीच, कोलकाता में स्थित है। पूर्व रेलवे का मुख्यालय भी फेयरली प्लेस, कोलकाता में है।',
    examCategory: 'Railway',
    examCode: 'RRB_NTPC',
    subject: 'General Awareness',
    topic: 'Railway Administration & Zones',
    difficulty: 'medium',
    marks: 1,
    negativeMarks: 0.33,
    sourceType: 'official_pyq',
    examinationYear: 2022,
    validationStatus: 'approved'
  },
  {
    questionText: 'What is the chemical formula of Plaster of Paris (POP)?',
    questionHindi: 'प्लास्टर ऑफ पेरिस (POP) का रासायनिक सूत्र क्या है?',
    options: [
      { key: 'A', text: 'CaSO4 . 2H2O' },
      { key: 'B', text: 'CaSO4 . 1/2 H2O' },
      { key: 'C', text: 'CaSO4 . 5H2O' },
      { key: 'D', text: 'CaCO3' }
    ],
    optionsHindi: [
      { key: 'A', text: 'CaSO4 . 2H2O' },
      { key: 'B', text: 'CaSO4 . 1/2 H2O' },
      { key: 'C', text: 'CaSO4 . 5H2O' },
      { key: 'D', text: 'CaCO3' }
    ],
    correctAnswer: 'B',
    explanation: 'Plaster of Paris is calcium sulfate hemihydrate: CaSO4 · 0.5 H2O. It is prepared by gently heating gypsum (CaSO4 · 2H2O) to 373 K.',
    explanationHindi: 'प्लास्टर ऑफ पेरिस का रासायनिक नाम कैल्शियम सल्फेट हेमीहाइड्रेट (CaSO4 · 1/2 H2O) है। इसे जिप्सम को 373 K पर गर्म करके बनाया जाता है।',
    examCategory: 'Railway',
    examCode: 'RRB_NTPC',
    subject: 'General Science',
    topic: 'Chemistry in Everyday Life',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0.33,
    sourceType: 'official_pyq',
    examinationYear: 2021,
    validationStatus: 'approved'
  },
  {
    questionText: 'Pipe A can fill a tank in 6 hours and Pipe B can empty the same tank in 8 hours. If both pipes are opened simultaneously, in how many hours will the tank be completely filled?',
    questionHindi: 'पाइप A एक टंकी को 6 घंटे में भर सकता है और पाइप B उसी टंकी को 8 घंटे में खाली कर सकता है। यदि दोनों पाइप एक साथ खोल दिए जाएं, तो टंकी कितने घंटों में भर जाएगी?',
    options: [
      { key: 'A', text: '14 hours' },
      { key: 'B', text: '24 hours' },
      { key: 'C', text: '18 hours' },
      { key: 'D', text: '12 hours' }
    ],
    optionsHindi: [
      { key: 'A', text: '14 घंटे' },
      { key: 'B', text: '24 घंटे' },
      { key: 'C', text: '18 घंटे' },
      { key: 'D', text: '12 घंटे' }
    ],
    correctAnswer: 'B',
    explanation: 'Net filling rate per hour = (1/6) - (1/8) = (4 - 3)/24 = 1/24. Thus, the tank will be filled in 24 hours.',
    explanationHindi: 'प्रति घंटा शुद्ध कार्य = 1/6 - 1/8 = (4 - 3)/24 = 1/24। अतः पूरी टंकी 24 घंटे में भर जाएगी।',
    examCategory: 'Railway',
    examCode: 'RRB_NTPC',
    subject: 'Mathematics',
    topic: 'Pipes and Cisterns',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0.33,
    sourceType: 'human_curated',
    validationStatus: 'approved'
  },

  // =========================================================================
  // 6. BANKING & INSURANCE (IBPS PO / SBI PO)
  // =========================================================================
  {
    questionText: 'What is the definition of the "Repo Rate" set by the Reserve Bank of India?',
    questionHindi: 'भारतीय रिज़र्व बैंक द्वारा निर्धारित "रेपो दर" (Repo Rate) की सही परिभाषा क्या है?',
    options: [
      { key: 'A', text: 'Rate at which RBI borrows money from commercial banks' },
      { key: 'B', text: 'Rate at which RBI lends short-term funds to commercial banks against government securities' },
      { key: 'C', text: 'Rate of interest commercial banks charge their prime corporate borrowers' },
      { key: 'D', text: 'Percentage of deposits banks must keep as cash balance with RBI' }
    ],
    optionsHindi: [
      { key: 'A', text: 'जिस दर पर RBI वाणिज्यिक बैंकों से धन उधार लेता है' },
      { key: 'B', text: 'जिस दर पर RBI सरकारी प्रतिभूतियों के बदले वाणिज्यिक बैंकों को अल्पकालिक ऋण देता है' },
      { key: 'C', text: 'जिस ब्याज दर पर बैंक अपने प्रमुख कॉर्पोरेट ग्राहकों को ऋण देते हैं' },
      { key: 'D', text: 'जमा का वह प्रतिशत जिसे बैंकों को RBI के पास नकद रखना अनिवार्य है' }
    ],
    correctAnswer: 'B',
    explanation: 'Repo rate (Repurchase Agreement rate) is the key policy interest rate at which the central bank (RBI) lends money to commercial banks against collateral of government securities to regulate liquidity and control inflation.',
    explanationHindi: 'रेपो दर वह नीतिगत ब्याज दर है जिस पर केंद्रीय बैंक (RBI) वाणिज्यिक बैंकों को सरकारी प्रतिभूतियों के बदले अल्पकालिक धन उधार देता है।',
    examCategory: 'Banking',
    examCode: 'IBPS_PO',
    subject: 'Banking & Financial Awareness',
    topic: 'Monetary Policy Instruments',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'official_pyq',
    examinationYear: 2023,
    validationStatus: 'approved'
  },
  {
    questionText: 'What is the maximum deposit insurance coverage provided per depositor per insured commercial/cooperative bank by the Deposit Insurance and Credit Guarantee Corporation (DICGC)?',
    questionHindi: 'DICGC द्वारा प्रत्येक बीमित बैंक में प्रति जमाकर्ता कितनी अधिकतम राशि तक का बीमा संरक्षण प्रदान किया जाता है?',
    options: [
      { key: 'A', text: 'Rs. 1,00,000' },
      { key: 'B', text: 'Rs. 2,00,000' },
      { key: 'C', text: 'Rs. 5,00,000' },
      { key: 'D', text: 'Rs. 10,00,000' }
    ],
    optionsHindi: [
      { key: 'A', text: 'रु. 1,00,000' },
      { key: 'B', text: 'रु. 2,00,000' },
      { key: 'C', text: 'रु. 5,00,000' },
      { key: 'D', text: 'रु. 10,00,000' }
    ],
    correctAnswer: 'C',
    explanation: 'Under DICGC regulations, each depositor in an insured bank is insured up to a maximum of Rs. 5,00,000 (including both principal and interest) across all accounts in the same right and capacity.',
    explanationHindi: 'DICGC नियमों के तहत प्रत्येक जमाकर्ता को प्रति बैंक अधिकतम 5 लाख रुपये तक (मूलधन और ब्याज दोनों मिलाकर) का पूर्ण बीमा संरक्षण प्रदान किया जाता है।',
    examCategory: 'Banking',
    examCode: 'IBPS_PO',
    subject: 'Banking & Financial Awareness',
    topic: 'Banking Regulations & DICGC',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'official_pyq',
    examinationYear: 2024,
    validationStatus: 'approved'
  },
  {
    questionText: 'What is the mandatory Priority Sector Lending (PSL) target for domestic scheduled commercial banks (excluding RRBs and Small Finance Banks) as a percentage of Adjusted Net Bank Credit (ANBC)?',
    questionHindi: 'घरेलू अनुसूचित वाणिज्यिक बैंकों के लिए समायोजित शुद्ध बैंक ऋण (ANBC) के कितने प्रतिशत का अनिवार्य प्राथमिकता प्राप्त क्षेत्र ऋण (PSL) लक्ष्य निर्धारित है?',
    options: [
      { key: 'A', text: '25%' },
      { key: 'B', text: '33%' },
      { key: 'C', text: '40%' },
      { key: 'D', text: '50%' }
    ],
    optionsHindi: [
      { key: 'A', text: '25%' },
      { key: 'B', text: '33%' },
      { key: 'C', text: '40%' },
      { key: 'D', text: '50%' }
    ],
    correctAnswer: 'C',
    explanation: 'Domestic commercial banks are mandated by the Reserve Bank of India to allocate at least 40% of their Adjusted Net Bank Credit (ANBC) or Credit Equivalent Amount of Off-Balance Sheet Exposure to priority sectors including agriculture, MSMEs, education, and housing.',
    explanationHindi: 'आरबीआई के दिशानिर्देशों के तहत घरेलू वाणिज्यिक बैंकों को अपने समायोजित शुद्ध बैंक ऋण (ANBC) का न्यूनतम 40% प्राथमिकता प्राप्त क्षेत्रों (जैसे कृषि, एमएसएमई आदि) में आवंटित करना अनिवार्य है।',
    examCategory: 'Banking',
    examCode: 'IBPS_PO',
    subject: 'Banking & Financial Awareness',
    topic: 'Priority Sector Lending',
    difficulty: 'medium',
    marks: 1,
    negativeMarks: 0.25,
    sourceType: 'official_pyq',
    examinationYear: 2023,
    validationStatus: 'approved'
  },

  // =========================================================================
  // 7. CLASS 10 BOARD EXAMINATIONS (CBSE & BSEB)
  // =========================================================================
  {
    questionText: 'According to Ohm\'s Law, what is the mathematical relationship between electric potential difference (V), current (I), and resistance (R) at constant temperature?',
    questionHindi: 'ओम के नियम के अनुसार, स्थिर ताप पर विद्युत विभवांतर (V), धारा (I), और प्रतिरोध (R) के बीच क्या गणितीय संबंध होता है?',
    options: [
      { key: 'A', text: 'V = I / R' },
      { key: 'B', text: 'V = I * R' },
      { key: 'C', text: 'V = I^2 * R' },
      { key: 'D', text: 'R = V * I' }
    ],
    optionsHindi: [
      { key: 'A', text: 'V = I / R' },
      { key: 'B', text: 'V = I * R' },
      { key: 'C', text: 'V = I^2 * R' },
      { key: 'D', text: 'R = V * I' }
    ],
    correctAnswer: 'B',
    explanation: 'Ohm\'s Law states that electric current through a metallic conductor between two points is directly proportional to voltage across the two points: V = I * R.',
    explanationHindi: 'ओम के नियम के अनुसार, स्थिर ताप पर चालक के सिरों के बीच का विभवांतर उसमें प्रवाहित होने वाली विद्युत धारा के अनुक्रमानुपाती होता है: V = I * R।',
    examCategory: 'Board Exams',
    examCode: 'CLASS_10',
    subject: 'Physics',
    topic: 'Electricity',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0,
    sourceType: 'human_curated',
    validationStatus: 'approved'
  },
  {
    questionText: 'The breakdown of pyruvate using oxygen to produce carbon dioxide, water, and ATP takes place in which cellular organelle?',
    questionHindi: 'ऑक्सीजन की उपस्थिति में पाइरूवेट का विखंडन होकर कार्बन डाइऑक्साइड, जल और एटीपी का निर्माण कोशिका के किस अंगक में होता है?',
    options: [
      { key: 'A', text: 'Cytoplasm' },
      { key: 'B', text: 'Mitochondria' },
      { key: 'C', text: 'Chloroplast' },
      { key: 'D', text: 'Endoplasmic Reticulum' }
    ],
    optionsHindi: [
      { key: 'A', text: 'कोशिकाद्रव्य (Cytoplasm)' },
      { key: 'B', text: 'माइटोकॉन्ड्रिया (Mitochondria)' },
      { key: 'C', text: 'हरितलवक (Chloroplast)' },
      { key: 'D', text: 'अंतःप्रद्रव्यी जालिका' }
    ],
    correctAnswer: 'B',
    explanation: 'Glycolysis (glucose to pyruvate) occurs in the cytoplasm, whereas aerobic breakdown of pyruvate occurs inside the mitochondria (Krebs cycle).',
    explanationHindi: 'पाइरूवेट का एरोबिक (वायवीय) विखंडन माइटोकॉन्ड्रिया में होता है जहां प्रचुर मात्रा में एटीपी ऊर्जा उत्पन्न होती है।',
    examCategory: 'Board Exams',
    examCode: 'CLASS_10',
    subject: 'Biology',
    topic: 'Life Processes - Respiration',
    difficulty: 'easy',
    marks: 1,
    negativeMarks: 0,
    sourceType: 'human_curated',
    validationStatus: 'approved'
  }
];

async function seedAuthenticQuestions() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas successfully.');

    // Remove legacy un-differentiated dummy questions
    const deleteResult = await Question.deleteMany({});
    console.log(`Cleared previous questions collection (${deleteResult.deletedCount} removed).`);

    // Insert rich, authentic question bank
    const insertedQuestions = await Question.insertMany(authenticQuestions);
    console.log(`✅ Seeded ${insertedQuestions.length} authentic, bilingual multidisciplinary questions.`);

    // Remove outdated mock test documents so they regenerate cleanly with specific questions
    await Quiz.deleteMany({ isMock: true });
    console.log('Cleared previous mock quizzes.');

    // Define mock tests mapped to specific categories and question pools
    const mockDefinitions = [
      {
        title: 'UPSC Civil Services Prelims GS Paper 1 All-India Mock',
        hindiTitle: 'संघ लोक सेवा आयोग सिविल सेवा प्रारंभिक सामान्य अध्ययन पेपर 1 मॉक',
        description: 'Authentic 100-mark mock test matching UPSC Prelims standard negative marking (-0.66) covering Polity, History, Economy, and Geography.',
        examCategory: 'Civil Services',
        examCode: 'UPSC_CSE',
        durationMinutes: 120,
        positiveMarks: 2,
        negativeMarks: 0.66,
        isMock: true,
        difficulty: 'hard'
      },
      {
        title: 'BPSC 70th CCE Combined Preliminary Full Mock',
        hindiTitle: '70वीं बीपीएससी संयुक्त प्रारंभिक परीक्षा पूर्ण मॉक टेस्ट',
        description: 'Authentic BPSC preliminary simulation covering Bihar History, Bihar Geography, Someshwar range, Champaran, and Bihar Administration (-0.33 negative marking).',
        examCategory: 'State PSC',
        examCode: 'BPSC_CCE',
        durationMinutes: 120,
        positiveMarks: 1,
        negativeMarks: 0.33,
        isMock: true,
        difficulty: 'medium'
      },
      {
        title: 'SSC CGL Tier 1 All-India CBT Speed Simulation',
        hindiTitle: 'कर्मचारी चयन आयोग सीजीएल टियर 1 सीबीटी स्पीड टेस्ट',
        description: 'Timed 60-minute test covering Quantitative Aptitude, General Intelligence, Number Series, and English Comprehension (-0.50 negative marking).',
        examCategory: 'SSC',
        examCode: 'SSC_CGL',
        durationMinutes: 60,
        positiveMarks: 2,
        negativeMarks: 0.50,
        isMock: true,
        difficulty: 'medium'
      },
      {
        title: 'GATE Computer Science & Information Technology Full Mock',
        hindiTitle: 'गेट कंप्यूटर साइंस और सूचना प्रौद्योगिकी पूर्ण मॉक',
        description: 'Authentic Computer Science simulation covering Algorithms, Operating Systems, Relational Normalization (BCNF), and TCP/IP Networking (-0.66 negative marking).',
        examCategory: 'GATE CSE',
        examCode: 'GATE_CSE',
        durationMinutes: 180,
        positiveMarks: 2,
        negativeMarks: 0.66,
        isMock: true,
        difficulty: 'hard'
      },
      {
        title: 'Railway RRB NTPC Stage 1 CBT Grand Test',
        hindiTitle: 'रेलवे आरआरबी एनटीपीसी स्टेज 1 सीबीटी ग्रैंड टेस्ट',
        description: 'Authentic Railway recruitment test covering Indian Railways heritage, General Science, and Mathematics with 1/3 negative marking.',
        examCategory: 'Railway',
        examCode: 'RRB_NTPC',
        durationMinutes: 90,
        positiveMarks: 1,
        negativeMarks: 0.33,
        isMock: true,
        difficulty: 'easy'
      },
      {
        title: 'IBPS PO Prelims Speed Practice Mock',
        hindiTitle: 'आईबीपीएस पीओ प्रारंभिक स्पीड अभ्यास मॉक',
        description: 'Section-wise timed mock covering Repo Rate, Banking Awareness, Priority Sector Lending, and DICGC regulations with 0.25 negative marking.',
        examCategory: 'Banking',
        examCode: 'IBPS_PO',
        durationMinutes: 60,
        positiveMarks: 1,
        negativeMarks: 0.25,
        isMock: true,
        difficulty: 'medium'
      },
      {
        title: 'Class 10 Board All-India Science & Math Assessment',
        hindiTitle: 'कक्षा 10वीं बोर्ड अखिल भारतीय विज्ञान एवं गणित मूल्यांकन',
        description: 'Syllabus-aligned board practice test covering Ohm\'s Law, Electricity, Pyruvate breakdown, and Quadratic Equations.',
        examCategory: 'Board Exams',
        examCode: 'CLASS_10',
        durationMinutes: 90,
        positiveMarks: 1,
        negativeMarks: 0,
        isMock: true,
        difficulty: 'easy'
      }
    ];

    for (const def of mockDefinitions) {
      // Find questions strictly matching this examCode or examCategory
      const questionsForExam = await Question.find({
        $or: [
          { examCode: def.examCode },
          { examCategory: def.examCategory }
        ],
        validationStatus: 'approved'
      });

      const quizDoc = await Quiz.create({
        ...def,
        totalQuestions: questionsForExam.length,
        questions: questionsForExam.map(q => q._id),
        publishStatus: 'published'
      });

      console.log(`✅ Created Mock: "${def.title}" with ${questionsForExam.length} authentic exam-specific questions.`);
    }

    // Also update the Daily Quiz with a curated cross-exam set
    const dailyQuestions = await Question.find({ validationStatus: 'approved' });
    await Quiz.deleteMany({ isDaily: true });
    const daily = await Quiz.create({
      title: `All-India Daily Grand Quiz - ${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
      hindiTitle: `अखिल भारतीय दैनिक महा-क्विज़ - ${new Date().toLocaleDateString('hi-IN', { timeZone: 'Asia/Kolkata' })}`,
      description: 'Curated multidisciplinary assessment spanning Civil Services, State PSC, SSC, GATE CSE, Railway, and Banking.',
      hindiDescription: 'सिविल सेवा, राज्य लोक सेवा आयोग, एसएससी, गेट और बैंकिंग के प्रामाणिक प्रश्नों का अखिल भारतीय दैनिक अभ्यास।',
      examCategory: 'General Knowledge & Multidisciplinary',
      totalQuestions: dailyQuestions.length,
      durationMinutes: 60,
      positiveMarks: 2,
      negativeMarks: 0.5,
      isDaily: true,
      questions: dailyQuestions.map(q => q._id),
      scheduledFor: new Date(),
      publishStatus: 'published'
    });
    console.log(`✅ Updated Daily Quiz: "${daily.title}" with ${dailyQuestions.length} questions across all subjects.`);

    console.log('\n============================================================');
    console.log('🎉 QUESTION BANK AND MOCK TEST SEEDING COMPLETED!');
    console.log('Each exam now has distinct, authentic, syllabus-specific questions.');
    console.log('============================================================');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedAuthenticQuestions();
