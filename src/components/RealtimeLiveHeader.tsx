/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Crown, 
  Sparkles, 
  Flame, 
  Radio, 
  Wifi, 
  WifiOff, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  Smartphone,
  Layers,
  Award,
  Search,
  CheckCircle2,
  X,
  Building2,
  Train,
  Stethoscope,
  Globe2,
  ShieldCheck,
  Check,
  Download,
  DollarSign
} from 'lucide-react';
import { ExamType } from '../types';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { isOwnerEmail } from '../utils/authUtils';

export interface ExamCategoryGroup {
  id: string;
  categoryName: string;
  categoryIcon: string;
  categoryTag: string;
  exams: {
    id: ExamType;
    name: string;
    targetPosts: string;
    badge: string;
    level: string;
  }[];
}

export const EXAM_CATEGORY_GROUPS: ExamCategoryGroup[] = [
  {
    id: 'civil-services',
    categoryName: 'Civil Services (State & Union)',
    categoryIcon: '🏛️',
    categoryTag: 'Administrative, Police & Executive Cadres',
    exams: [
      {
        id: 'TNPSC_G1',
        name: 'TNPSC Group 1 (CCSE-I)',
        targetPosts: 'Deputy Collector, DSP, Commercial Tax Officer, District Registrar',
        badge: 'Top State Rank',
        level: 'Degree Level'
      },
      {
        id: 'TNPSC_G2',
        name: 'TNPSC Group 2 & 2A (CCSE-II)',
        targetPosts: 'Sub-Registrar, Municipal Commissioner, Revenue Assistant',
        badge: 'Executive & Non-Exec',
        level: 'Graduate'
      },
      {
        id: 'TNPSC_G4',
        name: 'TNPSC Group 4 & VAO (CCSE-IV)',
        targetPosts: 'Village Administrative Officer (VAO), Junior Assistant, Typist',
        badge: 'State-wide Mega Exam',
        level: 'SSLC / 10th Standard'
      },
      {
        id: 'UPSC',
        name: 'UPSC Civil Services (CSE)',
        targetPosts: 'IAS, IPS, IFS, IRS - Prelims & Mains General Studies (GS 1-4)',
        badge: 'All India Services',
        level: 'National Cadre'
      }
    ]
  },
  {
    id: 'ssc-railways',
    categoryName: 'Staff Selection & Central Railways',
    categoryIcon: '🚆',
    categoryTag: 'Central Government Ministries & Indian Railways Recruitment',
    exams: [
      {
        id: 'SSC_CGL',
        name: 'SSC CGL (Tier 1 & Tier 2)',
        targetPosts: 'Income Tax Inspector, Central Excise, CBI Inspector, ASO, Auditor',
        badge: 'Combined Graduate',
        level: 'All India Staff'
      },
      {
        id: 'RRB_NTPC',
        name: 'RRB NTPC & Group D (Railways)',
        targetPosts: 'Station Master, Goods Guard, Commercial Apprentice, Traffic Assistant',
        badge: 'Indian Railways',
        level: 'Railway Recruitment'
      }
    ]
  },
  {
    id: 'medical-engineering',
    categoryName: 'Medical & Engineering National Entrances',
    categoryIcon: '🔬',
    categoryTag: 'Premier National University & Professional College Admissions',
    exams: [
      {
        id: 'NEET',
        name: 'NEET UG (Medical Entrance)',
        targetPosts: 'MBBS, BDS, AYUSH & Veterinary Medical Admissions across India',
        badge: 'NTA Medical',
        level: 'Class 11 & 12 NCERT'
      },
      {
        id: 'IIT_JEE',
        name: 'IIT JEE (Main & Advanced)',
        targetPosts: 'IITs, NITs, IIITs Engineering & Technical Technology Programs',
        badge: 'Premier Engineering',
        level: 'Physics, Chem, Math'
      }
    ]
  },
  {
    id: 'language-abroad',
    categoryName: 'Global English & Study Abroad',
    categoryIcon: '🌐',
    categoryTag: 'International Education, Visa & Immigration Proficiency',
    exams: [
      {
        id: 'IELTS',
        name: 'IELTS Band 8+ Master',
        targetPosts: 'Academic & General Training (Reading, Listening, Writing, Speaking)',
        badge: 'IDP / British Council',
        level: 'Global Standard'
      }
    ]
  }
];

interface RealtimeLiveHeaderProps {
  selectedExam: ExamType;
  onExamChange: (exam: ExamType) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  socketStatus: 'connected' | 'connecting' | 'disconnected' | 'reconnecting';
  pingMs: number;
  activeCount: number;
  isPremium: boolean;
  onPremiumClick: () => void;
  onOpenLiveArena: () => void;
  unreadCount?: number;
  userEmail?: string;
  onAuthClick?: () => void;
  onOpenInstallations?: () => void;
  onOpenPaidAppAdmin?: () => void;
}

