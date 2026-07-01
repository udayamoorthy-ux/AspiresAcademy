/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ExamType } from '../types';
import { 
  GraduationCap, 
  Clock, 
  Play, 
  Pause, 
  RefreshCw, 
  CheckSquare, 
  CheckCircle, 
  Bookmark, 
  FileText, 
  Sparkles, 
  AlertCircle,
  Award
} from 'lucide-react';

interface SprintPrompt {
  id: string;
  question: string;
  timeLimit: number; // in seconds
  idealKeywords: string[];
  evaluationRubric: { title: string; desc: string }[];
  context: string;
}

const TNPSC_SPRINTS: SprintPrompt[] = [
  {
    id: 'tnpsc-sprint-1',
    question: 'Evaluate the social and cultural impact of the Self-Respect Movement (Suyamariyathai Iyakkam) on the empowerment of women in Madras Presidency.',
    timeLimit: 300, // 5 minutes
    idealKeywords: ['Periyar E.V.R', 'Self-Respect Marriage', 'Madras Devadasi Act', 'Equal property rights', 'Kudi Arasu'],
    evaluationRubric: [
      { title: 'Social Reforms', desc: 'Highlighted elimination of priest-led marriages and validation of simple Self-Respect Marriages.' },
      { title: 'Legislative Milestones', desc: 'Linked the movement with Dr. Muthulakshmi Reddy\'s bills combating social evils.' },
      { title: 'Economic Rights', desc: 'Emphasized demands for equal inheritance rights championed in early conferences.' }
    ],
    context: 'History of Tamil Society (Paper-II / Unit 8)'
  }
];

const DAILY_SPRINTS: Record<ExamType, SprintPrompt[]> = {
  UPSC: [
    {
      id: 'upsc-sprint-1',
      question: 'Analyze the dynamic role of the Governor under Article 163 of the Indian Constitution, especially with respect to discretionary powers in post-election coalitions.',
      timeLimit: 300, // 5 minutes
      idealKeywords: ['Article 163', 'Discretionary powers', 'Punchhi Commission', 'Sarkaria Commission', 'Constitutional head'],
      evaluationRubric: [
        { title: 'Constitutional Basis', desc: 'Mentioned Article 163 and explicitly compared it with Article 74 (President has less explicit discretionary power).' },
        { title: 'Judicial/Commission Safeguards', desc: 'Referenced landmark cases (e.g., Nabam Rebia case) or recommendation reports of Sarkaria/Punchhi commissions.' },
        { title: 'Conflict Zone', desc: 'Identified the tension between the Governor\'s role as central agent vs. impartial constitutional head.' }
      ],
      context: 'Polity & Federalism (GS Paper-II)'
    },
    {
      id: 'upsc-sprint-2',
      question: 'What are the main systemic bottlenecks holding back India from achieving its targets under the National Green Hydrogen Mission?',
      timeLimit: 180, // 3 minutes
      idealKeywords: ['Electrolyzer manufacturing', 'Water scarcity', 'Grid integration', 'High capital cost', 'Grey hydrogen transition'],
      evaluationRubric: [
        { title: 'Technical challenges', desc: 'Identified electrolyzer supply chain issues and heavy dependency on raw materials.' },
        { title: 'Resource allocation', desc: 'Addressed the massive fresh-water footprint required for green hydrogen generation.' },
        { title: 'Economic viability', desc: 'Analyzed storage and transportation safety and cost bottlenecks.' }
      ],
      context: 'Economy & Infrastructure (GS Paper-III)'
    }
  ],
  TNPSC_G1: TNPSC_SPRINTS,
  TNPSC_G2: TNPSC_SPRINTS,
  TNPSC_G4: TNPSC_SPRINTS,
};

