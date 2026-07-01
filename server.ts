/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Successfully initialized server-side Google GenAI client.");
  } catch (error) {
    console.warn("Google GenAI client initialization alert:", error);
  }
} else {
  console.log("No valid GEMINI_API_KEY provided in environment. Server will operate in mock/smart offline mode.");
}

// Helper function to call Gemini with retry and exponential backoff
async function callGeminiWithRetry<T>(
  apiCall: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await apiCall();
    } catch (err: any) {
      lastError = err;
      const errorMsg = err?.message || err?.toString() || '';
      const is503 = err?.status === 503 || errorMsg.includes('503') || errorMsg.includes('UNAVAILABLE');
      const isRateLimit = err?.status === 429 || errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED');
      
      if (is503 || isRateLimit) {
        console.log(`Gemini API returned ${is503 ? '503 (Unavailable)' : '429 (Rate Limit)'}. Retrying attempt ${i + 1}/${retries} in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        delayMs *= 2; // Exponential backoff
      } else {
        throw err;
      }
    }
  }
  throw lastError;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Health & Config status
app.get('/api/config-status', (req, res) => {
  res.json({
    hasApiKey: !!aiClient,
    environment: process.env.NODE_ENV || 'development'
  });
});

// 2. Dynamic Study Planner Generator
app.post('/api/study-planner', async (req, res) => {
  const { exam, totalDays, dailyHours, startDate, targetDate } = req.body;

  if (!exam || !totalDays || !dailyHours) {
    return res.status(400).json({ error: 'Missing planner parameters' });
  }

  const examLabels: Record<string, string> = {
    UPSC: 'UPSC Civil Services Examination (CSE) Prelims & Mains',
    TNPSC_G1: 'TNPSC Group I (Deputy Collector/DSP) Prelims & Mains',
    TNPSC_G2: 'TNPSC Group II/IIA Executive and Non-Executive Exams',
    TNPSC_G4: 'TNPSC Group IV & VAO Written Exam'
  };

  const examLabel = examLabels[exam] || exam;

  if (aiClient) {
    try {
      const prompt = `Generate an extremely comprehensive, high-yield, and detailed study task list for the ${examLabel} starting from ${startDate || 'today'} to ${targetDate || 'target date'} (spanning exactly ${totalDays} days), studying ${dailyHours} hours per day.
      Provide exactly 10 to 14 milestone tasks representing key progression points spaced evenly across the days (e.g. Day 1, Day 3, Day 6, Day 9, Day 12, etc.).
      Each milestone task MUST be highly realistic and include:
      - subject: Broad subject (e.g. Polity, History, Economy, General Tamil, Aptitude)
      - topic: Highly specific syllabus topic (e.g., 'Fundamental Rights & Judicial Review', 'Sangam Literature & Social Stratification')
      - hours: Recommended study hours
      - subtasks: 3-5 precise, highly actionable checklist subtasks referring to standard books
      - phase: Broad preparation phase, e.g., 'Phase 1: Foundation Building', 'Phase 2: Core Syllabus Mastery', 'Phase 3: Integration & Answer Writing', 'Phase 4: High-Yield Revision'
      - priority: Priority level: 'High', 'Medium', or 'Low'
      - references: Real textbook references, e.g., ['M. Laxmikanth - Indian Polity Chapter 7', 'NCERT Class XI Indian Constitution at Work']
      - learningObjectives: 3 key conceptual learning objectives the student should be able to recall
      - selfCheckQuestion: A highly challenging, conceptual Active Recall self-check question based on the topic
      - selfCheckAnswer: The exact, detailed factual answer to the self-check question.`;

      const response = await callGeminiWithRetry(() => aiClient!.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an elite Civil Services Exam Mentor who creates precise, customized, realistic schedules for UPSC and TNPSC aspirants. All topics, chapters, and textbook citations (e.g., NCERT, M. Laxmikanth, Spectrum, Samacheer Kalvi) must be 100% authentic, real, and factually accurate. Do not recommend fictional resources or invent false syllabus chapters.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tasks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.INTEGER, description: "The day number in the schedule" },
                    topic: { type: Type.STRING, description: "Specific topic name to study" },
                    subject: { type: Type.STRING, description: "Broad subject (e.g. History, Polity, Geography, General Tamil, Aptitude)" },
                    hours: { type: Type.NUMBER, description: "Recommended hours to allocate" },
                    subtasks: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "List of actionable subtasks or study references"
                    },
                    phase: { type: Type.STRING, description: "The study phase name, e.g. 'Phase 1: Foundation Building', 'Phase 2: Core Syllabus Mastery'" },
                    priority: { type: Type.STRING, description: "The priority level: 'High', 'Medium', or 'Low'" },
                    references: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "List of real textbook and chapter references"
                    },
                    learningObjectives: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "3 key conceptual learning objectives the student should recall"
                    },
                    selfCheckQuestion: { type: Type.STRING, description: "Active recall self-check question" },
                    selfCheckAnswer: { type: Type.STRING, description: "Factual answer to the self-check question" }
                  },
                  required: ["day", "topic", "subject", "hours", "subtasks", "phase", "priority", "references", "learningObjectives", "selfCheckQuestion", "selfCheckAnswer"]
                }
              }
            },
            required: ["tasks"]
          }
        }
      }));

      const resultText = response.text;
      if (resultText) {
        const parsed = JSON.parse(resultText);
        return res.json(parsed);
      }
    } catch (error: any) {
      console.warn("Gemini planner fallback activated:", error.message || error);
    }
  }

  // Fallback Schedule Generator (Realistic, Mock/Offline Mode)
  console.log("Generating offline smart schedule with high details...");
  
  const generatedTasks = [];
  const taskCount = 10; // Spatially dense, high info

  // Rich database of offline high-yield items
  const upscPlanPool = [
    {
      topic: "Preamble & Salient Features of the Constitution",
      subject: "Polity",
      phase: "Phase 1: Foundation Building",
      priority: "High",
      references: ["M. Laxmikanth Chapters 3 & 4", "NCERT Class XI: Indian Constitution at Work Chapter 1"],
      learningObjectives: [
        "Explain the significance of 'Sovereign Socialist Secular Democratic Republic'",
        "Define whether the Preamble is a part of the Constitution based on Kesavananda Bharati case",
        "Recall the amendment that inserted 'Socialist, Secular, Integrity'"
      ],
      selfCheckQuestion: "Is the Preamble amendable under Article 368? What was the Supreme Court's ruling on this in the Kesavananda Bharati Case (1973)?",
      selfCheckAnswer: "Yes, the Supreme Court ruled in the Kesavananda Bharati case (1973) that the Preamble is an integral part of the Constitution and can be amended under Article 368, provided that the 'Basic Structure' of the Constitution is not destroyed or altered. It has been amended only once so far, by the 42nd Amendment in 1976."
    },
    {
      topic: "Fundamental Rights (Articles 14 to 18)",
      subject: "Polity",
      phase: "Phase 1: Foundation Building",
      priority: "High",
      references: ["M. Laxmikanth Chapter 7", "Indian Constitution Articles 14, 15, 16, 17, 18"],
      learningObjectives: [
        "Differentiate between 'Equality before Law' and 'Equal Protection of Laws'",
        "Deconstruct the exceptions to Article 15 & 16 for reservation policies",
        "Understand why Article 17 is absolute and has no exceptions"
      ],
      selfCheckQuestion: "Explain the difference between 'Equality before Law' (borrowed from UK) and 'Equal Protection of Laws' (borrowed from USA).",
      selfCheckAnswer: "'Equality before Law' is a negative concept of British origin implying the absence of any special privileges and equal subjection of all persons to ordinary law. 'Equal Protection of Laws' is a positive concept of American origin implying equal treatment under equal circumstances, allowing the state to make reasonable classifications for affirmative action."
    },
    {
      topic: "Indian Freedom Struggle: The Gandhian Phase (1915-1930)",
      subject: "History",
      phase: "Phase 2: Core Syllabus Mastery",
      priority: "High",
      references: ["Spectrum Modern India Chapter 15 & 16", "NCERT Class XII: Themes in Indian History Part III"],
      learningObjectives: [
        "Trace Mahatma Gandhi's early Satyagrahas: Champaran, Kheda, Ahmedabad",
        "Deconstruct the causes, events, and suspension of the Non-Cooperation Movement",
        "Explain the strategic shift to Civil Disobedience and the Salt March (1930)"
      ],
      selfCheckQuestion: "What was the immediate cause for Gandhi to suspend the Non-Cooperation Movement in February 1922?",
      selfCheckAnswer: "Mahatma Gandhi suspended the Non-Cooperation Movement following the Chauri Chaura incident in February 1922, where an angry mob set fire to a police station, burning alive 22 policemen. Since Gandhi was strictly committed to absolute Non-Violence (Ahimsa), he deemed the country not yet ready for a mass struggle."
    },
    {
      topic: "Monetary Policy Committee & Inflation Targeting",
      subject: "Economy",
      phase: "Phase 2: Core Syllabus Mastery",
      priority: "High",
      references: ["Ramesh Singh - Indian Economy Chapter 12", "RBI Official Website Monetary Policy FAQ"],
      learningObjectives: [
        "Understand the composition and voting rules of the Monetary Policy Committee (MPC)",
        "Differentiate between Headline inflation and Core inflation",
        "Explain how Repo Rate and Reverse Repo Rate control liquidity"
      ],
      selfCheckQuestion: "What is the statutory inflation target for the Reserve Bank of India, and who constitutes the Monetary Policy Committee?",
      selfCheckAnswer: "The statutory inflation target is 4% with a tolerance band of +/- 2% (i.e., 2% to 6%). The MPC consists of 6 members: 3 from the RBI (including the Governor as ex-officio Chairperson) and 3 external members appointed by the Government of India."
    },
    {
      topic: "Physiographic Divisions of India & Himalayan Rivers",
      subject: "Geography",
      phase: "Phase 1: Foundation Building",
      priority: "Medium",
      references: ["NCERT Class XI: India Physical Environment Chapter 2 & 3"],
      learningObjectives: [
        "Compare the geological origin of Himalayas vs Peninsular Plateau",
        "Trace the courses, tributaries, and basins of the Indus, Ganga, and Brahmaputra",
        "Identify major mountain passes (Zoji La, Shipki La, Nathu La) and their strategic relevance"
      ],
      selfCheckQuestion: "Which major tributary of the Indus originates near the Rohtang Pass, and what major hydroelectric project is situated on it?",
      selfCheckAnswer: "The Sutlej and Beas originate near the Rohtang Pass (Beas Kund specifically for the Beas River, while the Sutlej enters India from Tibet through Shipki La). The Beas River merges with Sutlej at Harike. The famous Bhakra-Nangal dam complex is built on the Sutlej river."
    },
    {
      topic: "Biodiversity Conservation: National Parks & Wildlife Protection Act",
      subject: "Environment",
      phase: "Phase 3: Integration & Answer Writing",
      priority: "High",
      references: ["Shankar IAS Environment Book Chapters 5 & 10", "Wildlife Protection Act, 1972 Schedules"],
      learningObjectives: [
        "Contrast the legal protection differences between National Parks, Wildlife Sanctuaries, and Biosphere Reserves",
        "Understand the recent 2022 amendments to the WPA, reducing schedules from six to four",
        "Locate key critically endangered species and their habitats (e.g., Hangul, Sangai Deer, Great Indian Bustard)"
      ],
      selfCheckQuestion: "What is the key difference between a National Park and a Wildlife Sanctuary regarding human activities?",
      selfCheckAnswer: "In a National Park, no human activities (like grazing, forestry, or habitat settlement) are permitted at all. In a Wildlife Sanctuary, certain limited human activities and traditional rights (like collection of minor forest produce or grazing) are allowed, subject to regulation by the Chief Wildlife Warden."
    },
    {
      topic: "CSAT: Quantitative Aptitude - Percentages & Profit-Loss",
      subject: "CSAT",
      phase: "Phase 3: Integration & Answer Writing",
      priority: "Medium",
      references: ["RS Aggarwal - Quantitative Aptitude Chapter 10 & 11", "UPSC CSAT Past 10 Years Question Papers"],
      learningObjectives: [
        "Master percentage formula conversions and successive increase/decrease models",
        "Solve complex profit, loss, and marked price problems with high accuracy",
        "Apply shortcut ratios to increase speed during the exam"
      ],
      selfCheckQuestion: "If a merchant sells an item at a profit of 20% after giving a discount of 10% on the marked price, find the ratio of Cost Price to Marked Price.",
      selfCheckAnswer: "Let Cost Price be CP and Marked Price be MP. Selling Price (SP) = CP * 1.2 and SP = MP * 0.9. Therefore, CP * 1.2 = MP * 0.9 => CP/MP = 0.9 / 1.2 = 3/4. The ratio is 3:4."
    },
    {
      topic: "Mains GS2 Answer Writing: Cooperative Federalism & Interstate disputes",
      subject: "Polity",
      phase: "Phase 3: Integration & Answer Writing",
      priority: "High",
      references: ["Sarkaria Commission Report Summary", "M. Laxmikanth Chapter 14", "Constitution of India Article 262 & 263"],
      learningObjectives: [
        "Recall constitutional mechanisms for resolving interstate water disputes (Article 262)",
        "Evaluate the effectiveness of the Inter-State Council (Article 263)",
        "Formulate a balanced administrative recommendation for central-state cooperation"
      ],
      selfCheckQuestion: "Under which Article can the President establish an Inter-State Council to investigate and discuss subjects of common interest?",
      selfCheckAnswer: "Under Article 263 of the Constitution of India, the President can establish an Inter-State Council. It was first established in 1990 on the recommendation of the Sarkaria Commission."
    },
    {
      topic: "Major Government Schemes for Rural Development",
      subject: "Economy",
      phase: "Phase 4: High-Yield Revision",
      priority: "Medium",
      references: ["Yojana Magazine Issues", "Kurukshetra Journal summaries", "Ministry of Rural Development briefs"],
      learningObjectives: [
        "Outline the goals and wage structure of MGNREGA",
        "Recall components of PM Awas Yojana (Gramin)",
        "Analyze the impact of digital land records integration (SVAMITVA Scheme)"
      ],
      selfCheckQuestion: "What is the legal guarantee provided under the MGNREGA Act regarding employment days?",
      selfCheckAnswer: "The MGNREGA Act legally guarantees at least 100 days of wage employment in a financial year to every rural household whose adult members volunteer to do unskilled manual work."
    },
    {
      topic: "High-Yield Prelims Mock Test & Last Minute Revision",
      subject: "General Studies Core",
      phase: "Phase 4: High-Yield Revision",
      priority: "High",
      references: ["Aspires Academy Full Length Prelims Papers 1-5", "Syllabus Review Checklists"],
      learningObjectives: [
        "Simulate exact 2-hour exam condition for General Studies Paper I",
        "Review mistake logs to eliminate conceptual traps and factual gaps",
        "Practice tactical elimination techniques for uncertain questions"
      ],
      selfCheckQuestion: "How should you manage your exam attempts if you are unsure about several 50-50 options?",
      selfCheckAnswer: "For questions where you can confidently eliminate exactly 2 options (leaving a 50-50 choice), the laws of probability dictate you should attempt them, as the positive marking (+2) outweighs the negative penalty (-0.66) over a larger sample of questions."
    }
  ];

  const tnpscPlanPool = [
    {
      topic: "Thirukkural: Role in Ethics, Modern Administration & Humanity",
      subject: "Tamil Heritage",
      phase: "Phase 1: Foundation Building",
      priority: "High",
      references: ["Samacheer Kalvi Class 11 & 12 Special Tamil", "Unit 8 TNPSC Syllabus Guide"],
      learningObjectives: [
        "Explain Thiruvalluvar's concepts of secular administration (Porutpal)",
        "Analyze how Thirukkural addresses social equity, equality, and compassion",
        "Write custom ethical explanations of major Kurals related to governance"
      ],
      selfCheckQuestion: "How does Thirukkural define a ideal King/State in the 'Iraimatchi' (Greatness of King) chapter?",
      selfCheckAnswer: "In the Kural 'Murai Seythu Kaapaatrum...', Valluvar states that a ruler who administers justice and protects his subjects is regarded as a divine leader. The state must excel in four actions: creating wealth, acquiring it, safeguarding it, and distributing it equitably."
    },
    {
      topic: "Justice Party Rule & Non-Brahmin Movement (1916-1944)",
      subject: "History & Culture",
      phase: "Phase 1: Foundation Building",
      priority: "High",
      references: ["Social Transformation in Tamil Nadu - Samacheer Class 10 Unit 10", "Unit 8 History textbook"],
      learningObjectives: [
        "Deconstruct the formation of South Indian Liberal Federation (SILF) / Justice Party in 1916",
        "List key achievements of the Justice Party rule (e.g., Communal G.O of 1921 & 1922, Staff Selection Board, Mid-day meals)",
        "Trace the transformation into Dravidar Kazhagam under Periyar in 1944"
      ],
      selfCheckQuestion: "Which major social welfare scheme was pioneered by the Justice Party in Madras Corporation in 1920?",
      selfCheckAnswer: "The Madras Corporation under Justice Party rule pioneered the Mid-day Meal Scheme in a corporation school at Thousand Lights, Chennai, in 1920. This was the historical precursor to the massive noon-meal systems of today."
    },
    {
      topic: "Aptitude: Simplification & HCF and LCM formulas",
      subject: "Aptitude",
      phase: "Phase 2: Core Syllabus Mastery",
      priority: "High",
      references: ["Samacheer Kalvi Maths textbooks Classes 6 to 10", "TNPSC Aptitude Past Papers"],
      learningObjectives: [
        "Master BODMAS rules, algebraic identities, and square/cube roots calculation",
        "Establish the relationship between two numbers and their HCF and LCM: Product = HCF * LCM",
        "Solve real-world application problems involving traffic lights, bells, or tile layouts"
      ],
      selfCheckQuestion: "If the product of two numbers is 2025 and their LCM is 135, find their HCF.",
      selfCheckAnswer: "Using the formula: Product of two numbers = HCF * LCM, we get 2025 = HCF * 135. Therefore, HCF = 2025 / 135 = 15."
    },
    {
      topic: "Social Reform Movements: Self-Respect Movement & Periyar",
      subject: "Tamil Heritage",
      phase: "Phase 2: Core Syllabus Mastery",
      priority: "High",
      references: ["Socio-Religious Reform Movements of 19th and 20th Century", "Unit 8/9 TNPSC guidelines"],
      learningObjectives: [
        "Detail Periyar E.V.R.'s key philosophies on self-respect, rationalism, and women's liberation",
        "Recall landmark conferences (Chengalpattu 1929, Erode 1930) and their resolutions",
        "Explain Periyar's contributions to the Vaikom Satyagraha and title 'Thanthai Periyar'"
      ],
      selfCheckQuestion: "Who conferred the title 'Periyar' (The Great One) on E. V. Ramasamy, and in which year?",
      selfCheckAnswer: "The title 'Periyar' was conferred on E. V. Ramasamy by the Madras Province Women's Association during a historic conference in Chennai on November 13, 1938, led by Dr. Dharmambal and other prominent women activists."
    },
    {
      topic: "Physical Geography of Tamil Nadu & Monsoon Cycles",
      subject: "Geography",
      phase: "Phase 1: Foundation Building",
      priority: "Medium",
      references: ["Samacheer Kalvi Class 10 Social Science Geography of Tamil Nadu Unit 6 & 7"],
      learningObjectives: [
        "Detail the structural differences between Western Ghats and Eastern Ghats in Tamil Nadu",
        "Analyze why Tamil Nadu receives the bulk of its rainfall from the Northeast Monsoon (Retreating Monsoon)",
        "Map key rivers (Cauvery, Vaigai, Thamirabarani) and major irrigation canals"
      ],
      selfCheckQuestion: "Why does Tamil Nadu receive more rainfall during the Northeast Monsoon compared to the Southwest Monsoon?",
      selfCheckAnswer: "During the Southwest Monsoon, Tamil Nadu lies in the rain-shadow region of the Western Ghats. In contrast, during the Northeast Monsoon (October to December), the retreating winds pick up moisture from the Bay of Bengal and hit the eastern coast directly, bringing heavy rainfall."
    },
    {
      topic: "Development Administration: Welfare Schemes of Tamil Nadu",
      subject: "Development Admin",
      phase: "Phase 2: Core Syllabus Mastery",
      priority: "High",
      references: ["TNPSC Unit 9 Development Administration Syllabus", "Tamil Nadu State Budget Highlight summaries"],
      learningObjectives: [
        "Explain the historical evolution and success of Tamil Nadu's reservation model (69% quota)",
        "Recall details of iconic welfare schemes (e.g., Pudhumai Penn, Moovalur Ramamirtham Ammaiyar, Illam Thedi Kalvi)",
        "Highlight state health indicators compared to National averages"
      ],
      selfCheckQuestion: "What is the Pudhumai Penn Scheme, and what incentive does it offer to female students?",
      selfCheckAnswer: "The Pudhumai Penn Scheme (Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme) provides a monthly financial assistance of ₹1,000 to girl students who studied from Class 6 to 12 in government schools and are pursuing higher education."
    },
    {
      topic: "Aptitude: Ratio and Proportion & Time and Work",
      subject: "Aptitude",
      phase: "Phase 3: Integration & Answer Writing",
      priority: "High",
      references: ["Samacheer Kalvi Class 7 & 8 Mathematics", "TNPSC Aptitude Solved Question Papers"],
      learningObjectives: [
        "Deconstruct problems on direct and inverse proportions",
        "Solve 'Time and Work' equations using the unitary or LCM efficiency method",
        "Apply formula: M1 * D1 * H1 / W1 = M2 * D2 * H2 / W2 for compound work"
      ],
      selfCheckQuestion: "If 12 men can build a wall in 20 days, working 8 hours a day, in how many days can 15 men build the same wall working 10 hours a day?",
      selfCheckAnswer: "Using the work formula: M1 * D1 * H1 = M2 * D2 * H2 => 12 * 20 * 8 = 15 * D2 * 10 => 1920 = 150 * D2 => D2 = 1920 / 150 = 12.8 days."
    },
    {
      topic: "Indian Polity: State Legislature & Role of Governor",
      subject: "Polity",
      phase: "Phase 2: Core Syllabus Mastery",
      priority: "High",
      references: ["M. Laxmikanth Chapters 30 & 31", "Constitution of India Articles 153 to 167"],
      learningObjectives: [
        "Examine the discretionary powers of the Governor (Article 163)",
        "Compare legislative power differences between Legislative Assembly and Legislative Council",
        "Analyze central-state federal frictions regarding assent to bills (Article 200)"
      ],
      selfCheckQuestion: "Under which Article of the Constitution can a Governor reserve a state bill for the consideration of the President?",
      selfCheckAnswer: "Under Article 200 of the Indian Constitution, the Governor has the power to reserve a bill passed by the state legislature for the consideration of the President."
    },
    {
      topic: "Economy of Tamil Nadu: Industrial Clusters & Economy Indicators",
      subject: "Economy",
      phase: "Phase 4: High-Yield Revision",
      priority: "Medium",
      references: ["Samacheer Kalvi Class 11 Economics Chapter 11 on Tamil Nadu Economy"],
      learningObjectives: [
        "Detail why Tamil Nadu is called the 'Detroit of Southern Asia'",
        "Trace geographical clusters: Tiruppur (garments), Sivakasi (fireworks), Karur (coach building), Salem (steel)",
        "Acknowledge the success of the state in renewable energy (Muppandal wind farm)"
      ],
      selfCheckQuestion: "Which town in Tamil Nadu is famously nicknamed 'Little Japan' due to its massive production of printing, matches, and fireworks?",
      selfCheckAnswer: "Sivakasi in Virudhunagar district is nicknamed 'Little Japan' (by Jawaharlal Nehru) because it contributes around 90% of India's fireworks production and 80% of safety matches."
    },
    {
      topic: "Comprehensive Revision & Mock Test on General Tamil & General Studies",
      subject: "General Studies Core",
      phase: "Phase 4: High-Yield Revision",
      priority: "High",
      references: ["TNPSC Group I/II/IV Full Model Tests", "Aptitude formula sheet review"],
      learningObjectives: [
        "Solve 200 MCQ questions in exactly 3 hours",
        "Verify grammar errors in General Tamil (e.g. Porutham, Ezuthu, Sol)",
        "Fine-tune time allocation: 1 hour for Tamil, 45 mins for Aptitude, 1 hour 15 mins for GS"
      ],
      selfCheckQuestion: "What is the recommended order of sections to attempt in a 200-question TNPSC exam?",
      selfCheckAnswer: "Most high-scoring candidates recommend attempting General Tamil (or Language Eligibility) first to complete 100 questions within 45-55 minutes, followed immediately by General Studies (75 questions) for 75 minutes, leaving the final 50-60 minutes dedicated to solving the 25 Aptitude questions with complete scratchpad sanity."
    }
  ];

  // Select pool based on exam
  const activePool = exam.startsWith('TNPSC') ? tnpscPlanPool : upscPlanPool;
  
  for (let i = 0; i < taskCount; i++) {
    const dayNum = Math.round(((i + 1) / taskCount) * totalDays);
    const poolItem = activePool[i % activePool.length];
    
    generatedTasks.push({
      id: `task-offline-${i}-${Date.now()}`,
      day: dayNum,
      topic: poolItem.topic,
      subject: poolItem.subject,
      hours: parseFloat(dailyHours),
      completed: false,
      subtasks: [
        `Read official textbooks/material: ${poolItem.references[0]}`,
        `Fulfill active recall objectives (listed in detailed planner expansion panel)`,
        `Solve past board papers matching "${poolItem.topic}"`,
        `Consult with Personal AI Coach if any conceptual doubts persist`
      ],
      phase: poolItem.phase,
      priority: poolItem.priority,
      references: poolItem.references,
      learningObjectives: poolItem.learningObjectives,
      selfCheckQuestion: poolItem.selfCheckQuestion,
      selfCheckAnswer: poolItem.selfCheckAnswer
    });
  }

  res.json({ tasks: generatedTasks, isOffline: true });
});

// 3. Dynamic Quiz Generator
app.post('/api/generate-quiz', async (req, res) => {
  const { exam, subject } = req.body;

  if (!exam) {
    return res.status(400).json({ error: 'Exam parameter is required' });
  }

  if (aiClient) {
    try {
      const prompt = `Generate a high-quality MCQ mock quiz for the ${exam} exam.
      The focus subject/topic is: ${subject || 'General Studies'}.
      Generate exactly 5 questions.
      Each question must have exactly 4 plausible options, a 0-indexed correctAnswerIndex, and a comprehensive explanation explaining WHY the correct answer is right and why other options are wrong (referring to key facts, Articles, or syllabus points). Include Tamil terminology or translation where suitable if it is a TNPSC exam, but keep the overall content clean and professional. Do not repeat questions.`;

      const response = await callGeminiWithRetry(() => aiClient!.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are a Senior Question Compiler for UPSC (Civil Services) and TNPSC (Tamil Nadu Public Service Commission) exams. Your questions are balanced, challenging, accurate, and test deep understanding rather than simple rote memorization. Every question, option, correct answer, and explanation must be 100% factually accurate, referencing real articles of the Constitution of India, real historical timelines, and genuine economic statistics. There is zero tolerance for hallucinations or incorrect/outdated facts.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING, description: "The MCQ question text" },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "List of exactly 4 choices/options"
                    },
                    correctAnswerIndex: { type: Type.INTEGER, description: "The 0-indexed index of the correct option" },
                    explanation: { type: Type.STRING, description: "Clear explanation of the answer" }
                  },
                  required: ["id", "text", "options", "correctAnswerIndex", "explanation"]
                }
              }
            },
            required: ["questions"]
          }
        }
      }));

      const resultText = response.text;
      if (resultText) {
        const parsed = JSON.parse(resultText);
        return res.json(parsed);
      }
    } catch (error: any) {
      console.warn("Gemini quiz generator fallback activated:", error.message || error);
    }
  }

  // Fallback offline dynamic compiler
  console.log("Generating offline fallback quiz...");
  const offlineQuestions = [
    {
      id: `off-q-${Date.now()}-1`,
      text: `Which of the following bodies is constitutional in nature for the development and financial devolution of states?`,
      options: [
        'NITI Aayog',
        'National Development Council (NDC)',
        'The Finance Commission of India (Article 280)',
        'GST Council Secretariat'
      ],
      correctAnswerIndex: 2,
      explanation: 'The Finance Commission is a constitutional body established under Article 280 of the Constitution. Its primary duty is to recommend the devolution of financial resources between the Union and the States. NITI Aayog and NDC are executive bodies.'
    },
    {
      id: `off-q-${Date.now()}-2`,
      text: `In the context of TNPSC History and Heritage, who chaired the first provincial conference of the Self-Respect Movement in Chengalpattu in 1929?`,
      options: [
        'E. V. Ramasamy (Periyar)',
        'W. P. A. Soundarapandianar',
        'C. Natesa Mudaliar',
        'T. M. Nair'
      ],
      correctAnswerIndex: 1,
      explanation: 'W.P.A. Soundarapandianar presided over the historic First Self-Respect Movement Provincial Conference held at Chengalpattu in 1929, which was organized under Periyar\'s guidance.'
    },
    {
      id: `off-q-${Date.now()}-3`,
      text: `Which article of the Indian Constitution empowers the President of India to grant pardons, reprieves, or commutations of sentences?`,
      options: [
        'Article 72',
        'Article 161',
        'Article 123',
        'Article 356'
      ],
      correctAnswerIndex: 0,
      explanation: 'Article 72 of the Constitution of India empowers the President to grant pardons, reprieves, respites, or remissions of punishment or to suspend, remit, or commute sentences. Article 161 empowers Governors of States similarly.'
    }
  ];

  res.json({ questions: offlineQuestions, isOffline: true });
});

// 4. Descriptive Essay/Mains Answer Evaluator
app.post('/api/evaluate-essay', async (req, res) => {
  const { promptTitle, context, essayText, wordCountTarget } = req.body;

  if (!essayText) {
    return res.status(400).json({ error: 'Essay text is required' });
  }

  const wordCount = essayText.trim().split(/\s+/).length;

  if (aiClient) {
    try {
      const prompt = `Evaluate the following civil services descriptive/essay answer.
      Topic Title: "${promptTitle}"
      Topic Context: "${context}"
      Target Word Count: ${wordCountTarget || 800} words.
      Student Answer: "${essayText}"

      Provide an expert, professional evaluation. Be balanced but demanding. Frame comments like an official Civil Services examiner. Output a structured evaluation matching the requested schema.`;

      const response = await callGeminiWithRetry(() => aiClient!.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an Expert UPSC and TNPSC Descriptive Examiner who grades mains essays and GS answers. You evaluate structural cohesion, depth of arguments, inclusion of constitution articles or historical references, grammatical accuracy, and logical flow. You must rigorously check for factual accuracy; penalize any fabricated statistics or misattributed constitutional articles. Your model answers must represent 100% authentic, accurate, and official academic outlines.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER, description: "Total score out of 100" },
              overallFeedback: { type: Type.STRING, description: "Detailed high-level summary of the submission" },
              structureRating: { type: Type.INTEGER, description: "Structure score (out of 10)" },
              structuralFeedback: { type: Type.STRING, description: "Analysis of Introduction, Body, Conclusion structure" },
              argumentRating: { type: Type.INTEGER, description: "Argumentative depth score (out of 10)" },
              argumentFeedback: { type: Type.STRING, description: "Feedback on critical analytical arguments, data, and citations" },
              languageRating: { type: Type.INTEGER, description: "Grammar, tone, and flow score (out of 10)" },
              languageFeedback: { type: Type.STRING, description: "Vocabulary and flow insights" },
              factAccuracyRating: { type: Type.INTEGER, description: "Factual/historical accuracy score (out of 10)" },
              factFeedback: { type: Type.STRING, description: "Review of articles, timelines, facts quoted" },
              modelAnswerOutline: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of 4-6 bullet points of ideal elements/arguments that should have been covered"
              }
            },
            required: [
              "score", "overallFeedback", "structureRating", "structuralFeedback",
              "argumentRating", "argumentFeedback", "languageRating", "languageFeedback",
              "factAccuracyRating", "factFeedback", "modelAnswerOutline"
            ]
          }
        }
      }));

      const resultText = response.text;
      if (resultText) {
        const parsed = JSON.parse(resultText);
        return res.json(parsed);
      }
    } catch (error: any) {
      console.warn("Gemini essay evaluator fallback activated:", error.message || error);
    }
  }

  // Simulated evaluation fallback
  const simulatedScore = Math.min(85, Math.max(45, 55 + Math.floor(Math.random() * 20) + (wordCount > 150 ? 10 : 0)));
  const simulatedEvaluation = {
    score: simulatedScore,
    overallFeedback: `Good effort! Your submission contains around ${wordCount} words. The response addresses the core prompt reasonably well, but requires deeper integration of constitutional provisions, relevant court cases, or localized development statistics to score higher.`,
    structureRating: 7,
    structuralFeedback: "Your introduction starts strong, and the main points are structured in clear paragraphs. However, your conclusion could be more action-oriented or forward-looking.",
    argumentRating: 6,
    argumentFeedback: "The points raised are valid but somewhat generic. Try to include official committee reports (like Sarkaria Commission or Kasturirangan committee) to bolster the credibility of your arguments.",
    languageRating: 8,
    languageFeedback: "The language is clear, grammatically sound, and maintains an objective academic/administrative tone throughout.",
    factAccuracyRating: 7,
    factFeedback: "You have mentioned core facts correctly. Ensure you precisely cite Articles of the Constitution (e.g., Article 21, Article 356) to make your arguments solid.",
    modelAnswerOutline: [
      "Define key terms clearly in the opening paragraphs (Introduction).",
      "Explain chronological background, core administrative/cultural significance.",
      "Cite specific Articles of the Constitution, Supreme Court precedents, or legislative Acts.",
      "Incorporate socio-economic facts, statistical indicators, or regional welfare metrics.",
      "Provide a balanced positive 'Way Forward' focusing on cooperative federalism, digital literacy, or inclusive policy."
    ],
    isOffline: true
  };

  res.json(simulatedEvaluation);
});

// 5. Mentor AI Chatbot
app.post('/api/mentor-chat', async (req, res) => {
  const { messages, exam } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const examLabels: Record<string, string> = {
    UPSC: 'UPSC Civil Services Exam',
    TNPSC_G1: 'TNPSC Group I Exam',
    TNPSC_G2: 'TNPSC Group II Exam',
    TNPSC_G4: 'TNPSC Group IV & VAO Exam'
  };

  const examLabel = examLabels[exam] || 'Civil Services Exam';

  const chatHistoryFormatted = messages.map(msg => 
    `${msg.sender === 'user' ? 'Aspirant' : 'Mentor'}: ${msg.text}`
  ).join('\n');

  if (aiClient) {
    try {
      const response = await callGeminiWithRetry(() => aiClient!.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `The aspirant is preparing for the ${examLabel}.\nChat history:\n${chatHistoryFormatted}\n\nProvide the next response as the wise, encouraging Civil Services Mentor. Keep your answer highly helpful, structured, clear, and focused on specific syllabus guidelines, study tips, or explanations. All facts, historical timelines, and constitutional provisions must be 100% authentic and accurate. If you are unsure of any specific local data or statistics, state that they should check official government sources directly (e.g., PIB, Tamil Nadu Department of Archaeology, or Union Budget). Feel free to explain administrative concepts, historical milestones, or Thirukkural ethics, and write in Tamil or English as requested by the aspirant.`,
        config: {
          systemInstruction: 'You are an inspiring, wise, highly knowledgeable UPSC and TNPSC civil services coach who acts as a caring but lively Indian sister/auntie mentor ("Priya Didi"). You MUST speak in a highly engaging tone, using popular Indian-English slang naturally and frequently (e.g., "Arre Yaar", "Beta", "Aiyyo", "Tension nakko lo", "Chalo", "simple na", "toh", "acha", "hain na", "yaar", "bas", "jaldi se", "Superb!"). While maintaining absolute factual accuracy and academic rigor for all Indian Polity, History, Tamil Heritage, and Aptitude topics, deliver your wisdom with this warm, sisterly Indian persona so the aspirant feels supported and motivated. Do not lose your casual, lovable slang style!',
        }
      }));

      const reply = response.text;
      if (reply) {
        return res.json({ reply });
      }
    } catch (error: any) {
      console.warn("Gemini chat fallback activated:", error.message || error);
    }
  }

  // Fallback offline reply
  const lastUserMsg = messages[messages.length - 1]?.text?.toLowerCase() || '';
  let reply = "Arre Beta! I am here to guide your civil services journey! Focus on building strong conceptual foundations, simple na? Read your newspaper daily, solve MCQs regularly, and practice answer writing. Tension nakko lo!";

  if (lastUserMsg.includes('tamil') || lastUserMsg.includes('தமிழ்')) {
    reply = "Aiyyo! நிச்சயமாக! டி.என்.பி.எஸ்.சி (TNPSC) தேர்வுகளில் பொதுத்தமிழ் மற்றும் தமிழ் மரபு மிகவும் முக்கியமானது, simple na? திருக்குறள், சங்க இலக்கியம், மற்றும் சமூக சீர்திருத்த இயக்கங்களை நன்கு படியுங்கள், super-ah score பண்ணலாம். நான் உங்களுக்கு உதவத் தயாராக உள்ளேன், chalo!";
  } else if (lastUserMsg.includes('polity') || lastUserMsg.includes('constitution')) {
    reply = "Arre Yaar, for Indian Polity, M. Laxmikanth is the absolute gold standard! Focus extensively on Fundamental Rights, DPSP, Parliament, Judicial Review, and Federalism. Understand both theoretical parts and recent Supreme Court judgments, acha?";
  } else if (lastUserMsg.includes('syllabus') || lastUserMsg.includes('pattern')) {
    reply = `Arre Beta, for the ${examLabel}, understanding the syllabus is 50% of the preparation, hain na? Memorize key keywords of the syllabus so that when you read newspapers, you can filter and connect relevant articles. Let me know which specific subject you'd like to explore first!`;
  } else if (lastUserMsg.includes('thirukkural') || lastUserMsg.includes('திருக்குறள்')) {
    reply = "Aiyyo! திருக்குறள் நிர்வாகத் தரம் மற்றும் அறநெறிகளுக்குச் சான்றாகும், simple na? TNPSC மற்றும் UPSC தேர்வுகளில், அறன் வலியுறுத்தல், ஒழுக்கமுடைமை, வாய்மை, மற்றும் பெரியாரைத் துணைக்கோடல் போன்ற அதிகாரங்கள் மிகவும் முக்கியமானவை. Keep practicing, beta!";
  }

  res.json({ reply, isOffline: true });
});

