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
      const prompt = `Generate a comprehensive study task list for the ${examLabel} starting from ${startDate || 'today'} to ${targetDate || 'target date'} (spanning exactly ${totalDays} days), studying ${dailyHours} hours per day.
      Return a structured list of study tasks. Spread the tasks across days evenly (provide between 5 to 10 milestone tasks representing key milestone days or sequences, e.g. Day 1, Day 3, Day 5, etc., up to the total days). Make sure the tasks are highly realistic, including subject, specific topics matching the official syllabus, daily hours, and subtasks (specific study items like books, chapters, or practice areas).`;

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
                    }
                  },
                  required: ["day", "topic", "subject", "hours"]
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
  console.log("Generating offline smart schedule...");
  const subjectsByExam: Record<string, string[]> = {
    UPSC: ['Polity', 'History', 'Economy', 'Geography', 'Environment', 'CSAT'],
    TNPSC_G1: ['History & Culture', 'Tamil Heritage', 'Development Admin', 'Geography', 'Polity', 'Aptitude'],
    TNPSC_G2: ['General Tamil/English', 'Aptitude', 'Tamil Heritage', 'Economy', 'Polity'],
    TNPSC_G4: ['General Tamil', 'Aptitude', 'History & Civics', 'Geography', 'Science']
  };

  const selectedSubjects = subjectsByExam[exam] || ['General Studies', 'Aptitude'];
  const generatedTasks = [];
  const taskCount = Math.min(8, totalDays);

  for (let i = 0; i < taskCount; i++) {
    const dayNum = Math.round(((i + 1) / taskCount) * totalDays);
    const subject = selectedSubjects[i % selectedSubjects.length];
    
    // Customize topics based on exam & subject
    let topic = `Core Concepts of ${subject}`;
    let subtasks = [`Read standard reference textbook`, `Draft summary notes`, `Solve 10 practice questions`];

    if (exam === 'UPSC') {
      if (subject === 'Polity') {
        topic = 'Fundamental Rights & Preamble';
        subtasks = ['Read Laxmikanth Chapters 7-10', 'Analyze landmark Supreme Court rulings (Kesavananda, Maneka)', 'Attempt past year questions'];
      } else if (subject === 'History') {
        topic = 'Indian Freedom Struggle (1915-1947)';
        subtasks = ['Spectrum Modern History chapters on Gandhian Phase', 'Study key resolutions of INC sessions', 'Analyze Mains GS1 questions'];
      }
    } else if (exam.startsWith('TNPSC')) {
      if (subject === 'Tamil Heritage' || subject === 'General Tamil') {
        topic = 'Thirukkural - Study of Ethics & Governance';
        subtasks = ['Study chapters on leadership, wisdom and integrity', 'Write explanations for 5 major Kurals', 'Review past TNPSC questions'];
      } else if (subject === 'Aptitude') {
        topic = 'Simplification, Percentage, & HCF-LCM';
        subtasks = ['Practice formula sheet', 'Solve 30 past TNPSC questions', 'Take a 15-minute quick test'];
      }
    }

    generatedTasks.push({
      id: `task-offline-${i}`,
      day: dayNum,
      topic,
      subject,
      hours: parseFloat(dailyHours),
      completed: false,
      subtasks
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
          systemInstruction: 'You are an inspiring, wise, highly knowledgeable UPSC and TNPSC civil services coach. Your guidance is clear, academic, motivational, and addresses subjects like Indian Polity, History, Tamil Heritage, Development Administration, and General Aptitude with ease. You maintain absolute factual integrity and never hallucinate or present unverified information as fact.',
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
  let reply = "I am here to guide your civil services journey! Focus on building strong conceptual foundations. Read your newspaper daily, solve MCQs regularly, and practice answer writing.";

  if (lastUserMsg.includes('tamil') || lastUserMsg.includes('தமிழ்')) {
    reply = "நிச்சயமாக! டி.என்.பி.எஸ்.சி (TNPSC) தேர்வுகளில் பொதுத்தமிழ் மற்றும் தமிழ் மரபு மிகவும் முக்கியமானது. திருக்குறள், சங்க இலக்கியம், மற்றும் சமூக சீர்திருத்த இயக்கங்களை நன்கு படியுங்கள். நான் உங்களுக்கு உதவத் தயாராக உள்ளேன்!";
  } else if (lastUserMsg.includes('polity') || lastUserMsg.includes('constitution')) {
    reply = "For Indian Polity, M. Laxmikanth is the gold standard. Focus extensively on Fundamental Rights, DPSP, Parliament, Judicial Review, and Federalism. Understand both theoretical parts and recent Supreme Court judgments.";
  } else if (lastUserMsg.includes('syllabus') || lastUserMsg.includes('pattern')) {
    reply = `For the ${examLabel}, understanding the syllabus is 50% of the preparation. Memorize key keywords of the syllabus so that when you read newspapers, you can filter and connect relevant articles. Let me know which specific subject you'd like to explore first!`;
  } else if (lastUserMsg.includes('thirukkural') || lastUserMsg.includes('திருக்குறள்')) {
    reply = "திருக்குறள் நிர்வாகத் தரம் மற்றும் அறநெறிகளுக்குச் சான்றாகும். TNPSC மற்றும் UPSC தேர்வுகளில், அறன் வலியுறுத்தல், ஒழுக்கமுடைமை, வாய்மை, மற்றும் பெரியாரைத் துணைக்கோடல் போன்ற அதிகாரங்கள் மிகவும் முக்கியமானவை.";
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
