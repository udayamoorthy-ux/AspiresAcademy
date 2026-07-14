/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExamType, EssayPrompt, Question, GKArticle } from './types';

export const EXAM_DETAILS = {
  UPSC: {
    title: 'UPSC Civil Services Exam (CSE)',
    shortName: 'UPSC IAS/IPS',
    stages: [
      { name: 'Stage 1: Prelims', details: 'GS Paper I (100 MCQs, 200 Marks) & CSAT Paper II (80 MCQs, 200 Marks, 33% qualifying)' },
      { name: 'Stage 2: Mains', details: '9 Descriptive Papers (including Essay, 4 GS Papers, and 2 Optional Papers; 1750 total marks)' },
      { name: 'Stage 3: Personality Test', details: 'Interview assessing suitability for administrative services (275 marks)' },
    ],
    syllabus: [
      { subject: 'History of India & Indian National Movement', description: 'Ancient, Medieval, and Modern Indian history with a focus on freedom struggle.' },
      { subject: 'Indian Polity & Governance', description: 'Constitution, political system, Panchayati Raj, public policy, and rights issues.' },
      { subject: 'Indian & World Geography', description: 'Physical, social, and economic geography of India and the world.' },
      { subject: 'Economic & Social Development', description: 'Sustainable development, poverty, inclusion, demographics, and social sector initiatives.' },
      { subject: 'Environment & General Science', description: 'Biodiversity, climate change, and general scientific advancements.' },
    ],
  },
  TNPSC_G1: {
    title: 'TNPSC Group I (Deputy Collector, DSP)',
    shortName: 'TNPSC Group I',
    stages: [
      { name: 'Prelims', details: 'Single GS Paper (200 MCQs, 300 Marks; contains Aptitude & Mental Ability)' },
      { name: 'Mains', details: '4 Descriptive Papers (Paper I Tamil Eligibility, Paper II, III, & IV General Studies; 750 total marks)' },
      { name: 'Interview', details: 'Personality assessment (100 marks)' },
    ],
    syllabus: [
      { subject: 'History and Culture of India', description: 'Indus Valley civilization, Guptas, Delhi Sultans, Mughals, Marathas, and modern India.' },
      { subject: 'History, Culture, Heritage and Socio-Political Movements in Tamil Nadu', description: 'Thirukkural, Sangam age, archaeological discoveries, and Tamil social reform movements.' },
      { subject: 'Development Administration in Tamil Nadu', description: 'Human Development Indicators, social justice, and economic growth in TN.' },
      { subject: 'General Science & Geography of India', description: 'Scientific laws, physical geography with a focus on Tamil Nadu.' },
      { subject: 'Aptitude & Mental Ability', description: 'Simplification, percentage, HCF, LCM, ratio, interest, area, volume, logical reasoning.' },
    ],
  },
  TNPSC_G2: {
    title: 'TNPSC Group II & IIA (Sub Registrar, Municipal Comm.)',
    shortName: 'TNPSC Group II',
    stages: [
      { name: 'Prelims', details: 'GS (175 Questions) + Aptitude (25 Questions) = 200 MCQs (300 Marks)' },
      { name: 'Mains (Group II only)', details: 'Paper I Tamil Eligibility (100 Marks, qualifying) & Paper II General Studies (Descriptive, 300 Marks)' },
    ],
    syllabus: [
      { subject: 'General Tamil or General English', description: 'Grammar, literature, authors and their works (Highly scoring, crucial for Group II prelims).' },
      { subject: 'Aptitude & Mental Ability', description: 'Aptitude tests covering percentage, compound interest, time & work, data interpretation.' },
      { subject: 'Socio-Cultural History of India & Tamil Nadu', description: 'Focus on regional developments, self-respect movement, and Dravidian heritage.' },
      { subject: 'Indian Economy & Constitution', description: 'Planning commission/NITI Aayog, GST, federal structure, state-center relations.' },
    ],
  },
  TNPSC_G4: {
    title: 'TNPSC Group IV (VAO, Junior Assistant, Typist)',
    shortName: 'TNPSC Group IV',
    stages: [
      { name: 'Single Written Exam', details: 'One Paper containing Part A Tamil Eligibility & Scoring (100 MCQs) & Part B GS + Aptitude (100 MCQs). Total 300 Marks.' },
    ],
    syllabus: [
      { subject: 'Part A: General Tamil (பொதுத்தமிழ்)', description: 'Grammar (இலக்கணம்), Literature (இலக்கியம்), Tamil Scholars (தமிழ் அறிஞர்களும் தமிழ்த் தொண்டும்).' },
      { subject: 'Part B: General Studies', description: 'Physics, Chemistry, Biology, History, Indian National Movement, Polity, and Current Events.' },
      { subject: 'Part B: Aptitude & Mental Ability', description: 'Mental math, ratio, simplification, logical reasoning, and basic word problems.' },
    ],
  },
  SSC_CGL: {
    title: 'SSC Combined Graduate Level (CGL) Exam',
    shortName: 'SSC CGL',
    stages: [
      { name: 'Tier 1: Preliminary Exam', details: '4 Sections: General Intelligence & Reasoning (25 Qs), General Awareness (25 Qs), Quantitative Aptitude (25 Qs), English Comprehension (25 Qs). Total 100 MCQs, 200 Marks.' },
      { name: 'Tier 2: Mains Exam', details: 'Mathematical Abilities (30 Qs), Reasoning & General Intelligence (30 Qs), English Language & Comprehension (45 Qs), General Awareness (25 Qs), Computer Knowledge (20 Qs) and Data Entry Speed Test.' },
    ],
    syllabus: [
      { subject: 'Quantitative Aptitude', description: 'Percentage, Ratio, Profit & Loss, Simple & Compound Interest, Algebra, Geometry, Mensuration, Trigonometry.' },
      { subject: 'General Intelligence & Reasoning', description: 'Analogy, Classification, Syllogism, Blood Relations, Coding-Decoding, Non-verbal series, Venn diagrams.' },
      { subject: 'English Language & Comprehension', description: 'Spot the Error, Fill in the Blanks, Synonyms/Antonyms, Idioms & Phrases, Active/Passive Voice, Direct/Indirect, Cloze Test.' },
      { subject: 'General Awareness', description: 'History, Culture, Geography, Economic Scene, General Policy, Scientific Research, Current Affairs.' },
      { subject: 'Computer Knowledge', description: 'Computer Basics, Software (MS Office), Working with Internet and Emails, Basics of Cyber Security.' },
    ],
  },
  RRB_NTPC: {
    title: 'RRB NTPC (Non-Technical Popular Categories) Exam',
    shortName: 'RRB NTPC',
    stages: [
      { name: 'Stage 1 CBT', details: '3 Sections: Mathematics (30 Qs), General Intelligence & Reasoning (30 Qs), General Awareness (40 Qs). Total 100 MCQs, 100 Marks. Time: 90 Mins.' },
      { name: 'Stage 2 CBT', details: 'Mathematics (35 Qs), General Intelligence & Reasoning (35 Qs), General Awareness (50 Qs). Total 120 MCQs, 120 Marks. Time: 90 Mins.' },
      { name: 'CBAT / Typing Test', details: 'Computer Based Aptitude Test (for Station Master/Traffic Assistant) or Typing Skill Test (for clerk positions).' }
    ],
    syllabus: [
      { subject: 'Mathematics', description: 'Number System, Decimals, Fractions, LCM, HCF, Ratio & Proportion, Percentage, Mensuration, Time & Work, Time & Distance, Simple & Compound Interest, Profit & Loss, Elementary Algebra, Geometry, Trigonometry, Elementary Statistics.' },
      { subject: 'General Intelligence & Reasoning', description: 'Analogies, Completion of Number and Alphabetical Series, Coding and Decoding, Mathematical Operations, Similarities and Differences, Relationships, Analytical Reasoning, Syllogism, Jumbling, Venn Diagrams, Puzzle, Data Sufficiency, Statement-Conclusion, Statement-Courses of Action, Decision Making, Maps, Interpretation of Graphs.' },
      { subject: 'General Awareness', description: 'Current Events of National and International Importance, Games and Sports, Art and Culture of India, Indian Literature, Monuments and Places of India, General Science and Life Science (up to 10th CBSE), History of India and Freedom Struggle, Physical, Social and Economic Geography of India and World, Indian Polity and Constitution, General Scientific and Technological Developments, Environmental Issues, Basics of Computers.' }
    ],
  },
};