// 6. Current Affairs GK Deep Dive
app.post('/api/gk-deepdive', async (req, res) => {
  const { title, category, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Article parameters are required' });
  }

  if (aiClient) {
    try {
      const prompt = `Analyze this current affairs article for a Civil Services aspirant (UPSC/TNPSC):
      Title: "${title}"
      Category: "${category}"
      Content: "${content}"

      Provide an extensive GS (General Studies) analytical deep dive containing:
      1. Background & Context (Why is this important?)
      2. Relevance to Syllabus (UPSC/TNPSC Paper mappings)
      3. Critical Analysis & Points (Pros, Cons, Challenges, and Key data)
      4. Way Forward & Recommendations (Administrative perspective)`;

      const response = await callGeminiWithRetry(() => aiClient!.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are a Senior Policy Analyst and General Studies Faculty who creates analytical briefs for IAS/IPS and state-level administrative aspirants. Your analyses are highly objective, deep, structured, and use standard policy terminologies. You must ensure all background dates, court cases, legislative acts, and statistical citations are 100% genuine and verified, avoiding any false information.',
        }
      }));

      const analysis = response.text;
      if (analysis) {
        return res.json({ analysis });
      }
    } catch (error: any) {
      console.warn("Gemini GK analysis fallback activated:", error.message || error);
    }
  }

  // Fallback analytical content
  const simulatedAnalysis = `### 1. Background & Context
The issue of **${title}** represents a significant milestone in contemporary socio-economic or environmental governance. It addresses critical infrastructural/societal changes that directly impact federal and state developments.

### 2. Syllabus Relevance (UPSC / TNPSC)
* **UPSC CSE Mains:** General Studies Paper III (Science & Technology, Economic Development, Environment) and Paper II (Governance and Public Policy).
* **TNPSC Group I/II:** Development Administration in Tamil Nadu, Indian Polity, and State Planning initiatives.

### 3. Key Issues & Critical Analysis
* **Structural Integration:** Incorporating progressive models into existing bureaucratic channels holds challenges but ensures decentralized execution.
* **Funding & Tech-Capacity:** Successful implementation relies heavily on fiscal transfers and local administrative skill-building.
* **Socio-Cultural Impact:** Aligning state schemes with grassroots needs improves public service speed and citizen satisfaction metrics.

### 4. Administrative Way Forward
To maximize impact, administrators should focus on:
* Fostering public-private partnerships (PPP) where capital requirements are intense.
* Integrating real-time IoT or digital tracking mechanisms to ensure transparency.
* Consistently seeking local community participation to establish organic, sustainable development projects.`;

  res.json({ analysis: simulatedAnalysis, isOffline: true });
});

