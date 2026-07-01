/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ExamType } from '../types';
import { 
  Layers, 
  HelpCircle, 
  RefreshCw, 
  TrendingUp, 
  Bookmark, 
  ChevronRight, 
  RotateCw, 
  CheckCircle, 
  Flame, 
  Sparkles,
  Award
} from 'lucide-react';

interface Flashcard {
  id: string;
  category: string;
  question: string;
  answer: string;
  points: string[];
}

const TNPSC_CARDS: Flashcard[] = [
  {
    id: 'tnpsc-fc-1',
    category: 'Tamil Nadu History',
    question: 'What was the significance of the Vaikom Satyagraha (1924-25)?',
    answer: 'A non-violent social reform movement in Travancore led by regional leaders and strongly championed by Periyar E.V. Ramasamy to secure temple entry and public road access for marginalized communities.',
    points: [
      'Periyar E.V.R. earned the title "Vaikom Veerar" for his persistent leadership.',
      'First organized mass struggle against untouchability and social exclusion in Kerala/Tamil Nadu.',
      'Led directly to the Temple Entry Proclamation of 1936.'
    ]
  },
  {
    id: 'tnpsc-fc-2',
    category: 'Development Administration',
    question: 'What is the "Pudhumai Penn" scheme launched by the Tamil Nadu government?',
    answer: 'An elite social welfare and educational empowerment program providing financial support of ₹1,000 per month to girl students who studied in government schools from Class 6 to 12.',
    points: [
      'Aims to increase girl student enrollment in higher education institutes.',
      'Prevents early marriages and supports financial independence.',
      'Funds are directly credited into students bank accounts.'
    ]
  },
  {
    id: 'tnpsc-fc-3',
    category: 'Geography & Economy',
    question: 'Why is Tiruppur known as the "Dollar City" of Tamil Nadu?',
    answer: 'It is India\'s largest knitwear and hosiery manufacturing cluster, contributing over 90% of cotton knitwear exports from India, fueling billions of dollars in foreign exchange.',
    points: [
      'Provides massive direct and indirect employment for rural and urban laborers.',
      'Relies heavily on eco-friendly zero-liquid discharge effluent treatment plants.',
      'Known for fast-paced logistics and high global brand partnerships.'
    ]
  }
];

const FLASHCARD_DECKS: Record<ExamType, Flashcard[]> = {
  UPSC: [
    {
      id: 'upsc-fc-1',
      category: 'Polity & Constitution',
      question: 'What is the doctrine of "Basic Structure" of the Indian Constitution?',
      answer: 'A judicial principle established in the Kesavananda Bharati case (1973). It asserts that certain fundamental features of the Constitution cannot be amended or destroyed by the Parliament.',
      points: [
        'Established in Kesavananda Bharati v. State of Kerala (1973).',
        'Parliament cannot amend features like judicial review, federalism, secularism, or democracy.',
        'Ensures the supremacy of the Constitution over legislative absolute power.'
      ]
    },
    {
      id: 'upsc-fc-2',
      category: 'Economy',
      question: 'Explain the concept of "Fiscal Drag".',
      answer: 'A situation where inflation or progressive taxation pushes taxpayers into higher tax brackets, effectively increasing government tax revenues without an explicit tax hike, while decreasing consumer purchasing power.',
      points: [
        'Acts as an automatic stabilizer by cooling down an overheating economy.',
        'Can lead to lower consumer spending and economic slowdown if unchecked.',
        'Usually resolved by indexation of tax brackets to inflation rates.'
      ]
    },
    {
      id: 'upsc-fc-3',
      category: 'Environment',
      question: 'What is "Eutrophication" and its primary drivers?',
      answer: 'The gradual enrichment of a water body with nutrients (mostly nitrates and phosphates), leading to excessive plant/algae growth, oxygen depletion, and severe aquatic death.',
      points: [
        'Primary drivers are agricultural fertilizer runoff and domestic sewage discharge.',
        'Leads to "Algal Bloom" which blocks sunlight from underwater plants.',
        'Resulting hypoxia (low oxygen) creates dead zones where marine life cannot survive.'
      ]
    },
    {
      id: 'upsc-fc-4',
      category: 'History & Art',
      question: 'What are the main characteristics of Vesara architecture?',
      answer: 'A hybrid temple architectural style that emerged in the Deccan region, blending elements of the Northern Nagara style and Southern Dravida style under the Chalukyas and Hoysalas.',
      points: [
        'Features a star-shaped base layout (stellate plan).',
        'Prasat/Vimana spire is shorter than Dravida but more segmented than Nagara.',
        'Ornate carvings on walls, pillars, and ceilings (e.g., temples at Belur and Halebidu).'
      ]
    }
  ],
  TNPSC_G1: TNPSC_CARDS,
  TNPSC_G2: TNPSC_CARDS,
  TNPSC_G4: TNPSC_CARDS,
};

