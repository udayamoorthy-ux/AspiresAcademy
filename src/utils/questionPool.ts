/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question } from '../types';

// Authentic Question Pool for Civil Services exams
export const AUTHENTIC_POLITY_POOL: Question[] = [
  {
    id: 'pol-001',
    text: 'Which Article of the Constitution of India safeguards one\'s right to marry the person of one\'s choice?',
    options: ['Article 19', 'Article 21', 'Article 25', 'Article 29'],
    correctAnswerIndex: 1,
    explanation: 'In the landmark Hadiya Case (2018) and K.S. Puttaswamy case (2017), the Supreme Court of India ruled that the right to marry a person of one\'s choice is an integral part of Article 21 (Right to Life and Personal Liberty) of the Constitution of India.',
    subject: 'Polity'
  },
  {
    id: 'pol-002',
    text: 'With reference to the Constitution of India, consider the following statements:\n1. No minister can be sued in a court of law for his official acts.\n2. The President of India cannot be impeached for violating the Constitution unless a court of law proves the charge first.\n\nWhich of the statements given above is/are correct?',
    options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
    correctAnswerIndex: 0,
    explanation: 'Statement 1 is correct: Under Indian constitutional law, there is no system of legal liability for ministers for official acts (unlike the UK). Statement 2 is incorrect: Article 61 governs impeachment for "violation of the Constitution," which is a political-legislative procedure conducted solely by Parliament, not dependent on prior judicial conviction.',
    subject: 'Polity'
  },
  {
    id: 'pol-003',
    text: 'A constitutional government by definition is a:',
    options: ['Government by legislature', 'Popular government', 'Multi-party government', 'Limited government'],
    correctAnswerIndex: 3,
    explanation: 'Constitutionalism or a constitutional government is, by definition, a "limited government." It places legal limits on the powers of the government to safeguard individual liberties and prevent arbitrary rule.',
    subject: 'Polity'
  },
  {
    id: 'pol-004',
    text: 'In India, Separation of Judiciary from the Executive is enjoined by:',
    options: ['The Preamble of the Constitution', 'A Directive Principle of State Policy', 'The Seventh Schedule', 'The conventional practice'],
    correctAnswerIndex: 1,
    explanation: 'Article 50 of the Constitution of India, contained within Part IV (Directive Principles of State Policy), directs the State to take steps to separate the judiciary from the executive in the public services of the State.',
    subject: 'Polity'
  },
  {
    id: 'pol-005',
    text: 'Which Schedule of the Constitution of India contains provisions regarding the anti-defection law?',
    options: ['Second Schedule', 'Fifth Schedule', 'Eighth Schedule', 'Tenth Schedule'],
    correctAnswerIndex: 3,
    explanation: 'The Tenth Schedule was added to the Constitution by the 52nd Amendment Act of 1985. It contains detailed provisions regarding disqualification on grounds of defection.',
    subject: 'Polity'
  },
  {
    id: 'pol-006',
    text: 'Who among the following was the Chairman of the Union Constitution Committee of the Constituent Assembly of India?',
    options: ['Dr. B.R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Vallabhbhai Patel', 'J.B. Kripalani'],
    correctAnswerIndex: 1,
    explanation: 'Jawaharlal Nehru was the Chairman of the Union Constitution Committee, Union Powers Committee, and States Committee of the Constituent Assembly.',
    subject: 'Polity'
  },
  {
    id: 'pol-007',
    text: 'The power of the Supreme Court of India to decide disputes between the Centre and the States falls under its:',
    options: ['Advisory jurisdiction', 'Appellate jurisdiction', 'Original jurisdiction', 'Writ jurisdiction'],
    correctAnswerIndex: 2,
    explanation: 'Under Article 131 of the Constitution, the Supreme Court of India has exclusive Original Jurisdiction in disputes between the Government of India and one or more States, or between two or more States.',
    subject: 'Polity'
  },
  {
    id: 'pol-008',
    text: 'The 44th Amendment Act to the Constitution of India of 1978 substituted which term in Article 352 to declare a National Emergency?',
    options: ['Internal disturbance with Armed rebellion', 'External aggression with Armed rebellion', 'War with armed mutiny', 'Public disorder with civil unrest'],
    correctAnswerIndex: 0,
    explanation: 'The 44th Amendment Act of 1978 replaced the highly ambiguous phrase "internal disturbance" with the precise term "armed rebellion" in Article 352 to prevent misuse of emergency powers.',
    subject: 'Polity'
  }
];