// 7. Notes Generator for Topics & Keywords
app.post('/api/notes', async (req, res) => {
  const { topic, keywords, exam } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  const keywordsList = keywords ? keywords.split(',').map((k: string) => k.trim()).filter(Boolean) : [];
  const examLabels: Record<string, string> = {
    UPSC: 'UPSC Civil Services Exam',
    TNPSC_G1: 'TNPSC Group 1 Exam',
    TNPSC_G2: 'TNPSC Group 2 Exam',
    TNPSC_G4: 'TNPSC Group 4 Exam'
  };
  const examLabel = examLabels[exam] || 'Civil Services Exam';

  if (aiClient) {
    try {
      const prompt = `Generate a detailed high-yield revision study note for a civil services candidate preparing for the ${examLabel}.
      Topic: "${topic}"
      Key Terms / Focus areas: ${keywordsList.join(', ') || 'General overview'}

      You MUST respond with a JSON object containing the exact structure below. Do not wrap in markdown codeblocks other than JSON.
      Structure:
      {
        "title": "A highly precise title for the notes",
        "syllabusSubject": "The exact General Studies or Tamil Heritage subject/unit this maps to",
        "coreSummary": "Extensive, highly structured notes in complete, rich Markdown format. Include bold text, sub-sections, bullet points, constitutional articles or dates where relevant, policy implications, and critical analysis.",
        "citations": ["Standard reference 1", "Standard reference 2"],
        "activeRecallQuestions": [
          { "question": "High-yield conceptual check question 1?", "answer": "Clear, precise answer based on the note" },
          { "question": "High-yield conceptual check question 2?", "answer": "Clear, precise answer based on the note" },
          { "question": "High-yield conceptual check question 3?", "answer": "Clear, precise answer based on the note" }
        ]
      }`;

      const response = await callGeminiWithRetry(() => aiClient!.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: 'You are an elite civil services academic dean and NCERT/Laxmikanth subject matter expert. You generate incredibly dense, structured, highly factual study cards, micro-notes, and active recall decks. Your historical timelines, article numbers, and statistics are flawless.',
        }
      }));

      const text = response.text;
      if (text) {
        try {
          const parsed = JSON.parse(text);
          return res.json(parsed);
        } catch (e) {
          console.error("Failed to parse Gemini JSON for notes:", e);
          return res.json({
            title: `Study Notes: ${topic}`,
            syllabusSubject: "General Studies",
            coreSummary: text,
            citations: ["UPSC Standard Syllabus Guidelines"],
            activeRecallQuestions: [
              { question: `What is the core significance of ${topic}?`, answer: "Refer to the generated study notes details." }
            ]
          });
        }
      }
    } catch (error: any) {
      console.warn("Gemini Notes Generator fallback activated:", error.message || error);
    }
  }

  // Fallback offline notes generation
  const mockNotes: Record<string, any> = {
    "fundamental rights": {
      title: "Fundamental Rights (Part III of the Constitution)",
      syllabusSubject: "Indian Polity & Governance (GS Paper II)",
      citations: ["M. Laxmikanth - Indian Polity Chapter 7", "Constitution of India, Articles 12-35"],
      coreSummary: `### 1. Introduction & Constitutional Status
The **Fundamental Rights** are enshrined in **Part III** of the Indian Constitution, stretching from **Articles 12 to 35**. Styled as the *Magna Carta of India*, these rights are justiciable, allowing citizens to approach the Supreme Court (under Article 32) or High Courts (under Article 226) directly in case of violation.

### 2. Core Classification
There are six primary categories of Fundamental Rights currently recognized:
1. **Right to Equality (Articles 14-18):** Establishes equality before the law, prohibits discrimination, and abolishes untouchability (Article 17).
2. **Right to Freedom (Articles 19-22):** Guarantees six democratic freedoms (speech, assembly, association, movement, residence, and profession) and safeguards against arbitrary conviction and arrest.
3. **Right against Exploitation (Articles 23-24):** Prohibits forced labor, human trafficking, and employment of children under 14 in hazardous industries.
4. **Right to Freedom of Religion (Articles 25-28):** Secures freedom of conscience, profession, practice, and propagation of religion.
5. **Cultural and Educational Rights (Articles 29-30):** Protects the language, script, and culture of minorities, and their right to establish educational institutions.
6. **Right to Constitutional Remedies (Article 32):** Right to move the Supreme Court to enforce Part III rights via writs: *Habeas Corpus, Mandamus, Prohibition, Certiorari, and Quo Warranto*. Dr. B.R. Ambedkar termed Article 32 the "Heart and Soul" of the Constitution.

### 3. Key Doctrines & Limitations
* **Justiciability & State Definition:** Article 12 broadly defines "State" to include legislative, executive, statutory, and even certain non-statutory bodies.
* **Doctrine of Eclipse & Severability:** Article 13 provides judicial review leverage over pre-constitutional and post-constitutional laws conflicting with Part III.
* **Reasonable Restrictions:** Rights are not absolute but qualified. The State can impose reasonable restrictions on grounds of sovereignty, security, public order, or morality.`,
      activeRecallQuestions: [
        { question: "Which article is called the 'Heart and Soul' of the Constitution and why?", answer: "Article 32 (Right to Constitutional Remedies) because it makes all other fundamental rights justiciable and enforceable by authorizing writs." },
        { question: "Are Fundamental Rights absolute?", answer: "No, they are qualified. The state can impose 'reasonable restrictions' based on security, public order, and sovereignty under Article 19." },
        { question: "Which article abolishes untouchability?", answer: "Article 17 of the Indian Constitution." }
      ]
    },
    "sangam era": {
      title: "Sangam Era: Social Polity & Sangam Literature",
      syllabusSubject: "Tamil Heritage, History & Culture (TNPSC Unit 8 & UPSC GS Paper I)",
      citations: ["K.A. Nilakanta Sastri - A History of South India", "TN State Board Class XI History Textbook"],
      coreSummary: `### 1. Historical Chronology & Geography
The **Sangam Age** is a glorious epoch in the history of South India, spanning roughly from **300 BCE to 300 CE**. Geographically, it covers the territory south of the Krishna and Tungabhadra rivers, known as *Tamilakam*.

### 2. The Three Great Assemblies (Sangams)
According to Tamil tradition, three Sangams (academies of poets) existed under Royal Pandyan patronage:
* **First Sangam:** Held at Madurai, attended by gods and legendary sages. No literary work survived.
* **Second Sangam:** Held at Kapadapuram. The only surviving grammatical work is **Tolkappiyam** written by Tolkappiyar.
* **Third Sangam:** Held at modern Madurai. Most of the surviving Sangam literature comes from this assembly.

### 3. Classification of Sangam Literature
Sangam texts are broadly divided into narrative (**Melkanakku** - 18 Major Works) and didactic (**Kilkanakku** - 18 Minor Works) styles:
* **Ettutogai (Eight Anthologies):** Includes *Aingurunuru, Narrinai, Kuruntogai, Pathitrupathu, Paripadal, Kalitogai, Akananuru,* and *Purananuru*.
* **Pathupattu (Ten Idylls):** Includes detailed descriptive poetry like *Murugaratrupadai, Maduraikanchi,* etc.
* **Didactic Masterpieces:** Includes **Thirukkural** by Thiruvalluvar, which establishes universal moral guidelines.

### 4. Fivefold Landscapes (Thinai)
The Sangam people classified their geography into five distinct physiological tracts, each with its own deity and occupation:
1. **Kurinji (Hilly tracks):** Deity: Murugan; Occupation: Hunting, honey collection.
2. **Mullai (Forest pastures):** Deity: Mayon (Vishnu); Occupation: Cattle rearing.
3. **Marutham (Agricultural plains):** Deity: Indira; Occupation: Agriculture.
4. **Neithal (Coastal zones):** Deity: Varunan; Occupation: Fishing, salt extraction.
5. **Palai (Desert/Parched lands):** Deity: Korravai; Occupation: Robbery, cattle lifting.`,
      activeRecallQuestions: [
        { question: "What is Tolkappiyam?", answer: "The oldest surviving Tamil grammatical work, composed during the Second Sangam by Tolkappiyar." },
        { question: "Name the five landscape divisions (Thinai) of the Sangam Age.", answer: "Kurinji (mountains), Mullai (forests), Marutham (agricultural plains), Neithal (seashore), and Palai (arid desert)." },
        { question: "Which classic Sangam text contains historical information about the Chera kings?", answer: "Pathitrupathu (part of Ettutogai)." }
      ]
    }
  };

  const cleanTopic = topic.toLowerCase().trim();
  let matchedNote = mockNotes[cleanTopic];

  if (!matchedNote) {
    const key = Object.keys(mockNotes).find(k => cleanTopic.includes(k) || k.includes(cleanTopic));
    if (key) {
      matchedNote = mockNotes[key];
    }
  }

  if (matchedNote) {
    return res.json({
      ...matchedNote,
      isOffline: true
    });
  }

  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
  const fallbackNote = {
    title: `${capitalizedTopic} Notes & Syllabus Matrix`,
    syllabusSubject: exam === 'UPSC' ? 'General Studies Core' : 'State Services Main Syllabus',
    citations: [`Official Board Reference Documents for ${examLabel}`, `NCERT Reference & State board textbooks`],
    coreSummary: `### 1. Conceptual Framework of ${capitalizedTopic}
The topic **${capitalizedTopic}** forms a vital pillar of the standard civil services syllabus. Understanding this requires analyzing its historical evolution, current legislative or scientific relevance, and contemporary administrative implications.

### 2. Analytical Dimensions
* **Socio-Political Importance:** This topic regulates or affects several administrative procedures, citizen-state relationship parameters, or developmental programs.
* **Critical Challenges:** Implementation issues, regulatory bottlenecks, lack of capacity, or historical gaps in policy application.
* **Syllabus Overlaps:** Combines foundational elements of theory with current institutional trends, which are highly tested in both Prelims (MCQs) and Mains (Descriptive).

### 3. Strategic Recommendations
Candidates must study:
* Important landmark cases or schemes corresponding to **${capitalizedTopic}** (especially those launched within the past 12-18 months).
* Recommended committee reports (such as NITI Aayog recommendations or Administrative Reforms Commission reports).
* Structural diagrams, flowchart opportunities, and brief comparative quotes to elevate their written answers.

*Keywords mapped to this notebook: ${keywordsList.join(', ') || 'General Framework'}.*`,
    activeRecallQuestions: [
      { question: `What is the primary administrative challenge regarding ${capitalizedTopic}?`, answer: "The key challenge lies in decentralization, balancing local governance capacity with centralized guidelines, and ensuring absolute transparency." },
      { question: `How should a candidate approach questions on ${capitalizedTopic} in Mains?`, answer: "Adopt an objective, balanced structure: outline the constitutional/historical context, present analytical arguments (pros and cons), cite relevant reports, and conclude with an administrative way-forward." }
    ],
    isOffline: true
  };

  res.json(fallbackNote);
});

