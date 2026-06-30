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
import AspiresLogo from './components/AspiresLogo';
import AuthModal from './components/AuthModal';
import ContactModal from './components/ContactModal';
import ReviewsView from './components/ReviewsView';

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
  TrendingUp,
  Crown,
  CheckCircle2,
  Star
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
  const [activeTab, setActiveTab] = useState<'syllabus' | 'planner' | 'quiz' | 'essay' | 'gk' | 'mentor' | 'materials' | 'notifications' | 'notes' | 'analytics' | 'reviews'>('syllabus');
  const [tickerIndex, setTickerIndex] = useState(0);
  const [voiceText, setVoiceText] = useState('');
  const [voiceTitle, setVoiceTitle] = useState('');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem('aspires_logged_in_email') || '';
  });

  // Premium Subscription State loaded securely from Cache standard
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    // If they are udayamoorthy@gmail.com, auto unlock
    const savedEmail = localStorage.getItem('aspires_logged_in_email') || '';
    if (savedEmail.trim().toLowerCase() === 'udayamoorthy@gmail.com') {
      return true;
    }
    return localStorage.getItem('aspires_is_premium') === 'true';
  });
  const [premiumPlan, setPremiumPlan] = useState<string>(() => {
    const savedEmail = localStorage.getItem('aspires_logged_in_email') || '';
    if (savedEmail.trim().toLowerCase() === 'udayamoorthy@gmail.com') {
      return 'annual';
    }
    return localStorage.getItem('aspires_premium_plan') || '';
  });

  const handleLoginSuccess = (email: string) => {
    localStorage.setItem('aspires_logged_in_email', email);
    setUserEmail(email);
    
    if (email === 'udayamoorthy@gmail.com') {
      localStorage.setItem('aspires_is_premium', 'true');
      localStorage.setItem('aspires_premium_plan', 'annual');
      setIsPremium(true);
      setPremiumPlan('annual');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('aspires_logged_in_email');
    setUserEmail('');
    
    // If they logged out and we want to reset premium (if it was the VIP auto premium)
    if (userEmail === 'udayamoorthy@gmail.com') {
      localStorage.removeItem('aspires_is_premium');
      localStorage.removeItem('aspires_premium_plan');
      setIsPremium(false);
      setPremiumPlan('');
    }
  };

  const handleSubscriptionSuccess = (plan: 'monthly' | 'annual') => {
    localStorage.setItem('aspires_is_premium', 'true');
    localStorage.setItem('aspires_premium_plan', plan);
    setIsPremium(true);
    setPremiumPlan(plan);
  };

  const handleCancelSubscription = () => {
    localStorage.removeItem('aspires_is_premium');
    localStorage.removeItem('aspires_premium_plan');
    setIsPremium(false);
    setPremiumPlan('');
  };

  useEffect(() => {
    // Auto-align premium state if they are logged in as udayamoorthy@gmail.com on launch
    const savedEmail = localStorage.getItem('aspires_logged_in_email') || '';
    if (savedEmail.trim().toLowerCase() === 'udayamoorthy@gmail.com') {
      localStorage.setItem('aspires_is_premium', 'true');
      localStorage.setItem('aspires_premium_plan', 'annual');
      setIsPremium(true);
      setPremiumPlan('annual');
    }
  }, [userEmail]);

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
    { id: 'reviews', label: 'Student Reviews & Ratings', icon: Star, component: ReviewsView },
  ] as const;

  const handleSelectExam = (exam: ExamType) => {
    setSelectedExam(exam);
  };

  const ActiveComponent = tabDetails.find(tab => tab.id === activeTab)?.component || SyllabusView;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-emerald-600 selection:text-white" id="portal-app-root">
      {/* Top Navigation Banner */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 px-6 py-4.5 shadow-sm" id="portal-header">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Headline */}
          <div className="flex items-center gap-3.5">
            <div className="flex-shrink-0">
              <AspiresLogo size={46} showText={false} className="rounded-xl bg-white border border-slate-200 p-0.5 shadow-sm" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 font-display">
                ASPIRES ACADEMY
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-600/10 border border-emerald-600/20 text-emerald-700 font-mono">
                  AI-Powered
                </span>
              </h1>
              <p className="text-xs md:text-sm text-slate-500 font-medium font-sans">TNPSC, UPSC Aspirants • Professional Study Blueprint & AI Evaluation</p>
            </div>
          </div>

          {/* Quick Info Bar & Premium Controls */}
          <div className="flex items-center gap-4 flex-wrap" id="header-quick-info">
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              id="header-support-btn"
            >
              <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
              <span>Support Desk</span>
            </button>

            <span className="h-4 w-px bg-slate-200 hidden sm:inline" />

            {userEmail ? (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
                id="header-user-profile-btn"
              >
                <div className="h-6 w-6 rounded-full bg-emerald-600 text-white font-extrabold text-[10.5px] flex items-center justify-center shadow-sm">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]" title={userEmail}>
                  {userEmail.split('@')[0]}
                </span>
              </button>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                id="header-sign-in-btn"
              >
                <UserCheck className="h-3.5 w-3.5 text-slate-500" />
                <span>Student Login</span>
              </button>
            )}

            <span className="h-4 w-px bg-slate-200 hidden sm:inline" />

            {isPremium ? (
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-amber-500 to-yellow-500 border border-amber-400 text-slate-950 font-extrabold text-[10.5px] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm shadow-amber-500/10 animate-fadeIn">
                  <Crown className="h-3.5 w-3.5 text-slate-950 fill-slate-950 animate-pulse animate-bounce" />
                  <span>PREMIUM ACTIVE ({premiumPlan === 'annual' ? 'Annual Pass' : 'Monthly Pass'})</span>
                </div>
                <button
                  onClick={() => setIsSupportModalOpen(true)}
                  className="text-[10px] text-slate-400 hover:text-slate-600 font-mono underline ml-1 cursor-pointer"
                  title="Manage subscription"
                >
                  Manage
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSupportModalOpen(true)}
                className="bg-gradient-to-r from-slate-950 to-slate-900 hover:from-slate-900 hover:to-slate-850 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm hover:shadow transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
                id="header-upgrade-btn"
              >
                <Crown className="h-3.5 w-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Go Premium</span>
              </button>
            )}

            <span className="h-4 w-px bg-slate-200 hidden sm:inline" />

            <div className="flex items-center gap-4 text-xs md:text-sm font-semibold text-slate-600">
              <span className="text-slate-800 flex items-center gap-1.5">
                Mode: <strong className="text-emerald-600 font-black bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded">{selectedExam}</strong>
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* Live Government Notification Ticker */}
      <div className="max-w-7xl mx-auto px-6 mt-6" id="live-announcement-ticker-container">
        <div 
          onClick={() => setActiveTab('notifications')}
          className="bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-500/25 rounded-2xl px-5 py-3 flex items-center justify-between gap-4 cursor-pointer group transition-all shadow-sm"
        >
          <div className="flex items-center gap-3.5 overflow-hidden">
            <span className="flex-shrink-0 flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-[10px] md:text-xs font-mono font-bold text-red-600 px-3 py-1.5 rounded-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
              GOVT PORTAL LIVE
            </span>
            <div className="text-sm text-slate-800 font-semibold truncate font-sans">
              {TICKER_HEADLINES[selectedExam]?.[tickerIndex]}
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
            <span>View Board Desk</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8" id="portal-main-stage">
        
        {/* Exam Quick Select & Pitch Banner */}
        <div className="bg-white border border-slate-200/80 p-6.5 rounded-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-sm" id="exam-pitch-banner">
          <div className="space-y-1.5 max-w-xl">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2 font-display">
              <Sparkles className="h-5.5 w-5.5 text-emerald-600" />
              Configure Your Civil Services Focus
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Toggle your goal exam below. Our study planner, MCQs diagnostic quizzes, descriptive answer evaluations, and AI personal assistant chatbot will automatically realign to the selected board syllabus.
            </p>
          </div>

          {/* Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto" id="exam-selector-buttons">
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
                  className={`px-4 py-3 rounded-xl text-xs md:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/15'
                      : 'bg-white border border-slate-200 hover:border-slate-350 text-slate-700 hover:text-slate-950'
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
            <span className="text-xs uppercase font-bold tracking-widest text-slate-450 px-1 font-mono">Study Modules</span>
            
            <nav className="flex flex-col gap-1.5" id="navigation-menu">
              {tabDetails.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    id={`nav-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left p-4 rounded-xl text-sm md:text-base font-bold flex items-center gap-3.5 transition-all border ${
                      isActive
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-extrabold shadow-sm'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Premium Status Widget / Promo Inside Sidebar */}
            {isPremium ? (
              <div className="bg-gradient-to-br from-amber-500/10 to-emerald-500/10 border border-amber-500/35 p-5 rounded-2xl space-y-3 shadow-sm relative overflow-hidden" id="premium-sidebar-active">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500 animate-pulse" />
                  <h4 className="font-extrabold text-sm text-slate-900 font-display">Premium Active</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  You have unlimited access to all AI evaluators, planners, diagnostic testing suites, and voice teachers.
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-800 font-black">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>ALL CAP LIMITS REMOVED</span>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-white border border-slate-800 p-5 rounded-2xl space-y-3.5 shadow-xl relative overflow-hidden" id="premium-sidebar-promo">
                <div className="absolute -right-3 -top-3 opacity-15">
                  <Crown className="h-20 w-20 text-yellow-400 rotate-12" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9.5px] uppercase tracking-widest text-amber-400 font-black font-mono">Unlock Unlimited AI Power</span>
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5 font-display">
                    ASPIRES Premium 💎
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Unlock limitless essay diagnostics, notes generators, custom schedules, and ad-free AI coaching chats.
                </p>
                <button
                  onClick={() => setIsSupportModalOpen(true)}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-101 cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>Activate Premium for ₹199</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* Support Information Box */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl space-y-3 shadow-sm" id="info-card">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <BookOpen className="h-4.5 w-4.5 text-emerald-600" />
                Strategic Preparation
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Maximize score efficiency by pairing your AI planner schedule with descriptive evaluation tasks and mock diagnostic quizzes. Keep in touch with the Personal AI Coach to draft specific revision outlines.
              </p>
            </div>
          </div>

          {/* Active Work Area Panel */}
          <div className="lg:col-span-9" id="active-work-area">
            {React.createElement(ActiveComponent as any, {
              selectedExam,
              onSelectExam: handleSelectExam,
              onVoicePlay: handleVoicePlay,
              setActiveTab: setActiveTab,
              isPremium: isPremium,
              userEmail: userEmail,
              onPremiumClick: () => setIsSupportModalOpen(true)
            })}
          </div>

        </div>

      </main>

      {/* Aesthetic Slate Footer */}
      <footer className="border-t border-slate-200 bg-white text-center py-10 text-xs text-slate-500 space-y-5 mt-16 shadow-inner" id="portal-footer">
        
        {/* Full official vector brand logo */}
        <div className="flex justify-center mb-1">
          <AspiresLogo size={200} showText={true} className="transition-transform duration-300 hover:scale-102" />
        </div>
        
        {/* Support Us / Premium trigger button & Help Desk button in the footer */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 py-2" id="footer-gpay-support-group">
          <button
            onClick={() => {
              setIsSupportModalOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-emerald-100/70 hover:from-emerald-100 hover:to-emerald-200/80 border border-emerald-200 px-4 py-2.5 rounded-2xl transition-all shadow-sm cursor-pointer group active:scale-95"
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
            <span className="text-xs font-extrabold text-slate-800 tracking-tight group-hover:text-emerald-950">
              {isPremium ? 'Upgrade / Support' : 'Go Premium / Support'}
            </span>
          </button>

          <button
            onClick={() => {
              setIsContactModalOpen(true);
            }}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-2xl transition-all shadow-sm cursor-pointer group active:scale-95 text-xs font-bold text-slate-700"
            id="footer-contact-support-trigger"
          >
            <MessageSquare className="h-4 w-4 text-emerald-600" />
            <span>Have Queries? Contact Helpdesk</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('reviews');
              document.getElementById('portal-main-stage')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 bg-amber-50/50 hover:bg-amber-100/70 border border-amber-200 px-4 py-2.5 rounded-2xl transition-all shadow-sm cursor-pointer group active:scale-95 text-xs font-bold text-slate-750"
            id="footer-reviews-trigger"
          >
            <Star className="h-4 w-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>Read & Write Reviews</span>
          </button>
        </div>

        <p className="text-[10.5px] text-slate-400 max-w-4xl mx-auto px-6 leading-relaxed">
          <strong>Disclaimer:</strong> ASPIRES ACADEMY is an independent educational portal. We are not affiliated, associated, authorized, or in any way officially connected with the Union Public Service Commission (UPSC), Tamil Nadu Public Service Commission (TNPSC), or any other government agency. Official notifications can be verified at upsc.gov.in and tnpsc.gov.in.
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
        isPremium={isPremium}
        onSubscriptionSuccess={handleSubscriptionSuccess}
        onCancelSubscription={handleCancelSubscription}
      />

      {/* Account Auth Modal popup Window */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentEmail={userEmail}
        onLogout={handleLogout}
      />

      {/* Support Desk Modal Window */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        currentUserEmail={userEmail}
      />
    </div>
  );
}