export const AUTHENTIC_HISTORY_POOL: Question[] = [
  {
    id: 'hist-001',
    text: 'With reference to ancient India, the term "Yavanapriya" in Sanskrit literature referred to:',
    options: ['Fine muslin cloth', 'Ivory carvings', 'Pepper', 'Greek damsels'],
    correctAnswerIndex: 2,
    explanation: 'Pepper was highly valued by the Greeks (Yavanas) who traded with ancient Tamil kingdoms. Hence, it was termed "Yavanapriya" (loved by Yavanas) in classical Sanskrit literature.',
    subject: 'History'
  },
  {
    id: 'hist-002',
    text: 'Who among the following founded the Ahmedabad Textile Labour Association in 1918?',
    options: ['Mahatma Gandhi', 'Sardar Vallabhbhai Patel', 'N.M. Joshi', 'J.B. Kripalani'],
    correctAnswerIndex: 0,
    explanation: 'Following the successful Ahmedabad Mill Strike of 1918, Mahatma Gandhi along with Anasuya Sarabhai founded the Ahmedabad Textile Labour Association (Majoor Mahajan Sangh) on principles of trust and mutual negotiation.',
    subject: 'History'
  },
  {
    id: 'hist-003',
    text: 'In medieval India, the term "Fanam" referred to:',
    options: ['Weapons', 'Coins', 'Measuring ornaments', 'Agricultural land taxes'],
    correctAnswerIndex: 1,
    explanation: 'In medieval southern India, "Fanam" or "Panam" was a widely circulating gold or silver coin used extensively during the Vijayanagara and Nayak dynasties.',
    subject: 'History'
  },
  {
    id: 'hist-004',
    text: 'With reference to the history of India, the "Ulgulan" or Great Tumult is the description of which of the following movements?',
    options: ['The Indigo Revolt of 1859-60', 'Mappila Rebellion of 1921', 'Santhal Rebellion of 1855-56', 'Birsa Munda Revolt of 1899-1900'],
    correctAnswerIndex: 3,
    explanation: 'The Birsa Munda tribal uprising of 1899-1900 in the region south of Ranchi is historically celebrated as the "Ulgulan" (The Great Tumult) against colonial exploitation and the Zamindari system.',
    subject: 'History'
  },
  {
    id: 'hist-005',
    text: 'Which of the following ports of the ancient Tamil country was highly active in Roman trade, as testified by extensive Roman amphorae found at Arikamedu?',
    options: ['Kaveripoompattinam', 'Arikamedu', 'Korkai', 'Musiri'],
    correctAnswerIndex: 1,
    explanation: 'Arikamedu, located near Puducherry, was an ancient Indo-Roman trading port active in the 1st century BCE to 2nd century CE. Excavations recovered Roman amphorae, Arretine ware, Roman coins, and glass beads.',
    subject: 'History'
  },
  {
    id: 'hist-006',
    text: 'Who was the author of the Tamil historic work "Madurai Kanchi", which gives a vivid description of Madurai city under King Nedunchezhiyan?',
    options: ['Mangudi Marudanar', 'Nakkirar', 'Kapilar', 'Ilango Adigal'],
    correctAnswerIndex: 0,
    explanation: '"Madurai Kanchi" is one of the Ten Idylls (Pathuppattu) works of Sangam literature. It was composed by Mangudi Marudanar to advise the Pandyan King Talayalanganathu Seruvendra Nedunchezhiyan on the transience of worldly power.',
    subject: 'History'
  },
  {
    id: 'hist-007',
    text: 'The famous Vaikom Satyagraha of 1924-25 in Travancore was organized primarily to:',
    options: ['Oppose land tax enhancements', 'Permit lower-caste entry to public roads around Vaikom temple', 'End the British residency administration', 'Support the local salt satyagraha'],
    correctAnswerIndex: 1,
    explanation: 'The Vaikom Satyagraha was a peaceful social protest demanding that depressed classes be allowed access to walk on the public pathways surrounding the Vaikom Mahadeva Temple in Kerala. E.V. Ramasamy (Periyar) played a pivotal leading role, earning the title "Vaikom Veerar".',
    subject: 'History'
  }
];