export const RealtimeLiveHeader: React.FC<RealtimeLiveHeaderProps> = ({
  selectedExam,
  onExamChange,
  activeTab,
  onTabChange,
  socketStatus,
  pingMs,
  activeCount,
  isPremium,
  onPremiumClick,
  onOpenLiveArena,
  unreadCount = 0,
  userEmail = '',
  onAuthClick,
  onOpenInstallations,
  onOpenPaidAppAdmin
}) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('ALL');

  const isUserOwner = isOwnerEmail(userEmail);

  // Find active exam details and its category
  let currentExamName = 'UPSC Civil Services';
  let currentCategoryName = 'Civil Services';
  let currentCategoryIcon = '🏛️';

  for (const group of EXAM_CATEGORY_GROUPS) {
    const found = group.exams.find((e) => e.id === selectedExam);
    if (found) {
      currentExamName = found.name;
      currentCategoryName = group.categoryName.split(' ')[0] + ' ' + (group.categoryName.split(' ')[1] || '');
      currentCategoryIcon = group.categoryIcon;
      break;
    }
  }

  const tabs = [
    { id: 'daily-mcqs', label: 'Daily Drills' },
    { id: 'practice-tests', label: 'Mock Tests & PYQs' },
    { id: 'live-arena', label: '🔥 Live Arena', highlight: true },
    { id: 'subject-quiz', label: 'Topic Drill Arena' },
    { id: 'notes', label: 'Smart Study Notes' },
    { id: 'planner', label: 'AI Study Planner' },
    { id: 'evaluator', label: 'Mains Evaluator' },
    { id: 'mentor', label: 'AI Mentor Chat' },
    { id: 'flashcards', label: 'Flashcards' }
  ];

  // Filtered categories for the selection modal
  const filteredGroups = EXAM_CATEGORY_GROUPS.map((group) => {
    if (selectedCategoryTab !== 'ALL' && group.id !== selectedCategoryTab) {
      return null;
    }

    const filteredExams = group.exams.filter((exam) => {
      if (!categorySearchQuery.trim()) return true;
      const q = categorySearchQuery.toLowerCase();
      return (
        exam.name.toLowerCase().includes(q) ||
        exam.targetPosts.toLowerCase().includes(q) ||
        exam.badge.toLowerCase().includes(q) ||
        exam.id.toLowerCase().includes(q)
      );
    });

    if (filteredExams.length === 0) return null;

    return {
      ...group,
      exams: filteredExams
    };
  }).filter(Boolean) as ExamCategoryGroup[];

  const handleSelectExamAndClose = (id: ExamType) => {
    onExamChange(id);
    setShowCategoryModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white select-none shadow-md">
        {/* Realtime Live Connectivity Top Bar */}
        <div className="bg-slate-950/90 border-b border-slate-800/80 px-4 py-1 text-[11px] font-mono flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {socketStatus === 'connected' ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>LIVE NETWORK</span>
              </span>
            ) : socketStatus === 'connecting' || socketStatus === 'reconnecting' ? (
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>SYNCING...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                <WifiOff className="h-3 w-3" />
                <span>OFFLINE (CACHED)</span>
              </span>
            )}

            <span className="text-slate-500 hidden sm:inline">&bull;</span>
            <span className="text-slate-400 hidden sm:inline">
              <strong className="text-white">{activeCount}</strong> active aspirants nationwide
            </span>
            <span className="text-slate-500 hidden md:inline">&bull;</span>
            <span className="text-slate-500 hidden md:inline">Latency: {pingMs}ms</span>
          </div>

          {/* Quick Triggers */}
          <div className="flex items-center gap-2">
            {isUserOwner && onOpenPaidAppAdmin && (
              <button
                onClick={onOpenPaidAppAdmin}
                className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-bold text-[10px] bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 rounded-full transition-all active:scale-95 cursor-pointer shadow-sm"
                title="Paid App Revenue, Pricing & License Keys Manager"
              >
                <DollarSign className="h-3 w-3 text-amber-400" />
                <span>💰 Paid App Hub</span>
              </button>
            )}

            {isUserOwner && onOpenInstallations && (
              <button
                onClick={onOpenInstallations}
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold text-[10px] bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full transition-all active:scale-95 cursor-pointer"
                title="View list of people who installed the app"
              >
                <Smartphone className="h-3 w-3" />
                <span>📱 App Installs Log</span>
              </button>
            )}

            <button
              onClick={onOpenLiveArena}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold text-[10px] bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full transition-all active:scale-95 cursor-pointer"
            >
              <Flame className="h-3 w-3 fill-amber-400" />
              <span>Live MCQ Battle &amp; Lounge</span>
            </button>
          </div>
        </div>

        {/* Main App Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-4">
          {/* Brand & Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 shrink-0">
              <GraduationCap className="h-6 w-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg tracking-tight text-white font-sans">
                  ASPIRES
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/30">
                  PORTAL
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
                All India Competitive Examination Portal
              </p>
            </div>
          </div>

          {/* Categorized Exam Target Selector Trigger Button */}
          <div className="flex-1 max-w-xs sm:max-w-md">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="w-full flex items-center justify-between gap-2 bg-gradient-to-r from-slate-800 to-slate-850 hover:from-slate-750 hover:to-slate-800 border border-slate-700 hover:border-amber-500/60 rounded-2xl px-3 sm:px-4 py-1.5 text-xs font-bold transition-all active:scale-[0.99] cursor-pointer shadow-md group text-left"
              title="Click to change Exam Target & Category"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base shrink-0">{currentCategoryIcon}</span>
                <div className="min-w-0">
                  <div className="text-[9px] uppercase tracking-wider text-amber-400 font-mono font-black truncate">
                    Category: {currentCategoryName}
                  </div>
                  <div className="text-white font-extrabold text-xs sm:text-sm truncate">
                    {currentExamName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 text-slate-400 group-hover:text-amber-400 transition-colors">
                <span className="text-[10px] hidden md:inline font-mono">Change</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </button>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {onAuthClick && (
              userEmail ? (
                <button 
                  onClick={onAuthClick}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all active:scale-95 shadow-sm"
                  title={userEmail}
                >
                  <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                    {userEmail.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-200 truncate max-w-[80px] hidden sm:inline">
                    {userEmail.split('@')[0]}
                  </span>
                </button>
              ) : (
                <button 
                  onClick={onAuthClick}
                  className="border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold text-xs px-2.5 py-1.5 rounded-xl transition-all active:scale-95 cursor-pointer"
                >
                  Login
                </button>
              )
            )}

            <PWAInstallPrompt variant="button" />

            {/* Pro Membership Status / Upgrade CTA */}
            <button
              onClick={onPremiumClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer ${
                isPremium
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 text-slate-950 hover:brightness-105 shadow-amber-500/30'
              }`}
            >
              <Crown className="h-3.5 w-3.5 text-slate-950 fill-slate-950" />
              <span>{isPremium ? 'PRO ACTIVE' : '⚡ ANNUAL PASS ₹350'}</span>
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Native App Navigation Tabs */}
        <div className="bg-slate-900/90 border-t border-slate-800 px-4 sm:px-6 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center gap-2 py-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : tab.highlight
                      ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 font-extrabold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* CATEGORIZED EXAM SELECTOR MODAL (High-Clarity Target Dialog) */}
      {showCategoryModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setShowCategoryModal(false)}
        >
          <div 
            className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-850/80 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  <h3 className="text-lg font-black text-white font-display">
                    Select Your Examination Category
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose your targeted competitive exam to automatically load the official syllabus, authentic PYQs, and daily drills
                </p>
              </div>

              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-750 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Input & Category Filter Tabs */}
            <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 space-y-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                  placeholder="Search exam (e.g. TNPSC Group 1, UPSC, NEET, SSC CGL, RRB)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-850 border border-slate-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                <button
                  onClick={() => setSelectedCategoryTab('ALL')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategoryTab === 'ALL'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  All Categories (9)
                </button>

                {EXAM_CATEGORY_GROUPS.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryTab(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectedCategoryTab === cat.id
                        ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{cat.categoryIcon}</span>
                    <span>{cat.categoryName.split(' ')[0]} {cat.categoryName.split(' ')[1]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Categorized Exam Cards Stream */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <div key={group.id} className="space-y-3">
                    {/* Category Header */}
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                      <span className="text-xl">{group.categoryIcon}</span>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">
                          {group.categoryName}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-sans">
                          {group.categoryTag}
                        </p>
                      </div>
                    </div>

                    {/* Examination Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {group.exams.map((exam) => {
                        const isSelected = selectedExam === exam.id;
                        return (
                          <div
                            key={exam.id}
                            onClick={() => handleSelectExamAndClose(exam.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between gap-2.5 relative group ${
                              isSelected
                                ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                                : 'border-slate-800 bg-slate-850 hover:border-slate-700 hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full font-mono bg-slate-800 text-amber-400 border border-slate-700">
                                  {exam.badge}
                                </span>
                                <h5 className="font-extrabold text-sm text-white mt-1 group-hover:text-amber-300 transition-colors">
                                  {exam.name}
                                </h5>
                              </div>

                              {isSelected && (
                                <div className="h-6 w-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                                  <Check className="h-4 w-4 stroke-[3]" />
                                </div>
                              )}
                            </div>

                            <p className="text-xs text-slate-400 leading-relaxed font-sans">
                              {exam.targetPosts}
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                              <span className="font-mono">Level: {exam.level}</span>
                              <span className="text-amber-400 font-bold group-hover:underline">
                                {isSelected ? 'Active Target ✓' : 'Select Exam →'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Search className="h-8 w-8 text-slate-600 mx-auto" />
                  <p className="text-sm">No examinations match "{categorySearchQuery}"</p>
                  <button
                    onClick={() => {
                      setCategorySearchQuery('');
                      setSelectedCategoryTab('ALL');
                    }}
                    className="text-xs text-amber-400 font-bold hover:underline"
                  >
                    Clear search and show all exams
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>
                Currently active: <strong className="text-white">{currentExamName}</strong>
              </span>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
