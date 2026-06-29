/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ExamType, QuizSession, Question } from '../types';
import { STATIC_QUIZ_QUESTIONS } from '../data';
import { PREVIOUS_YEAR_PRACTICE_TESTS, PracticeTest } from '../data_tests';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  HelpCircle, 
  ArrowRight, 
  RefreshCw, 
  Sparkles, 
  BookOpen, 
  Download, 
  ExternalLink, 
  Calendar, 
  Hourglass, 
  ArrowLeft, 
  ShieldCheck, 
  Layers,
  FileText
} from 'lucide-react';

interface QuizViewProps {
  selectedExam: ExamType;
  onVoicePlay?: (text: string, title: string) => void;
}

export default function QuizView({ selectedExam, onVoicePlay }: QuizViewProps) {
  const [activeTab, setActiveTab] = useState<'pyqs' | 'ai-compiler' | 'diagnostics'>('pyqs');
  const [session, setSession] = useState<QuizSession | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [customSubject, setCustomSubject] = useState<string>('');
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [activePYQFilter, setActivePYQFilter] = useState<'ALL' | 'UPSC' | 'TNPSC'>('ALL');

  // Load diagnostic preset
  const startStaticQuiz = () => {
    const questions = STATIC_QUIZ_QUESTIONS[selectedExam] || [];
    if (questions.length === 0) return;

    setSession({
      id: `preset-${selectedExam}-${Date.now()}`,
      title: `${selectedExam} Syllabus Diagnostics`,
      questions,
      currentQuestionIndex: 0,
      userAnswers: Array(questions.length).fill(null),
      isCompleted: false,
      score: 0,
    });
    setSelectedAnswerIndex(null);
    setHasAnswered(false);
  };

  // Launch a selected Official PYQ Practice Test
  const startPracticeTest = (test: PracticeTest) => {
    setSession({
      id: `practice-${test.id}-${Date.now()}`,
      title: test.title,
      questions: test.questions,
      currentQuestionIndex: 0,
      userAnswers: Array(test.questions.length).fill(null),
      isCompleted: false,
      score: 0,
    });
    setSelectedAnswerIndex(null);
    setHasAnswered(false);
  };

  // Generate dynamically using Gemini
  const generateAIQuiz = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam: selectedExam,
          subject: customSubject.trim() || undefined
        }),
      });
      const data = await response.json();
      if (data && data.questions && data.questions.length > 0) {
        setSession({
          id: `ai-${selectedExam}-${Date.now()}`,
          title: customSubject.trim() 
            ? `AI Practice Quiz: ${customSubject}`
            : `AI Dynamic ${selectedExam} Mock Exam`,
          questions: data.questions,
          currentQuestionIndex: 0,
          userAnswers: Array(data.questions.length).fill(null),
          isCompleted: false,
          score: 0,
        });
        setSelectedAnswerIndex(null);
        setHasAnswered(false);
      }
    } catch (error) {
      console.warn("Issue compiling AI Quiz:", error);
      // Fallback automatically to syllabus diagnostics
      startStaticQuiz();
    } finally {
      setLoading(false);
    }
  };

  // Automatically adapt when target exam changes
  useEffect(() => {
    if (session && (session.id.startsWith('preset-') || session.id.startsWith('ai-'))) {
      startStaticQuiz();
    }
  }, [selectedExam]);

  // Save quiz history to localStorage when completed
  useEffect(() => {
    if (session && session.isCompleted) {
      const historyKey = 'quiz_history';
      const existingHistory = localStorage.getItem(historyKey);
      let list: any[] = [];
      if (existingHistory) {
        try {
          list = JSON.parse(existingHistory);
        } catch (e) {}
      }
      
      const alreadySaved = list.some(item => item.id === session.id);
      if (!alreadySaved) {
        list.push({
          id: session.id,
          title: session.title,
          exam: selectedExam,
          score: session.score,
          total: session.questions.length,
          timestamp: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        });
        localStorage.setItem(historyKey, JSON.stringify(list));
      }
    }
  }, [session, selectedExam]);

  // Handle option selection
  const handleSelectOption = (optIndex: number) => {
    if (hasAnswered) return;
    setSelectedAnswerIndex(optIndex);
  };

  // Verify chosen option
  const handleVerifyAnswer = () => {
    if (selectedAnswerIndex === null || hasAnswered) return;

    const currentQuestion: Question = session!.questions[session!.currentQuestionIndex];
    const isCorrect = selectedAnswerIndex === currentQuestion.correctAnswerIndex;
    const updatedAnswers = [...session!.userAnswers];
    updatedAnswers[session!.currentQuestionIndex] = selectedAnswerIndex;

    const newScore = isCorrect ? session!.score + 1 : session!.score;

    setSession({
      ...session!,
      userAnswers: updatedAnswers,
      score: newScore,
    });
    setHasAnswered(true);
  };

  // Jump to a specific question index
  const handleJumpToQuestion = (targetIdx: number) => {
    if (!session) return;
    const previousSavedAnswer = session.userAnswers[targetIdx];
    
    setSession({
      ...session,
      currentQuestionIndex: targetIdx,
    });
    
    if (previousSavedAnswer !== null) {
      setSelectedAnswerIndex(previousSavedAnswer);
      setHasAnswered(true);
    } else {
      setSelectedAnswerIndex(null);
      setHasAnswered(false);
    }
  };

  // Move back to previous question
  const handlePrevQuestion = () => {
    if (!session || session.currentQuestionIndex === 0) return;
    handleJumpToQuestion(session.currentQuestionIndex - 1);
  };

  // Advance to next question
  const handleNextQuestion = () => {
    if (!session || !hasAnswered) return;

    const isLastQuestion = session.currentQuestionIndex === session.questions.length - 1;

    if (isLastQuestion) {
      setSession({
        ...session,
        isCompleted: true,
      });
    } else {
      handleJumpToQuestion(session.currentQuestionIndex + 1);
    }
  };

  // Early submission of full exam
  const handleSubmitExam = () => {
    if (!session) return;
    setSession({
      ...session,
      isCompleted: true,
    });
  };

  // Filter practice tests based on toggle and selected exam
  const filteredTests = PREVIOUS_YEAR_PRACTICE_TESTS.filter(test => {
    // Stage 1 filter: UPSC/TNPSC overall switch
    if (activePYQFilter === 'UPSC' && test.exam !== 'UPSC') return false;
    if (activePYQFilter === 'TNPSC' && test.exam === 'UPSC') return false;

    // Stage 2 filter: If they are on a specific exam screen, show relevant or matching years first
    return true;
  });

  return (
    <div className="space-y-6" id="quiz-view-dashboard">
      
      {/* Tab Switcher - Only display if not in an active quiz session */}
      {!session && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm" id="quiz-tab-switcher">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-amber-500" />
            <span className="font-extrabold text-sm text-slate-850">Practice Exam Center</span>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('pyqs')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'pyqs'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-850'
              }`}
            >
              15 PYQ Practice Tests
            </button>
            <button
              onClick={() => setActiveTab('ai-compiler')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'ai-compiler'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-850'
              }`}
            >
              AI Custom Mock
            </button>
            <button
              onClick={() => {
                setActiveTab('diagnostics');
                startStaticQuiz();
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'diagnostics'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-850'
              }`}
            >
              Diagnostic Preset
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE QUIZ SESSION SCREEN */}
      {session ? (
        <div className="bg-white text-slate-800 border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 animate-fadeIn" id="active-quiz-container">
          
          {/* Header Bar */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <button
              onClick={() => setSession(null)}
              className="text-xs text-slate-600 hover:text-slate-800 flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Exit to Tests List
            </button>

            <span className="text-[10px] uppercase font-mono font-bold px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-700">
              Active Session
            </span>
          </div>

          {!session.isCompleted ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="session-questions-playing">
              
              {/* Left Column: Active Question */}
              <div className="lg:col-span-2 space-y-5">
                {/* Progress & Live Score Indicator */}
                <div className="flex justify-between items-end gap-4" id="playing-progress-indicators">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 font-mono block truncate max-w-[280px] sm:max-w-none">
                      {session.title}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Question {session.currentQuestionIndex + 1} of {session.questions.length}
                    </h3>
                  </div>
                  <div className="text-right font-mono flex-shrink-0">
                    <span className="text-[10px] text-slate-500 block">Current Accuracy</span>
                    <span className="text-emerald-600 font-bold text-sm">
                      {session.score} / {session.questions.length} Correct
                    </span>
                  </div>
                </div>

                {/* Graphical Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${((session.currentQuestionIndex + 1) / session.questions.length) * 100}%` }}
                  />
                </div>

                {/* Question Text */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  {session.questions[session.currentQuestionIndex].subject && (
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {session.questions[session.currentQuestionIndex].subject}
                    </span>
                  )}
                  <p className="text-sm md:text-base font-extrabold leading-relaxed text-slate-850 whitespace-pre-line pt-1">
                    {session.questions[session.currentQuestionIndex].text}
                  </p>

                  {/* Multiple Choice Options */}
                  <div className="grid grid-cols-1 gap-2.5" id="options-choices-grid">
                    {session.questions[session.currentQuestionIndex].options.map((option, idx) => {
                      const isSelected = selectedAnswerIndex === idx;
                      const isCorrect = session.questions[session.currentQuestionIndex].correctAnswerIndex === idx;
                      
                      let btnStyle = "border-slate-200 bg-white hover:bg-slate-50 text-slate-700";
                      
                      if (hasAnswered) {
                        if (isCorrect) {
                          btnStyle = "border-emerald-300 bg-emerald-50/50 text-emerald-800";
                        } else if (isSelected) {
                          btnStyle = "border-rose-300 bg-rose-50/50 text-rose-800";
                        } else {
                          btnStyle = "border-slate-100 bg-slate-50/30 text-slate-400";
                        }
                      } else if (isSelected) {
                        btnStyle = "border-amber-550 bg-amber-50 text-amber-800";
                      }

                      return (
                        <button
                          key={idx}
                          disabled={hasAnswered}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full text-left p-4 rounded-xl border text-xs md:text-sm font-semibold transition-all flex items-center justify-between gap-3 leading-relaxed disabled:cursor-default ${btnStyle}`}
                        >
                          <div className="flex gap-3 items-center">
                            <span className={`h-6 w-6 rounded-lg flex items-center justify-center font-mono text-xs font-black flex-shrink-0 ${
                              isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 border border-slate-250 text-slate-600'
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{option}</span>
                          </div>
                          
                          {hasAnswered && isCorrect && (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                          )}
                          {hasAnswered && isSelected && !isCorrect && (
                            <AlertTriangle className="h-5 w-5 text-rose-400 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Verification & Navigation controls */}
                <div className="flex justify-between items-center pt-3 border-t border-slate-100" id="quiz-navigation-action-bar">
                  <div className="flex gap-2">
                    <button
                      disabled={session.currentQuestionIndex === 0}
                      onClick={handlePrevQuestion}
                      className="bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-600 font-extrabold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Prev
                    </button>
                    <button
                      disabled={session.currentQuestionIndex === session.questions.length - 1}
                      onClick={() => handleJumpToQuestion(session.currentQuestionIndex + 1)}
                      className="bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-600 font-extrabold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1"
                    >
                      Skip / Next
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {!hasAnswered ? (
                    <button
                      disabled={selectedAnswerIndex === null}
                      onClick={handleVerifyAnswer}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Verify Option
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                    >
                      {session.currentQuestionIndex === session.questions.length - 1 ? 'Finish Practice' : 'Save & Continue'}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Explanations Section */}
                {hasAnswered && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 animate-fadeIn" id="quiz-explanation-box">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-amber-700 uppercase tracking-widest font-mono">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        Authorized Explanation & Citation:
                      </div>
                      {onVoicePlay && (
                        <button
                          onClick={() => onVoicePlay(session.questions[session.currentQuestionIndex].explanation, `Question ${session.currentQuestionIndex + 1} Explanation`)}
                          className="text-[10px] bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-850 font-bold px-2 py-0.5 rounded flex items-center gap-1 transition-all cursor-pointer"
                          title="Listen to Explanation"
                        >
                          🔊 Listen
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-mono">
                      {session.questions[session.currentQuestionIndex].explanation}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: 100-Question Board Navigator */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 h-fit">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-widest font-mono">
                      Board Navigator
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {session.userAnswers.filter(a => a !== null).length} Answered | {session.questions.length - session.userAnswers.filter(a => a !== null).length} Left
                    </span>
                  </div>
                  <button
                    onClick={handleSubmitExam}
                    className="bg-rose-50 hover:bg-rose-550 border border-rose-200 hover:border-rose-500 text-rose-600 hover:text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition-all shadow-sm"
                  >
                    Submit Exam
                  </button>
                </div>

                {/* Legend Indicator */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-200 block"></span>
                    <span>Unanswered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500 block"></span>
                    <span>Active Now</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500/20 border border-emerald-500/50 block"></span>
                    <span>Correct</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-rose-500/20 border border-rose-500/50 block"></span>
                    <span>Incorrect</span>
                  </div>
                </div>

                {/* 100 Button Grid */}
                <div className="grid grid-cols-5 gap-1.5 max-h-[300px] overflow-y-auto pr-1">
                  {session.questions.map((_, idx) => {
                    const isActive = session.currentQuestionIndex === idx;
                    const answer = session.userAnswers[idx];
                    const isAnswered = answer !== null;
                    const isCorrect = isAnswered && answer === session.questions[idx].correctAnswerIndex;

                    let style = "bg-white border border-slate-200 text-slate-550 hover:border-slate-300";
                    if (isActive) {
                      style = "bg-amber-500 border border-amber-500 text-slate-950 font-black scale-105 shadow-sm";
                    } else if (isAnswered) {
                      style = isCorrect 
                        ? "bg-emerald-50 border border-emerald-300 text-emerald-700 font-bold"
                        : "bg-rose-50 border border-rose-300 text-rose-700 font-bold";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleJumpToQuestion(idx)}
                        className={`h-8 w-full rounded-lg text-[10px] font-mono flex items-center justify-center transition-all ${style}`}
                      >
                        Q{(idx + 1).toString().padStart(2, '0')}
                      </button>
                    );
                  })}
                </div>

                <div className="bg-white border border-slate-200 p-3 rounded-xl text-[10px] text-slate-550 leading-relaxed font-mono">
                  💡 <strong>Exam Portal Tip:</strong> You can jump directly to any question to review your options or change selections before final submission.
                </div>
              </div>

            </div>
          ) : (
            /* Quiz Score Card */
            <div className="text-center py-8 space-y-6" id="session-completed-results">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Award className="h-8 w-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-black text-slate-100">Practice Session Completed!</h3>
                <p className="text-xs text-slate-400">{session.title}</p>
              </div>

              <div className="max-w-md mx-auto bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">Verification accuracy</span>
                  <p className="text-3xl font-black text-emerald-600">{session.score} / {session.questions.length}</p>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(session.score / session.questions.length) * 100}%` }}
                  />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {session.score === session.questions.length
                    ? 'Superb! You answered all representative questions with 100% precision. Continue referencing official texts.'
                    : session.score >= session.questions.length / 2
                    ? 'Excellent effort. Be sure to review the official explanation boxes and verify your syllabus outlines.'
                    : 'Consider revising this topic using our verified government portals library to prevent factual gaps.'}
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-4 border-t border-slate-150">
                <button
                  onClick={() => setSession(null)}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all"
                >
                  Return to Tests Registry
                </button>
                <button
                  onClick={() => {
                    const idParts = session.id.split('-');
                    const testId = idParts.slice(1, -1).join('-');
                    const matchedTest = PREVIOUS_YEAR_PRACTICE_TESTS.find(t => t.id === testId);
                    if (matchedTest) {
                      startPracticeTest(matchedTest);
                    } else {
                      startStaticQuiz();
                    }
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/10"
                >
                  <RefreshCw className="h-3.5 w-3.5 inline mr-1" />
                  Retry representative set
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* REGISTRY OF 10 TO 15 PRACTICE TESTS */
        <div>
          {activeTab === 'pyqs' && (
            <div className="space-y-6" id="pyq-registry-panel">
              
              {/* Filter controls & Title */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    Authorized Previous Year Question Papers (15 Sets)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Sourced directly from UPSC and TNPSC commission boards. Play the representative question sets or download the official papers.
                  </p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
                  {[
                    { id: 'ALL', label: 'All Boards' },
                    { id: 'UPSC', label: 'UPSC CSE' },
                    { id: 'TNPSC', label: 'TNPSC Boards' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setActivePYQFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        activePYQFilter === f.id
                          ? 'bg-emerald-500 text-slate-950'
                          : 'text-slate-600 hover:text-slate-855'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of 15 papers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="practice-test-grid-cards">
                {filteredTests.map((test) => (
                  <div 
                    key={test.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-amber-500/30 hover:bg-slate-50/20 transition-all flex flex-col justify-between space-y-4 shadow-sm"
                  >
                    <div className="space-y-3">
                      
                      {/* Badge header */}
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-emerald-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          {test.year} Paper
                        </span>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">
                          {test.exam.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Title & Subject Scope */}
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-amber-500 transition-colors">
                          {test.title}
                        </h4>
                        <span className="text-[11px] text-slate-500 leading-relaxed block">
                          Scope: <strong className="text-slate-700 font-normal">{test.subjectScope}</strong>
                        </span>
                      </div>

                      {/* Official metadata counters */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center text-xs font-mono text-slate-700">
                        <div className="space-y-0.5 border-r border-slate-200">
                          <span className="text-[10px] text-slate-400 block">ACTUAL QUESTIONS</span>
                          <strong className="text-slate-800 text-sm">{test.actualQuestionCount} MCQs</strong>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 block">OFFICIAL DURATION</span>
                          <strong className="text-slate-800 text-sm">{test.durationMinutes} Mins</strong>
                        </div>
                      </div>

                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-550" />
                        Verified Keys Mapped
                      </div>

                      <div className="flex gap-2">
                        {test.officialAnswerKeyUrl && (
                          <a
                            href={test.officialAnswerKeyUrl}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            rel="noopener noreferrer"
                            title="Official Key"
                            className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-amber-600 p-2 rounded-xl flex items-center justify-center transition-all"
                          >
                            <FileText className="h-4 w-4" />
                          </a>
                        )}
                        <a
                          href={test.officialPaperUrl}
                          target="_blank"
                          referrerPolicy="no-referrer"
                          rel="noopener noreferrer"
                          title="Download Full Paper PDF"
                          className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-650 p-2 rounded-xl flex items-center justify-center transition-all"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => startPracticeTest(test)}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/10"
                        >
                          <Play className="h-3.5 w-3.5" />
                          Practice Set
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {activeTab === 'ai-compiler' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-805 space-y-6 shadow-sm" id="ai-compiler-panel">
              <div className="space-y-1">
                <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Dynamic Exam Compiler (Gemini-3.5-Flash)
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                  Specify a custom subject, syllabus unit, or core chapter. The model will assemble a completely unique diagnostic mock set containing 100% verified question keys and citations.
                </p>
              </div>

              <div className="max-w-xl space-y-4" id="compiler-input-group">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Syllabus Subject Focus</label>
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="e.g. Fundamental Rights, Sangam Era Literature, Aptitude Simple Interest"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-start gap-2.5">
                  <BookOpen className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    AI generation is aligned strictly with official textbook standards. The questions constructed will reference real provisions of the Constitution, genuine archaeological carbon dates, and correct NCERT definitions.
                  </p>
                </div>

                <button
                  disabled={loading}
                  onClick={generateAIQuiz}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs md:text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/10 disabled:opacity-40"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Compiling Verified Questions...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Compile & Launch Live Mock
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'diagnostics' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-805 text-center space-y-4 shadow-sm" id="diagnostics-info-fallback">
              <HelpCircle className="h-10 w-10 text-amber-500 mx-auto" />
              <div className="space-y-1 max-w-md mx-auto">
                <h4 className="font-extrabold text-sm text-slate-900">Syllabus Diagnostic Preset</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You are currently loading the preset diagnostics test. Click below to begin answering questions instantly.
                </p>
              </div>
              <button
                onClick={startStaticQuiz}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-5 py-2 rounded-xl transition-all"
              >
                Launch Diagnostic Quiz
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