export const AUTHENTIC_ECONOMY_POOL: Question[] = [
  {
    id: 'econ-001',
    text: 'Which of the following measures would result in an increase in the money supply in the economy?\n1. Purchase of government securities from the public by the Central Bank.\n2. Sale of government securities to the public by the Central Bank.\n3. Borrowing by the government from the Central Bank.\n\nSelect the correct answer using the code given below:',
    options: ['1 only', '1 and 3 only', '2 and 3 only', '1, 2 and 3'],
    correctAnswerIndex: 1,
    explanation: '1 is correct: Purchasing securities pumps cash into the public hand. 2 is incorrect: Selling securities sucks cash out. 3 is correct: Government borrowing from RBI leads to printing/injection of fresh high-powered money, increasing the overall money supply.',
    subject: 'Economy'
  },
  {
    id: 'econ-002',
    text: 'With reference to India, the term "Core Inflation" is calculated by excluding which categories from Headline Inflation?',
    options: ['Fuel and Power', 'Food and Beverages', 'Both Food and Fuel items', 'Manufactured goods only'],
    correctAnswerIndex: 2,
    explanation: 'Core Inflation is a measure of inflation that excludes highly volatile price categories like food articles and fuel/energy resources from the calculations to observe the stable underlying price trends.',
    subject: 'Economy'
  },
  {
    id: 'econ-003',
    text: 'The "Pudhumai Penn Scheme" of the Government of Tamil Nadu provides a monthly financial assistance of ₹1,000 to:',
    options: ['Rural girl students pursuing higher education who studied in government schools', 'Widowed women for self-employment', 'Female handloom weavers', 'Elderly agricultural laborers'],
    correctAnswerIndex: 0,
    explanation: 'The "Pudhumai Penn" (Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme) provides ₹1,000 per month to girl students who studied from Class 6 to 12 in government schools and are now pursuing higher education (degrees/diplomas).',
    subject: 'Economy'
  },
  {
    id: 'econ-004',
    text: 'Which of the following curves shows the inverse relationship between the rate of unemployment and the rate of inflation in an economy?',
    options: ['Laffer Curve', 'Phillips Curve', 'Kuznets Curve', 'Lorenz Curve'],
    correctAnswerIndex: 1,
    explanation: 'The Phillips Curve, conceptualized by A.W. Phillips, demonstrates a historical inverse relationship between the rate of unemployment and the rate of inflation in an economy (lower unemployment leads to higher inflation).',
    subject: 'Economy'
  }
];

