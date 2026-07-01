/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ExamType, Question, QuizSession } from '../types';
import { 
  Award, 
  BookOpen, 
  HelpCircle, 
  ArrowRight, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft, 
  Loader2, 
  Compass, 
  Layers,
  Crown,
  BookCheck,
  AlertTriangle,
  XCircle,
  Play
} from 'lucide-react';

interface SubjectQuizViewProps {
  selectedExam: ExamType;
  onVoicePlay?: (text: string, title: string) => void;
  isPremium?: boolean;
  onPremiumClick?: () => void;
}

const SUBJECTS = [
  {
    id: 'polity',
    name: 'Indian Polity (அரசியலமைப்பு)',
    description: 'Constitution, Fundamental Rights, Parliament, State Government, and Panchayati Raj.',
    icon: Compass,
    color: 'emerald',
    topics: [
      'Constitutional Framework & Salient Features',
      'Preamble & Territory of the Union',
      'Fundamental Rights & Duties (Articles 12-51A)',
      'Directive Principles of State Policy (DPSP)',
      'Union Executive & Parliament',
      'Judiciary (Supreme Court & High Courts)',
      'Local Bodies & Panchayati Raj Institutions',
      'Emergency Provisions & Constitutional Amendments'
    ]
  },
  {
    id: 'history',
    name: 'Indian History & National Movement (வரலாறு)',
    description: 'Ancient Civilizations, Sangam Age, South Indian History, and the Freedom Struggle.',
    icon: Layers,
    color: 'amber',
    topics: [
      'Indus Valley Civilization & Vedic Period',
      'Sangam Age: Literature, Thinai & Socio-Economic Life',
      'South Indian Dynasties (Cholas, Cheras, Pandyas, Vijayanagara)',
      'Socio-Religious Reform Movements in India & TN',
      'Early Uprisings & Revolt of 1857',
      'Indian National Congress & Moderate Phase (1885-1905)',
      'Extremist Phase & Swadeshi Movement',
      'Gandhian Era & Indian National Movement (1915-1947)',
      'Self-Respect Movement & Justice Party in TN'
    ]
  },
  {
    id: 'economy',
    name: 'Indian Economy & Development (பொருளாதாரம்)',
    description: 'NITI Aayog, Banking, Inflation, GST, and Welfare Schemes of Tamil Nadu.',
    icon: BookCheck,
    color: 'blue',
    topics: [
      'Planning Commission & NITI Aayog',
      'Monetary Policy & Reserve Bank of India (RBI)',
      'Fiscal Policy, Taxation, and GST Council',
      'Inflation, Core vs Headline, and Economic Growth',
      'Social Welfare Schemes (Pudhumai Penn, Tamil Pudhalvan)',
      'Human Development Index (HDI) & Welfare Policies',
      'Socio-Economic Development Model of Tamil Nadu'
    ]
  },
  {
    id: 'tamil',
    name: 'General Tamil (பொதுத்தமிழ் - இலக்கியம் & இலக்கணம்)',
    description: 'Thirukkural, Sangam Literature, and Tamil Scholars.',
    icon: BookOpen,
    color: 'purple',
    topics: [
      'திருக்குறள் (Thirukkural: Ethics & Governance)',
      'எட்டுத்தொகை & பத்துப்பாட்டு (Sangam Classics)',
      'தமிழ் இலக்கணம் (Grammar, Phonetics & Structure)',
      'தமிழ் அறிஞர்களும் தமிழ்த் தொண்டும் (Scholars & Reformers)',
      'பதினெண்கீழ்க்கணக்கு நூல்கள் (Didactic Works)'
    ]
  },
  {
    id: 'aptitude',
    name: 'Aptitude & Mental Ability (திறனறிவு)',
    description: 'Quantitative aptitude, logical reasoning, and mental arithmetic.',
    icon: Award,
    color: 'indigo',
    topics: [
      'Simplification & Number Series',
      'Simple Interest & Compound Interest',
      'Time, Speed, Distance & Work',
      'Ratio & Proportion, Ages',
      'Percentage, Profit & Loss',
      'Logical Reasoning & Data Interpretation'
    ]
  }
];

