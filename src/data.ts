/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExamType, EssayPrompt, Question, GKArticle } from './types';
import { EXAM_QUESTION_POOLS } from './utils/questionPool';

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
  IIT_JEE: {
    title: 'IIT JEE (Joint Entrance Examination Main & Advanced)',
    shortName: 'IIT JEE (Main/Adv)',
    stages: [
      { name: 'JEE Main (NTA)', details: 'Paper 1 for B.E./B.Tech (Physics, Chemistry, Mathematics; 90 questions, 300 Marks; Computer Based Test)' },
      { name: 'JEE Advanced (IITs)', details: 'Paper 1 & Paper 2 (Physics, Chemistry, Mathematics with single choice, multiple choice, numerical, matching type questions)' },
      { name: 'JoSAA Counseling', details: 'Joint Seat Allocation Authority counseling for IITs, NITs, IIITs, and GFTIs' }
    ],
    syllabus: [
      { subject: 'Physics', description: 'Kinematics, Laws of Motion, Work Energy Power, Rotational Dynamics, Gravitation, Electrodynamics, Optics, Thermodynamics, Modern Physics.' },
      { subject: 'Chemistry', description: 'Physical Chemistry (Mole concept, Chemical Kinetics, Thermodynamics), Organic Chemistry (Reaction Mechanisms, Functional Groups), Inorganic Chemistry (Coordination Compounds, Periodic Table).' },
      { subject: 'Mathematics', description: 'Calculus (Limits, Derivatives, Integrals), Coordinate Geometry (Vectors & 3D, Conics), Algebra (Matrices, Probability, Complex Numbers), Trigonometry.' }
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

export const STATIC_QUIZ_QUESTIONS: Record<ExamType, Question[]> = EXAM_QUESTION_POOLS;

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