// 9. Subject and Topic Wise Quiz Generator
app.post('/api/subject-quiz', async (req, res) => {
  const { subject, topic, exam } = req.body;

  if (!subject || !topic) {
    return res.status(400).json({ error: 'Subject and topic are required' });
  }

  const examLabels: Record<string, string> = {
    UPSC: 'UPSC Civil Services Examination (IAS/IPS)',
    TNPSC_G1: 'TNPSC Group I (Deputy Collector/DSP)',
    TNPSC_G2: 'TNPSC Group II/IIA Executive Services',
    TNPSC_G4: 'TNPSC Group IV & VAO Exam'
  };

  const examLabel = examLabels[exam] || exam || 'Civil Services standard';

  if (aiClient) {
    try {
      const prompt = `You are an Elite Civil Services Examination Question Designer for ${examLabel} specializing in standard MCQ assessments.
      Generate a premium, high-yield, and conceptual practice quiz containing exactly 5 multiple choice questions (MCQs) for:
      Subject Category: ${subject}
      Syllabus Topic/Focus: ${topic}
      
      Requirements for each of the 5 questions:
      - The question must be highly realistic, challenging, and assess conceptual depth (avoid trivia; test articles, timelines, logical reasoning, or formulas).
      - Include exactly 4 clear options.
      - Specify the correct answer index (0 for Option A, 1 for Option B, 2 for Option C, 3 for Option D).
      - Provide a thorough, official-style explanation describing why the correct option is right and highlighting the fallacies of incorrect options.
      
      Strictly output the response as JSON adhering to the specified schema.`;

      const response = await callGeminiWithRetry(() => aiClient!.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an Expert Civil Services Examiner. You construct top-tier multiple-choice questions (MCQs) that require critical analytical thinking. All facts, historical chronologies, and constitutional provisions must be 100% authentic and verifiable.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING, description: "Unique string id (e.g., q-pol-1)" },
                    text: { type: Type.STRING, description: "The full question text, including statements 1 & 2 if appropriate." },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Exactly 4 options"
                    },
                    correctAnswerIndex: { type: Type.INTEGER, description: "Correct answer index (0-3)" },
                    explanation: { type: Type.STRING, description: "Thorough explanation with facts and statutory references" },
                    subject: { type: Type.STRING, description: "The broad subject category" }
                  },
                  required: ["id", "text", "options", "correctAnswerIndex", "explanation", "subject"]
                }
              }
            },
            required: ["questions"]
          }
        }
      }));

      const resultText = response.text;
      if (resultText) {
        const parsed = JSON.parse(resultText);
        return res.json(parsed);
      }
    } catch (error: any) {
      console.warn("Gemini subject quiz generator fallback activated:", error.message || error);
    }
  }

  // Fallback Quiz Generator (High-fidelity offline mode)
  console.log(`Generating offline fallback quiz for Subject: ${subject}, Topic: ${topic}`);
  const fallbackData = generateFallbackQuiz(subject, topic, exam);
  res.json({
    ...fallbackData,
    isOffline: true
  });
});