export default function SubjectQuizView({
  selectedExam,
  onVoicePlay,
  isPremium = false,
  onPremiumClick
}: SubjectQuizViewProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  // Free Tier Quiz Counts
  const [quizCount, setQuizCount] = useState<number>(() => {
    const val = localStorage.getItem('aspires_subject_quiz_count');
    return val ? parseInt(val, 10) : 0;
  });

  const checkLimit = (): boolean => {
    if (isPremium) return true;
    if (quizCount >= 2) {
      alert("Free Tier Limit Reached: You have reached your daily limit of 2 Subject Quizzes. Upgrade to ASPIRES Premium to unlock unlimited custom, topic-wise, and AI-powered assessments!");
      onPremiumClick?.();
      return false;
    }
    return true;
  };

  const incrementLimit = () => {
    if (!isPremium) {
      const newCount = quizCount + 1;
      setQuizCount(newCount);
      localStorage.setItem('aspires_subject_quiz_count', String(newCount));
    }
  };

  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setSelectedTopic('');
    setCustomTopic('');
  };

  const activeSubjectData = SUBJECTS.find(s => s.id === selectedSubject);

  const startQuiz = async () => {
    const finalTopic = customTopic.trim() || selectedTopic;
    if (!finalTopic) {
      alert('Please select a topic or enter a custom one.');
      return;
    }

    if (!checkLimit()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/subject-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: activeSubjectData?.name || selectedSubject,
          topic: finalTopic,
          exam: selectedExam
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from quiz engine');
      }

      const data = await response.json();
      if (data && data.questions && data.questions.length > 0) {
        setSession({
          id: `sub-quiz-${selectedSubject}-${Date.now()}`,
          title: `${activeSubjectData?.name || selectedSubject} - ${finalTopic}`,
          questions: data.questions,
          currentQuestionIndex: 0,
          userAnswers: Array(data.questions.length).fill(null),
          isCompleted: false,
          score: 0,
        });
        setSelectedAnswerIndex(null);
        setHasAnswered(false);
        incrementLimit();
      } else {
        alert('Could not compile questions for the selected topic. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to quiz server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (hasAnswered) return;
    setSelectedAnswerIndex(index);
  };

  const handleAnswerSubmit = () => {
    if (session === null || selectedAnswerIndex === null || hasAnswered) return;

    const currentQuestion = session.questions[session.currentQuestionIndex];
    const isCorrect = selectedAnswerIndex === currentQuestion.correctAnswerIndex;

    const updatedAnswers = [...session.userAnswers];
    updatedAnswers[session.currentQuestionIndex] = selectedAnswerIndex;

    const updatedScore = isCorrect ? session.score + 1 : session.score;

    setSession({
      ...session,
      userAnswers: updatedAnswers,
      score: updatedScore
    });
    setHasAnswered(true);

    // Audio assistance
    if (onVoicePlay) {
      const phrase = isCorrect 
        ? "Excellent! That is correct." 
        : `Correction. The correct answer is option ${String.fromCharCode(65 + currentQuestion.correctAnswerIndex)}.`;
      onVoicePlay(phrase + " " + currentQuestion.explanation, "Quiz feedback assistant");
    }
  };

  const handleNextQuestion = () => {
    if (session === null) return;

    const nextIndex = session.currentQuestionIndex + 1;
    if (nextIndex < session.questions.length) {
      setSession({
        ...session,
        currentQuestionIndex: nextIndex
      });
      setSelectedAnswerIndex(null);
      setHasAnswered(false);
    } else {
      setSession({
        ...session,
        isCompleted: true
      });
    }
  };

  const handleRestartQuiz = () => {
    if (session === null) return;
    setSession({
      ...session,
      currentQuestionIndex: 0,
      userAnswers: Array(session.questions.length).fill(null),
      isCompleted: false,
      score: 0
    });
    setSelectedAnswerIndex(null);
    setHasAnswered(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6" id="subject-quiz-container">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6" id="subject-quiz-header">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/20">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-300" />
            <span>AI Topic Trainer</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight font-display">
            Subject & Topic-Wise Quizzes
          </h2>
          <p className="text-xs md:text-sm text-emerald-100 max-w-2xl font-sans">
            Deep dive into specific parts of your syllabus. Practice focused 5-question micro-assessments, view deep conceptual explanations, and perfect your weak areas.
          </p>
        </div>
        {!isPremium && (
          <div className="bg-amber-500 text-slate-950 p-4 rounded-2xl flex flex-col gap-2 shrink-0 max-w-xs border border-amber-400 shadow-lg">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-wider font-mono">Free Tier Plan</span>
            </div>
            <p className="text-[10px] font-bold leading-relaxed">
              Limit: 2 dynamic topic quizzes daily. Unlock unlimited premium subject tests!
            </p>
            <button
              onClick={onPremiumClick}
              className="mt-1 w-full bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition-all"
            >
              Get Premium Access
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {!session ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="quiz-setup-panel">
          
          {/* Step 1: Select Subject */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <span className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-700 font-mono text-sm font-black flex items-center justify-center">1</span>
              Choose broad subject area
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SUBJECTS.map((subject) => {
                const isSelected = selectedSubject === subject.id;
                const IconComponent = subject.icon;
                
                let cardStyle = "bg-white hover:border-slate-300 border-slate-200 text-slate-700";
                if (isSelected) {
                  cardStyle = "bg-emerald-50/50 border-2 border-emerald-500 ring-2 ring-emerald-500/10 text-emerald-950";
                }

                return (
                  <button
                    key={subject.id}
                    id={`subject-card-${subject.id}`}
                    onClick={() => handleSelectSubject(subject.id)}
                    className={`p-4 rounded-2xl border text-left flex gap-3.5 transition-all duration-200 cursor-pointer ${cardStyle}`}
                  >
                    <div className={`h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 ${isSelected ? 'bg-emerald-500 text-white' : 'text-slate-500'}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-extrabold text-sm tracking-tight">{subject.name}</p>
                      <p className="text-[11px] text-slate-500 leading-normal">{subject.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Topic & Configure */}
          <div className="lg:col-span-5 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-5 flex flex-col justify-between" id="topic-configure-panel">
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <span className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-700 font-mono text-sm font-black flex items-center justify-center">2</span>
                Choose topic & settings
              </h3>

              {!selectedSubject ? (
                <div className="text-center py-10 space-y-2 border-2 border-dashed border-slate-200 rounded-2xl">
                  <HelpCircle className="h-8 w-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-400 font-medium">Please choose a subject first to unlock topic selections</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Topic dropdown selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-600 uppercase tracking-wider font-mono">Pre-defined Syllabus Topics</label>
                    <select
                      id="topic-select-dropdown"
                      value={selectedTopic}
                      onChange={(e) => {
                        setSelectedTopic(e.target.value);
                        setCustomTopic('');
                      }}
                      className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                    >
                      <option value="">-- Choose pre-seeded topic --</option>
                      {activeSubjectData?.topics.map((t, idx) => (
                        <option key={idx} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Or Custom Topic generation */}
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">OR GENERATE DYNAMICALLY</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-600 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Custom Topic Input (AI-Powered)
                    </label>
                    <input
                      type="text"
                      id="custom-topic-input"
                      placeholder="e.g., Anti-defection law, Samacheer Kalvi History..."
                      value={customTopic}
                      onChange={(e) => {
                        setCustomTopic(e.target.value);
                        setSelectedTopic('');
                      }}
                      className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <button
                id="generate-subject-quiz-btn"
                disabled={loading || !selectedSubject || (!selectedTopic && !customTopic)}
                onClick={startQuiz}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-extrabold text-sm py-3 px-4 rounded-xl transition-all shadow-md shadow-emerald-600/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing Syllabus & Compiling...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Launch 5-Question Quiz</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-slate-400 text-center font-medium">
                Quizzes are designed according to strict standard civil services formats.
              </p>
            </div>

          </div>
        </div>
      ) : (
        /* ACTIVE QUIZ PANEL */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="active-quiz-panel">
          
          {/* Main Quiz Board (Col span 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header / Back button */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSession(null)}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Exit Quiz
              </button>
              <span className="text-[10px] font-black uppercase tracking-wider font-mono text-slate-400">
                ACTIVE TRAINING SESSION
              </span>
            </div>

            {/* Completion View vs Active Question */}
            {session.isCompleted ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-sm" id="quiz-results-card">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                  <Award className="h-8 w-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900">Training Session Completed!</h3>
                  <p className="text-xs text-slate-400 font-mono uppercase tracking-wider font-semibold">{session.title}</p>
                </div>

                <div className="max-w-md mx-auto bg-slate-50 border border-slate-100 p-6 rounded-2xl space-y-3">
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 font-mono">Accuracy Score</span>
                  <p className="text-4xl font-black text-emerald-600">
                    {session.score} <span className="text-slate-400 text-lg">/ {session.questions.length}</span>
                  </p>
                  
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${(session.score / session.questions.length) * 100}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pt-2">
                    {session.score === session.questions.length
                      ? 'Incredible performance! You demonstrated 100% mastery over this topic. Continue with other syllabus chapters!'
                      : session.score >= session.questions.length / 2
                      ? 'Good job. Review the explanation details below to seal any remaining conceptual gaps.'
                      : 'More practice needed on this area. Consider generating notes or talking to your Personal AI Coach to strengthen this subject.'}
                  </p>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => setSession(null)}
                    className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    Try Another Topic
                  </button>
                  <button
                    onClick={handleRestartQuiz}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Retry Questions
                  </button>
                </div>
              </div>
            ) : (
              /* Active Question Panel */
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 space-y-6" id="active-question-card">
                
                {/* Progress bar and indicator */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Question {session.currentQuestionIndex + 1} of {session.questions.length}</span>
                    <h4 className="font-extrabold text-xs text-slate-700 font-mono truncate max-w-sm md:max-w-md">{session.title}</h4>
                  </div>
                  <span className="text-xs font-black text-emerald-600 font-mono">
                    Score: {session.score}
                  </span>
                </div>

                {/* Question Text */}
                <div className="text-slate-850 font-extrabold text-base leading-relaxed" id="question-text">
                  {session.questions[session.currentQuestionIndex].text.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2 text-sm font-semibold text-slate-600' : ''}>{line}</p>
                  ))}
                </div>

                {/* Options list */}
                <div className="grid grid-cols-1 gap-3" id="quiz-options">
                  {session.questions[session.currentQuestionIndex].options.map((option, idx) => {
                    const isSelected = selectedAnswerIndex === idx;
                    const isCorrectOption = idx === session.questions[session.currentQuestionIndex].correctAnswerIndex;
                    const isUserSelected = session.userAnswers[session.currentQuestionIndex] === idx;
                    
                    let buttonStyle = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/70";
                    let iconNode = (
                      <span className="h-6 w-6 rounded-lg bg-white border border-slate-200 text-slate-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                    );

                    if (hasAnswered) {
                      if (isCorrectOption) {
                        buttonStyle = "bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold";
                        iconNode = <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />;
                      } else if (isUserSelected) {
                        buttonStyle = "bg-rose-50 border-2 border-rose-500 text-rose-950 font-bold";
                        iconNode = <XCircle className="h-6 w-6 text-rose-600 shrink-0" />;
                      } else {
                        buttonStyle = "bg-slate-50 border-slate-150 text-slate-400 opacity-60";
                      }
                    } else if (isSelected) {
                      buttonStyle = "bg-emerald-50/50 border-2 border-emerald-600 text-emerald-950 font-bold ring-2 ring-emerald-600/10";
                      iconNode = (
                        <span className="h-6 w-6 rounded-lg bg-emerald-600 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                      );
                    }

                    return (
                      <button
                        key={idx}
                        disabled={hasAnswered}
                        onClick={() => handleAnswerSelect(idx)}
                        className={`w-full p-4 rounded-xl border text-left flex items-center gap-3.5 transition-all text-xs font-medium cursor-pointer ${buttonStyle}`}
                      >
                        {iconNode}
                        <span className="leading-snug">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Submit button / Next button */}
                <div className="flex justify-end pt-4 border-t border-slate-100 gap-3">
                  {!hasAnswered ? (
                    <button
                      onClick={handleAnswerSubmit}
                      disabled={selectedAnswerIndex === null}
                      className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Verify Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/10 cursor-pointer"
                    >
                      <span>{session.currentQuestionIndex + 1 < session.questions.length ? 'Next Question' : 'Complete Quiz'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Explanation container */}
                {hasAnswered && (
                  <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-2 animate-fade-in" id="explanation-box">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-emerald-600" /> OFFICIAL EXPLANATION & ANALYSIS
                    </p>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                      {session.questions[session.currentQuestionIndex].explanation}
                    </p>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Quick status / progression panel (Col span 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Session Stats card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4" id="quiz-stats-sidebar">
              <h4 className="font-extrabold text-sm text-slate-800 border-b border-slate-100 pb-2">
                Session Progress
              </h4>

              {/* Progress dots */}
              <div className="grid grid-cols-5 gap-2">
                {session.questions.map((_, idx) => {
                  const isActive = session.currentQuestionIndex === idx;
                  const answer = session.userAnswers[idx];
                  const isAnswered = answer !== null;
                  const isCorrect = isAnswered && answer === session.questions[idx].correctAnswerIndex;

                  let style = "bg-slate-100 text-slate-400";
                  if (isActive) {
                    style = "bg-amber-500 text-slate-950 font-black scale-105 ring-2 ring-amber-500/15";
                  } else if (isAnswered) {
                    style = isCorrect 
                      ? "bg-emerald-500 text-white" 
                      : "bg-rose-500 text-white";
                  }

                  return (
                    <div
                      key={idx}
                      className={`h-8 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center transition-all ${style}`}
                    >
                      Q{idx + 1}
                    </div>
                  );
                })}
              </div>

              {/* Tips block */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-[11px] text-slate-500 leading-relaxed space-y-2">
                <p className="font-bold text-slate-700 flex items-center gap-1">
                  💡 Training Guide
                </p>
                <p>
                  Read each option carefully. Civil services examinations often use double-negatives or slightly misleading dates to check your precision.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
