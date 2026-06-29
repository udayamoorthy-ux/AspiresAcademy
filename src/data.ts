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