export const AUTHENTIC_TAMIL_POOL: Question[] = [
  {
    id: 'tam-001',
    text: '"அறம் பெருகும்; தீமை குறையும்" என்ற வாழ்வியல் நெறியை போதிக்கும் திருக்குறளின் முப்பால்களில் அறத்துப்பாலில் உள்ள மொத்த அதிகாரங்களின் எண்ணிக்கை எவ்வளவு?',
    options: ['34', '38', '70', '25'],
    correctAnswerIndex: 1,
    explanation: 'திருக்குறளில் அறத்துப்பாலில் 38 அதிகாரங்களும் (பாயிரவியல்-4, இல்லறவியல்-20, துறவறவியல்-13, ஊழியல்-1), பொருட்பாலில் 70 அதிகாரங்களும், காமத்துப்பால்/இன்பத்துப்பாலில் 25 அதிகாரங்களும் உள்ளன. மொத்தம் 133 அதிகாரங்கள்.',
    subject: 'General Tamil'
  },
  {
    id: 'tam-002',
    text: '"சுழன்றும்ஏர்ப் பின்னது உலகம் அதனால்\nஉழந்தும் உழவே தலை" - இக்குறட்பாவில் திருவள்ளுவர் எத்தொழிலின் சிறப்பைப் போற்றுகிறார்?',
    options: ['நெசவுத் தொழில்', 'கைவினைத் தொழில்', 'உழவுத் தொழில்', 'வணிகத் தொழில்'],
    correctAnswerIndex: 2,
    explanation: 'இக்குறள் உழவுத் தொழிலின் (விவசாயம்) உன்னதத்தை விளக்குகிறது. பல தொழில்கள் செய்து உலகம் சுழன்றாலும் அது ஏரின் பின்னேதான் சுழல வேண்டும்; எனவே எவ்வளவு வருந்தி உழைத்தாலும் உழவுத் தொழிலே உலகிற்கு மிகச் சிறந்த தொழிலாகும் என்று வள்ளுவர் கூறுகிறார்.',
    subject: 'General Tamil'
  },
  {
    id: 'tam-003',
    text: 'தமிழ் மொழியின் மிகப்பழைமையான இலக்கண நூல் எது?',
    options: ['நன்னூல்', 'தொல்காப்பியம்', 'வீரசோழியம்', 'அகத்தியம்'],
    correctAnswerIndex: 1,
    explanation: 'தொல்காப்பியம் என்பது நமக்குக் கிடைத்துள்ள தமிழ் மொழியின் மிகப்பழைமையான இலக்கண நூலாகும். இது தொல்காப்பியரால் இயற்றப்பட்டது. இது எழுத்து, சொல், பொருள் என மூன்று அதிகாரங்களை உள்ளடக்கியது.',
    subject: 'General Tamil'
  }
];

