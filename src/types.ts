/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ExamType = 'UPSC' | 'TNPSC_G1' | 'TNPSC_G2' | 'TNPSC_G4' | 'SSC_CGL';

export interface PlannerTask {
  id: string;
  day: number;
  topic: string;
  subject: string;
  hours: number;
  completed: boolean;
  subtasks?: string[];
  phase?: string;
  priority?: string;
  references?: string[];
  learningObjectives?: string[];
  selfCheckQuestion?: string;
  selfCheckAnswer?: string;
}

export interface StudyPlan {
  exam: ExamType;
  totalDays: number;
  dailyHours: number;
  startDate: string;
  targetDate: string;
  tasks: PlannerTask[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  subject?: string;
}

export interface QuizSession {
  id: string;
  title: string;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: (number | null)[];
  isCompleted: boolean;
  score: number;
}

export interface EssayPrompt {
  id: string;
  title: string;
  context: string;
  category: string;
  wordCountTarget: number;
}

export interface EssayEvaluation {
  score: number; // out of 100
  overallFeedback: string;
  structureRating: number; // out of 10
  argumentRating: number; // out of 10
  languageRating: number; // out of 10
  factAccuracyRating: number; // out of 10
  structuralFeedback: string;
  argumentFeedback: string;
  languageFeedback: string;
  factFeedback: string;
  modelAnswerOutline: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface GKArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  content: string;
  analysis?: string; // AI generated dynamic analysis
}