export default function MainsSprintsView({ selectedExam }: { selectedExam: ExamType }) {
  const prompts = DAILY_SPRINTS[selectedExam] || DAILY_SPRINTS['UPSC'];
  const [activePromptIdx, setActivePromptIdx] = useState(0);
  const prompt = prompts[activePromptIdx];

  // Timer states
  const [timeLeft, setTimeLeft] = useState(prompt ? prompt.timeLimit : 300);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Editor states
  const [typedAnswer, setTypedAnswer] = useState('');
  const [showSelfEvaluation, setShowSelfEvaluation] = useState(false);
  const [rubricGrades, setRubricGrades] = useState<Record<number, boolean>>({});

  // Reset states when prompt or exam changes
  useEffect(() => {
    if (prompt) {
      setTimeLeft(prompt.timeLimit);
      setTimerRunning(false);
      setTypedAnswer('');
      setShowSelfEvaluation(false);
      setRubricGrades({});
    }
  }, [activePromptIdx, selectedExam]);

  // Timer countdown hook
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      // Auto-submit triggers when time expires
      setShowSelfEvaluation(true);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerRunning, timeLeft]);

  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const handleReset = () => {
    setTimerRunning(false);
    setTimeLeft(prompt ? prompt.timeLimit : 300);
    setTypedAnswer('');
    setShowSelfEvaluation(false);
    setRubricGrades({});
  };

  const wordCount = typedAnswer.trim() === '' ? 0 : typedAnswer.trim().split(/\s+/).length;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Keyword check helper: check if the typed answer contains the keyword (case-insensitive)
  const containsKeyword = (kw: string) => {
    return typedAnswer.toLowerCase().includes(kw.toLowerCase());
  };

  const matchedKeywordsCount = prompt ? prompt.idealKeywords.filter(kw => containsKeyword(kw)).length : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="mains-sprint-desk">
      
      {/* Top micro sprint branding banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden" id="sprints-header-card">
        <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 rounded-full text-xs font-semibold text-indigo-200 border border-indigo-400/25">
              <Clock className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              Micro-Daily Mains Sprint
            </span>
            <h2 className="text-2xl md:text-3xl font-black font-display tracking-tight">Active Writing Reflex</h2>
            <p className="text-xs text-indigo-100 max-w-xl">
              Tackle daily micro-prompts under strict visual timers. Answer with core points to establish writing muscle memory without getting overwhelmed by 250-word margins.
            </p>
          </div>
          <div className="flex gap-2">
            {prompts.map((p, index) => (
              <button
                key={p.id}
                onClick={() => setActivePromptIdx(index)}
                className={`h-9 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activePromptIdx === index
                    ? 'bg-indigo-600 text-white shadow shadow-indigo-600/20'
                    : 'bg-white/10 hover:bg-white/15 text-indigo-200'
                }`}
              >
                Sprint {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {prompt ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="sprint-layout-grid">
          
          {/* Left Block: Prompt details and Editor */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              
              {/* Context Tag & Timing status */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider font-mono bg-indigo-50 px-2.5 py-1 rounded">
                  {prompt.context}
                </span>
                <span className="text-xs text-slate-400 font-bold font-mono">
                  Ideal Limit: {prompt.timeLimit / 60} Mins
                </span>
              </div>

              {/* Question display */}
              <h3 className="text-lg md:text-xl font-black text-slate-900 leading-snug font-display">
                {prompt.question}
              </h3>

              {/* Timer Bar */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex items-center justify-between gap-4" id="sprint-visual-timer">
                <div className="flex items-center gap-3">
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-mono font-black text-lg shadow-sm border transition-all ${
                    timeLeft <= 30 && timerRunning
                      ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}>
                    {formatTime(timeLeft)}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800">Sprint Countdown</p>
                    <p className="text-[10px] text-slate-400">Keep answers focused and precise.</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={toggleTimer}
                    className={`py-2 px-4 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                      timerRunning
                        ? 'bg-slate-800 text-white hover:bg-slate-700'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow shadow-indigo-600/10'
                    }`}
                  >
                    {timerRunning ? (
                      <>
                        <Pause className="h-3.5 w-3.5" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 fill-white" /> Start Countdown
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl transition-all cursor-pointer"
                    title="Reset Sprint"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Text Writing Area */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 font-mono">
                  <span>Your Sprint Response Outline</span>
                  <span className={wordCount > 120 ? 'text-rose-500' : 'text-indigo-600'}>
                    {wordCount} Words
                  </span>
                </div>
                <textarea
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  placeholder="Type your response outline or full bullet-pointed model answer here. Try to incorporate the ideal conceptual keywords listed on the side..."
                  className="w-full h-56 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans leading-relaxed"
                  disabled={timeLeft === 0 && !showSelfEvaluation}
                />
              </div>

              {/* Submit / Evaluate button */}
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setShowSelfEvaluation(true)}
                  disabled={typedAnswer.trim() === ''}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow shadow-indigo-600/15 transition-all cursor-pointer"
                >
                  Generate Evaluation Checklist
                </button>
              </div>

            </div>
          </div>

          {/* Right Block: Keyword analyzer and grading metric */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Target Keywords Checklist */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 font-display">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                Auto Keyword Sync
              </h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                Examiners hunt for specific terminology. Our engine detects active concept markers in your typed response.
              </p>

              <div className="space-y-2">
                {prompt.idealKeywords.map((kw, i) => {
                  const isMatched = containsKeyword(kw);
                  return (
                    <div 
                      key={i}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs ${
                        isMatched 
                          ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' 
                          : 'bg-slate-50 border-slate-100 text-slate-600'
                      }`}
                    >
                      <span className="font-bold">{kw}</span>
                      {isMatched ? (
                        <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-slate-300" />
                      )}
                    </div>
                  );
                })}
              </div>

              {showSelfEvaluation && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3 text-center text-xs">
                  <span className="font-black text-indigo-950">Keyword Hit Rate: </span>
                  <span className="font-bold text-indigo-700">
                    {matchedKeywordsCount} / {prompt.idealKeywords.length}
                  </span>
                </div>
              )}
            </div>

            {/* Self-Evaluation Rubric Panel */}
            {showSelfEvaluation && (
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 animate-fade-in" id="self-grading-checklist">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 font-display">
                  <Award className="h-4.5 w-4.5 text-indigo-600" />
                  Self-Grading Rubric
                </h4>
                <p className="text-[11px] text-slate-400">
                  Read these official grading indicators and check which parts you successfully covered:
                </p>

                <div className="space-y-3">
                  {prompt.evaluationRubric.map((rubric, idx) => {
                    const isChecked = !!rubricGrades[idx];
                    return (
                      <div 
                        key={idx}
                        onClick={() => setRubricGrades(prev => ({ ...prev, [idx]: !prev[idx] }))}
                        className={`p-3 rounded-xl border transition-all cursor-pointer text-left space-y-1 ${
                          isChecked 
                            ? 'bg-indigo-50/50 border-indigo-300 text-indigo-950 shadow-sm' 
                            : 'bg-slate-50/50 border-slate-100 text-slate-600 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-black text-xs font-display">{rubric.title}</span>
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={() => {}} // Controlled via parent click
                            className="rounded border-slate-300 text-indigo-600"
                          />
                        </div>
                        <p className="text-[10.5px] text-slate-500 leading-normal">{rubric.desc}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl text-center text-xs space-y-1">
                  <span className="text-[9px] uppercase font-black tracking-widest text-indigo-300 font-mono">Performance Verdict</span>
                  <p className="font-bold">
                    {Object.values(rubricGrades).filter(Boolean).length === prompt.evaluationRubric.length
                      ? '🏅 Exceptional Coverage!'
                      : '📈 Decent Sprint. Focus on missing anchors next time.'}
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-150">
          <GraduationCap className="h-10 w-10 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-500 text-sm font-semibold">No writing sprints loaded for this syllabus.</p>
        </div>
      )}

    </div>
  );
}
