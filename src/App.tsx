/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ExamType } from './types';
import SyllabusView from './components/SyllabusView';
import PlannerView from './components/PlannerView';
import QuizView from './components/QuizView';
import EssayEvaluatorView from './components/EssayEvaluatorView';
import GKFeedView from './components/GKFeedView';
import MentorChatView from './components/MentorChatView';
import MaterialsLibraryView from './components/MaterialsLibraryView';
import FlashNewsDesk from './components/FlashNewsDesk';
import NotesGeneratorView from './components/NotesGeneratorView';
import PerformanceAnalyticsView from './components/PerformanceAnalyticsView';
import AIVoiceTeacher from './components/AIVoiceTeacher';
import GPaySupportCard from './components/GPaySupportCard';

import { 
  BookOpen, 
  Calendar, 
  Award, 
  Sparkles, 
  MessageSquare, 
  Compass, 
  UserCheck, 
  Layers, 
  GraduationCap, 
  Globe,
  ShieldCheck,
  Bell,
  ArrowRight,
  BrainCircuit,
  TrendingUp
} from 'lucide-react';

const TICKER_HEADLINES: Record<ExamType, string[]> = {
  UPSC: [
    'Civil Services IAS 2026/2027 Prelims scheduled for May 24, 2027. Applications open soon via upsc.gov.in OTR portal.',
    'UPSC CSE 2025: Detailed Application Form-I (DAF-I) is active for Mains qualified candidates. Submit before July 15, 2026.',
    'Press Notification: Cutoff marks and final Reserve List for Civil Services Examination 2024 published.'
  ],
  TNPSC_G1: [
    'TNPSC Group I 2026 Prelims: Tentative Answer Keys published. Object via official web portal until July 04.',
    'Notice No 05/2026: Descriptive Mains Written Exam dates rescheduled for October 10 onwards at Chennai Center.'
  ],
  TNPSC_G2: [
    'TNPSC CCSE-II Group 2 & IIA Preliminary Results published. Selected candidates admitted to Mains list online.',
    'Guidance Alert: Sample answer format sheet and Tamil Compulsory Eligibility guidelines updated on tnpsc.gov.in.'
  ],
  TNPSC_G4: [
    'TNPSC Group IV Combined Civil Services 2026 notification released. Online Registration open for 6,244 vacancies.',
    'Typist & Steno-Typist Technical Certificate validation cycle starts. Verify credentials under local quota preference.'
  ]
};

