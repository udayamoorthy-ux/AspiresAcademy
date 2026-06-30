/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EssayPrompt, EssayEvaluation } from '../types';
import { DEFAULT_ESSAY_PROMPTS } from '../data';
import { Award, Sparkles, Send, FileText, CheckCircle2, ChevronRight, HelpCircle, Loader2, Crown } from 'lucide-react';

interface EssayEvaluatorViewProps {
  isPremium?: boolean;
  onPremiumClick?: () => void;
}

export default function EssayEvaluatorView({ isPremium = false, onPremiumClick }: EssayEvaluatorViewProps) {
  const [prompts, setPrompts] = useState<EssayPrompt[]>(DEFAULT_ESSAY_PROMPTS);
  const [selectedPrompt, setSelectedPrompt] = useState<EssayPrompt>(DEFAULT_ESSAY_PROMPTS[0]);
  const [essayText, setEssayText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<EssayEvaluation | null>(null);

  // Free Tier Usage Counting state
  const [evalCount, setEvalCount] = useState<number>(() => {
    const val = localStorage.getItem('aspires_essay_eval_count');
    return val ? parseInt(val, 10) : 0;
  });

  // Custom prompt input
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customContext, setCustomContext] = useState<string>('');
  const [customWordCount, setCustomWordCount] = useState<number>(800);
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false);

  const wordCount = essayText.trim() === '' ? 0 : essayText.trim().split(/\s+/).length;

  const handleSelectPrompt = (prompt: EssayPrompt) => {
    setSelectedPrompt(prompt);
    setEvaluation(null);
  };

  const addCustomPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newPrompt: EssayPrompt = {
      id: `prompt-custom-${Date.now()}`,
      title: customTitle,
      context: customContext || 'Write a comprehensive analytical essay addressing the core aspects of this subject.',
      category: 'User Custom Prompt',
      wordCountTarget: customWordCount
    };

    setPrompts([newPrompt, ...prompts]);
    setSelectedPrompt(newPrompt);
    setShowCustomForm(false);
    setEvaluation(null);

    // Clear state
    setCustomTitle('');
    setCustomContext('');
  };

  const handleEvaluateEssay = async () => {
    if (!essayText.trim() || loading) return;

    if (!isPremium && evalCount >= 1) {
      alert("Free Tier Limit Reached: You have reached your daily limit of 1 essay evaluation. Upgrade to ASPIRES Premium via Google Pay to get instant unlimited gradings!");
      onPremiumClick?.();
      return;
    }

    setLoading(true);
    setEvaluation(null);

    try {
      const response = await fetch('/api/evaluate-essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptTitle: selectedPrompt.title,
          context: selectedPrompt.context,
          essayText,
          wordCountTarget: selectedPrompt.wordCountTarget
        }),
      });

      const data = await response.json();
      if (data) {
        setEvaluation(data);
        if (!isPremium) {
          const newCount = evalCount + 1;
          setEvalCount(newCount);
          localStorage.setItem('aspires_essay_eval_count', String(newCount));
        }
      }
    } catch (error) {
      console.warn("Mains answer evaluation fallback warning:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="essay-evaluator-view">
      {/* Sidebar: Prompt Selector */}
      <div className="space-y-4" id="prompts-list-sidebar">
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 text-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">Mains Essay Prompts</h4>
            <button
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="text-xs text-amber-600 hover:text-amber-700 font-bold"
            >
              {showCustomForm ? 'View Presets' : 'Draft Custom'}
            </button>
          </div>

          {!showCustomForm ? (
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1" id="presets-container">
              {prompts.map((prompt) => {
                const isSelected = selectedPrompt.id === prompt.id;
                return (
                  <button
                    key={prompt.id}
                    id={`prompt-${prompt.id}`}
                    onClick={() => handleSelectPrompt(prompt)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold leading-relaxed transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-950 shadow-sm'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                      {prompt.category}
                    </span>
                    <span className="font-extrabold text-slate-900">{prompt.title}</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      Target: {prompt.wordCountTarget} words
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Custom Prompt Creator Form */
            <form onSubmit={addCustomPrompt} className="space-y-3" id="custom-prompt-form">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Prompt Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Agricultural Reforms and Farmers Welfare"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Instructions/Context</label>
                <textarea
                  placeholder="e.g., Examine the role of e-technology in aiding farmers. Highlight major challenges."
                  value={customContext}
                  onChange={(e) => setCustomContext(e.target.value)}
                  className="w-full h-16 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider">Target Words ({customWordCount} words)</label>
                <input
                  type="range"
                  min={150}
                  max={1200}
                  step={50}
                  value={customWordCount}
                  onChange={(e) => setCustomWordCount(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2 rounded-lg transition-colors"
              >
                Assemble New Prompt
              </button>
            </form>
          )}
        </div>

        {/* Selected Prompt Context details */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-slate-800 space-y-3 shadow-sm" id="selected-prompt-details">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <FileText className="h-4.5 w-4.5 text-amber-500" />
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-600">Selected Prompt Brief</h5>
          </div>
          <p className="text-xs font-semibold text-slate-600 leading-relaxed">
            {selectedPrompt.context}
          </p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[10px] text-slate-600 leading-normal">
            <span className="font-bold text-amber-800">Mains Core Guidance:</span> Ensure clear paragraphs, proper structure (Intro, Core Body argument with facts, constructive Conclusion), and cite specific reports or Constitution Articles.
          </div>
        </div>
      </div>

      {/* Main Column: Answer text field & evaluation */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-slate-200 text-slate-850 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600">Mains Answer Submission Box</span>
              <h3 className="text-base font-extrabold text-slate-900">{selectedPrompt.title}</h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-mono">Word Count Limit</span>
              <p className="font-extrabold text-xs">
                <span className={wordCount > selectedPrompt.wordCountTarget ? 'text-amber-600' : 'text-slate-800'}>
                  {wordCount}
                </span> / {selectedPrompt.wordCountTarget} words
              </p>
            </div>
          </div>

          {/* Premium Info / Limit Notification banner */}
          {!isPremium && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-center justify-between gap-4 text-xs font-semibold text-slate-800 animate-fadeIn mb-1">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-500 animate-bounce shrink-0" />
                <span>Free Daily Limit: <strong className="text-amber-700">{evalCount} / 1</strong> evaluation used.</span>
              </div>
              <button
                onClick={onPremiumClick}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1 rounded-lg text-[10px] font-black shadow-sm transition-all cursor-pointer"
              >
                Go Unlimited 💎
              </button>
            </div>
          )}

          <textarea
            id="essay-textarea"
            disabled={loading}
            value={essayText}
            onChange={(e) => setEssayText(e.target.value)}
            placeholder="Structure your UPSC/TNPSC mains answer here... Begin with a clean introduction, outline your main points, list specific Indian Constitution articles or factual benchmarks, and conclude with a practical administrative way-forward."
            className="w-full h-72 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs md:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors placeholder:text-slate-400 font-mono leading-relaxed"
          />

          <div className="flex justify-between items-center" id="evaluate-actions">
            <p className="text-[10px] text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Real-time word assessment active
            </p>
            
            <button
              id="btn-evaluate-essay"
              disabled={loading || !essayText.trim()}
              onClick={handleEvaluateEssay}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-extrabold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 shadow shadow-amber-500/10 active:scale-98 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Analyzing Mains Answer...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Request AI Grading & Feedback
                </>
              )}
            </button>
          </div>
        </div>

        {/* Evaluation results */}
        {evaluation && (
          <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl p-6 shadow-sm space-y-6 animate-fadeIn" id="evaluation-results-panel">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600">Analysis Concluded</span>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Award className="h-5 w-5 text-amber-500" />
                  Mains Evaluator Grade Sheet
                </h3>
              </div>

              {/* Total Score Circle Badge */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Composite Score</span>
                <span className="text-2xl font-black text-amber-600 font-mono">{evaluation.score} <span className="text-xs text-slate-400 font-normal">/ 100</span></span>
              </div>
            </div>

            {/* High Level feedback */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">General Review Summary:</span>
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                {evaluation.overallFeedback}
              </p>
            </div>

            {/* Criteria Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="criteria-grid">
              <div className="bg-slate-50/55 border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">1. Architectural Cohesion & Intro</span>
                  <span className="text-xs font-mono font-bold text-amber-700">{evaluation.structureRating} / 10</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{evaluation.structuralFeedback}</p>
              </div>

              <div className="bg-slate-50/55 border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">2. Critical Arguments & Citations</span>
                  <span className="text-xs font-mono font-bold text-amber-700">{evaluation.argumentRating} / 10</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{evaluation.argumentFeedback}</p>
              </div>

              <div className="bg-slate-50/55 border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">3. Vocabulary, Flow & Register</span>
                  <span className="text-xs font-mono font-bold text-amber-700">{evaluation.languageRating} / 10</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{evaluation.languageFeedback}</p>
              </div>

              <div className="bg-slate-50/55 border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">4. Factual / Constitutional Rigor</span>
                  <span className="text-xs font-mono font-bold text-amber-700">{evaluation.factAccuracyRating} / 10</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{evaluation.factFeedback}</p>
              </div>
            </div>

            {/* Model Outline points */}
            {evaluation.modelAnswerOutline && evaluation.modelAnswerOutline.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-100" id="ideal-outline-section">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Ideal Model Answer Outline:</span>
                <div className="space-y-2">
                  {evaluation.modelAnswerOutline.map((point, idx) => (
                    <div key={idx} className="flex gap-3 text-xs text-slate-700 leading-relaxed items-start">
                      <ChevronRight className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