// Helper function for offline subject-wise and topic-wise quiz questions
function generateFallbackQuiz(subject: string, topic: string, exam: string) {
  const normSubject = (subject || '').trim().toLowerCase();
  const normTopic = (topic || '').trim().toLowerCase();
  
  const questions: any[] = [];
  
  if (normSubject.includes('polity')) {
    questions.push({
      id: `fb-pol-1`,
      text: `Which of the following statements is correct regarding the writ jurisdiction of the Supreme Court and High Courts in India?\n1. The Supreme Court has wider writ jurisdiction than the High Courts since it can issue writs for any legal right.\n2. High Courts can issue writs under Article 226 not only for fundamental rights but also for other legal rights.`,
      options: [
        '1 only',
        '2 only',
        'Both 1 and 2',
        'Neither 1 nor 2'
      ],
      correctAnswerIndex: 1,
      explanation: `Statement 1 is incorrect: The writ jurisdiction of High Courts is wider than that of the Supreme Court. The Supreme Court can issue writs only for the enforcement of Fundamental Rights (Article 32), whereas a High Court can issue writs for the enforcement of Fundamental Rights as well as for any other purpose/ordinary legal rights (Article 226). Therefore, statement 2 is correct.`,
      subject: 'Polity'
    });
    questions.push({
      id: `fb-pol-2`,
      text: `Which article of the Indian Constitution directs the state to secure a Uniform Civil Code (UCC) for citizens throughout the territory of India?`,
      options: [
        'Article 39A',
        'Article 40',
        'Article 44',
        'Article 48'
      ],
      correctAnswerIndex: 2,
      explanation: `Article 44 of the Directive Principles of State Policy (Part IV of the Indian Constitution) states that the State shall endeavor to secure for the citizens a Uniform Civil Code throughout the territory of India.`,
      subject: 'Polity'
    });
    questions.push({
      id: `fb-pol-3`,
      text: `Consider the following statements regarding the amendment of the Constitution under Article 368:\n1. A bill to amend the Constitution can be initiated in either House of Parliament or State Legislatures.\n2. The President must give assent to a Constitutional Amendment Bill and cannot return it or withhold assent.`,
      options: [
        '1 only',
        '2 only',
        'Both 1 and 2',
        'Neither 1 nor 2'
      ],
      correctAnswerIndex: 1,
      explanation: `Statement 1 is incorrect: A constitutional amendment bill can only be initiated in either House of Parliament (Lok Sabha or Rajya Sabha), NOT in state legislatures. Statement 2 is correct: Under the 24th Amendment Act of 1971, it was made obligatory for the President to give assent to a constitutional amendment bill.`,
      subject: 'Polity'
    });
    questions.push({
      id: `fb-pol-4`,
      text: `The Sixth Schedule of the Indian Constitution deals with the administration of tribal areas in which of the following states?`,
      options: [
        'Assam, Meghalaya, Tripura, and Mizoram',
        'Assam, Manipur, Nagaland, and Tripura',
        'Meghalaya, Mizoram, Nagaland, and Arunachal Pradesh',
        'Manipur, Mizoram, Tripura, and Arunachal Pradesh'
      ],
      correctAnswerIndex: 0,
      explanation: `The Sixth Schedule of the Constitution of India contains provisions for the administration of tribal areas in the four northeastern states: Assam, Meghalaya, Tripura, and Mizoram (often remembered using the acronym AMTM).`,
      subject: 'Polity'
    });
    questions.push({
      id: `fb-pol-5`,
      text: `Which body conducts the elections to Panchayat Raj Institutions and Municipalities in Indian States?`,
      options: [
        'Election Commission of India',
        'State Legislative Assembly',
        'State Election Commission',
        'Ministry of Panchayati Raj'
      ],
      correctAnswerIndex: 2,
      explanation: `The State Election Commission (established under Articles 243K and 243ZA) is vested with the superintendence, direction, and control of the preparation of electoral rolls and the conduct of all elections to the Panchayats and Municipalities.`,
      subject: 'Polity'
    });
  } else if (normSubject.includes('history') || normSubject.includes('movement')) {
    questions.push({
      id: `fb-hist-1`,
      text: `Which of the following Buddhist Councils was held under the patronage of King Ashoka, and where did it take place?`,
      options: [
        'First Council at Rajgriha',
        'Second Council at Vaishali',
        'Third Council at Pataliputra',
        'Fourth Council at Kashmir'
      ],
      correctAnswerIndex: 2,
      explanation: `The Third Buddhist Council was convened in 250 BCE at Pataliputra under the patronage of the Mauryan Emperor Ashoka. It was presided over by Moggaliputta Tissa.`,
      subject: 'History'
    });
    questions.push({
      id: `fb-hist-2`,
      text: `The "Poona Pact" of 1932 was signed between Mahatma Gandhi and Dr. B.R. Ambedkar to resolve the deadlock over:`,
      options: [
        'Complete Independence (Purna Swaraj)',
        'Separate electorates for depressed classes proposed by the Communal Award',
        'The execution of Bhagat Singh',
        'Entry of lower castes into temples'
      ],
      correctAnswerIndex: 1,
      explanation: `The Poona Pact (September 1932) was an agreement between Dr. B.R. Ambedkar and Mahatma Gandhi on behalf of depressed classes and upper-caste Hindu leaders. It abandoned separate electorates for depressed classes (as announced in Ramsay MacDonald's Communal Award) but significantly increased reserved seats for them in provincial legislatures.`,
      subject: 'History'
    });
    questions.push({
      id: `fb-hist-3`,
      text: `Who among the following was the founder of the Self-Respect Movement (Swayam Mariyadai Iyakkam) in Tamil Nadu in 1925?`,
      options: [
        'C.N. Annadurai',
        'E.V. Ramasamy (Periyar)',
        'P. Theagaraya Chetty',
        'T.M. Nair'
      ],
      correctAnswerIndex: 1,
      explanation: `The Self-Respect Movement was started by E.V. Ramasamy (Periyar) in 1925 in Tamil Nadu to promote rationalism, self-respect, gender equality, and to dismantle the caste system.`,
      subject: 'History'
    });
    questions.push({
      id: `fb-hist-4`,
      text: `With reference to ancient Tamil history, what does the term "Kodumanal" signify?`,
      options: [
        'A famous port on the eastern coast',
        'An archaeological site in Erode district famous for gemstone-craft and iron smelting',
        'The capital city of the Early Cholas',
        'A classical dance form mentioned in Silappatikaram'
      ],
      correctAnswerIndex: 1,
      explanation: `Kodumanal is an important archaeological site in Erode district, Tamil Nadu. Excavations have proved it was a highly active industrial and trade center of the Sangam Age, renowned for semi-precious bead manufacturing and high-grade crucible iron smelting.`,
      subject: 'History'
    });
    questions.push({
      id: `fb-hist-5`,
      text: `The Swadeshi Steam Navigation Company (SSNCO), the first indigenous Indian shipping service, was launched in 1906 by:`,
      options: [
        'Subramania Bharati',
        'V.O. Chidambaram Pillai',
        'V.V.S. Aiyar',
        'Tiruppur Kumaran'
      ],
      correctAnswerIndex: 1,
      explanation: `V.O. Chidambaram Pillai (V.O.C.) established the Swadeshi Steam Navigation Company in Tuticorin in 1906 to challenge the British India Steam Navigation Company's monopoly, pioneering Indian industrial nationalism.`,
      subject: 'History'
    });
  } else if (normSubject.includes('econ') || normSubject.includes('development')) {
    questions.push({
      id: `fb-econ-1`,
      text: `Which of the following bodies replaced the Planning Commission of India on January 1, 2015?`,
      options: [
        'National Development Council (NDC)',
        'NITI Aayog (National Institution for Transforming India)',
        'Finance Commission of India',
        'Central Statistical Office (CSO)'
      ],
      correctAnswerIndex: 1,
      explanation: `The Planning Commission of India was replaced by NITI Aayog (National Institution for Transforming India) via a Cabinet Resolution on January 1, 2015, shifting India towards a cooperative, federal "bottom-up" planning model.`,
      subject: 'Economy'
    });
    questions.push({
      id: `fb-econ-2`,
      text: `What is the statutory inflation target assigned to the Reserve Bank of India (RBI) under the monetary policy framework?`,
      options: [
        '2% with a band of +/- 1%',
        '4% with a band of +/- 2%',
        '5% with a band of +/- 3%',
        '6% with a band of +/- 2%'
      ],
      correctAnswerIndex: 1,
      explanation: `Under the amended RBI Act, the Government of India, in consultation with the RBI, sets the inflation target. The current target is 4% with a tolerance band of +/- 2% (i.e., a range of 2% to 6%).`,
      subject: 'Economy'
    });
    questions.push({
      id: `fb-econ-3`,
      text: `The "Pudhumai Penn Scheme" of the Tamil Nadu government provides financial assistance of:`,
      options: [
        '₹500 per month for rural women entrepreneurs',
        '₹1,000 per month to girl students from government schools pursuing higher education',
        '₹1,500 per month for widowed mothers',
        '₹2,000 one-time wedding assistance'
      ],
      correctAnswerIndex: 1,
      explanation: `The Pudhumai Penn Scheme (Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme) provides a monthly incentive of ₹1,000 to girl students who studied in government schools (classes 6 to 12) and are now pursuing higher education in college/diploma courses.`,
      subject: 'Economy'
    });
    questions.push({
      id: `fb-econ-4`,
      text: `Which of the following is correct regarding Goods and Services Tax (GST) council in India?`,
      options: [
        'It is a non-constitutional body chaired by the Prime Minister.',
        'It is a constitutional body established under Article 279A, chaired by the Union Finance Minister.',
        'It is headed by the Governor of the Reserve Bank of India.',
        'Decisions are taken by a simple majority vote of members present.'
      ],
      correctAnswerIndex: 1,
      explanation: `The GST Council is a joint constitutional forum of the Centre and the States, established under Article 279A of the Constitution. It is chaired by the Union Finance Minister. Decisions are taken by a three-fourths majority of weighted votes of the members present and voting.`,
      subject: 'Economy'
    });
    questions.push({
      id: `fb-econ-5`,
      text: `In economics, the "Gini Coefficient" is a metric used to measure which of the following?`,
      options: [
        'Unemployment levels',
        'Income inequality or wealth distribution',
        'National debt ratio',
        'Industrial production growth rate'
      ],
      correctAnswerIndex: 1,
      explanation: `The Gini Coefficient (or Gini Index) is a statistical measure of economic inequality, measuring income or wealth distribution among a population. A coefficient of 0 represents perfect equality, while 1 represents perfect inequality.`,
      subject: 'Economy'
    });
  } else if (normSubject.includes('tamil')) {
    questions.push({
      id: `fb-tam-1`,
      text: `திருவள்ளுவர் அருளிய திருக்குறளில் உள்ள மொத்த அதிகாரங்கள் மற்றும் பாடல்களின் (குறள்கள்) எண்ணிக்கை முறையே எவ்வளவு?`,
      options: [
        '100 அதிகாரங்கள், 1000 குறள்கள்',
        '133 அதிகாரங்கள், 1330 குறள்கள்',
        '150 அதிகாரங்கள், 1500 குறள்கள்',
        '18 அதிகாரங்கள், 180 குறள்கள்'
      ],
      correctAnswerIndex: 1,
      explanation: `திருக்குறளில் மொத்தம் 133 அதிகாரங்கள் உள்ளன. ஒவ்வொரு அதிகாரத்திற்கும் 10 குறள்கள் வீதம் மொத்தம் 1330 குறட்பாக்கள் அமைந்துள்ளன. இது அறத்துப்பால், பொருட்பால், காமத்துப்பால் என்ற மூன்று பெரும் பிரிவுகளைக் கொண்டது.`,
      subject: 'General Tamil'
    });
    questions.push({
      id: `fb-tam-2`,
      text: `"யாதும் ஊரே யாவரும் கேளிர்" - என்ற உலகளாவிய மனிதநேய வரிகள் இடம்பெற்றுள்ள சங்க கால நூல் எது?`,
      options: [
        'நற்றிணை',
        'புறநானூறு',
        'அகநானூறு',
        'ஐங்குறுநூறு'
      ],
      correctAnswerIndex: 1,
      explanation: `"யாதும் ஊரே யாவரும் கேளிர்" (யாரும் நமக்கு அந்நியரல்லர், எல்லா ஊர்களும் நம்மூரே) என்ற உன்னத வரிகள் சங்க இலக்கியமான எட்டுத்தொகை நூல்களில் ஒன்றான "புறநானூற்றில்" (பாடல் 191) இடம்பெற்றுள்ளன. இதனைப் பாடியவர் கணியன் பூங்குன்றனார் ஆவார்.`,
      subject: 'General Tamil'
    });
    questions.push({
      id: `fb-tam-3`,
      text: `தமிழ் மொழியின் மிகப்பழைமையான இலக்கண நூல் எது?`,
      options: [
        'நன்னூல்',
        'தொல்காப்பியம்',
        'யாப்பருங்கலக்காரிகை',
        'அகத்தியம்'
      ],
      correctAnswerIndex: 1,
      explanation: `தொல்காப்பியம் என்பது நமக்குக் கிடைத்துள்ள தமிழ் மொழியின் மிகப்பழைமையான இலக்கண நூலாகும். இது தொல்காப்பியரால் இயற்றப்பட்டது. இது எழுத்து, சொல், பொருள் என மூன்று பெரும் அதிகாரங்களை உள்ளடக்கியது.`,
      subject: 'General Tamil'
    });
    questions.push({
      id: `fb-tam-4`,
      text: `பத்துப்பாட்டு நூல்களில் மிகக் குறுகிய அடிகளைக் கொண்ட நூல் எது?`,
      options: [
        'குறிஞ்சிப்பாட்டு',
        'முல்லைப்பாட்டு',
        'நெடுநல்வாடை',
        'மதுரைக்காஞ்சி'
      ],
      correctAnswerIndex: 1,
      explanation: `பத்துப்பாட்டு நூல்களிலேயே மிகக் குறைந்த அடிகளைக் கொண்ட நூல் "முல்லைப்பாட்டு" ஆகும். இது நப்பூதனாரால் இயற்றப்பட்டது, மொத்தம் 103 அடிகளைக் கொண்டது.`,
      subject: 'General Tamil'
    });
    questions.push({
      id: `fb-tam-5`,
      text: `சங்க காலத்தில் சோழ நாட்டின் தலைசிறந்த துறைமுகமாக விளங்கிய நகரம் எது?`,
      options: [
        'கொற்கை',
        'பூம்புகார் (காவிரிப்பூம்பட்டினம்)',
        'முசிறி',
        'தொண்டி'
      ],
      correctAnswerIndex: 1,
      explanation: `சங்க காலத்தில் சோழர்களின் முதன்மைத் துறைமுகமாக விளங்கியது பூம்புகார் (காவிரிப்பூம்பட்டினம்) ஆகும். கொற்கை பாண்டியர்களின் துறைமுகமாகவும், முசிறி மற்றும் தொண்டி சேரர்களின் துறைமுகங்களாகவும் விளங்கின.`,
      subject: 'General Tamil'
    });
  } else {
    // Default / Aptitude fallback
    questions.push({
      id: `fb-apt-1`,
      text: `A person borrows ₹8,000 at a simple interest rate of 10% per annum. What is the total interest payable at the end of 3 years?`,
      options: [
        '₹1,600',
        '₹2,400',
        '₹2,800',
        '₹3,200'
      ],
      correctAnswerIndex: 1,
      explanation: `Use Simple Interest Formula: SI = (P * R * T) / 100\nHere, P = ₹8,000, R = 10%, T = 3 years.\nSI = (8000 * 10 * 3) / 100 = ₹2,400.`,
      subject: 'Aptitude'
    });
    questions.push({
      id: `fb-apt-2`,
      text: `Find the compound interest on ₹10,000 for 2 years at 10% per annum, compounded annually.`,
      options: [
        '₹1,900',
        '₹2,000',
        '₹2,100',
        '₹2,200'
      ],
      correctAnswerIndex: 2,
      explanation: `Amount = P * (1 + R/100)^T\nAmount = 10000 * (1 + 10/100)^2 = 10000 * (1.1)^2 = ₹12,100.\nCompound Interest (CI) = Amount - Principal = 12100 - 10000 = ₹2,100.`,
      subject: 'Aptitude'
    });
    questions.push({
      id: `fb-apt-3`,
      text: `A can complete a piece of work in 12 days, and B can complete the same work in 24 days. In how many days can they complete the work if they work together?`,
      options: [
        '6 days',
        '8 days',
        '9 days',
        '10 days'
      ],
      correctAnswerIndex: 1,
      explanation: `Rate together: 1/12 + 1/24 = 3/24 = 1/8. Thus, they can complete the work in 8 days working together.`,
      subject: 'Aptitude'
    });
    questions.push({
      id: `fb-apt-4`,
      text: `Divide ₹480 between A and B in the ratio 3:5. What is the absolute difference between their shares?`,
      options: [
        '₹100',
        '₹120',
        '₹160',
        '₹180'
      ],
      correctAnswerIndex: 1,
      explanation: `Sum of ratio parts = 3 + 5 = 8 parts.\nTotal value of 8 parts = ₹480.\nValue of 1 part = 480 / 8 = ₹60.\nDifference between shares = (5 - 3) * 60 = 2 * 60 = ₹120.`,
      subject: 'Aptitude'
    });
    questions.push({
      id: `fb-apt-5`,
      text: `A student has to secure 20% marks to pass an exam. If the maximum marks of the exam are 300, how many marks are needed to qualify?`,
      options: [
        '50 marks',
        '60 marks',
        '70 marks',
        '80 marks'
      ],
      correctAnswerIndex: 1,
      explanation: `Passing marks = 20% of 300 = (20 / 100) * 300 = 60 marks.`,
      subject: 'Aptitude'
    });
  }
  
  return { questions };
}

// ----------------------------------------------------
// VITE OR STATIC SERVING MIDDLEWARE
// ----------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  }).then((vite) => {
    app.use(vite.middlewares);
    
    // Fallback index.html for development
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'index.html'));
    });

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Development server running at http://localhost:${PORT}`);
    });
  });
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Production server running at http://localhost:${PORT}`);
  });
}
