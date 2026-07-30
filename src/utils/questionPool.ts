/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, ExamType } from '../types';

// ==========================================
// 1. UPSC CIVIL SERVICES QUESTION POOL
// ==========================================
export const UPSC_QUESTION_POOL: Question[] = [
  {
    id: 'upsc-001',
    text: 'Which of the following is correct regarding the "Basic Structure" doctrine of the Indian Constitution?',
    options: [
      'It was first formulated in the Shankari Prasad case (1951).',
      'It is explicitly defined in Article 368 of the Constitution.',
      'It was established by the Supreme Court in the Kesavananda Bharati case (1973) and limits the amending power of Parliament.',
      'It holds that Parliament has absolute, unlimited power to amend any part of the Constitution.'
    ],
    correctAnswerIndex: 2,
    explanation: 'The Supreme Court of India outlined the Basic Structure doctrine in the Kesavananda Bharati case (1973). It held that Parliament cannot alter or destroy the essential features of the Constitution.',
    subject: 'Polity'
  },
  {
    id: 'upsc-002',
    text: 'Which Article of the Constitution of India safeguards one\'s right to marry the person of one\'s choice?',
    options: ['Article 19', 'Article 21', 'Article 25', 'Article 29'],
    correctAnswerIndex: 1,
    explanation: 'In the Hadiya Case (2018) and K.S. Puttaswamy case (2017), the Supreme Court ruled that the right to marry a person of one\'s choice is an integral part of Article 21 (Right to Life and Personal Liberty).',
    subject: 'Polity'
  },
  {
    id: 'upsc-003',
    text: 'A constitutional government by definition is a:',
    options: ['Government by legislature', 'Popular government', 'Multi-party government', 'Limited government'],
    correctAnswerIndex: 3,
    explanation: 'Constitutional government is by definition a limited government. It places legal limits on state powers to safeguard individual fundamental rights.',
    subject: 'Polity'
  },
  {
    id: 'upsc-004',
    text: 'In India, Separation of Judiciary from the Executive is enjoined by:',
    options: ['The Preamble of the Constitution', 'A Directive Principle of State Policy (Article 50)', 'The Seventh Schedule', 'The conventional practice'],
    correctAnswerIndex: 1,
    explanation: 'Article 50 of Part IV (Directive Principles of State Policy) directs the State to take steps to separate the judiciary from the executive in public services.',
    subject: 'Polity'
  },
  {
    id: 'upsc-005',
    text: 'Which Schedule of the Constitution contains provisions regarding the Anti-Defection Law?',
    options: ['Second Schedule', 'Fifth Schedule', 'Eighth Schedule', 'Tenth Schedule'],
    correctAnswerIndex: 3,
    explanation: 'The Tenth Schedule was added by the 52nd Amendment Act of 1985. It sets out the grounds for disqualification of members on grounds of defection.',
    subject: 'Polity'
  },
  {
    id: 'upsc-006',
    text: 'With reference to ancient India, the term "Yavanapriya" in Sanskrit literature referred to:',
    options: ['Fine muslin cloth', 'Ivory carvings', 'Pepper', 'Greek damsels'],
    correctAnswerIndex: 2,
    explanation: 'Pepper was highly valued by the Greeks (Yavanas) who traded with ancient Indian kingdoms. Hence it was called "Yavanapriya" (loved by Yavanas).',
    subject: 'History'
  },
  {
    id: 'upsc-007',
    text: 'Who among the following founded the Ahmedabad Textile Labour Association in 1918?',
    options: ['Mahatma Gandhi', 'Sardar Vallabhbhai Patel', 'N.M. Joshi', 'J.B. Kripalani'],
    correctAnswerIndex: 0,
    explanation: 'Following the 1918 Ahmedabad Mill Strike, Mahatma Gandhi along with Anasuya Sarabhai founded the Textile Labour Association (Majoor Mahajan Sangh).',
    subject: 'History'
  },
  {
    id: 'upsc-008',
    text: 'With reference to the history of India, the "Ulgulan" or Great Tumult was the description of which movement?',
    options: ['The Indigo Revolt of 1859', 'Mappila Rebellion of 1921', 'Santhal Rebellion of 1855', 'Birsa Munda Revolt of 1899-1900'],
    correctAnswerIndex: 3,
    explanation: 'The Birsa Munda tribal uprising of 1899-1900 in Ranchi region is historically remembered as the "Ulgulan" (The Great Tumult).',
    subject: 'History'
  },
  {
    id: 'upsc-009',
    text: 'Which of the following measures results in an increase in the money supply in an economy?',
    options: [
      'Sale of government securities to the public by the Central Bank',
      'Purchase of government securities from the public by the Central Bank',
      'Increase in Cash Reserve Ratio (CRR)',
      'Increase in Statutory Liquidity Ratio (SLR)'
    ],
    correctAnswerIndex: 1,
    explanation: 'Purchasing government securities pumps cash into the hands of the public and banking system, increasing liquidity and money supply.',
    subject: 'Economy'
  },
  {
    id: 'upsc-010',
    text: 'The term "Core Inflation" is calculated by excluding which categories from Headline Inflation?',
    options: ['Fuel and Power only', 'Food and Beverages only', 'Both Food and Fuel items', 'Manufactured goods only'],
    correctAnswerIndex: 2,
    explanation: 'Core inflation excludes volatile categories—specifically food articles and fuel/energy resources—to track the underlying inflation trend.',
    subject: 'Economy'
  },
  {
    id: 'upsc-011',
    text: 'Which curve demonstrates the inverse relationship between unemployment rate and inflation rate in an economy?',
    options: ['Laffer Curve', 'Phillips Curve', 'Kuznets Curve', 'Lorenz Curve'],
    correctAnswerIndex: 1,
    explanation: 'The Phillips Curve shows the historical inverse relationship between unemployment and inflation in an economy.',
    subject: 'Economy'
  },
  {
    id: 'upsc-012',
    text: 'Which atmosphere layer contains ionized particles that reflect radio waves back to Earth?',
    options: ['Troposphere', 'Stratosphere', 'Mesosphere', 'Ionosphere'],
    correctAnswerIndex: 3,
    explanation: 'The Ionosphere reflects radio waves back to Earth, enabling wireless telecommunication.',
    subject: 'Geography & Environment'
  },
  {
    id: 'upsc-013',
    text: 'In medieval India, the term "Fanam" referred to:',
    options: ['Weapons', 'Coins', 'Measuring ornaments', 'Agricultural land taxes'],
    correctAnswerIndex: 1,
    explanation: 'In medieval South India, "Fanam" or "Panam" was a widely circulating gold or silver coin.',
    subject: 'History'
  },
  {
    id: 'upsc-014',
    text: 'The 44th Amendment Act of 1978 substituted which term in Article 352 to declare a National Emergency?',
    options: ['Internal disturbance with Armed rebellion', 'External aggression with Armed rebellion', 'War with civil mutiny', 'Public disorder with riot'],
    correctAnswerIndex: 0,
    explanation: 'The 44th Amendment substituted "internal disturbance" with "armed rebellion" in Article 352 to prevent misuse of emergency powers.',
    subject: 'Polity'
  },
  {
    id: 'upsc-015',
    text: 'The power of the Supreme Court of India to decide disputes between the Centre and States falls under its:',
    options: ['Advisory jurisdiction', 'Appellate jurisdiction', 'Original jurisdiction', 'Writ jurisdiction'],
    correctAnswerIndex: 2,
    explanation: 'Under Article 131 of the Constitution, disputes between Centre and States fall exclusively under the Supreme Court\'s Original Jurisdiction.',
    subject: 'Polity'
  }
];

