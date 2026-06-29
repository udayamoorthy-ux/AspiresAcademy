/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EXAM_DETAILS } from '../data';
import { ExamType } from '../types';
import { BookOpen, Award, Layers, ShieldAlert } from 'lucide-react';

interface SyllabusViewProps {
  selectedExam: ExamType;
  onSelectExam: (exam: ExamType) => void;
}

export default function SyllabusView({ selectedExam, onSelectExam }: SyllabusViewProps) {
  const details = EXAM_DETAILS[selectedExam];

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
              className={`px-5 py-3 rounded-xl text-sm md:text-base font-bold transition-all duration-200 ${
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

      {/* Main Details */}
      <div className="space-y-6" id="exam-main-content">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" id="exam-title-section">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-emerald-600">Selected Syllabus</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-1 font-display leading-tight" id="exam-full-title">
              {details.title}
            </h2>
          </div>
          <div className="flex items-center gap-2.5 bg-emerald-50/50 px-4 py-2.5 rounded-xl border border-emerald-100 self-start md:self-auto" id="exam-badge">
            <Award className="h-5.5 w-5.5 text-emerald-600" />
            <span className="text-sm md:text-base font-bold text-slate-800">Official Exam Framework</span>
          </div>
        </div>

        {/* Exam Stages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="exam-stages-grid">
          {details.stages.map((stage, idx) => (
            <div
              key={idx}
              id={`stage-card-${idx}`}
              className="bg-slate-50/70 border border-slate-150 p-6 rounded-xl space-y-2.5 hover:border-emerald-200 hover:bg-white transition-all duration-200 shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 text-xs md:text-sm font-bold border border-emerald-600/20">
                  {idx + 1}
                </span>
                <h4 className="font-extrabold text-slate-950 text-base md:text-lg font-display">{stage.name}</h4>
              </div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans">{stage.details}</p>
            </div>
          ))}
        </div>

        {/* Syllabus Topics Section */}
        <div className="space-y-4" id="syllabus-topics-section">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <BookOpen className="h-6 w-6 text-emerald-600" />
            <h3 className="text-lg md:text-xl font-bold text-slate-950 font-display">Key Syllabus Focus Areas</h3>
          </div>

          <div className="grid grid-cols-1 gap-4.5" id="syllabus-list">
            {details.syllabus.map((topic, idx) => (
              <div
                key={idx}
                id={`syllabus-topic-${idx}`}
                className="group relative bg-white border border-slate-200 rounded-xl p-5 flex gap-4.5 hover:bg-slate-50 hover:border-emerald-200 transition-all duration-200"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Layers className="h-5.5 w-5.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <h5 className="font-bold text-slate-950 group-hover:text-emerald-900 text-base md:text-lg transition-colors font-display">
                    {topic.subject}
                  </h5>
                  <p className="text-xs md:text-sm text-slate-600 group-hover:text-slate-800 transition-colors leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General Guidelines */}
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-5 flex gap-3.5 text-sm md:text-base text-slate-700" id="syllabus-warning">
          <ShieldAlert className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5 leading-relaxed">
            <p className="font-bold text-emerald-900 text-sm md:text-base">Preparation Strategy Tip:</p>
            <p className="text-xs md:text-sm text-slate-655 font-sans">
              UPSC requires a focus on analytical thinking, extensive answer writing, and current policy reviews. TNPSC heavily focuses on factual precision, General Tamil (Group II/IV core), Development Administration metrics, and regional Tamil Nadu history. Toggle between exam tabs above to calibrate your study tools!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
