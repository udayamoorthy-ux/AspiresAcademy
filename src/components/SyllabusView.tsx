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
    <div className="bg-white text-slate-800 rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-8" id="syllabus-view-container">
      {/* Header Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4" id="exam-selector-tabs">
        {(Object.keys(EXAM_DETAILS) as ExamType[]).map((examKey) => {
          const isActive = selectedExam === examKey;
          return (
            <button
              key={examKey}
              id={`exam-tab-${examKey}`}
              onClick={() => onSelectExam(examKey)}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
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
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Selected Syllabus</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1" id="exam-full-title">
              {details.title}
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 self-start md:self-auto" id="exam-badge">
            <Award className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-semibold text-slate-700">Official Exam Framework</span>
          </div>
        </div>

        {/* Exam Stages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="exam-stages-grid">
          {details.stages.map((stage, idx) => (
            <div
              key={idx}
              id={`stage-card-${idx}`}
              className="bg-slate-50/55 border border-slate-100 p-5 rounded-xl space-y-2 hover:border-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-amber-700 text-xs font-bold border border-amber-500/20">
                  {idx + 1}
                </span>
                <h4 className="font-extrabold text-slate-800 text-sm md:text-base">{stage.name}</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">{stage.details}</p>
            </div>
          ))}
        </div>

        {/* Syllabus Topics Section */}
        <div className="space-y-4" id="syllabus-topics-section">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <BookOpen className="h-5 w-5 text-amber-600" />
            <h3 className="text-lg font-extrabold text-slate-900">Key Syllabus Focus Areas</h3>
          </div>

          <div className="grid grid-cols-1 gap-3" id="syllabus-list">
            {details.syllabus.map((topic, idx) => (
              <div
                key={idx}
                id={`syllabus-topic-${idx}`}
                className="group relative bg-white border border-slate-200/60 rounded-xl p-4 flex gap-4 hover:bg-slate-50 transition-all duration-200"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Layers className="h-5 w-5 text-slate-400 group-hover:text-amber-600 transition-colors" />
                </div>
                <div className="space-y-1">
                  <h5 className="font-extrabold text-slate-800 group-hover:text-slate-950 text-sm md:text-base transition-colors">
                    {topic.subject}
                  </h5>
                  <p className="text-xs text-slate-600 group-hover:text-slate-800 transition-colors leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General Guidelines */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 text-sm text-slate-700" id="syllabus-warning">
          <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <p className="font-bold text-amber-800">Preparation Strategy Tip:</p>
            <p className="text-xs text-slate-600">
              UPSC requires a focus on analytical thinking, extensive answer writing, and current policy reviews. TNPSC heavily focuses on factual precision, General Tamil (Group II/IV core), Development Administration metrics, and regional Tamil Nadu history. Toggle between exam tabs above to calibrate your study tools!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
