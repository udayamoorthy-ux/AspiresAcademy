/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { EXAM_DETAILS } from '../data';
import { ExamType } from '../types';
import { 
  BookOpen, 
  Award, 
  Layers, 
  ShieldAlert, 
  CheckCircle, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  ArrowRight,
  BookMarked,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface SyllabusViewProps {
  selectedExam: ExamType;
  onSelectExam: (exam: ExamType) => void;
}

type TopicStatus = 'unattempted' | 'inprogress' | 'mastered';

export default function SyllabusView({ selectedExam, onSelectExam }: SyllabusViewProps) {
  const details = EXAM_DETAILS[selectedExam];

  // Load interactive state for each subject/topic index
  const [topicStates, setTopicStates] = useState<Record<string, TopicStatus>>(() => {
    const saved = localStorage.getItem('aspires_syllabus_tracker_v1');
    return saved ? JSON.parse(saved) : {};
  });

  // Persist state updates
  const handleStatusChange = (subjectIndex: number, status: TopicStatus) => {
    const key = `${selectedExam}-${subjectIndex}`;
    const updated = { ...topicStates, [key]: status };
    setTopicStates(updated);
    localStorage.setItem('aspires_syllabus_tracker_v1', JSON.stringify(updated));
  };

  // Compute metrics
  const totalTopics = details.syllabus.length;
  let masteredCount = 0;
  let inProgressCount = 0;
  let unattemptedCount = 0;

  details.syllabus.forEach((_, idx) => {
    const key = `${selectedExam}-${idx}`;
    const status = topicStates[key] || 'unattempted';
    if (status === 'mastered') masteredCount++;
    else if (status === 'inprogress') inProgressCount++;
    else unattemptedCount++;
  });

  const masteredPct = Math.round((masteredCount / totalTopics) * 100);
  const inProgressPct = Math.round((inProgressCount / totalTopics) * 100);
  const unattemptedPct = 100 - masteredPct - inProgressPct;

  // Identify learning "Gaps"
  const gaps = details.syllabus.filter((_, idx) => {
    const key = `${selectedExam}-${idx}`;
    const status = topicStates[key] || 'unattempted';
    return status !== 'mastered';
  });

  return (
    <div className="bg-white text-slate-800 rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-8" id="syllabus-view-container">
      
      {/* Header Tabs */}
      <div className="flex flex-wrap gap-2.5 border-b border-slate-100 pb-5" id="exam-selector-tabs">
        {(Object.keys(EXAM_DETAILS) as ExamType[]).map((examKey) => {
          const isActive = selectedExam === examKey;
          return (
            <button
              key={examKey}
              id={`exam-tab-${examKey}`}
              onClick={() => onSelectExam(examKey)}
              className={`px-5 py-3 rounded-xl text-sm md:text-base font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/15'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {EXAM_DETAILS[examKey].shortName}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Details, Interactive checklist & Gap Analysis */}
      <div className="space-y-6" id="exam-main-content">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" id="exam-title-section">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-emerald-600">Syllabus Framework</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1 font-display leading-tight" id="exam-full-title">
              {details.title}
            </h2>
          </div>
          <div className="flex items-center gap-2.5 bg-emerald-50/50 px-4 py-2.5 rounded-xl border border-emerald-100 self-start md:self-auto" id="exam-badge">
            <Award className="h-5.5 w-5.5 text-emerald-600" />
            <span className="text-sm font-bold text-slate-800">Dynamic Progress Synced</span>
          </div>
        </div>

        {/* Dynamic Progress Analytics Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6" id="syllabus-progress-tracker">
          
          {/* Progress bar info */}
          <div className="md:col-span-8 space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 font-display">
              <TrendingUp className="h-4.5 w-4.5 text-emerald-600" />
              Syllabus Tracking Progress Bar
            </h3>
            
            {/* Visual stacked horizontal bar */}
            <div className="h-4.5 w-full rounded-full bg-slate-200 overflow-hidden flex shadow-inner">
              <div 
                style={{ width: `${masteredPct}%` }} 
                className="bg-emerald-500 transition-all duration-500 h-full" 
                title={`Mastered: ${masteredPct}%`}
              />
              <div 
                style={{ width: `${inProgressPct}%` }} 
                className="bg-amber-400 transition-all duration-500 h-full" 
                title={`In Progress: ${inProgressPct}%`}
              />
            </div>

            {/* Label indicators */}
            <div className="flex flex-wrap gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-slate-800">
                <span className="h-3 w-3 bg-emerald-500 rounded-full" />
                <span>Mastered ({masteredPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-800">
                <span className="h-3 w-3 bg-amber-400 rounded-full" />
                <span>In Progress ({inProgressPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-800">
                <span className="h-3 w-3 bg-slate-200 rounded-full" />
                <span>Unattempted ({unattemptedPct}%)</span>
              </div>
            </div>
          </div>

          {/* Quick numbers overview */}
          <div className="md:col-span-4 bg-white border border-slate-150 p-4 rounded-2xl flex flex-col justify-center text-center shadow-sm">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 font-mono">Total Course Focus Chapters</span>
            <p className="text-3xl font-black text-slate-900 font-mono mt-1">
              {masteredCount} <span className="text-xs text-slate-400">/ {totalTopics} Mastered</span>
            </p>
          </div>

        </div>

        {/* Exam Stages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="exam-stages-grid">
          {details.stages.map((stage, idx) => (
            <div
              key={idx}
              id={`stage-card-${idx}`}
              className="bg-slate-50/70 border border-slate-150 p-5 rounded-xl space-y-2 hover:border-emerald-200 hover:bg-white transition-all duration-200 shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 text-xs font-black border border-emerald-600/20">
                  {idx + 1}
                </span>
                <h4 className="font-extrabold text-slate-950 text-sm font-display">{stage.name}</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">{stage.details}</p>
            </div>
          ))}
        </div>

        {/* ---------------------------------------------------- */}
        {/* INTERACTIVE TRACKING SYLLABUS LIST & GAP ANALYSIS */}
        {/* ---------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="interactive-syllabus-section">
          
          {/* Left Area: Syllabus Interactive Focus List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-black text-slate-950 font-display">Interactive Coverage List</h3>
            </div>

            <div className="grid grid-cols-1 gap-3.5" id="syllabus-list">
              {details.syllabus.map((topic, idx) => {
                const key = `${selectedExam}-${idx}`;
                const activeStatus = topicStates[key] || 'unattempted';

                return (
                  <div
                    key={idx}
                    id={`syllabus-topic-${idx}`}
                    className="group bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-200 transition-all duration-200 shadow-sm"
                  >
                    <div className="flex gap-3 text-left">
                      <div className="flex-shrink-0 mt-0.5">
                        <Layers className="h-5 w-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-extrabold text-slate-950 text-sm font-display">
                          {topic.subject}
                        </h5>
                        <p className="text-[11.5px] text-slate-500 leading-relaxed font-sans">
                          {topic.description}
                        </p>
                      </div>
                    </div>

                    {/* Interactive Toggles */}
                    <div className="flex gap-1 shrink-0 self-end sm:self-center" id={`status-toggle-${idx}`}>
                      {[
                        { id: 'unattempted', label: '⚪ Left' },
                        { id: 'inprogress', label: '🟡 Study' },
                        { id: 'mastered', label: '🟢 Okay' }
                      ].map((item) => {
                        const isSel = activeStatus === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleStatusChange(idx, item.id as any)}
                            className={`px-2.5 py-1.5 rounded-lg text-[10.5px] font-extrabold transition-all border cursor-pointer ${
                              isSel
                                ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Area: Gap Analysis Predictor panel */}
          <div className="lg:col-span-5 space-y-6" id="gap-analysis-sidebar">
            <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-md border border-slate-800 space-y-4">
              
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Activity className="h-5 w-5 text-emerald-400 animate-pulse" />
                <h4 className="font-extrabold text-sm font-display">Syllabus Gap Analysis</h4>
              </div>

              {gaps.length === 0 ? (
                <div className="text-center py-6 space-y-2">
                  <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto" />
                  <p className="font-extrabold text-sm">Perfect Coverage Achieved!</p>
                  <p className="text-xs text-slate-400">All topics are marked as Mastered. Go attempt a Mock Practice Test to solidify confidence.</p>
                </div>
              ) : (
                <div className="space-y-4 text-xs" id="gap-recommender">
                  <p className="text-slate-400 leading-relaxed font-sans text-[11px]">
                    Our analysis identified <strong>{gaps.length} gaps</strong> in your active preparation. Below are high-yield recommendations to patch these weak anchors immediately:
                  </p>

                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
                    {gaps.map((topic, i) => (
                      <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1 text-left">
                        <div className="flex justify-between items-center text-[10px] font-mono text-amber-400">
                          <span>Unresolved Area</span>
                          <span className="flex items-center gap-0.5 font-sans font-bold">⚠️ Gap</span>
                        </div>
                        <p className="font-extrabold text-xs text-white">{topic.subject}</p>
                        <p className="text-[10.5px] text-slate-400 font-sans leading-normal line-clamp-2">
                          {topic.description}
                        </p>
                        
                        {/* Action link simulator */}
                        <div className="flex items-center gap-1.5 text-[10.5px] text-emerald-400 font-bold mt-2 pt-2 border-t border-white/5">
                          <span>Recommended action: Attempt related Mock Test</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* General Guidelines */}
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-5 flex gap-3.5 text-xs text-slate-700" id="syllabus-warning">
              <ShieldAlert className="h-5.5 w-5.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1.5 leading-relaxed">
                <p className="font-bold text-emerald-900">Preparation Strategy Tip:</p>
                <p className="text-slate-655 font-sans text-[11px]">
                  UPSC requires a focus on analytical thinking, extensive answer writing, and current policy reviews. TNPSC heavily focuses on factual precision, General Tamil (Group II/IV core), Development Administration metrics, and regional Tamil Nadu history. Toggle between exam tabs above to calibrate your study tools!
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