// ==========================================
// 2. TNPSC GROUP 1 QUESTION POOL
// ==========================================
export const TNPSC_G1_QUESTION_POOL: Question[] = [
  {
    id: 'tn1-001',
    text: 'Under whose leadership was the Self-Respect Movement (சுயமரியாதை இயக்கம்) launched in Tamil Nadu in 1925?',
    options: ['C. N. Annadurai', 'E. V. Ramasamy (Periyar)', 'C. Rajagopalachari', 'K. Kamaraj'],
    correctAnswerIndex: 1,
    explanation: 'E.V. Ramasamy (Periyar) started the Self-Respect Movement in 1925 to establish an egalitarian society free of caste discrimination.',
    subject: 'Tamil Heritage'
  },
  {
    id: 'tn1-002',
    text: 'According to Thirukkural, which of the following is considered supreme virtue (தலைசிறந்த அறம்)?',
    options: [
      'Earning vast wealth',
      'Speaking sweet words and Non-injury / Non-killing (இன்னா செய்யாமை / கொல்லாமை)',
      'Achieving fame in warfare',
      'Ruling with strict punishment'
    ],
    correctAnswerIndex: 1,
    explanation: 'Thirukkural emphasizes non-killing (கொல்லாமை) and non-injury (இன்னா செய்யாமை) as supreme ethical virtues.',
    subject: 'Thirukkural'
  },
  {
    id: 'tn1-003',
    text: 'The famous Sangam age archaeological site "Keezhadi" is located in which district of Tamil Nadu?',
    options: ['Madurai', 'Sivagangai', 'Thanjavur', 'Thoothukudi'],
    correctAnswerIndex: 1,
    explanation: 'Keezhadi is an active Sangam era archaeological site located in Sivagangai district along the Vaigai river basin near Madurai.',
    subject: 'History & Archaeology'
  },
  {
    id: 'tn1-004',
    text: 'The famous Vaikom Satyagraha of 1924-25 in Travancore was organized primarily to:',
    options: [
      'Oppose land tax enhancements',
      'Permit depressed classes to walk on public roads around Vaikom temple',
      'End British residency administration',
      'Support local salt satyagraha'
    ],
    correctAnswerIndex: 1,
    explanation: 'The Vaikom Satyagraha demanded public pathway access around the Vaikom temple for all castes. E.V. Ramasamy led the protest, earning the title "Vaikom Veerar".',
    subject: 'Tamil Heritage'
  },
  {
    id: 'tn1-005',
    text: 'The "Pudhumai Penn Scheme" of Tamil Nadu provides ₹1,000 monthly financial assistance to:',
    options: [
      'Girl students from government schools (Class 6-12) pursuing higher education',
      'Widowed women for self-employment',
      'Handloom weavers',
      'Elderly agricultural laborers'
    ],
    correctAnswerIndex: 0,
    explanation: 'Pudhumai Penn Scheme (Moovalur Ramamirtham Ammaiyar Scheme) provides ₹1,000/month to female students from government schools entering college.',
    subject: 'Development Admin'
  },
  {
    id: 'tn1-006',
    text: 'Which ancient Sangam port near Puducherry yielded extensive Roman amphorae and pottery, testifying to active Mediterranean trade?',
    options: ['Kaveripoompattinam', 'Arikamedu', 'Korkai', 'Musiri'],
    correctAnswerIndex: 1,
    explanation: 'Arikamedu was an active Indo-Roman trade port (1st century BCE to 2nd century CE). Excavations yielded amphorae, Arretine ware, and glass beads.',
    subject: 'History'
  },
  {
    id: 'tn1-007',
    text: 'Who composed the Sangam work "Madurai Kanchi" praising Pandyan King Nedunchezhiyan?',
    options: ['Mangudi Marudanar', 'Nakkirar', 'Kapilar', 'Ilango Adigal'],
    correctAnswerIndex: 0,
    explanation: 'Madurai Kanchi, part of the Pathuppattu anthology, was composed by Mangudi Marudanar for Pandyan King Talayalanganathu Seruvendra Nedunchezhiyan.',
    subject: 'Tamil Literature'
  },
  {
    id: 'tn1-008',
    text: 'Which ancient Tamil Sangam work is revered as "Tamil Veda" or "Utharavedham"?',
    options: ['Silappatikaram', 'Manimekalai', 'Thirukkural', 'Thiruvilayadal Puranam'],
    correctAnswerIndex: 2,
    explanation: 'Thirukkural by Thiruvalluvar is revered as the "Tamil Veda" (Utharavedham) for its universal ethical and moral maxims.',
    subject: 'Tamil Heritage'
  },
  {
    id: 'tn1-009',
    text: 'The Iron Age archaeological burial site "Adichanallur" is located in which district of Tamil Nadu?',
    options: ['Sivagangai', 'Thoothukudi', 'Dharmapuri', 'Perambalur'],
    correctAnswerIndex: 1,
    explanation: 'Adichanallur is an ancient Iron Age burial site situated in Thoothukudi district along the Thamirabarani river valley.',
    subject: 'Archaeology'
  },
  {
    id: 'tn1-010',
    text: 'Which state launched the pioneer "Chief Minister\'s Breakfast Scheme" for primary school children in 2022?',
    options: ['Kerala', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh'],
    correctAnswerIndex: 1,
    explanation: 'Tamil Nadu launched the Chief Minister\'s Breakfast Scheme in 2022 for government primary school students to improve nutritional levels.',
    subject: 'Development Admin'
  },
  {
    id: 'tn1-011',
    text: 'Who authored the Sangam poem "Pattinappalai" describing the Kaveripoompattinam port during Karikala Chola\'s reign?',
    options: ['Kadiyalur Uruttirangannanar', 'Kapilar', 'Avvaiyar', 'Paranar'],
    correctAnswerIndex: 0,
    explanation: 'Pattinappalai was composed by Kadiyalur Uruttirangannanar to describe the flourishing sea trade of Poompuhar under Karikala Chola.',
    subject: 'Tamil Literature'
  },
  {
    id: 'tn1-012',
    text: 'Veerapandiya Kattabomman, the Palayakkarar who revolted against British East India Company, ruled over which palayam?',
    options: ['Nerkattumseval', 'Panchalankurichi', 'Ettayapuram', 'Sivagiri'],
    correctAnswerIndex: 1,
    explanation: 'Kattabomman was the Palayakkarar of Panchalankurichi who refused to pay taxes to the British East India Company and waged war until 1799.',
    subject: 'History'
  }
];

// ==========================================
// 3. TNPSC GROUP 2 QUESTION POOL
// ==========================================
export const TNPSC_G2_QUESTION_POOL: Question[] = [
  {
    id: 'tn2-001',
    text: 'Who is regarded as the "Father of the Dravidian Movement" in Tamil Nadu?',
    options: ['Dr. C. Natesanar', 'Sir P. T. Theagaraya Chetty', 'E. V. Ramasamy', 'Dr. T. M. Nair'],
    correctAnswerIndex: 0,
    explanation: 'Dr. C. Natesanar founded the Madras Dravidian Association in 1912 and brought Non-Brahmin leaders together to form the Justice Party in 1916.',
    subject: 'Tamil Heritage'
  },
  {
    id: 'tn2-002',
    text: 'If a sum of ₹10,000 yields ₹2,000 simple interest over 2 years, what is the annual rate of interest?',
    options: ['5%', '8%', '10%', '12%'],
    correctAnswerIndex: 2,
    explanation: 'SI = (P * R * T) / 100 -> 2000 = (10000 * R * 2) / 100 -> 2000 = 200 * R -> R = 10%.',
    subject: 'Aptitude'
  },
  {
    id: 'tn2-003',
    text: 'The famous Valluvar Kottam monument in Chennai was built in 1976 during the governance of which Chief Minister?',
    options: ['K. Kamaraj', 'M. G. Ramachandran', 'M. Karunanidhi', 'C. N. Annadurai'],
    correctAnswerIndex: 2,
    explanation: 'Valluvar Kottam was constructed in 1976 during the tenure of Chief Minister M. Karunanidhi to honor Thiruvalluvar.',
    subject: 'Tamil Culture'
  },
  {
    id: 'tn2-004',
    text: 'In which year did the historic Vellore Sepoy Mutiny against British rule break out in Tamil Nadu?',
    options: ['1757', '1806', '1857', '1942'],
    correctAnswerIndex: 1,
    explanation: 'The Vellore Sepoy Mutiny erupted on July 10, 1806, at Vellore Fort against new British dress codes and turban rules.',
    subject: 'History'
  },
  {
    id: 'tn2-005',
    text: 'Which committee was appointed in 1983 to review Centre-State relations in India?',
    options: ['Sarkaria Commission', 'Mandal Commission', 'Shah Commission', 'Kothari Commission'],
    correctAnswerIndex: 0,
    explanation: 'The Sarkaria Commission was setup in 1983 by the Central Government to examine the constitutional balance and Centre-State relations.',
    subject: 'Polity'
  },
  {
    id: 'tn2-006',
    text: 'Who authored the Tamil epic "Silappatikaram"?',
    options: ['Sithalai Sathanar', 'Ilango Adigal', 'Tirutthakkadevar', 'Kambar'],
    correctAnswerIndex: 1,
    explanation: 'Ilango Adigal, a Chera prince turned Jain monk, authored Silappatikaram detailing the story of Kovalan, Kannagi, and Madhavi.',
    subject: 'Tamil Literature'
  },
  {
    id: 'tn2-007',
    text: 'Who authored the Buddhist Tamil epic "Manimekalai", which serves as a continuation of Silappatikaram?',
    options: ['Sithalai Sathanar', 'Ilango Adigal', 'Kamban', 'Ottakoothar'],
    correctAnswerIndex: 0,
    explanation: 'Sithalai Sathanar composed Manimekalai, focusing on Kovalan and Madhavi\'s daughter Manimekalai and Buddhist philosophy.',
    subject: 'Tamil Literature'
  },
  {
    id: 'tn2-008',
    text: 'A can complete a task in 12 days, and B can complete it in 24 days. How many days will they take together?',
    options: ['6 days', '8 days', '9 days', '10 days'],
    correctAnswerIndex: 1,
    explanation: 'Combined rate = 1/12 + 1/24 = 3/24 = 1/8 per day. Working together they complete the task in 8 days.',
    subject: 'Aptitude'
  },
  {
    id: 'tn2-009',
    text: 'Which freedom fighter established the "Swadeshi Steam Navigation Company" in 1906 between Tuticorin and Colombo to break British monopoly?',
    options: ['Subramania Bharati', 'V. O. Chidambaram Pillai (VOC)', 'Subramania Siva', 'Rajaji'],
    correctAnswerIndex: 1,
    explanation: 'V. O. Chidambaram Pillai (Kappalottiya Thamizhan) launched two ships, SS Gaelia and SS Lawoe, under the Swadeshi Steam Navigation Company in 1906.',
    subject: 'History'
  },
  {
    id: 'tn2-010',
    text: 'What is the compound interest on ₹10,000 for 2 years at 10% per annum compounded annually?',
    options: ['₹1,800', '₹2,000', '₹2,100', '₹2,200'],
    correctAnswerIndex: 2,
    explanation: 'Amount = 10000 * (1.1)² = ₹12,100. CI = Amount - Principal = 12100 - 10000 = ₹2,100.',
    subject: 'Aptitude'
  },
  {
    id: 'tn2-011',
    text: 'Under the 73rd Constitutional Amendment Act, 1992, which Part was added to the Constitution for Panchayati Raj?',
    options: ['Part IX', 'Part IXA', 'Part X', 'Part XIV'],
    correctAnswerIndex: 0,
    explanation: 'Part IX titled "The Panchayats" and the Eleventh Schedule were added by the 73rd Constitutional Amendment Act, 1992.',
    subject: 'Polity'
  },
  {
    id: 'tn2-012',
    text: 'Which scheme in Tamil Nadu aims to provide skill development training to 10 lakh youth annually?',
    options: ['Naan Mudhalvan Scheme', 'Pudhumai Penn', 'Makkalai Thedi Maruthuvam', 'Illam Thedi Kalvi'],
    correctAnswerIndex: 0,
    explanation: 'The "Naan Mudhalvan" flagship scheme aims to equip higher education students with job-oriented digital, language, and technical skills.',
    subject: 'Development Admin'
  }
];

// ==========================================
// 4. TNPSC GROUP 4 & VAO QUESTION POOL
// ==========================================
export const TNPSC_G4_QUESTION_POOL: Question[] = [
  {
    id: 'tn4-001',
    text: '"யாதும் ஊரே யாவரும் கேளிர்" என்ற வரலாற்றுச் சிறப்புமிக்க வரியைப் பாடிய சங்க காலப் புலவர் யார்?',
    options: ['கபிலர்', 'ஔவையார்', 'கணியன் பூங்குன்றனார்', 'நக்கீரர்'],
    correctAnswerIndex: 2,
    explanation: '"யாதும் ஊரே யாவரும் கேளிர்" என்பது கணியன் பூங்குன்றனார் இயற்றிய புறநானூற்றுப் பாடலாகும் (பாடல் 192).',
    subject: 'General Tamil'
  },
  {
    id: 'tn4-002',
    text: 'திருக்குறளில் மொத்தம் எத்தனை அதிகாரங்களும் குறட்பாக்களும் உள்ளன?',
    options: ['130 அதிகாரங்கள், 1300 குறள்கள்', '133 அதிகாரங்கள், 1330 குறள்கள்', '100 அதிகாரங்கள், 1000 குறள்கள்', '150 அதிகாரங்கள், 1500 குறள்கள்'],
    correctAnswerIndex: 1,
    explanation: 'திருக்குறள் 133 அதிகாரங்களையும், அதிகாரத்திற்கு 10 குறள்கள் வீதம் மொத்தம் 1330 குறட்பாக்களையும் கொண்டுள்ளது.',
    subject: 'General Tamil'
  },
  {
    id: 'tn4-003',
    text: '"பாரதி" என்ற சிறப்புப் பட்டத்தை சுப்பிரமணிய பாரதியாருக்கு வழங்கிச் சிறப்பித்த சமஸ்தானம் எது?',
    options: ['புதுக்கோட்டை சமஸ்தானம்', 'எட்டயபுர சமஸ்தானம்', 'இராமநாதபுரம் சமஸ்தானம்', 'தஞ்சாவூர் சமஸ்தானம்'],
    correctAnswerIndex: 1,
    explanation: 'பாரதியாரின் கவிப்புலமையைப் பாராட்டி எட்டயபுர சமஸ்தான மன்னர் அவருக்கு 11ஆம் வயதில் "பாரதி" என்ற பட்டத்தை வழங்கினார்.',
    subject: 'General Tamil'
  },
  {
    id: 'tn4-004',
    text: 'கிராம நிர்வாக அலுவலரால் (VAO) பராமரிக்கப்படும் முதன்மை நிலக்கணக்கு "கிராம அடங்கல்" கணக்கு எண் யாது?',
    options: ['கணக்கு எண் 1', 'கணக்கு எண் 2', 'கணக்கு எண் 10', 'கணக்கு எண் 12'],
    correctAnswerIndex: 1,
    explanation: 'கிராமக் கணக்கு எண் 2 (அடங்கல்) கிராமத்தில் உள்ள ஒவ்வொரு சர்வே எண்ணின் பயிர் சாகுபடி விவரங்களைப் பதிவு செய்யும் முதன்மைப் பதிவேடாகும்.',
    subject: 'VAO Administration'
  },
  {
    id: 'tn4-005',
    text: 'கிறித்துவக் சமயக் காப்பியமான "தேம்பாவணி" நூலை இயற்றியவர் யார்?',
    options: ['ஜி.யு.போப்', 'வீரமாமுனிவர் (கான்ஸ்டன்டின் ஜோசப் பெஸ்கி)', 'கால்டுவெல்', 'ஹென்றி கிருஷ்ணப்பிள்ளை'],
    correctAnswerIndex: 1,
    explanation: 'இத்தாலி நாட்டைச் சேர்ந்த வீரமாமுனிவர் (Constantine Joseph Beschi) இயற்றிய பெருங்காப்பியம் தேம்பாவணி ஆகும்.',
    subject: 'General Tamil'
  },
  {
    id: 'tn4-006',
    text: '63 நாயன்மார்களின் வரலாற்றைக் கூறும் "பெரியபுராணம்" நூலை இயற்றியவர் யார்?',
    options: ['சேக்கிழார்', 'திருத்தக்கதேவர்', 'சுந்தரர்', 'நம்பியாண்டார் நம்பி'],
    correctAnswerIndex: 0,
    explanation: 'அநபாய சோழனின் முதலமைச்சராக இருந்த சேக்கிழார் பெருமான் இயற்றிய நூல் பெரியபுராணம் (திருத்தொண்டர் புராணம்) ஆகும்.',
    subject: 'General Tamil'
  },
  {
    id: 'tn4-007',
    text: 'மனித உடலில் காணப்படும் மிக நீளமான மற்றும் வலிமையான எலும்பு எது?',
    options: ['கழுத்து எலும்பு (Cervical)', 'தொடை எலும்பு (Femur)', 'மார்பெலும்பு (Sternum)', 'கை எலும்பு (Humerus)'],
    correctAnswerIndex: 1,
    explanation: 'மனித உடலின் மிக நீளமான மற்றும் வலிமையான எலும்பு தொடை எலும்பு (Femur / Thigh bone) ஆகும்.',
    subject: 'General Science'
  },
  {
    id: 'tn4-008',
    text: 'தாவரங்கள் ஒளிச்சேர்க்கையின் (Photosynthesis) போது வெளிவிடும் வாயு எது?',
    options: ['காரபன் டை ஆக்சைடு (CO₂)', 'நைட்ரஜன் (N₂)', 'ஆக்ஸிஜன் (O₂)', 'ஹைட்ரஜன் (H₂)'],
    correctAnswerIndex: 2,
    explanation: 'தாவரங்கள் சூரிய ஒளி மற்றும் பச்சைய உதவியுடன் கார்பன் டை ஆக்சைடை உட்கொண்டு ஆக்ஸிஜன் வாயுவை வெளிவிடுகின்றன.',
    subject: 'General Science'
  },
  {
    id: 'tn4-009',
    text: '₹400 தொகையை A மற்றும் B இருவருக்கு 3:5 என்ற விகிதத்தில் பிரித்தால், இருவரின் பங்கிற்கும் உள்ள வித்தியாசம் எவ்வளவு?',
    options: ['₹50', '₹100', '₹150', '₹200'],
    correctAnswerIndex: 1,
    explanation: 'மொத்த பங்குகள் = 3 + 5 = 8. ஒரு பங்கு = 400/8 = ₹50. A பங்கு = 150, B பங்கு = 250. வித்தியாசம் = 250 - 150 = ₹100.',
    subject: 'Aptitude'
  },
  {
    id: 'tn4-010',
    text: 'சூரியநாராயண சாஸ்திரியார் என்ற தனது வடமொழிப் பெயரை "பரிதிமாற்கலைஞன்" எனத் தூய தமிழில் மாற்றிக் கொண்ட தமிழறிஞர் யார்?',
    options: ['மறைமலை அடிகள்', 'பரிதிமாற்கலைஞர்', 'திரு.வி.க', 'தேவநேயப் பாவாணர்'],
    correctAnswerIndex: 1,
    explanation: 'வி.கோ. சூரியநாராயண சாஸ்திரியார் தமக்கிருந்த தூய தமிழ் ஆர்வத்தால் தம் பெயரை "பரிதிமாற்கலைஞன்" என மாற்றிக் கொண்டார்.',
    subject: 'General Tamil'
  },
  {
    id: 'tn4-011',
    text: 'பாஞ்சாலி சபதம், குயில் பாட்டு, கண்ணன் பாட்டு ஆகிய புகழ்பெற்ற கவிதை நூல்களை இயற்றியவர் யார்?',
    options: ['பாரதிதாசன்', 'மகாகவி சுப்பிரமணிய பாரதியார்', 'கவிமணி தேசிய விநாயகம்', 'நாமக்கல் கவிஞர்'],
    correctAnswerIndex: 1,
    explanation: 'மகாகவி சுப்பிரமணிய பாரதியார் பாஞ்சாலி சபதம், குயில் பாட்டு, கண்ணன் பாட்டு போன்ற অমর காவியங்களைப் படைத்துள்ளார்.',
    subject: 'General Tamil'
  },
  {
    id: 'tn4-012',
    text: 'சுருக்குக: 1/2 + 1/4 + 1/8 மதிப்பு என்ன?',
    options: ['3/8', '5/8', '7/8', '1'],
    correctAnswerIndex: 2,
    explanation: 'பொதுப் பகுதி 8. (4 + 2 + 1) / 8 = 7/8.',
    subject: 'Aptitude'
  }
];

// ==========================================
// 5. SSC CGL QUESTION POOL
// ==========================================
export const SSC_CGL_QUESTION_POOL: Question[] = [
  {
    id: 'ssc-001',
    text: 'A sum of ₹12,000 becomes ₹15,972 in 3 years at x% per annum compounded annually. What is the value of x?',
    options: ['8%', '10%', '12%', '15%'],
    correctAnswerIndex: 1,
    explanation: 'Amount formula: 15972 / 12000 = (1 + x/100)³ -> 1.331 = (1 + x/100)³. Since (1.1)³ = 1.331, x = 10%.',
    subject: 'Quantitative Aptitude'
  },
  {
    id: 'ssc-002',
    text: 'Select the synonym of the given word: "OBSTINATE"',
    options: ['Stubborn', 'Flexible', 'Pliant', 'Submissive'],
    correctAnswerIndex: 0,
    explanation: '"Obstinate" means stubbornly adhering to an opinion or purpose. "Stubborn" is its exact synonym.',
    subject: 'English Language'
  },
  {
    id: 'ssc-003',
    text: 'If in a certain code language, "CAT" is written as "24267", how is "DOG" written in that code?',
    options: ['231220', '201223', '231507', '221520'],
    correctAnswerIndex: 0,
    explanation: 'Letters coded by reverse alphabet positions (Z=1 to A=26): C(24), A(26), T(7). For DOG: D(23), O(12), G(20) -> 231220.',
    subject: 'Reasoning'
  },
  {
    id: 'ssc-004',
    text: 'Which Article of the Indian Constitution empowers the President to declare a Financial Emergency?',
    options: ['Article 352', 'Article 356', 'Article 360', 'Article 368'],
    correctAnswerIndex: 2,
    explanation: 'Article 360 empowers the President to declare Financial Emergency if financial stability is threatened.',
    subject: 'General Awareness'
  },
  {
    id: 'ssc-005',
    text: 'If tan θ + cot θ = 2, then what is the value of tan² θ + cot² θ?',
    options: ['1', '2', '4', '0'],
    correctAnswerIndex: 1,
    explanation: 'Squaring both sides: (tan θ + cot θ)² = 4 -> tan² θ + cot² θ + 2(tan θ * cot θ) = 4 -> tan² θ + cot² θ + 2 = 4 -> 2.',
    subject: 'Quantitative Aptitude'
  },
  {
    id: 'ssc-006',
    text: 'Select the antonym of the word: "METICULOUS"',
    options: ['Careful', 'Careless', 'Thorough', 'Precise'],
    correctAnswerIndex: 1,
    explanation: '"Meticulous" means showing great attention to detail. Its opposite is "Careless".',
    subject: 'English Language'
  },
  {
    id: 'ssc-007',
    text: 'What is the meaning of the idiom "To burn the candle at both ends"?',
    options: ['To waste money recklessly', 'To work continuously from early morning till late night', 'To cause a fire hazard', 'To be extra careful'],
    correctAnswerIndex: 1,
    explanation: 'The idiom "To burn the candle at both ends" means to exhaust one\'s strength by working long hours without adequate rest.',
    subject: 'English Language'
  },
  {
    id: 'ssc-008',
    text: 'If x + 1/x = 3, what is the value of x² + 1/x²?',
    options: ['5', '7', '9', '11'],
    correctAnswerIndex: 1,
    explanation: 'Squaring both sides: (x + 1/x)² = 9 -> x² + 1/x² + 2 = 9 -> x² + 1/x² = 7.',
    subject: 'Quantitative Aptitude'
  },
  {
    id: 'ssc-009',
    text: 'In which year was the historic Battle of Plassey fought between British East India Company and Nawab Siraj-ud-Daulah?',
    options: ['1757', '1764', '1857', '1761'],
    correctAnswerIndex: 0,
    explanation: 'The Battle of Plassey was fought on June 23, 1757, laying the foundation of British rule in India.',
    subject: 'General Awareness'
  },
  {
    id: 'ssc-010',
    text: 'Shortcut key to permanently delete a file or folder in Windows operating system bypassing Recycle Bin:',
    options: ['Ctrl + Delete', 'Shift + Delete', 'Alt + Delete', 'Windows + Delete'],
    correctAnswerIndex: 1,
    explanation: 'Pressing Shift + Delete bypasses the Recycle Bin and deletes the item permanently from the filesystem.',
    subject: 'Computer Knowledge'
  },
  {
    id: 'ssc-011',
    text: 'What is the total surface area of a solid hemisphere of radius 7 cm?',
    options: ['308 cm²', '462 cm²', '616 cm²', '154 cm²'],
    correctAnswerIndex: 1,
    explanation: 'Total Surface Area of hemisphere = 3 π r² = 3 * (22/7) * 7 * 7 = 3 * 22 * 7 = 462 cm².',
    subject: 'Quantitative Aptitude'
  },
  {
    id: 'ssc-012',
    text: 'Chemical formula of Baking Soda used in kitchen and food industry:',
    options: ['Na₂CO₃', 'NaHCO₃', 'NaOH', 'CaOCl₂'],
    correctAnswerIndex: 1,
    explanation: 'Baking Soda is Sodium Bicarbonate (NaHCO₃). Washing soda is Na₂CO₃, caustic soda is NaOH.',
    subject: 'General Science'
  }
];

// ==========================================
// 6. RRB NTPC QUESTION POOL
// ==========================================
export const RRB_NTPC_QUESTION_POOL: Question[] = [
  {
    id: 'rrb-001',
    text: 'A train 150 m long passes a post in 12 s. In how much time will it pass a bridge 250 m long?',
    options: ['20 s', '24 s', '32 s', '40 s'],
    correctAnswerIndex: 2,
    explanation: 'Speed = 150 / 12 = 12.5 m/s. Distance for bridge = 150 + 250 = 400 m. Time = 400 / 12.5 = 32 seconds.',
    subject: 'Mathematics'
  },
  {
    id: 'rrb-002',
    text: 'In which city is the National Academy of Indian Railways (NAIR) situated?',
    options: ['New Delhi', 'Vadodara', 'Secunderabad', 'Pune'],
    correctAnswerIndex: 1,
    explanation: 'The National Academy of Indian Railways (NAIR), formerly Railway Staff College, is in Vadodara, Gujarat.',
    subject: 'General Awareness'
  },
  {
    id: 'rrb-003',
    text: 'Complete the analogy: COAL : HEAT :: WAX : ?',
    options: ['Energy', 'Candle', 'Light', 'Bee'],
    correctAnswerIndex: 2,
    explanation: 'Burning coal produces heat; burning wax produces light (as in a candle flame).',
    subject: 'Reasoning'
  },
  {
    id: 'rrb-004',
    text: 'Which Indian Railway zone operates the highest altitude railway station in India, "Ghum" (2,258 m)?',
    options: ['Northern Railway', 'Northeast Frontier Railway', 'Southern Railway', 'Western Railway'],
    correctAnswerIndex: 1,
    explanation: 'Ghum station on the Darjeeling Himalayan Railway (2,258 m) is operated by Northeast Frontier Railway.',
    subject: 'General Awareness'
  },
  {
    id: 'rrb-005',
    text: 'Where is the world\'s longest railway platform (1,507 meters) located?',
    options: ['Gorakhpur, UP', 'Shree Siddharoodha Swamiji Hubballi Station, Karnataka', 'Kollam Junction, Kerala', 'Kharagpur, West Bengal'],
    correctAnswerIndex: 1,
    explanation: 'Hubballi Junction (Shree Siddharoodha Swamiji Station) in Karnataka features the world\'s longest platform at 1,507 m.',
    subject: 'General Awareness'
  },
  {
    id: 'rrb-006',
    text: 'In which year was India\'s first passenger train run between Mumbai (Bori Bunder) and Thane?',
    options: ['1832', '1853', '1881', '1905'],
    correctAnswerIndex: 1,
    explanation: 'India\'s first passenger train ran on April 16, 1853, covering 34 km between Bori Bunder and Thane.',
    subject: 'General Awareness'
  },
  {
    id: 'rrb-007',
    text: 'What is the SI unit of Electric Current?',
    options: ['Volt', 'Ohm', 'Ampere', 'Watt'],
    correctAnswerIndex: 2,
    explanation: 'Ampere (A) is the base SI unit of electric current.',
    subject: 'General Science'
  },
  {
    id: 'rrb-008',
    text: 'The product of two numbers is 120 and their HCF is 2. What is their LCM?',
    options: ['30', '40', '60', '120'],
    correctAnswerIndex: 2,
    explanation: 'Formula: Product of numbers = HCF * LCM -> 120 = 2 * LCM -> LCM = 60.',
    subject: 'Mathematics'
  },
  {
    id: 'rrb-009',
    text: 'Which manufacturing facility produces the indigenous Vande Bharat Express semi-high speed trains?',
    options: ['Integral Coach Factory (ICF), Chennai', 'Rail Coach Factory (RCF), Kapurthala', 'Diesel Locomotive Works, Varanasi', 'Chittaranjan Locomotive Works'],
    correctAnswerIndex: 0,
    explanation: 'Integral Coach Factory (ICF) in Perambur, Chennai designed and manufactures Vande Bharat Express trains.',
    subject: 'General Awareness'
  },
  {
    id: 'rrb-010',
    text: 'Convert a speed of 72 km/h into m/s:',
    options: ['15 m/s', '18 m/s', '20 m/s', '25 m/s'],
    correctAnswerIndex: 2,
    explanation: 'Multiply by 5/18: 72 * (5/18) = 4 * 5 = 20 m/s.',
    subject: 'Mathematics'
  },
  {
    id: 'rrb-011',
    text: 'Which blood group is known as the Universal Donor?',
    options: ['A Positive', 'B Negative', 'AB Positive', 'O Negative'],
    correctAnswerIndex: 3,
    explanation: 'O Negative (O -ve) lacks A, B, and Rh antigens, making it the universal donor blood group.',
    subject: 'General Science'
  },
  {
    id: 'rrb-012',
    text: 'Complete the number series: 2, 6, 12, 20, 30, ?',
    options: ['36', '40', '42', '48'],
    correctAnswerIndex: 2,
    explanation: 'Pattern is n² + n: 1²+1=2, 2²+2=6, 3²+3=12, 4²+4=20, 5²+5=30, 6²+6=42.',
    subject: 'Reasoning'
  }
];

// ==========================================
// 7. IIT JEE QUESTION POOL
// ==========================================
export const IIT_JEE_QUESTION_POOL: Question[] = [
  {
    id: 'jee-001',
    text: 'In Young\'s Double Slit Experiment (YDSE), if the slit separation d is halved and slit-to-screen distance D is doubled, what happens to fringe width β?',
    options: ['Remains unchanged', 'Doubled', 'Halved', 'Increases by 4 times'],
    correctAnswerIndex: 3,
    explanation: 'Fringe width β = λD / d. New width β\' = λ(2D) / (d/2) = 4 (λD/d) = 4β.',
    subject: 'Physics'
  },
  {
    id: 'jee-002',
    text: 'Which coordination complex ion exhibits optical isomerism?',
    options: ['[Co(NH₃)₆]³⁺', 'cis-[Co(en)₂Cl₂]⁺', 'trans-[Co(en)₂Cl₂]⁺', '[Ni(CN)₄]²⁻'],
    correctAnswerIndex: 1,
    explanation: 'cis-[Co(en)₂Cl₂]⁺ lacks plane and center of symmetry, making it chiral and optically active.',
    subject: 'Chemistry'
  },
  {
    id: 'jee-003',
    text: 'If A is a 3 × 3 non-singular matrix such that A Aᵀ = Aᵀ A and B = A⁻¹ Aᵀ, what is B Bᵀ equal to?',
    options: ['I (Identity Matrix)', 'A', 'B²', 'A⁻¹'],
    correctAnswerIndex: 0,
    explanation: 'B Bᵀ = (A⁻¹ Aᵀ) (A⁻¹ Aᵀ)ᵀ = (A⁻¹ Aᵀ) (A (A⁻¹)ᵀ) = A⁻¹ (A Aᵀ) (Aᵀ)⁻¹ = I.',
    subject: 'Mathematics'
  },
  {
    id: 'jee-004',
    text: 'An ideal gas undergoes isothermal expansion at temperature T from volume V to 2V. Work done per mole is:',
    options: ['RT ln 2', '2 RT', 'RT / 2', 'Zero'],
    correctAnswerIndex: 0,
    explanation: 'Work done in reversible isothermal expansion W = nRT ln(V₂/V₁) = RT ln 2 for 1 mole.',
    subject: 'Physics'
  },
  {
    id: 'jee-005',
    text: 'Which ion has the highest molar conductivity at infinite dilution in aqueous solution?',
    options: ['Li⁺', 'Na⁺', 'K⁺', 'H⁺'],
    correctAnswerIndex: 3,
    explanation: 'H⁺ has exceptionally high ionic mobility and molar conductivity in water via the Grotthuss proton relay mechanism.',
    subject: 'Chemistry'
  },
  {
    id: 'jee-006',
    text: 'A particle moves along a line such that v = α√x (α > 0). What is the acceleration of the particle?',
    options: ['α / 2', 'α² / 2', 'α²', '2 α²'],
    correctAnswerIndex: 1,
    explanation: 'Acceleration a = v (dv/dx) = (α x^(1/2)) * (α / (2 x^(1/2))) = α² / 2.',
    subject: 'Physics'
  },
  {
    id: 'jee-007',
    text: 'Which organic halide will undergo SN1 reaction at the fastest rate?',
    options: ['CH₃-CH₂-Cl', 'CH₂=CH-CH₂-Cl (Allyl chloride)', '(CH₃)₃C-Cl (tert-Butyl chloride)', 'C₆H₅-CH₂-Cl (Benzyl chloride)'],
    correctAnswerIndex: 3,
    explanation: 'Benzyl carbocation C₆H₅-CH₂⁺ is stabilized by resonance across the aromatic ring, reacting fastest via SN1.',
    subject: 'Chemistry'
  },
  {
    id: 'jee-008',
    text: 'Evaluate the limit: lim_{x -> 0} (tan x - sin x) / x³',
    options: ['0', '1 / 2', '1', '2'],
    correctAnswerIndex: 1,
    explanation: '(tan x - sin x)/x³ = sin x (1 - cos x)/(x³ cos x) = (sin x / x) * (2 sin²(x/2) / x²) * (1/cos x) -> 1 * 2*(1/4) * 1 = 1/2.',
    subject: 'Mathematics'
  },
  {
    id: 'jee-009',
    text: 'The electric field inside a uniformly charged thin spherical shell of radius R carrying charge Q is:',
    options: ['kQ / R²', 'kQ / r²', 'Zero', 'kQ / 2R²'],
    correctAnswerIndex: 2,
    explanation: 'By Gauss\'s Law, the enclosed charge inside any Gaussian surface internal to a thin spherical shell is zero, so E = 0.',
    subject: 'Physics'
  },
  {
    id: 'jee-010',
    text: 'The Reimer-Tiemann reaction converts phenol into which aromatic aldehyde in the presence of CHCl₃ and KOH?',
    options: ['Benzaldehyde', 'Salicylaldehyde', 'Benzoic acid', 'Anisole'],
    correctAnswerIndex: 1,
    explanation: 'Phenol reacts with chloroform and aqueous KOH to form o-hydroxybenzaldehyde (Salicylaldehyde) via dichlorocarbene intermediate.',
    subject: 'Chemistry'
  },
  {
    id: 'jee-011',
    text: 'Evaluate the definite integral: ∫₀¹ (1 / (1 + x²)) dx',
    options: ['π / 2', 'π / 4', 'π / 3', '1'],
    correctAnswerIndex: 1,
    explanation: '∫ (1/(1+x²)) dx = tan⁻¹(x). From 0 to 1: tan⁻¹(1) - tan⁻¹(0) = π/4 - 0 = π/4.',
    subject: 'Mathematics'
  },
  {
    id: 'jee-012',
    text: 'Efficiency of a Carnot engine operating between a heat source at 600 K and a sink at 300 K is:',
    options: ['25%', '33.3%', '50%', '75%'],
    correctAnswerIndex: 2,
    explanation: 'Efficiency η = 1 - T_sink / T_source = 1 - 300/600 = 0.5 = 50%.',
    subject: 'Physics'
  }
];

// Master Dictionary Mapping Exam Types to Pools
export const EXAM_QUESTION_POOLS: Record<ExamType, Question[]> = {
  UPSC: UPSC_QUESTION_POOL,
  TNPSC_G1: TNPSC_G1_QUESTION_POOL,
  TNPSC_G2: TNPSC_G2_QUESTION_POOL,
  TNPSC_G4: TNPSC_G4_QUESTION_POOL,
  SSC_CGL: SSC_CGL_QUESTION_POOL,
  RRB_NTPC: RRB_NTPC_QUESTION_POOL,
  IIT_JEE: IIT_JEE_QUESTION_POOL,
};

// Backwards-compatible aliases
export const AUTHENTIC_POLITY_POOL = UPSC_QUESTION_POOL.filter(q => q.subject === 'Polity');
export const AUTHENTIC_HISTORY_POOL = UPSC_QUESTION_POOL.filter(q => q.subject === 'History');
export const AUTHENTIC_ECONOMY_POOL = UPSC_QUESTION_POOL.filter(q => q.subject === 'Economy');
export const AUTHENTIC_TAMIL_POOL = TNPSC_G4_QUESTION_POOL.filter(q => q.subject === 'General Tamil');

// Generative Math helper
export function generateAptitudeQuestion(seed: number): Question {
  const p = 5000 + (seed % 5) * 1000;
  const r = 10;
  const t = 2;
  const si = (p * r * t) / 100;
  return {
    id: `gen-apt-si-${seed}`,
    text: `A person borrows ₹${p} at a simple interest rate of ${r}% per annum. What is the total interest payable at the end of ${t} years?`,
    options: [`₹${si - 100}`, `₹${si}`, `₹${si + 100}`, `₹${si + 200}`],
    correctAnswerIndex: 1,
    explanation: `SI = (P * R * T) / 100 = (${p} * ${r} * ${t}) / 100 = ₹${si}.`,
    subject: 'Aptitude'
  };
}

/**
 * Master Question Selection Function
 * Guarantees NO duplicate questions within the selected array,
 * category-specific question pools for each of the 7 exam types,
 * and optional cross-category deduplication when batch generating!
 */
export function getQuestionsForExam(
  exam: ExamType,
  seedOffset: number = 0,
  count: number = 5,
  globalUsedIds?: Set<string>
): Question[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const baseSeed = year * 1000 + month * 100 + date + seedOffset;

  const pool = EXAM_QUESTION_POOLS[exam] || EXAM_QUESTION_POOLS.UPSC;
  const result: Question[] = [];
  const localUsed = new Set<string>();

  // Distinct offset per exam so different exams don't align on identical indices
  const examOffsets: Record<string, number> = {
    UPSC: 0,
    TNPSC_G1: 2,
    TNPSC_G2: 4,
    TNPSC_G4: 6,
    SSC_CGL: 8,
    RRB_NTPC: 10,
    IIT_JEE: 12
  };
  const eOffset = examOffsets[exam] || 0;

  for (let step = 0; step < pool.length * 3 && result.length < count; step++) {
    const idx = (baseSeed + eOffset + step * 2) % pool.length;
    const q = pool[idx];

    // Skip if already selected locally
    if (localUsed.has(q.id)) continue;

    // Skip if already selected globally across batch categories
    if (globalUsedIds && globalUsedIds.has(q.id)) continue;

    localUsed.add(q.id);
    if (globalUsedIds) globalUsedIds.add(q.id);
    result.push({ ...q });
  }

  // Safeguard fallback: if pool items were filtered out by globalUsedIds, fill remaining from local pool
  if (result.length < count) {
    for (let i = 0; i < pool.length && result.length < count; i++) {
      const q = pool[i];
      if (!localUsed.has(q.id)) {
        localUsed.add(q.id);
        result.push({ ...q });
      }
    }
  }

  return result;
}