export default function FlashcardsView({ selectedExam }: { selectedExam: ExamType }) {
  const cards = FLASHCARD_DECKS[selectedExam] || FLASHCARD_DECKS['UPSC'];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('aspires_srs_streak') || '0', 10);
  });
  
  // SRS Levels: stores status of card IDs (1 = Hard, 2 = Good, 3 = Easy)
  const [srsLevels, setSrsLevels] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aspires_srs_levels');
    return saved ? JSON.parse(saved) : {};
  });

  const activeCard = cards[currentIdx];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSrsAction = (level: number) => {
    if (!activeCard) return;
    
    // Update Spaced Repetition Level
    const updatedLevels = { ...srsLevels, [activeCard.id]: level };
    setSrsLevels(updatedLevels);
    localStorage.setItem('aspires_srs_levels', JSON.stringify(updatedLevels));

    // Increase streak if marked Good/Easy
    if (level >= 2) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      localStorage.setItem('aspires_srs_streak', String(nextStreak));
    } else {
      setStreak(0);
      localStorage.setItem('aspires_srs_streak', '0');
    }

    // Go to next card
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % cards.length);
    }, 200);
  };

  // Reset indices if exam changes
  useEffect(() => {
    setCurrentIdx(0);
    setIsFlipped(false);
  }, [selectedExam]);

  const cardsReviewedCount = Object.keys(srsLevels).filter(id => id.startsWith(selectedExam.toLowerCase())).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="flashcards-desk">
      
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden" id="srs-header-card">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 h-48 w-48 rounded-full bg-teal-400/10 blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 rounded-full text-xs font-semibold text-emerald-200 border border-emerald-400/25">
              <Flame className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              Spaced Repetition System (SRS)
            </span>
            <h2 className="text-2xl md:text-3xl font-black font-display tracking-tight">Active Recall Deck</h2>
            <p className="text-xs text-emerald-100 max-w-xl">
              Scientific study shows that testing yourself (Active Recall) at increasing intervals (Spaced Repetition) is 300% more effective than passive reading. Rate your retention below to schedule reviews.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-left min-w-[140px] shadow" id="srs-streak-floater">
            <span className="text-[10px] text-emerald-200 uppercase font-black font-mono tracking-wider">Current Streak</span>
            <div className="text-2xl font-black text-amber-300 flex items-center gap-1.5 font-mono">
              <Flame className="h-5.5 w-5.5 text-amber-400 fill-amber-400" />
              {streak} Days
            </div>
          </div>
        </div>
      </div>

      {/* Main Flashcard Container */}
      {activeCard ? (
        <div className="space-y-6" id="flashcard-srs-panel">
          
          {/* Card Flipping Stage */}
          <div className="perspective-[1000px] h-[340px] md:h-[300px] w-full" id="flashcard-animation-stage">
            <div 
              onClick={handleFlip}
              className={`relative w-full h-full duration-500 transform-style-3d cursor-pointer select-none rounded-3xl shadow-md border border-slate-200 transition-transform ${
                isFlipped ? 'rotate-y-180 bg-slate-900 text-white' : 'bg-white text-slate-900'
              }`}
            >
              
              {/* FRONT OF THE CARD */}
              <div className={`absolute inset-0 p-6 md:p-8 flex flex-col justify-between backface-hidden ${isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-xs font-black uppercase text-emerald-600 font-mono tracking-widest">{activeCard.category}</span>
                  <span className="text-xs text-slate-400 font-mono font-bold">Card {currentIdx + 1} of {cards.length}</span>
                </div>

                <div className="my-auto text-center py-4">
                  <h3 className="text-lg md:text-2xl font-extrabold font-display leading-snug text-slate-900">
                    {activeCard.question}
                  </h3>
                </div>

                <div className="flex justify-center items-center gap-1 text-slate-400 text-xs font-bold font-mono">
                  <RotateCw className="h-4 w-4 animate-spin-slow" />
                  Click Card to Reveal Core Concept
                </div>
              </div>

              {/* BACK OF THE CARD */}
              <div className={`absolute inset-0 p-6 md:p-8 flex flex-col justify-between backface-hidden rotate-y-180 bg-slate-950 text-slate-100 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-xs font-black uppercase text-emerald-400 font-mono tracking-widest">{activeCard.category}</span>
                  <span className="text-xs text-slate-400 font-mono font-bold">Back Side</span>
                </div>

                <div className="my-auto space-y-4 text-left overflow-y-auto pr-2 max-h-[180px]">
                  <p className="text-sm md:text-base text-slate-200 font-medium leading-relaxed">
                    {activeCard.answer}
                  </p>
                  
                  {/* Explanatory bullet points */}
                  <div className="space-y-1.5 border-t border-white/5 pt-3">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-wider font-mono">Mains Core Value Additions</p>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-slate-350 leading-relaxed font-sans">
                      {activeCard.points.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-center items-center gap-1 text-slate-500 text-xs font-bold font-mono border-t border-white/5 pt-3">
                  <RotateCw className="h-4 w-4" />
                  Click to Flip Back
                </div>
              </div>

            </div>
          </div>

          {/* Spaced Repetition Grading Controls */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-center space-y-4" id="srs-action-panel">
            <h4 className="font-extrabold text-xs text-slate-600 uppercase tracking-widest font-mono">Rate your active recall difficulty:</h4>
            
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSrsAction(1)}
                className="py-3 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 rounded-xl transition-all font-bold text-xs flex flex-col items-center gap-1 cursor-pointer group"
              >
                <span className="text-sm">🔴 Hard</span>
                <span className="text-[10px] text-rose-500 font-normal group-hover:text-rose-600 font-sans">Review in 1 Min</span>
              </button>
              
              <button
                onClick={() => handleSrsAction(2)}
                className="py-3 px-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 rounded-xl transition-all font-bold text-xs flex flex-col items-center gap-1 cursor-pointer group"
              >
                <span className="text-sm">🟡 Good</span>
                <span className="text-[10px] text-indigo-500 font-normal group-hover:text-indigo-600 font-sans">Review in 10 Mins</span>
              </button>

              <button
                onClick={() => handleSrsAction(3)}
                className="py-3 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl transition-all font-bold text-xs flex flex-col items-center gap-1 cursor-pointer group"
              >
                <span className="text-sm">🟢 Easy</span>
                <span className="text-[10px] text-emerald-500 font-normal group-hover:text-emerald-600 font-sans">Review in 4 Days</span>
              </button>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono border-t border-slate-100 pt-3">
              <span>Reviewed Decks: <strong>{cardsReviewedCount} / {cards.length} cards</strong></span>
              <button 
                onClick={() => {
                  setSrsLevels({});
                  localStorage.removeItem('aspires_srs_levels');
                  setCurrentIdx(0);
                }}
                className="text-indigo-600 hover:underline font-bold"
              >
                Reset SRS Progress
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-150">
          <Layers className="h-10 w-10 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-500 text-sm font-semibold">No flashcards loaded for this syllabus.</p>
        </div>
      )}

    </div>
  );
}
