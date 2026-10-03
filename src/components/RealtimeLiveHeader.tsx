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
  Award
} from 'lucide-react';
import { ExamType } from '../types';
import { PWAInstallPrompt } from './PWAInstallPrompt';

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
  onAuthClick
}) => {
  const [showExamDropdown, setShowExamDropdown] = useState(false);

  const exams: { id: ExamType; label: string; badge: string }[] = [
    { id: 'TNPSC_G1', label: 'TNPSC Group 1', badge: 'State Civil Services' },
    { id: 'TNPSC_G2', label: 'TNPSC Group 2 / 2A', badge: 'Executive Posts' },
    { id: 'TNPSC_G4', label: 'TNPSC Group 4 & VAO', badge: 'Village Admin' },
    { id: 'UPSC', label: 'UPSC Civil Services (IAS)', badge: 'Union CSE' },
    { id: 'SSC_CGL', label: 'SSC CGL Tier 1 & 2', badge: 'Central Staff' },
    { id: 'RRB_NTPC', label: 'RRB Railways', badge: 'Non-Technical' },
    { id: 'IIT_JEE', label: 'IIT JEE Main & Adv', badge: 'Engineering' },
    { id: 'NEET', label: 'NEET UG Medical', badge: 'Medical Entrance' },
    { id: 'IELTS', label: 'IELTS Band 8+ Master', badge: 'Language Exam' }
  ];

  const currentExamObj = exams.find((e) => e.id === selectedExam) || exams[0];

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

  return (
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
              <span>LIVE SERVER</span>
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

        {/* Live Arena Trigger Pill */}
        <div className="flex items-center gap-2">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
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
              All India Competitive Exam Realtime App
            </p>
          </div>
        </div>

        {/* Active Exam Target Selector Pill */}
        <div className="relative">
          <button
            onClick={() => setShowExamDropdown(!showExamDropdown)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-2xl px-3 py-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-inner"
          >
            <span className="text-amber-400">Target:</span>
            <span className="text-white max-w-[120px] sm:max-w-[160px] truncate">
              {currentExamObj.label}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {/* Exam Selection Dropdown */}
          {showExamDropdown && (
            <div 
              className="absolute left-0 mt-2 w-64 bg-slate-850 border border-slate-750 rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-scaleUp"
              onClick={() => setShowExamDropdown(false)}
            >
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Select Examination Target
              </div>
              {exams.map((e) => (
                <button
                  key={e.id}
                  onClick={() => onExamChange(e.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                    selectedExam === e.id
                      ? 'bg-amber-500 text-slate-950 font-extrabold'
                      : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-bold">{e.label}</span>
                  <span className={`text-[10px] ${selectedExam === e.id ? 'text-slate-900' : 'text-slate-400'}`}>
                    {e.badge}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
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

          {/* Premium Badge / Button */}
          <button
            onClick={onPremiumClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-md transition-all active:scale-95 cursor-pointer ${
              isPremium
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950'
                : 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
            }`}
          >
            <Crown className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span className="hidden sm:inline">{isPremium ? 'Premium Active' : 'Upgrade'}</span>
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
  );
};
