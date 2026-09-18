import { Question } from '../../types';

export const SSC_CGL_QUESTION_POOL: Question[] = [
  {
    id: 'ssc-001',
    text: 'A principal sum of ₹12,000 amounts to ₹15,972 in 3 years at x% per annum compounded annually. What is the value of x?',
    options: ['8%', '10%', '12%', '15%'],
    correctAnswerIndex: 1,
    explanation: 'Amount / Principal = 15972 / 12000 = 1.331 = (1 + x/100)³. Since (1.1)³ = 1.331, 1 + x/100 = 1.1, giving x = 10%.',
    subject: 'Quantitative Aptitude'
  },
  {
    id: 'ssc-002',
    text: 'If x + (1 / x) = 5, what is the value of x² + (1 / x²)?',
    options: ['21', '23', '25', '27'],
    correctAnswerIndex: 1,
    explanation: 'Squaring both sides: (x + 1/x)² = x² + 1/x² + 2 = 25 -> x² + 1/x² = 25 - 2 = 23.',
    subject: 'Quantitative Aptitude'
  },
  {
    id: 'ssc-003',
    text: 'If x + (1 / x) = 3, what is the value of x³ + (1 / x³)?',
    options: ['18', '21', '24', '27'],
    correctAnswerIndex: 0,
    explanation: 'Using the identity x³ + 1/x³ = (x + 1/x)³ - 3(x + 1/x) = 3³ - 3(3) = 27 - 9 = 18.',
    subject: 'Quantitative Aptitude'
  },
  {
    id: 'ssc-004',
    text: 'In a cyclic quadrilateral ABCD, if ∠A = 70°, what is the measure of the opposite angle ∠C?',
    options: ['70°', '90°', '110°', '130°'],
    correctAnswerIndex: 2,
    explanation: 'In any cyclic quadrilateral, the sum of opposite interior angles is supplementary (180°). Therefore, ∠C = 180° - 70° = 110°.',
    subject: 'Quantitative Aptitude'
  },
  {
    id: 'ssc-005',
    text: 'Two successive trade discounts of 20% and 10% are equivalent to a single net discount of:',
    options: ['28%', '30%', '32%', '25%'],
    correctAnswerIndex: 0,
    explanation: 'Net Discount = d1 + d2 - (d1 * d2) / 100 = 20 + 10 - (20 * 10) / 100 = 30 - 2 = 28%.',
    subject: 'Quantitative Aptitude'
  },
  {
    id: 'ssc-006',
    text: 'A speed of 72 km/h when converted into metres per second (m/s) is equal to:',
    options: ['15 m/s', '20 m/s', '25 m/s', '30 m/s'],
    correctAnswerIndex: 1,
    explanation: 'To convert km/h to m/s, multiply by 5/18: 72 * (5 / 18) = 4 * 5 = 20 m/s.',
    subject: 'Quantitative Aptitude'
  },
  {
    id: 'ssc-007',
    text: 'Evaluate: sin²(25°) + sin²(65°)',
    options: ['0', '1 / 2', '1', '2'],
    correctAnswerIndex: 2,
    explanation: 'Since sin(65°) = sin(90° - 25°) = cos(25°), the expression becomes sin²(25°) + cos²(25°) = 1.',
    subject: 'Quantitative Aptitude'
  },
  {
    id: 'ssc-008',
    text: 'A and B can complete a job in 10 days and 15 days respectively. If they work together and earn a total wage of ₹1,500, what is A\'s share?',
    options: ['₹600', '₹750', '₹900', '₹1,000'],
    correctAnswerIndex: 2,
    explanation: 'Ratio of daily work efficiency = 1/10 : 1/15 = 3 : 2. A\'s share = (3 / 5) * 1500 = ₹900.',
    subject: 'Quantitative Aptitude'
  },
  {
    id: 'ssc-009',
    text: 'Find the missing number in the series: 2, 6, 12, 20, 30, 42, ?',
    options: ['52', '54', '56', '58'],
    correctAnswerIndex: 2,
    explanation: 'Differences: +4, +6, +8, +10, +12. The next difference is +14: 42 + 14 = 56 (or n(n+1): 7 * 8 = 56).',
    subject: 'General Intelligence & Reasoning'
  },
  {
    id: 'ssc-010',
    text: 'Statements:\nI. All roses are flowers.\nII. All flowers are plants.\nConclusions:\n1. All roses are plants.\n2. Some plants are roses.',
    options: ['Only conclusion 1 follows', 'Only conclusion 2 follows', 'Neither conclusion follows', 'Both conclusions 1 and 2 follow'],
    correctAnswerIndex: 3,
    explanation: 'Since Roses ⊂ Flowers ⊂ Plants, all roses are plants (1 follows) and some plants are roses (2 follows). Both follow.',
    subject: 'General Intelligence & Reasoning'
  },
  {
    id: 'ssc-011',
    text: 'Select the one-word substitution for: "A universal cure or remedy for all diseases or difficulties".',
    options: ['Panacea', 'Placebo', 'Antibiotic', 'Antidote'],
    correctAnswerIndex: 0,
    explanation: '"Panacea" is defined in standard English lexicography as a universal remedy or cure-all for all diseases.',
    subject: 'English Comprehension'
  },
  {
    id: 'ssc-012',
    text: 'Select the one-word substitution for: "A person who loves, collects, and reads books voraciously".',
    options: ['Bibliophile', 'Philanthropist', 'Polyglot', 'Calligrapher'],
    correctAnswerIndex: 0,
    explanation: '"Bibliophile" refers to an individual who has a deep admiration for and collection of books.',
    subject: 'English Comprehension'
  },
  {
    id: 'ssc-013',
    text: 'Select the most appropriate meaning of the idiom: "To beat around the bush".',
    options: [
      'To search for animals in a forest',
      'To avoid talking about the main topic directly',
      'To finish work ahead of deadline',
      'To clean a garden thoroughly'
    ],
    correctAnswerIndex: 1,
    explanation: '"To beat around the bush" means to speak evasively and delay approaching the central or unpleasant issue.',
    subject: 'English Comprehension'
  },
  {
    id: 'ssc-014',
    text: 'Identify the segment with a grammatical error: "Neither the teacher (A) / nor the students (B) / was present in the hall (C) / No error (D)"',
    options: ['(A)', '(B)', '(C)', '(D)'],
    correctAnswerIndex: 2,
    explanation: 'Under the rule of proximity for "neither... nor", the verb agrees with the subject closest to it. Since "students" is plural, it must be "were present" instead of "was present".',
    subject: 'English Comprehension'
  },
  {
    id: 'ssc-015',
    text: 'Select the most appropriate ANTONYM of the given word: "CANDID"',
    options: ['Frank', 'Blunt', 'Deceptive / Dishonest', 'Sincere'],
    correctAnswerIndex: 2,
    explanation: '"Candid" means truthful, open, and straightforward. Its antonym is deceptive, secretive, or dishonest.',
    subject: 'English Comprehension'
  },
  {
    id: 'ssc-016',
    text: 'Who was the Viceroy of India when the Indian National Congress (INC) was established in Bombay in December 1885?',
    options: ['Lord Curzon', 'Lord Dufferin', 'Lord Ripon', 'Lord Lytton'],
    correctAnswerIndex: 1,
    explanation: 'Lord Dufferin served as the Viceroy of India (1884–1888) when A.O. Hume organized the first session of the INC presided over by W.C. Bonnerjee.',
    subject: 'General Awareness'
  },
  {
    id: 'ssc-017',
    text: 'Which Indian State possesses the longest coastline along mainland India?',
    options: ['Andhra Pradesh', 'Tamil Nadu', 'Maharashtra', 'Gujarat'],
    correctAnswerIndex: 3,
    explanation: 'Gujarat has the longest mainland coastline in India, extending over approximately 1,600 km due to its deep gulfs (Kutch and Khambhat).',
    subject: 'General Awareness'
  },
  {
    id: 'ssc-018',
    text: 'Which organ in the human body acts as both an exocrine gland (secreting digestive enzymes) and an endocrine gland (secreting insulin and glucagon)?',
    options: ['Liver', 'Pancreas', 'Thyroid', 'Adrenal gland'],
    correctAnswerIndex: 1,
    explanation: 'The Pancreas is a heterocrine gland; its acinar cells produce pancreatic juice (exocrine) while the Islets of Langerhans secrete hormones directly into blood (endocrine).',
    subject: 'General Awareness'
  },
  {
    id: 'ssc-019',
    text: 'The Tropic of Cancer (23.5° N) passes through 8 Indian States. Through which of the following states does it NOT pass?',
    options: ['Rajasthan', 'Gujarat', 'Odisha', 'Tripura'],
    correctAnswerIndex: 2,
    explanation: 'The Tropic of Cancer passes through Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura, and Mizoram. It does NOT pass through Odisha.',
    subject: 'General Awareness'
  },
  {
    id: 'ssc-020',
    text: 'Which Article of the Constitution of India deals with the "Abolition of Untouchability" and penalizes its practice in any form?',
    options: ['Article 14', 'Article 17', 'Article 23', 'Article 24'],
    correctAnswerIndex: 1,
    explanation: 'Article 17 declares untouchability abolished and forbids its practice in any form, enforced via the Protection of Civil Rights Act.',
    subject: 'General Awareness'
  },
  {
    id: 'ssc-021',
    text: 'If \'DELHI\' is coded as \'73541\' and \'CALCUTTA\' is coded as \'82589662\', how is \'CALICUT\' coded in that code language?',
    options: ['8251896', '8251596', '8258962', '8251396'],
    correctAnswerIndex: 0,
    explanation: 'Matching letters: C=8, A=2, L=5, I=1, C=8, U=9, T=6 -> 8251896.',
    subject: 'General Intelligence & Reasoning'
  },
  {
    id: 'ssc-022',
    text: 'Which chemical element is present in all organic compounds?',
    options: ['Carbon', 'Silicon', 'Nitrogen', 'Phosphorus'],
    correctAnswerIndex: 0,
    explanation: 'Organic chemistry is the chemistry of Carbon compounds. Carbon\'s tetravalency and catenation property allow it to form the backbone of all organic molecules.',
    subject: 'General Awareness'
  },
  {
    id: 'ssc-023',
    text: 'If the radius of a sphere is doubled, its surface area increases by what factor?',
    options: ['2 times', '4 times', '6 times', '8 times'],
    correctAnswerIndex: 1,
    explanation: 'Surface area of a sphere A = 4πr². When r is replaced by 2r, new area A\' = 4π(2r)² = 4(4πr²) = 4A. It increases by 4 times.',
    subject: 'Quantitative Aptitude'
  },
  {
    id: 'ssc-024',
    text: 'Select the idiom that means: "To face a difficult situation with courage and fortitude".',
    options: ['Bite the bullet', 'Spill the beans', 'Burn the midnight oil', 'Hit the sack'],
    correctAnswerIndex: 0,
    explanation: '"Bite the bullet" means to endure a painful or difficult situation that is unavoidable with courage.',
    subject: 'English Comprehension'
  },
  {
    id: 'ssc-025',
    text: 'Who was the first Indian woman to be elected President of the Indian National Congress at the Kanpur session in 1925?',
    options: ['Annie Besant', 'Sarojini Naidu', 'Nellie Sengupta', 'Kamala Nehru'],
    correctAnswerIndex: 1,
    explanation: 'Sarojini Naidu presided over the Kanpur session of the INC in 1925, becoming the first Indian woman president (Annie Besant in 1917 was British).',
    subject: 'General Awareness'
  }
];