export default function App() {
  const [selectedExam, setSelectedExam] = useState<ExamType>('UPSC');
  const [activeTab, setActiveTab] = useState<'syllabus' | 'planner' | 'quiz' | 'essay' | 'gk' | 'mentor' | 'materials' | 'notifications' | 'notes' | 'analytics'>('syllabus');
  const [tickerIndex, setTickerIndex] = useState(0);
  const [voiceText, setVoiceText] = useState('');
  const [voiceTitle, setVoiceTitle] = useState('');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  useEffect(() => {
    setTickerIndex(0);
  }, [selectedExam]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % (TICKER_HEADLINES[selectedExam]?.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedExam]);

  const handleVoicePlay = (text: string, title: string) => {
    setVoiceText(text);
    setVoiceTitle(title);
  };

  const tabDetails = [
    { id: 'syllabus', label: 'Syllabus & Stages', icon: Compass, component: SyllabusView },
    { id: 'notifications', label: 'Govt Notification Desk', icon: Bell, component: FlashNewsDesk },
    { id: 'materials', label: 'Official References', icon: ShieldCheck, component: MaterialsLibraryView },
    { id: 'planner', label: 'AI Study Planner', icon: Calendar, component: PlannerView },
    { id: 'quiz', label: 'Practice Mock Tests', icon: Award, component: QuizView },
    { id: 'essay', label: 'Mains Essay Evaluator', icon: GraduationCap, component: EssayEvaluatorView },
    { id: 'gk', label: 'Current Affairs Deep Dive', icon: Globe, component: GKFeedView },
    { id: 'notes', label: 'AI Notes Generator', icon: BrainCircuit, component: NotesGeneratorView },
    { id: 'analytics', label: 'Performance Analytics', icon: TrendingUp, component: PerformanceAnalyticsView },
    { id: 'mentor', label: 'Personal AI Coach', icon: MessageSquare, component: MentorChatView },
  ] as const;

  const handleSelectExam = (exam: ExamType) => {
    setSelectedExam(exam);
  };

  const ActiveComponent = tabDetails.find(tab => tab.id === activeTab)?.component || SyllabusView;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-amber-400 selection:text-slate-900" id="portal-app-root">
      {/* Top Navigation Banner */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 px-6 py-4 shadow-sm" id="portal-header">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Headline */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-amber-500/20">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                Aspires Academy
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-700 font-mono">
                  AI-Powered
                </span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium font-sans">tnpsc,upsc aspirants • Professional Study Blueprint & AI Evaluation</p>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500" id="header-quick-info">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Syllabus Mapped 2026
            </span>
            <span className="h-4 w-px bg-slate-200" />
            <span className="text-slate-700">Exam Mode: <strong className="text-amber-600">{selectedExam}</strong></span>
          </div>

        </div>
      </header>

      {/* Live Government Notification Ticker */}
      <div className="max-w-7xl mx-auto px-6 mt-6" id="live-announcement-ticker-container">
        <div 
          onClick={() => setActiveTab('notifications')}
          className="bg-amber-50 hover:bg-amber-100/80 border border-amber-500/30 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 cursor-pointer group transition-all shadow-sm"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="flex-shrink-0 flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-[10px] font-mono font-bold text-red-600 px-2.5 py-1 rounded-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
              GOVT PORTAL LIVE
            </span>
            <div className="text-xs text-slate-800 font-medium truncate font-sans">
              {TICKER_HEADLINES[selectedExam]?.[tickerIndex]}
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-1 text-[10px] font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform">
            <span>View Board Desk</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8" id="portal-main-stage">
        
        {/* Exam Quick Select & Pitch Banner */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm" id="exam-pitch-banner">
          <div className="space-y-1 max-w-xl">
            <h2 className="text-lg md:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Configure Your Civil Services Focus
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Toggle your goal exam below. Our study planner, MCQs diagnostic quizzes, descriptive answer evaluations, and AI personal assistant chatbot will automatically realign to the selected board syllabus.
            </p>
          </div>

          {/* Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto" id="exam-selector-buttons">
            {[
              { id: 'UPSC', label: 'UPSC IAS/IPS' },
              { id: 'TNPSC_G1', label: 'TNPSC Group 1' },
              { id: 'TNPSC_G2', label: 'TNPSC Group 2' },
              { id: 'TNPSC_G4', label: 'TNPSC Group 4' }
            ].map((examItem) => {
              const isActive = selectedExam === examItem.id;
              return (
                <button
                  key={examItem.id}
                  id={`btn-select-exam-${examItem.id}`}
                  onClick={() => handleSelectExam(examItem.id as ExamType)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                      : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {examItem.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Navigation Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="dashboard-main-grid">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-4" id="navigation-sidebar-column">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-1 font-mono">Study Modules</span>
            
            <nav className="flex flex-col gap-1.5" id="navigation-menu">
              {tabDetails.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    id={`nav-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left p-4 rounded-xl text-xs md:text-sm font-bold flex items-center gap-3 transition-all border ${
                      isActive
                        ? 'bg-amber-50 border-amber-300 text-amber-800 font-extrabold shadow-sm'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-amber-600' : 'text-slate-500'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Support Information Box */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl space-y-3 shadow-sm" id="info-card">
              <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-amber-600" />
                Strategic Preparation
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Maximize score efficiency by pairing your AI planner schedule with descriptive evaluation tasks and mock diagnostic quizzes. Keep in touch with the Personal AI Coach to draft specific revision outlines.
              </p>
            </div>
          </div>

          {/* Active Work Area Panel */}
          <div className="lg:col-span-9" id="active-work-area">
            {React.createElement(ActiveComponent as any, {
              selectedExam,
              onSelectExam: handleSelectExam,
              onVoicePlay: handleVoicePlay
            })}
          </div>

        </div>

      </main>

      {/* Aesthetic Slate Footer */}
      <footer className="border-t border-slate-200 bg-white text-center py-8 text-xs text-slate-500 space-y-4 mt-16 shadow-inner" id="portal-footer">
        <p className="font-mono text-slate-700 font-bold text-sm">Aspires Academy</p>
        <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest font-mono">tnpsc,upsc aspirants • Mapped to official civil service syllabi</p>
        
        {/* Support Us trigger button in the footer */}
        <div className="flex justify-center items-center py-2" id="footer-gpay-support-group">
          <button
            onClick={() => {
              setIsSupportModalOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-amber-100/60 hover:from-amber-100 hover:to-amber-200/80 border border-amber-300 px-4 py-2 rounded-2xl transition-all shadow-sm cursor-pointer group active:scale-95"
            id="footer-support-gpay-trigger"
          >
            <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider font-mono">Contribute via</span>
            <span className="text-xs font-black tracking-tight flex items-center">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">P</span>
              <span className="text-[#FBBC05]">a</span>
              <span className="text-[#34A853]">y</span>
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="text-xs font-extrabold text-slate-800 tracking-tight group-hover:text-amber-950">Support Us</span>
          </button>
        </div>

        <p className="text-[10.5px] text-slate-400 max-w-4xl mx-auto px-6 leading-relaxed">
          <strong>Disclaimer:</strong> Aspires Academy is an independent educational portal. We are not affiliated, associated, authorized, or in any way officially connected with the Union Public Service Commission (UPSC), Tamil Nadu Public Service Commission (TNPSC), or any other government agency. Official notifications can be verified at upsc.gov.in and tnpsc.gov.in.
        </p>
        <p className="text-[9px] text-slate-400 font-mono">All student schedules, checked off tasks, and custom parameters are securely preserved within local standard cache engines.</p>
      </footer>

      {/* Floating global AI Voice Teacher panel */}
      <AIVoiceTeacher 
        currentText={voiceText} 
        currentTitle={voiceTitle} 
        onClearText={() => {
          setVoiceText('');
          setVoiceTitle('');
        }} 
      />

      {/* GPay Support Modal popup Window */}
      <GPaySupportCard 
        isOpen={isSupportModalOpen} 
        onClose={() => setIsSupportModalOpen(false)} 
        onVoicePlay={handleVoicePlay} 
      />
    </div>
  );
}
