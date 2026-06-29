/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GKArticle } from '../types';
import { INITIAL_GK_FEED } from '../data';
import { Award, BookOpen, Clock, Globe, RefreshCw, ChevronRight, HelpCircle, FileText } from 'lucide-react';

interface GKFeedViewProps {
  onVoicePlay?: (text: string, title: string) => void;
}

export default function GKFeedView({ onVoicePlay }: GKFeedViewProps) {
  const [articles, setArticles] = useState<GKArticle[]>(INITIAL_GK_FEED);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [analysisText, setAnalysisText] = useState<string>('');
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);

  // Trigger server-side Gemini deep policy brief
  const triggerDeepAnalysis = async (article: GKArticle) => {
    setSelectedArticleId(article.id);
    setAnalysisText('');
    setLoadingAnalysis(true);

    try {
      const response = await fetch('/api/gk-deepdive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          category: article.category,
          content: article.content
        }),
      });

      const data = await response.json();
      if (data && data.analysis) {
        setAnalysisText(data.analysis);
      }
    } catch (error) {
      console.warn("Issue fetching policy analysis briefing:", error);
      setAnalysisText("An error occurred while compiling your policy briefing. Please verify your internet connection or try again.");
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const selectedArticle = articles.find(a => a.id === selectedArticleId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="gk-feed-view">
      {/* Current Affairs Articles Feed List */}
      <div className="lg:col-span-5 space-y-4" id="gk-articles-column">
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-500">Current Policy & GK Briefs</h3>
          <span className="text-[10px] text-emerald-600 font-mono font-bold flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Daily Update Cycle
          </span>
        </div>

        <div className="space-y-3" id="gk-articles-scroller">
          {articles.map((art) => {
            const isAnalyzing = selectedArticleId === art.id;
            return (
              <div
                key={art.id}
                id={`gk-article-card-${art.id}`}
                className={`bg-white border rounded-xl p-5 text-slate-800 transition-all duration-200 cursor-pointer shadow-sm ${
                  isAnalyzing 
                    ? 'border-amber-500 bg-amber-50/40 shadow' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
                onClick={() => {
                  if (selectedArticleId !== art.id) {
                    triggerDeepAnalysis(art);
                  }
                }}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-amber-600">{art.category}</span>
                    <span className="text-slate-400 font-mono">{art.date}</span>
                  </div>

                  <h4 className="font-extrabold text-sm md:text-base text-slate-900 hover:text-amber-600 transition-colors leading-snug">
                    {art.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {art.content}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Globe className="h-3.5 w-3.5" />
                      Syllabus Relevance
                    </span>
                    <span className="text-amber-600 flex items-center gap-1">
                      Deep AI Analysis
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep Policy Brief Panel */}
      <div className="lg:col-span-7" id="gk-analysis-column">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-850 h-full min-h-[450px] shadow-sm flex flex-col justify-between space-y-6">
          
          {!selectedArticleId ? (
            /* Idle state asking to select an article */
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8 space-y-4" id="gk-idle-panel">
              <div className="h-14 w-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                <FileText className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-slate-800">No Current Affair Selected</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  Click on any news story or current affairs update on the left. Our AI mentor will perform a multi-dimensional civil service examination analysis.
                </p>
              </div>
            </div>
          ) : (
            /* Active Analysis Viewer */
            <div className="flex-grow flex flex-col justify-between space-y-4" id="gk-active-analysis-panel">
              <div className="space-y-3">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600">
                      Mains & Prelims Integration Analysis
                    </span>
                    <h3 className="font-extrabold text-sm md:text-base text-slate-900 mt-1">
                      {selectedArticle?.title}
                    </h3>
                  </div>
                  {onVoicePlay && analysisText && !loadingAnalysis && (
                    <button
                      onClick={() => onVoicePlay(`Policy Brief for ${selectedArticle?.title}. Here is the complete analysis. ${analysisText.replace(/###/g, '').replace(/##/g, '').replace(/\*\*/g, '')}`, selectedArticle?.title || 'Current Affairs Brief')}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      🔊 Listen Brief
                    </button>
                  )}
                </div>

                {loadingAnalysis ? (
                  /* Loading Spinner */
                  <div className="py-16 text-center space-y-4 flex flex-col items-center justify-center">
                    <RefreshCw className="h-8 w-8 text-amber-500 animate-spin" />
                    <p className="text-xs text-slate-500 font-mono animate-pulse">
                      Synthesizing policy drafts, constitutional rulings and historical timelines...
                    </p>
                  </div>
                ) : (
                  /* Render Markdown/Text Analysis result */
                  <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1" id="analysis-content-area">
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs leading-relaxed text-slate-700 italic">
                      <span className="font-bold text-amber-700">Brief Summary:</span> {selectedArticle?.content}
                    </div>

                    {/* Render Formatted Policy Analysis */}
                    <div className="prose max-w-none text-xs md:text-sm text-slate-800 leading-relaxed font-sans space-y-4 whitespace-pre-wrap">
                      {analysisText}
                    </div>
                  </div>
                )}
              </div>

              {/* Way forward footer notice */}
              {!loadingAnalysis && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2.5 text-[11px] text-slate-800">
                  <Award className="h-4.5 w-4.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-700">Study Strategy Recommendation:</span> Save this brief summary into your revision files. Use the structured outlines as headings when drafting answers to similar Mains questions.
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
