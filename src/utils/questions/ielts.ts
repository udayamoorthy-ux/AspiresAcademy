import { Question } from '../../types';

export const IELTS_QUESTION_POOL: Question[] = [
  {
    id: 'ielts-001',
    text: 'In an IELTS Academic Reading passage: "Recent epidemiological studies suggest that regular moderate physical activity mitigates cognitive decline in seniors, although the exact neurological pathways remain incompletely understood."\n\nQuestion: According to the text, the neurological mechanism through which exercise preserves cognitive function is fully proven.',
    options: ['TRUE', 'FALSE', 'NOT GIVEN', 'CANNOT BE DETERMINED'],
    correctAnswerIndex: 1,
    explanation: 'The statement directly contradicts the passage, which explicitly states that the exact neurological pathways "remain incompletely understood". Therefore, the correct answer is FALSE.',
    subject: 'Reading (True/False/Not Given)'
  },
  {
    id: 'ielts-002',
    text: 'Which cohesive transitional phrase is most appropriate to introduce an opposing perspective in an IELTS Writing Task 2 academic essay?',
    options: [
      'By the way, on the other hand',
      'Conversely, proponents of the alternative viewpoint argue that',
      'Secondly, I want to say that opposite people think',
      'Anyway, some folks disagree because'
    ],
    correctAnswerIndex: 1,
    explanation: '"Conversely, proponents of the alternative viewpoint argue that" provides formal academic register, high lexical resource, and seamless cohesion required for Band 8+ essay discourse.',
    subject: 'Writing (Cohesion & Coherence)'
  },
  {
    id: 'ielts-003',
    text: 'In IELTS Listening Section 1 (Form Filling), you hear: "My flight lands at quarter to five in the afternoon on Thursday." What is the correct standard time format to record in the booking form?',
    options: ['4:15 PM', '4:45 PM', '5:15 PM', '5:45 PM'],
    correctAnswerIndex: 1,
    explanation: '"Quarter to five" means 15 minutes before 5:00, which corresponds to 4:45 PM (or 16:45).',
    subject: 'Listening (Time & Numerical Note-Taking)'
  },
  {
    id: 'ielts-004',
    text: 'Which of the following phrases represents a high-level (Band 8/9) academic collocation to describe a sharp increase in an IELTS Writing Task 1 chart?',
    options: [
      'Went big up very quickly',
      'Experienced an exponential surge',
      'Grew lots of numbers up',
      'Climbed fastly with much marks'
    ],
    correctAnswerIndex: 1,
    explanation: '"Experienced an exponential surge" demonstrates sophisticated lexical resource and natural collocation suitable for academic report writing.',
    subject: 'Writing Task 1 (Lexical Resource)'
  },
  {
    id: 'ielts-005',
    text: 'In IELTS Reading, what is the strict difference between an answer being "FALSE" versus "NOT GIVEN"?',
    options: [
      '"FALSE" means the passage mentions the topic but contradicts the claim; "NOT GIVEN" means the author makes no claim either way',
      '"FALSE" means the fact is untrue in real life; "NOT GIVEN" means it is true in real life',
      '"FALSE" applies only to science passages; "NOT GIVEN" applies to history',
      'There is no functional grading difference between the two'
    ],
    correctAnswerIndex: 0,
    explanation: 'In IELTS, "FALSE" means the statement directly conflicts with or negates the passage information. "NOT GIVEN" means the passage contains insufficient information to confirm or deny the statement.',
    subject: 'Reading (Test Strategy)'
  },
  {
    id: 'ielts-006',
    text: 'In IELTS Listening, if the rubric instructions specify "WRITE NO MORE THAN TWO WORDS AND/OR A NUMBER", which of the following answers will be penalized with 0 marks?',
    options: [
      '15 Elm Street',
      'In the library',
      'Very large university campus',
      '24 hours'
    ],
    correctAnswerIndex: 2,
    explanation: '"Very large university campus" consists of four words, which breaches the strict word-limit constraint of "no more than two words", resulting in zero marks regardless of factual correctness.',
    subject: 'Listening (Word Limit Rules)'
  },
  {
    id: 'ielts-007',
    text: 'In IELTS Academic Writing Task 1 (describing graphs, maps, or processes), what is the single most essential feature required to achieve Band 7 or higher in Task Achievement?',
    options: [
      'Listing every single individual data figure mentioned on the graph',
      'Providing a clear, comprehensive Overview summarizing the main trends, differences, or stages',
      'Writing an emotive personal conclusion giving your own opinion on the topic',
      'Writing more than 400 words'
    ],
    correctAnswerIndex: 1,
    explanation: 'The official IELTS public band descriptors mandate that candidates must "present a clear overview of main trends, differences or stages" to attain Band 7 or higher in Task Achievement.',
    subject: 'Writing Task 1 (Task Achievement)'
  },
  {
    id: 'ielts-008',
    text: 'In IELTS Speaking Part 2 (the Long Turn / Cue Card), how much time is candidate allotted to prepare and take notes before delivering their 2-minute speech?',
    options: ['30 seconds', 'Exactly 1 minute', '2 minutes', '3 minutes'],
    correctAnswerIndex: 1,
    explanation: 'In Speaking Part 2, the examiner gives the candidate a task card, paper, and pencil, allowing exactly 1 minute of preparation before speaking for 1 to 2 minutes.',
    subject: 'Speaking (Format & Strategy)'
  },
  {
    id: 'ielts-009',
    text: 'Which sentence correctly utilizes advanced punctuation to join two closely connected independent academic clauses without a coordinating conjunction?',
    options: [
      'Renewable energy adoption has accelerated globally; nevertheless, fossil fuel subsidies persist in numerous developing economies.',
      'Renewable energy adoption has accelerated globally, nevertheless fossil fuel subsidies persist.',
      'Renewable energy adoption has accelerated globally: but fossil fuel subsidies persist.',
      'Renewable energy adoption has accelerated globally; but, fossil fuel subsidies persist.'
    ],
    correctAnswerIndex: 0,
    explanation: 'A semicolon followed by a conjunctive adverb ("nevertheless") and a comma correctly links two independent clauses with high grammatical accuracy.',
    subject: 'Writing (Grammatical Range)'
  },
  {
    id: 'ielts-010',
    text: 'In IELTS Reading, what is the primary operational difference between the "Skimming" and "Scanning" techniques?',
    options: [
      'Skimming means reading rapidly to grasp the general gist; Scanning means searching specifically for targeted keywords, names, or numbers',
      'Skimming is for multiple-choice questions; Scanning is only for headings',
      'Skimming requires reading aloud; Scanning requires silent reading',
      'Both terms mean reading every word carefully from beginning to end'
    ],
    correctAnswerIndex: 0,
    explanation: 'Skimming is fast reading to get the overall main idea (gist) of a paragraph. Scanning is moving eyes rapidly over text to locate specific information such as dates, statistics, or terminology.',
    subject: 'Reading (Speed Reading Skills)'
  },
  {
    id: 'ielts-011',
    text: 'In IELTS General Training Writing Task 1, if you are writing a formal complaint letter to a hotel manager whose name you do NOT know, how should the letter commence and conclude?',
    options: [
      'Dear Hotel Manager ... Yours affectionately,',
      'Dear Sir or Madam, ... Yours faithfully,',
      'Hi Sir, ... Yours sincerely,',
      'To whom it may concern, ... Cheers,'
    ],
    correctAnswerIndex: 1,
    explanation: 'Standard formal English business letter convention dictates that when the recipient\'s name is unknown, the salutation is "Dear Sir or Madam," and the sign-off is "Yours faithfully,".',
    subject: 'General Training (Letter Conventions)'
  },
  {
    id: 'ielts-012',
    text: 'Identify the sophisticated Band 8/9 synonym to replace the informal phrase "a lot of problems" in an academic essay:',
    options: ['A bunch of troubles', 'A myriad of pressing challenges', 'Loads of bad things', 'Plenty of hard stuffs'],
    correctAnswerIndex: 1,
    explanation: '"A myriad of pressing challenges" displays precise, formal vocabulary and sophisticated collocations valued in IELTS Writing assessment criteria.',
    subject: 'Writing Task 2 (Lexical Resource)'
  },
  {
    id: 'ielts-013',
    text: 'In IELTS Listening, speakers frequently utilize "distractors" to correct themselves. For example: "We initially booked the conference room for Tuesday the 14th, but due to scheduling conflicts, we shifted it to Friday the 17th." What is the confirmed conference date?',
    options: ['Tuesday the 14th', 'Wednesday the 15th', 'Friday the 17th', 'Saturday the 18th'],
    correctAnswerIndex: 2,
    explanation: 'The speaker uses a self-correction marker ("shifted it to"), making Friday the 17th the correct final booking date, while the 14th was a deliberate distractor.',
    subject: 'Listening (Distractor Traps)'
  },
  {
    id: 'ielts-014',
    text: 'Which sentence illustrates a complex conditional structure (Inversion in Third Conditional) suitable for showcasing high grammatical range?',
    options: [
      'Had the municipal authorities implemented flood defenses earlier, the economic fallout would have been substantially mitigated.',
      'If the authorities implemented defenses, everything was fine.',
      'If the authorities would have done it, it will be better.',
      'Authorities did not do it, so disaster happened.'
    ],
    correctAnswerIndex: 0,
    explanation: '"Had the municipal authorities implemented..." is an inverted third conditional showing Band 8+ grammatical range and syntactic flexibility.',
    subject: 'Writing (Grammar & Syntactic Variety)'
  },
  {
    id: 'ielts-015',
    text: 'In an IELTS Speaking exam, how should a candidate handle unfamiliarity with a question such as "Do you enjoy visiting museums?"?',
    options: [
      'Remain silent until the examiner moves to the next question',
      'Use natural discourse markers: "To be frank, I haven\'t visited a museum recently because...", expanding with reasons',
      'Answer with just a single word "No"',
      'Recite a memorized poem about ancient history'
    ],
    correctAnswerIndex: 1,
    explanation: 'In IELTS Speaking, candidates are evaluated on fluency and linguistic resource, not factual knowledge. Natural filler markers and honest explanation demonstrate spontaneous English competence.',
    subject: 'Speaking (Fluency & Spontaneity)'
  },
  {
    id: 'ielts-016',
    text: 'In an IELTS Academic Reading "Matching Headings" exercise, where in a paragraph is the central "Topic Sentence" most frequently found?',
    options: [
      'Exclusively in the exact middle of the paragraph',
      'Often in the first or second sentence, or occasionally the concluding sentence',
      'In the footnote citations',
      'In the italicized vocabulary gloss'
    ],
    correctAnswerIndex: 1,
    explanation: 'In standard academic prose, paragraphs are structured with a topic sentence at or near the beginning that introduces the core idea, followed by supporting evidence and an optional synthesizing summary.',
    subject: 'Reading (Matching Headings)'
  },
  {
    id: 'ielts-017',
    text: 'Which word has the correct spelling often tested in IELTS Listening numerical/address forms?',
    options: ['Accomodation', 'Accommodation', 'Acommodation', 'Accomadation'],
    correctAnswerIndex: 1,
    explanation: 'The standard spelling is "Accommodation" with double \'c\' and double \'m\'. Incorrect spelling forfeits the mark in the Listening module.',
    subject: 'Listening (Spelling Precision)'
  },
  {
    id: 'ielts-018',
    text: 'What is the recommended minimum word count for IELTS Writing Task 1 and Writing Task 2 respectively?',
    options: ['100 words and 200 words', '150 words and 250 words', '200 words and 300 words', '250 words and 400 words'],
    correctAnswerIndex: 1,
    explanation: 'Official IELTS regulations require a minimum of 150 words for Task 1 (suggested 20 minutes) and 250 words for Task 2 (suggested 40 minutes). Writing below the minimum incurs a penalty.',
    subject: 'Writing (Exam Guidelines)'
  },
  {
    id: 'ielts-019',
    text: 'Which transitional device demonstrates high-level qualification of an assertion in an argumentative essay?',
    options: ['Without doubt completely', 'To a considerable extent, however, this trend is contingent upon', '100% all people agree', 'Obviously always'],
    correctAnswerIndex: 1,
    explanation: 'Academic discourse prizes cautious hedging and nuanced qualification rather than absolute sweeping generalizations.',
    subject: 'Writing Task 2 (Academic Tone & Hedging)'
  },
  {
    id: 'ielts-020',
    text: 'In the IELTS Speaking test, what does the "Lexical Resource" assessment criterion specifically examine?',
    options: [
      'The speed of words spoken per second',
      'The range, precision, and natural use of collocations, idiomatic expressions, and paraphrasing ability',
      'Having a native British accent',
      'Giving lengthy answers that never pause'
    ],
    correctAnswerIndex: 1,
    explanation: 'Lexical Resource assesses variety of vocabulary, precision in word choice, natural idiomatic usage, and the ability to paraphrase without repetitive phrasing.',
    subject: 'Speaking (Band Descriptors)'
  },
  {
    id: 'ielts-021',
    text: 'In an Academic Task 1 line graph describing a period where figures stayed level for five years, what is the best collocation to describe this?',
    options: ['Stayed flat without walking', 'Remained virtually unchanged / plateaued', 'Stop growing lots', 'Froze in the ground'],
    correctAnswerIndex: 1,
    explanation: '"Plateaued" and "remained virtually unchanged" are precise academic descriptions of static trend lines.',
    subject: 'Writing Task 1 (Vocabulary)'
  },
  {
    id: 'ielts-022',
    text: 'In IELTS Listening, if you hear a UK postcode pronounced "SW1A 1AA", what is the required notation format?',
    options: ['SW1A 1AA (letters in uppercase with standard spacing)', 'sw1a1aa (all lowercase no space)', 'south west one a', 'Post 141'],
    correctAnswerIndex: 0,
    explanation: 'Postcodes should be transcribed in uppercase letters with standard spacing matching standard postal formatting.',
    subject: 'Listening (Notational Conventions)'
  },
  {
    id: 'ielts-023',
    text: 'Which sentence demonstrates correct Subject-Verb Agreement with an indefinite pronoun?',
    options: [
      'Each of the participants was given a detailed questionnaire.',
      'Each of the participants were given a detailed questionnaire.',
      'Each of the participant are given a detailed questionnaire.',
      'Each of the participants have been given a questionnaire.'
    ],
    correctAnswerIndex: 0,
    explanation: '"Each" is a singular indefinite pronoun requiring the singular verb "was" regardless of the plural object of preposition "participants".',
    subject: 'Writing (Grammatical Accuracy)'
  },
  {
    id: 'ielts-024',
    text: 'Select the most natural colloquial idiom suitable for IELTS Speaking Part 1 when discussing hobbies: "I only play tennis..."',
    options: ['Once in a blue moon', 'Whenever blue planets rotate', 'One time in twenty moons', 'In dark nights'],
    correctAnswerIndex: 0,
    explanation: '"Once in a blue moon" is a natural English idiom meaning very rarely or infrequently, demonstrating appropriate informal idiomatic competence for Part 1/2.',
    subject: 'Speaking (Idiomatic Vocabulary)'
  },
  {
    id: 'ielts-025',
    text: 'In an IELTS Writing Task 2 "Discuss both views and give your opinion" essay, how should the candidate structure their thesis?',
    options: [
      'Discuss only the view you agree with and ignore the other view',
      'Clearly present both opposing viewpoints objectively and articulate your own reasoned stance throughout the essay and conclusion',
      'Ask rhetorical questions without stating any opinion',
      'Write about a completely different related topic'
    ],
    correctAnswerIndex: 1,
    explanation: 'To satisfy Task Achievement for this prompt, the candidate must examine both sides with balanced supporting arguments and maintain a clear, consistent personal position throughout.',
    subject: 'Writing Task 2 (Task Achievement)'
  }
];