export const DEFAULT_ESSAY_PROMPTS: EssayPrompt[] = [
  {
    id: 'essay-1',
    title: 'The Role of Artificial Intelligence in India\'s Administrative Governance',
    context: 'Discuss how artificial intelligence can streamline public service delivery in India, enhance administrative speed, and reduce corruption, while keeping in mind data security, privacy, and accessibility in rural sectors.',
    category: 'UPSC GS Paper IV / Essay',
    wordCountTarget: 1000,
  },
  {
    id: 'essay-2',
    title: 'Federalism in India: Center-State Relations & Financial Autonomy',
    context: 'Examine the evolution of federalism in India, particularly highlighting the role of the Finance Commission, GST council, and resolving conflicts between Union mandates and State autonomy.',
    category: 'UPSC GS Paper II',
    wordCountTarget: 800,
  },
  {
    id: 'essay-3',
    title: 'The Significance of Thirukkural in Modern Administrative Ethics',
    context: 'திருக்குறள் கூறும் அறநெறிகள் இன்றைய நிர்வாகத்திற்கு எவ்வாறு பொருந்தும் என்பதை விளக்குக. Detail how the ethical teachings of Thirukkural regarding leadership, integrity, and social justice apply to modern civil servants.',
    category: 'TNPSC Group I/II General Tamil / Heritage',
    wordCountTarget: 500,
  },
  {
    id: 'essay-4',
    title: 'Development Administration Model of Tamil Nadu: Social Justice & Welfare',
    context: 'Analyze the "Tamil Nadu Model" of development that balances rapid industrialization/economic growth with extensive affirmative action, healthcare, and education welfare programs.',
    category: 'TNPSC Group I/II Paper III',
    wordCountTarget: 800,
  },
];

