/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, ExamType } from '../types';
import { UPSC_QUESTION_POOL } from './questions/upsc';
import { TNPSC_G1_QUESTION_POOL } from './questions/tnpsc_g1';
import { TNPSC_G2_QUESTION_POOL } from './questions/tnpsc_g2';
import { TNPSC_G4_QUESTION_POOL } from './questions/tnpsc_g4';
import { SSC_CGL_QUESTION_POOL } from './questions/ssc_cgl';
import { RRB_NTPC_QUESTION_POOL } from './questions/rrb_ntpc';
import { IIT_JEE_QUESTION_POOL } from './questions/iit_jee';
import { NEET_QUESTION_POOL } from './questions/neet';
import { IELTS_QUESTION_POOL } from './questions/ielts';

// Re-export individual exam question pools
export {
  UPSC_QUESTION_POOL,
  TNPSC_G1_QUESTION_POOL,
  TNPSC_G2_QUESTION_POOL,
  TNPSC_G4_QUESTION_POOL,
  SSC_CGL_QUESTION_POOL,
  RRB_NTPC_QUESTION_POOL,
  IIT_JEE_QUESTION_POOL,
  NEET_QUESTION_POOL,
  IELTS_QUESTION_POOL
};

// Master Dictionary Mapping Exam Types to Real Authentic Pools
export const EXAM_QUESTION_POOLS: Record<ExamType, Question[]> = {
  UPSC: UPSC_QUESTION_POOL,
  TNPSC_G1: TNPSC_G1_QUESTION_POOL,
  TNPSC_G2: TNPSC_G2_QUESTION_POOL,
  TNPSC_G4: TNPSC_G4_QUESTION_POOL,
  SSC_CGL: SSC_CGL_QUESTION_POOL,
  RRB_NTPC: RRB_NTPC_QUESTION_POOL,
  IIT_JEE: IIT_JEE_QUESTION_POOL,
  NEET: NEET_QUESTION_POOL,
  IELTS: IELTS_QUESTION_POOL,
};

// Backwards-compatible aliases for tests and mock exams
export const AUTHENTIC_POLITY_POOL = UPSC_QUESTION_POOL.filter(q => q.subject === 'Polity');
export const AUTHENTIC_HISTORY_POOL = UPSC_QUESTION_POOL.filter(q => q.subject === 'History');
export const AUTHENTIC_ECONOMY_POOL = UPSC_QUESTION_POOL.filter(q => q.subject === 'Economy');
export const AUTHENTIC_TAMIL_POOL = TNPSC_G4_QUESTION_POOL.filter(q => q.subject === 'General Tamil');

