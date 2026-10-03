/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Home, 
  FileText, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Menu, 
  X, 
  Crown, 
  GraduationCap, 
  Award, 
  Share2, 
  BrainCircuit, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  Smartphone,
  Flame,
  Radio
} from 'lucide-react';
import { ExamType } from '../types';
import { PWAInstallPrompt } from './PWAInstallPrompt';

interface MobileBottomNavProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
  selectedExam: ExamType;
  onExamChange: (exam: ExamType) => void;
  onPremiumClick: () => void;
  isPremium?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onTabChange,
  selectedExam,
  onExamChange,
  onPremiumClick,
  isPremium = false,
}) => {
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  // Primary 5 tabs on mobile bottom bar + Menu
  const primaryTabs = [
    { id: 'daily-mcqs', label: 'Drills', icon: Home },
    { id: 'live-arena', label: 'Live Arena', icon: Flame, isLive: true },
    { id: 'practice-tests', label: 'Mocks', icon: FileText },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'planner', label: 'Planner', icon: Calendar },
  ];

  // Secondary tabs inside the More drawer
  const drawerTabs = [
    { id: 'subject-quiz', label: 'Topic Drill Arena', icon: Award, desc: 'Subject & chapter quizzes' },
    { id: 'mentor', label: 'Ask AI Mentor', icon: MessageSquare, desc: 'Syllabus doubt clearing' },
    { id: 'evaluator', label: 'Mains Essay Evaluator', icon: BrainCircuit, desc: 'Automated descriptive scoring' },
    { id: 'flashcards', label: 'Active Recall Flashcards', icon: Sparkles, desc: 'Quick memory retention cards' },
    { id: 'analytics', label: 'Syllabus Tracker', icon: CheckCircle2, desc: 'Topic completion & progress' },
  ];

  const exams: { id: ExamType; label: string; tag: string }[] = [
    { id: 'TNPSC_G1', label: 'TNPSC Group 1', tag: 'State Civil Services' },
    { id: 'TNPSC_G2', label: 'TNPSC Group 2 / 2A', tag: 'Executive Posts' },
    { id: 'TNPSC_G4', label: 'TNPSC Group 4 & VAO', tag: 'Village Admin' },
    { id: 'UPSC', label: 'UPSC Civil Services (IAS/IPS)', tag: 'Union Service' },
    { id: 'SSC_CGL', label: 'SSC CGL Tier 1 & 2', tag: 'Staff Selection' },
    { id: 'RRB_NTPC', label: 'RRB NTPC Railways', tag: 'Non-Technical' },
    { id: 'IIT_JEE', label: 'IIT JEE Main & Adv', tag: 'Engineering' },
    { id: 'NEET', label: 'NEET UG Medical', tag: 'Medical Entrance' },
    { id: 'IELTS', label: 'IELTS Band 8+ Master', tag: 'Global English' },
  ];

  const handleSelectTab = (id: string) => {
    onTabChange(id);
    setShowDrawer(false);
  };

  return (
    <>
      {/* Fixed Native Bottom Bar (Mobile Only) */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-area-bottom select-none"
        aria-label="Mobile Navigation"
      >
        <div className="grid grid-cols-6 h-16 max-w-lg mx-auto px-0.5">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
                  isActive 
                    ? 'text-amber-500 font-extrabold' 
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                <div className={`relative p-1 rounded-xl transition-all ${
                  isActive ? 'bg-amber-500/10' : ''
                }`}>
                  <Icon className="h-5 w-5" />
                  {(tab as any).isLive && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500" />
                  )}
                </div>
                <span className="text-[9.5px] tracking-tight mt-0.5 truncate max-w-[50px]">{tab.label}</span>
              </button>
            );
          })}

          {/* More / Menu Drawer Toggle */}
          <button
            onClick={() => setShowDrawer(true)}
            className={`flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
              showDrawer || !primaryTabs.some(t => t.id === currentTab)
                ? 'text-amber-500 font-extrabold' 
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <div className={`relative p-1 rounded-xl transition-all ${
              showDrawer || !primaryTabs.some(t => t.id === currentTab) ? 'bg-amber-500/10' : ''
            }`}>
              <Menu className="h-5 w-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">More</span>
          </button>
        </div>
      </nav>

      {/* Slide-Up Bottom Drawer Sheet */}
      {showDrawer && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fadeIn"
          onClick={() => setShowDrawer(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 border-t border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">ASPIRES Menu</h4>
                  <p className="text-[11px] text-slate-500">Selected: {selectedExam.replace('_', ' ')}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Active Exam Switcher */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Switch Exam Target</span>
              <div className="grid grid-cols-2 gap-2">
                {exams.slice(0, 6).map((e) => (
                  <button
                    key={e.id}
                    onClick={() => {
                      onExamChange(e.id);
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all active:scale-95 ${
                      selectedExam === e.id
                        ? 'border-amber-500 bg-amber-500/10 font-bold text-amber-700 dark:text-amber-400'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-extrabold">{e.label}</div>
                    <div className="text-[9px] text-slate-400">{e.tag}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Modules */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Preparation Modules</span>
              <div className="grid grid-cols-1 gap-1.5">
                {drawerTabs.map((item) => {
                  const Icon = item.icon;
                  const isCurrent = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                        isCurrent
                          ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white font-extrabold'
                          : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${
                        isCurrent ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[10px] text-slate-400">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* App Installation Promo inside Drawer */}
            <div className="pt-2">
              <PWAInstallPrompt variant="banner" />
            </div>

            {/* Premium CTA */}
            <button
              onClick={() => {
                setShowDrawer(false);
                onPremiumClick();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Crown className="h-4 w-4" />
              <span>{isPremium ? 'Premium Active — Support Server' : 'Unlock ASPIRES Premium'}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