export const STATIC_QUIZ_QUESTIONS: Record<ExamType, Question[]> = {
  UPSC: [
    {
      id: 'upsc-q1',
      text: 'Which of the following is correct regarding the "Basic Structure" doctrine of the Indian Constitution?',
      options: [
        'It was first formulated in the Shankari Prasad case (1951).',
        'It is explicitly defined in Article 368 of the Constitution.',
        'It was established by the Supreme Court in the Kesavananda Bharati case (1973) and limits the amending power of the Parliament.',
        'It holds that Parliament has absolute, unlimited power to amend any part of the Constitution including fundamental rights.',
      ],
      correctAnswerIndex: 2,
      explanation: 'The Supreme Court of India outlined the Basic Structure doctrine in the historic Kesavananda Bharati v. State of Kerala case (1973). It held that while Parliament has wide power to amend the Constitution under Article 368, it cannot alter or destroy its essential features or "basic structure".',
      subject: 'Polity',
    },
    {
      id: 'upsc-q2',
      text: 'Consider the following statements regarding the "NITI Aayog":\n1. It is a statutory body established by an Act of Parliament.\n2. The Prime Minister serves as its ex-officio Chairperson.\n\nWhich of the statements given above is/are correct?',
      options: [
        '1 only',
        '2 only',
        'Both 1 and 2',
        'Neither 1 nor 2',
      ],
      correctAnswerIndex: 1,
      explanation: 'NITI Aayog is neither a constitutional nor a statutory body. It was established by an executive resolution of the Union Cabinet in 2015 to replace the Planning Commission. The Prime Minister is indeed its ex-officio Chairperson, making statement 2 correct.',
      subject: 'Polity',
    },
    {
      id: 'upsc-q3',
      text: 'The term "Capital Adequacy Ratio (CAR)" is associated with which sector?',
      options: [
        'Agriculture Sector',
        'Banking Sector',
        'Foreign Trade Sector',
        'Telecommunication Sector',
      ],
      correctAnswerIndex: 1,
      explanation: 'Capital Adequacy Ratio (CAR), also known as Capital-to-Risk Weighted Assets Ratio (CRAR), is a metric used to measure a bank\'s available capital to ensure it can absorb a reasonable amount of loss before becoming insolvent.',
      subject: 'Economy',
    },
    {
      id: 'upsc-q4',
      text: 'Which of the following layers of the atmosphere is responsible for reflecting radio waves back to the Earth\'s surface?',
      options: [
        'Troposphere',
        'Stratosphere',
        'Mesosphere',
        'Ionosphere',
      ],
      correctAnswerIndex: 3,
      explanation: 'The Ionosphere (part of the Thermosphere) contains ionized particles that reflect radio waves back to Earth, facilitating long-distance wireless radio communication.',
      subject: 'Geography',
    },
    {
      id: 'upsc-q5',
      text: 'The primary purpose of the "Montagu-Chelmsford Reforms" of 1919 was to:',
      options: [
        'Introduce complete provincial autonomy.',
        'Establish diarchy in the provinces.',
        'Grant dominion status to India.',
        'Separate state budgets from the central budget completely.',
      ],
      correctAnswerIndex: 1,
      explanation: 'The Government of India Act 1919 (Montagu-Chelmsford Reforms) introduced "Diarchy" (rule by two authorities) in the provinces. Under this, provincial subjects were divided into "Transferred" and "Reserved" subjects.',
      subject: 'History',
    }
  ],
  TNPSC_G1: [
    {
      id: 'tn-g1-q1',
      text: 'Under whose leadership was the Self-Respect Movement (சுயமரியாதை இயக்கம்) launched in Tamil Nadu in 1925?',
      options: [
        'C. N. Annadurai',
        'E. V. Ramasamy (Periyar)',
        'C. Rajagopalachari',
        'K. Kamaraj',
      ],
      correctAnswerIndex: 1,
      explanation: 'E.V. Ramasamy, affectionately called Periyar, started the Self-Respect Movement in 1925 in Tamil Nadu to advocate for an equal society free of caste discrimination and backward traditions.',
      subject: 'Tamil Heritage',
    },
    {
      id: 'tn-g1-q2',
      text: 'According to Thirukkural, which of the following is considered the greatest virtue (அறம்)?',
      options: [
        'Sustaining wealth (பொருள் ஈட்டல்)',
        'Speaking pleasant words and non-injury (இனியவை கூறல் மற்றும் இன்னா செய்யாமை / கொல்லாமை)',
        'Acquiring absolute fame (புகழ் அடைதல்)',
        'Ruling with strict punishment (கடுங்கோல் ஆட்சி)',
      ],
      correctAnswerIndex: 1,
      explanation: 'Thirukkural emphasizes non-injury (அகிம்சை/இன்னா செய்யாமை) and vegetarianism/non-killing (கொல்லாமை) as supreme virtues. Speaking sweet words (இனியவை கூறல்) is also highlighted as a foundational virtue.',
      subject: 'Thirukkural',
    },
    {
      id: 'tn-g1-q3',
      text: 'The famous Sangam age archaeological site "Keezhadi" is located in which district of Tamil Nadu?',
      options: [
        'Madurai',
        'Sivagangai',
        'Thanjavur',
        'Thoothukudi',
      ],
      correctAnswerIndex: 1,
      explanation: 'Keezhadi (Keezhadhi) is an active Sangam era archaeological site located in the Sivagangai district of Tamil Nadu, situated near Madurai along the Vaigai river basin.',
      subject: 'History',
    }
  ],
  TNPSC_G2: [
    {
      id: 'tn-g2-q1',
      text: 'Who is known as the "Father of the Dravidian Movement" in Tamil Nadu?',
      options: [
        'Dr. C. Natesanar',
        'Sir P. T. Theagaraya Chetty',
        'E. V. Ramasamy',
        'Dr. T. M. Nair',
      ],
      correctAnswerIndex: 0,
      explanation: 'Dr. C. Natesanar is regarded as the Father of the Dravidian Movement. He founded the Madras United League (later Madras Dravidian Association) in 1912 and was instrumental in bringing Non-Brahmin leaders together to form the Justice Party.',
      subject: 'Tamil Heritage',
    },
    {
      id: 'tn-g2-q2',
      text: 'If a sum of ₹10,000 yields ₹2,000 simple interest over 2 years, what is the annual rate of interest?',
      options: [
        '5%',
        '8%',
        '10%',
        '12%',
      ],
      correctAnswerIndex: 2,
      explanation: 'Simple Interest (SI) = (P * R * T) / 100. Here, 2000 = (10000 * R * 2) / 100 -> 2000 = 200 * R -> R = 10%.',
      subject: 'Aptitude',
    }
  ],
  TNPSC_G4: [
    {
      id: 'tn-g4-q1',
      text: '"யாதும் ஊரே யாவரும் கேளிர்" என்ற வரிகளைப் பாடிய சங்க காலப் புலவர் யார்?',
      options: [
        'கபிலர்',
        'ஔவையார்',
        'கணியன் பூங்குன்றனார்',
        'நக்கீரர்',
      ],
      correctAnswerIndex: 2,
      explanation: '"யாதும் ஊரே யாவரும் கேளிர்" (To us all towns are one, all men our kin) is a universally acclaimed verse sung by the Sangam poet Kaniyan Pungundranar in Purananuru (புறநானூறு).',
      subject: 'General Tamil',
    },
    {
      id: 'tn-g4-q2',
      text: 'திருக்குறள் எத்தனை அதிகாரங்களைக் கொண்டுள்ளது?',
      options: [
        '130',
        '1330',
        '133',
        '100',
      ],
      correctAnswerIndex: 2,
      explanation: 'திருக்குறள் 133 அதிகாரங்களையும் (chapters), அதிகாரத்திற்கு பத்து குறட்பாக்கள் வீதம் மொத்தம் 1330 குறட்பாக்களையும் கொண்டுள்ளது.',
      subject: 'General Tamil',
    }
  ],
  SSC_CGL: [
    {
      id: 'ssc-cgl-q1',
      text: 'A sum of ₹12,000 becomes ₹15,972 in 3 years at x% per annum, compounded annually. What is the value of x?',
      options: [
        '8%',
        '10%',
        '12%',
        '15%'
      ],
      correctAnswerIndex: 1,
      explanation: 'Using Compound Interest formula: A = P(1 + r/100)^t -> 15972 = 12000(1 + x/100)^3 -> 15972 / 12000 = (1 + x/100)^3 -> 1.331 = (1 + x/100)^3. Since 1.331 is (1.1)^3, we have 1 + x/100 = 1.1 -> x = 10%.',
      subject: 'Quantitative Aptitude',
    },
    {
      id: 'ssc-cgl-q2',
      text: 'Select the synonym of the given word: "OBSTINATE"',
      options: [
        'Stubborn',
        'Flexible',
        'Pliant',
        'Submissive'
      ],
      correctAnswerIndex: 0,
      explanation: '"Obstinate" means stubbornly refusing to change one\'s opinion or chosen course of action, despite attempts to persuade one to do so. "Stubborn" is its exact synonym. Flexible, pliant, and submissive are antonyms.',
      subject: 'English Language',
    },
    {
      id: 'ssc-cgl-q3',
      text: 'If in a certain code language, "CAT" is written as "24267", how is "DOG" written in that code?',
      options: [
        '231220',
        '201223',
        '231507',
        '221520'
      ],
      correctAnswerIndex: 0,
      explanation: 'In this code, letters are coded by the position value of their opposites (Z-A reverse order: A=26, B=25, C=24...). C (opposite X) is 24, A (opposite Z) is 26, T (opposite G) is 7. Thus, CAT is "24267". For DOG: D (opposite W) is 23, O (opposite L) is 12, G (opposite T) is 20. So DOG is coded as "231220".',
      subject: 'General Intelligence & Reasoning',
    },
    {
      id: 'ssc-cgl-q4',
      text: 'Which article of the Indian Constitution empowers the President to declare a Financial Emergency?',
      options: [
        'Article 352',
        'Article 356',
        'Article 360',
        'Article 368'
      ],
      correctAnswerIndex: 2,
      explanation: 'Article 360 of the Indian Constitution empowers the President of India to declare a financial emergency if he/she is satisfied that a situation has arisen whereby the financial stability or credit of India or any part of its territory is threatened.',
      subject: 'General Awareness',
    }
  ],
  RRB_NTPC: [
    {
      id: 'rrb-ntpc-q1',
      text: 'A train 150 meters long passes a telegraph post in 12 seconds. In how much time (in seconds) will it pass a bridge 250 meters long?',
      options: [
        '20 seconds',
        '24 seconds',
        '32 seconds',
        '40 seconds'
      ],
      correctAnswerIndex: 2,
      explanation: 'Speed of the train = Length of train / Time taken to pass post = 150 m / 12 s = 12.5 m/s.\nTo pass the bridge, the train has to cover a total distance = Length of train + Length of bridge = 150 + 250 = 400 m.\nTime required = Total distance / Speed = 400 m / 12.5 m/s = 32 seconds.\nCorrect option is C.',
      subject: 'Mathematics',
    },
    {
      id: 'rrb-ntpc-q2',
      text: 'In which city is the National Academy of Indian Railways (NAIR) situated?',
      options: [
        'New Delhi',
        'Vadodara',
        'Secunderabad',
        'Pune'
      ],
      correctAnswerIndex: 1,
      explanation: 'The National Academy of Indian Railways (NAIR), formerly known as Railway Staff College, is situated in Vadodara, Gujarat. It is the premier training institution for the officers of Indian Railways.',
      subject: 'General Awareness',
    },
    {
      id: 'rrb-ntpc-q3',
      text: 'Select the option that is related to the third term in the same way as the second term is related to the first term:\n\nCOAL : HEAT :: WAX : ?',
      options: [
        'Energy',
        'Candle',
        'Light',
        'Bee'
      ],
      correctAnswerIndex: 2,
      explanation: 'Burning COAL produces HEAT. Similarly, burning WAX produces LIGHT (as in a candle). Thus, Light is the correct logical counterpart.',
      subject: 'General Intelligence & Reasoning',
    },
    {
      id: 'rrb-ntpc-q4',
      text: 'Which Indian Railway zone operates the highest altitude railway station, "Ghum" (at an altitude of 2,258 meters)?',
      options: [
        'Northern Railway',
        'Northeast Frontier Railway',
        'Southern Railway',
        'Western Railway'
      ],
      correctAnswerIndex: 1,
      explanation: 'Ghum railway station of the Darjeeling Himalayan Railway is the highest railway station in India. It is situated at an altitude of 2,258 meters (7,407 ft) and is operated by the Northeast Frontier Railway (NFR) zone.',
      subject: 'General Awareness',
    }
  ]
};