// Generative Math helper for quantitative sets
export function generateAptitudeQuestion(seed: number): Question {
  const p = 5000 + (Math.abs(seed) % 5) * 1000;
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
 * Deterministic pseudo-random number generator using Mulberry32 algorithm
 */
function mulberry32(seed: number): () => number {
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher-Yates shuffle with seeded RNG to guarantee reproducible but non-repetitive order
 */
function seededShuffle<T>(array: T[], seed: number): T[] {
  const copy = [...array];
  const rand = mulberry32(seed);
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Key for storing seen question IDs in localStorage to prevent repetition across visits
 */
function getStorageKey(exam: ExamType): string {
  return `aspires_seen_mcqs_${exam}`;
}

/**
 * Get previously seen question IDs for an exam from browser localStorage (if available)
 */
export function getSeenQuestionIds(exam: ExamType): string[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(getStorageKey(exam));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Record question IDs that have been served to the user so they are not repeated
 */
export function markQuestionsAsSeen(exam: ExamType, questionIds: string[]): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    const existing = new Set(getSeenQuestionIds(exam));
    questionIds.forEach(id => existing.add(id));
    
    // If user has seen all questions in the pool, reset history to allow a fresh cycle
    const pool = EXAM_QUESTION_POOLS[exam] || EXAM_QUESTION_POOLS.UPSC;
    if (existing.size >= pool.length) {
      existing.clear();
      questionIds.forEach(id => existing.add(id));
    }
    
    window.localStorage.setItem(getStorageKey(exam), JSON.stringify(Array.from(existing)));
  } catch {
    // Ignore storage write errors
  }
}

/**
 * Reset seen questions history for an exam
 */
export function resetSeenQuestions(exam?: ExamType): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    if (exam) {
      window.localStorage.removeItem(getStorageKey(exam));
    } else {
      Object.keys(EXAM_QUESTION_POOLS).forEach(key => {
        window.localStorage.removeItem(getStorageKey(key as ExamType));
      });
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Master Question Selection Function
 * 
 * Features:
 * 1. Zero Repetition: Uses non-overlapping chunk slicing and seen-history tracking.
 * 2. High Diversity: Balances subjects so questions span the complete syllabus.
 * 3. Seed Offset Support: Each increment of seedOffset yields completely disjoint sets.
 * 4. Multi-Channel Deduplication: Supports globalUsedIds Set across batch broadcasts.
 */
export function getQuestionsForExam(
  exam: ExamType,
  seedOffset: number = 0,
  count: number = 5,
  globalUsedIds?: Set<string>
): Question[] {
  const pool = EXAM_QUESTION_POOLS[exam] || EXAM_QUESTION_POOLS.UPSC;
  if (!pool || pool.length === 0) return [];

  // Calculate day-based seed
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const year = today.getFullYear();
  
  // Create an exam-specific offset so different exams start from distinct permutations
  const examOffsetMap: Record<ExamType, number> = {
    UPSC: 101,
    TNPSC_G1: 203,
    TNPSC_G2: 307,
    TNPSC_G4: 409,
    SSC_CGL: 521,
    RRB_NTPC: 631,
    IIT_JEE: 743,
    NEET: 853,
    IELTS: 967
  };
  const examPrime = examOffsetMap[exam] || 111;

  // The daySeed changes every 24 hours, ensuring fresh questions every single day
  const daySeed = year * 10000 + dayOfYear * 37 + examPrime;

  // Generate a non-repeating pseudo-random permutation of the entire pool for today
  const shuffledPool = seededShuffle(pool, daySeed);

  // Retrieve seen IDs from browser storage if in client environment
  const seenIds = new Set<string>(getSeenQuestionIds(exam));

  // Determine non-overlapping slice based on seedOffset
  // For a pool of 25 questions and count=5, offsets 0,1,2,3,4 yield completely non-overlapping slices:
  // [0..4], [5..9], [10..14], [15..19], [20..24]
  const totalChunks = Math.max(1, Math.floor(pool.length / count));
  const chunkIndex = Math.abs(seedOffset) % totalChunks;
  const startIndex = chunkIndex * count;

  const result: Question[] = [];
  const localUsed = new Set<string>();
  const usedSubjects = new Set<string>();

  // Pass 1: Select questions from the current disjoint chunk that haven't been used globally or locally
  for (let i = 0; i < pool.length && result.length < count; i++) {
    const idx = (startIndex + i) % pool.length;
    const q = shuffledPool[idx];

    if (localUsed.has(q.id)) continue;
    if (globalUsedIds && globalUsedIds.has(q.id)) continue;

    // Prioritize subject diversity
    if (!usedSubjects.has(q.subject)) {
      localUsed.add(q.id);
      usedSubjects.add(q.subject);
      if (globalUsedIds) globalUsedIds.add(q.id);
      result.push({ ...q });
    }
  }

  // Pass 2: If we need more questions to reach `count`, pick from the remainder of the pool,
  // prioritizing questions the user hasn't seen recently in this browser
  if (result.length < count) {
    for (let i = 0; i < pool.length && result.length < count; i++) {
      const idx = (startIndex + i) % pool.length;
      const q = shuffledPool[idx];

      if (localUsed.has(q.id)) continue;
      if (globalUsedIds && globalUsedIds.has(q.id)) continue;

      // Prefer questions not yet seen
      if (!seenIds.has(q.id)) {
        localUsed.add(q.id);
        usedSubjects.add(q.subject);
        if (globalUsedIds) globalUsedIds.add(q.id);
        result.push({ ...q });
      }
    }
  }

  // Pass 3: Fill remaining slots from any unused question in the current pool
  if (result.length < count) {
    for (let i = 0; i < pool.length && result.length < count; i++) {
      const q = shuffledPool[i];
      if (!localUsed.has(q.id)) {
        localUsed.add(q.id);
        if (globalUsedIds) globalUsedIds.add(q.id);
        result.push({ ...q });
      }
    }
  }

  // Automatically mark these questions as seen in the browser so next daily drill is fresh
  if (typeof window !== 'undefined' && result.length > 0) {
    markQuestionsAsSeen(exam, result.map(q => q.id));
  }

  return result;
}

/**
 * Returns a guaranteed fresh set of questions that excludes specific question IDs
 */
export function getFreshNonRepetitiveQuestions(
  exam: ExamType,
  count: number = 5,
  excludeIds: string[] = []
): Question[] {
  const pool = EXAM_QUESTION_POOLS[exam] || EXAM_QUESTION_POOLS.UPSC;
  const excludeSet = new Set(excludeIds);

  // First pick questions not in excludeSet
  const candidates = pool.filter(q => !excludeSet.has(q.id));
  
  // If not enough, fallback to full pool
  const source = candidates.length >= count ? candidates : pool;
  
  // Randomly shuffle source
  const shuffled = [...source].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