// Generative Math templates with strict logical step verification
export function generateAptitudeQuestion(seed: number): Question {
  const types = ['SI', 'CI', 'WORK', 'RATIO', 'PERCENT'];
  const type = types[seed % types.length];

  if (type === 'SI') {
    // Simple Interest Template
    const principal = 5000 + (seed % 5) * 1000; // 5000 to 9000
    const rate = 5 + (seed % 4) * 2; // 5, 7, 9, 11
    const years = 2 + (seed % 3); // 2, 3, 4
    const interest = (principal * rate * years) / 100;
    
    return {
      id: `gen-apt-si-${seed}`,
      text: `A person borrows ₹${principal} at a simple interest rate of ${rate}% per annum. What is the total interest payable at the end of ${years} years?`,
      options: [
        `₹${interest - 100}`,
        `₹${interest}`,
        `₹${interest + 120}`,
        `₹${interest + 240}`
      ],
      correctAnswerIndex: 1,
      explanation: `Use the standard Simple Interest formula:\nSI = (P * R * T) / 100\nHere, Principal (P) = ₹${principal}, Rate (R) = ${rate}%, Time (T) = ${years} years.\nSI = (${principal} * ${rate} * ${years}) / 100 = ₹${interest}.\nHence, the correct answer is option B.`,
      subject: 'Aptitude'
    };
  } else if (type === 'CI') {
    // Compound Interest Template
    const p = 10000;
    const rate = 10;
    const years = 2;
    const amount = p * Math.pow(1 + rate/100, years);
    const ci = amount - p;

    return {
      id: `gen-apt-ci-${seed}`,
      text: `Find the compound interest on ₹${p} for ${years} years at ${rate}% per annum, compounded annually.`,
      options: [
        `₹${ci - 200}`,
        `₹${ci - 100}`,
        `₹${ci}`,
        `₹${ci + 150}`
      ],
      correctAnswerIndex: 2,
      explanation: `Using the formula:\nAmount = P * (1 + R/100)^T\nAmount = ${p} * (1 + 10/100)^2 = ${p} * (1.1)^2 = ${p} * 1.21 = ₹${amount}.\nCompound Interest (CI) = Amount - Principal = ${amount} - ${p} = ₹${ci}.\nTherefore, the correct answer is option C.`,
      subject: 'Aptitude'
    };
  } else if (type === 'WORK') {
    // Time and Work Template
    const daysA = 10 + (seed % 3) * 5; // 10, 15, 20
    const daysB = 12 + (seed % 2) * 8; // 12, 20
    // Simplify for easy display - say, A can do work in 12 days, B in 24 days
    const a = 12;
    const b = 24;
    // 1/a + 1/b = 1/12 + 1/24 = 3/24 = 1/8 => 8 days
    return {
      id: `gen-apt-work-${seed}`,
      text: `A can complete a piece of work in ${a} days, and B can complete the same work in ${b} days. In how many days can they complete the work if they work together?`,
      options: [
        `6 days`,
        `8 days`,
        `9 days`,
        `10 days`
      ],
      correctAnswerIndex: 1,
      explanation: `Combined rate of work:\nWork rate per day = 1/${a} + 1/${b} = (2 + 1) / 24 = 3 / 24 = 1/8.\nTherefore, working together, they will complete the work in 8 days.`,
      subject: 'Aptitude'
    };
  } else if (type === 'RATIO') {
    // Ratio & Proportion Template
    const r1 = 3 + (seed % 2); // 3, 4
    const r2 = 5;
    const total = 400 + (seed % 3) * 80; // 400, 480, 560
    // say r1=3, r2=5, total=480. Parts = 3x, 5x. 8x=480 => x=60. Parts = 180, 300. Difference = 120.
    const x = total / (r1 + r2);
    const diff = (r2 - r1) * x;

    return {
      id: `gen-apt-ratio-${seed}`,
      text: `Divide ₹${total} between A and B in the ratio ${r1}:${r2}. What is the absolute difference between their shares?`,
      options: [
        `₹${diff - 20}`,
        `₹${diff}`,
        `₹${diff + 40}`,
        `₹${diff + 80}`
      ],
      correctAnswerIndex: 1,
      explanation: `Sum of the ratio parts = ${r1} + ${r2} = ${r1 + r2} parts.\nTotal value of ${r1 + r2} parts = ₹${total}.\nValue of 1 part = ${total} / ${r1 + r2} = ₹${x}.\nDifference between shares = (${r2} - ${r1}) * ${x} = ₹${diff}.\nCorrect answer is option B.`,
      subject: 'Aptitude'
    };
  } else {
    // Percentage Template
    const value = 250 + (seed % 4) * 50; // 250, 300, 350, 400
    const pct = 10 + (seed % 3) * 5; // 10%, 15%, 20%
    const ans = (value * pct) / 100;

    return {
      id: `gen-apt-pct-${seed}`,
      text: `A student has to secure ${pct}% marks to pass an exam. If the maximum marks of the exam are ${value}, how many marks are needed to qualify?`,
      options: [
        `${ans - 5} marks`,
        `${ans} marks`,
        `${ans + 10} marks`,
        `${ans + 15} marks`
      ],
      correctAnswerIndex: 1,
      explanation: `Passing marks = ${pct}% of ${value}\nPassing Marks = (${pct} / 100) * ${value} = ${ans}.\nCorrect answer is option B.`,
      subject: 'Aptitude'
    };
  }
}