export const INITIAL_GK_FEED: GKArticle[] = [
  {
    id: 'gk-1',
    title: 'The Great Indian Hornbill Nest Monitoring Project: Community-Led Conservation',
    category: 'Environment / Ecology',
    date: 'June 26, 2026',
    content: 'In the tropical forests of Northeast India, the Nyishi tribe is leading a breakthrough Nest Adoption Program. Working with wildlife biologists, local tribesmen patrol nested areas to protect nesting trees of the Endangered Great Hornbill. This project highlights a crucial shift toward democratic, community-centric environmental preservation, setting a benchmark for UPSC GS Paper III Environment.',
  },
  {
    id: 'gk-2',
    title: 'Tamil Nadu Leads in Renewable Energy Capacity: Wind-Solar Integration Insights',
    category: 'Economy / Infrastructure',
    date: 'June 25, 2026',
    content: 'Tamil Nadu has surpassed 21 GW in installed renewable energy capacity, making it a pioneer in wind-solar hybrid projects. The state grid operator is pioneering advanced battery energy storage systems (BESS) to manage seasonal grid fluctuations. Highly relevant for TNPSC Group I/II Development Administration and Indian Economy topics.',
  },
  {
    id: 'gk-3',
    title: 'The Judicial Doctrine of Non-Arbitrariness & Article 14 of the Constitution',
    category: 'Indian Polity & Governance',
    date: 'June 24, 2026',
    content: 'The Supreme Court recently re-emphasized that State action must be non-arbitrary, transparent, and fair to pass the muster of Article 14 (Equality before Law). The Court set aside a series of administrative tenders that failed the proportionality test, reaffirming the judicial guardrails on executive power.',
  },
  {
    id: 'gk-4',
    title: 'The Iron-Age Artifacts at Keezhadi Excavations: Rewriting Tamil Culture Timeline',
    category: 'Tamil Heritage & Culture',
    date: 'June 23, 2026',
    content: 'The latest Phase IX excavations at Keezhadi near Madurai have unearthed carbon-dated artifacts proving a thriving urban, literacy-rich civilization on the banks of Vaigai river as early as 6th Century BCE. This pushes back the Sangam Era timeline, establishing key historical insights for TNPSC Group I/II/IV.',
  }
];
