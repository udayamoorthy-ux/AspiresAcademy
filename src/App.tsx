/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ExamType, Question } from './types';
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
import SubjectQuizView from './components/SubjectQuizView';
import FlashcardsView from './components/FlashcardsView';
import MainsSprintsView from './components/MainsSprintsView';
import { 
  AUTHENTIC_POLITY_POOL, 
  AUTHENTIC_HISTORY_POOL, 
  AUTHENTIC_ECONOMY_POOL, 
  AUTHENTIC_TAMIL_POOL, 
  generateAptitudeQuestion 
} from './utils/questionPool';

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
  Star,
  FileText,
  Share2,
  Copy,
  Check
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
  const [activeTab, setActiveTab] = useState<'syllabus' | 'planner' | 'quiz' | 'subjectQuiz' | 'activeRecall' | 'mainsSprints' | 'essay' | 'gk' | 'mentor' | 'materials' | 'notifications' | 'notes' | 'analytics' | 'reviews'>('syllabus');
  const [tickerIndex, setTickerIndex] = useState(0);
  const [voiceText, setVoiceText] = useState('');
  const [voiceTitle, setVoiceTitle] = useState('');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPost, setCopiedPost] = useState(false);
  const [selectedHeadingIndex, setSelectedHeadingIndex] = useState(0);
  const [showOutreachKit, setShowOutreachKit] = useState(false);
  const [highlightShareCard, setHighlightShareCard] = useState(false);
  const [outreachQuestions, setOutreachQuestions] = useState<Question[]>([]);
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState(false);
  const [outreachSource, setOutreachSource] = useState<'daily' | 'ai'>('daily');
  const [dailySeedOffset, setDailySeedOffset] = useState(0);

  const getDailyQuestionsForOutreach = (exam: ExamType, seedOffset = 0) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const baseSeed = year * 1000 + month * 100 + date + seedOffset;

    const selectedQuestions: Question[] = [];

    // 1. Polity
    const polityIdx = baseSeed % AUTHENTIC_POLITY_POOL.length;
    selectedQuestions.push({ ...AUTHENTIC_POLITY_POOL[polityIdx], subject: 'POLITY' });

    // 2. History
    const historyIdx = (baseSeed + 3) % AUTHENTIC_HISTORY_POOL.length;
    selectedQuestions.push({ ...AUTHENTIC_HISTORY_POOL[historyIdx], subject: 'HISTORY' });

    // 3. Economy
    const economyIdx = (baseSeed + 7) % AUTHENTIC_ECONOMY_POOL.length;
    selectedQuestions.push({ ...AUTHENTIC_ECONOMY_POOL[economyIdx], subject: 'ECONOMY' });

    // 4. Tamil History or general history based on Exam
    if (exam.startsWith('TNPSC')) {
      const tamilIdx = (baseSeed + 11) % AUTHENTIC_TAMIL_POOL.length;
      selectedQuestions.push({ ...AUTHENTIC_TAMIL_POOL[tamilIdx], subject: 'TAMIL HERITAGE' });
    } else {
      const otherHistoryIdx = (baseSeed + 11) % AUTHENTIC_HISTORY_POOL.length;
      const finalHistIdx = otherHistoryIdx === historyIdx ? (otherHistoryIdx + 1) % AUTHENTIC_HISTORY_POOL.length : otherHistoryIdx;
      selectedQuestions.push({ ...AUTHENTIC_HISTORY_POOL[finalHistIdx], subject: 'WORLD & INDIAN HISTORY' });
    }

    // 5. Aptitude
    const aptQ = generateAptitudeQuestion(baseSeed + 15);
    selectedQuestions.push({ ...aptQ, subject: 'CSAT / APTITUDE' });

    return selectedQuestions;
  };

  useEffect(() => {
    if (outreachSource === 'daily') {
      const q = getDailyQuestionsForOutreach(selectedExam, dailySeedOffset);
      setOutreachQuestions(q);
    }
  }, [selectedExam, dailySeedOffset, outreachSource]);

  const handleGenerateAIOutreach = async () => {
    setIsGeneratingOutreach(true);
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exam: selectedExam,
          subject: 'Mixed High-Yield civil services topics spanning Indian Polity, Modern History, Economy, and Science'
        }),
      });
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        // Map the generated questions to ensure they have subjects mapped for the Outreach visualizer
        const mappedQuestions = data.questions.map((q: any, idx: number) => {
          const defaultSubjects = ['POLITY', 'HISTORY', 'ECONOMY', 'GENERAL SCIENCE', 'CSAT'];
          return {
            ...q,
            subject: q.subject || defaultSubjects[idx % defaultSubjects.length]
          };
        });
        setOutreachQuestions(mappedQuestions);
        setOutreachSource('ai');
      } else {
        throw new Error('No questions returned');
      }
    } catch (err) {
      console.warn("Outreach AI Generation failed, falling back to next offline daily pool:", err);
      setDailySeedOffset(prev => prev + 1);
      setOutreachSource('daily');
    } finally {
      setIsGeneratingOutreach(false);
    }
  };
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
    { id: 'syllabus', label: 'Official Exam Syllabus', icon: Compass, component: SyllabusView },
    { id: 'notifications', label: 'Govt Notification Desk', icon: Bell, component: FlashNewsDesk },
    { id: 'materials', label: 'Official References', icon: ShieldCheck, component: MaterialsLibraryView },
    { id: 'planner', label: 'AI Study Planner', icon: Calendar, component: PlannerView },
    { id: 'quiz', label: 'Practice Mock Tests', icon: Award, component: QuizView },
    { id: 'subjectQuiz', label: 'Syllabus Topic Quizzes', icon: Sparkles, component: SubjectQuizView },
    { id: 'activeRecall', label: 'Active Recall SRS Deck', icon: Layers, component: FlashcardsView },
    { id: 'mainsSprints', label: 'Mains Daily Sprints', icon: FileText, component: MainsSprintsView },
    { id: 'essay', label: 'Mains Essay Evaluator', icon: GraduationCap, component: EssayEvaluatorView },
    { id: 'gk', label: 'Current Affairs Deep Dive', icon: Globe, component: GKFeedView },
    { id: 'notes', label: 'AI Notes Generator', icon: BrainCircuit, component: NotesGeneratorView },
    { id: 'analytics', label: 'Performance Analytics', icon: TrendingUp, component: PerformanceAnalyticsView },
    { id: 'mentor', label: 'Personal AI Coach', icon: MessageSquare, component: MentorChatView },
    { id: 'reviews', label: 'Reviews & Testimonials', icon: Star, component: ReviewsView },
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
              onClick={() => {
                // Scroll to share card
                const el = document.getElementById('share-card');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setHighlightShareCard(true);
                  setTimeout(() => setHighlightShareCard(false), 2500);
                }
              }}
              className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-extrabold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
              id="header-share-btn"
            >
              <Share2 className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
              <span>Invite Buddies</span>
            </button>

            <span className="h-4 w-px bg-slate-200 hidden sm:inline" />

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
                <span>Login</span>
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
                  <span>Activate Premium</span>
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

            {/* Viral Growth & Share Widget */}
            <div 
              className={`bg-gradient-to-br from-emerald-600/5 to-teal-600/5 border p-5 rounded-2xl space-y-4 shadow-sm transition-all duration-500 ${
                highlightShareCard 
                  ? 'ring-4 ring-amber-400 border-amber-400 scale-[1.03] shadow-md animate-pulse' 
                  : 'border-emerald-500/20'
              }`} 
              id="share-card"
            >
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-emerald-700 font-bold font-mono">Spread the Word 📢</span>
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 font-display">
                  Invite Study Buddies
                </h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Help other civil services aspirants prepare smarter! Share ASPIRES ACADEMY with your UPSC & TNPSC peers on WhatsApp or Telegram.
              </p>
              
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    const shareText = `Hey! Check out ASPIRES ACADEMY — it is an amazing AI-powered prep portal for UPSC and TNPSC civil service exams! It has a dynamic syllabus tracker, AI essay evaluator, active recall cards, and an AI tutor chatbot. Try it here: ${window.location.origin}`;
                    navigator.clipboard.writeText(shareText);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-750 font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                  id="btn-copy-invite"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600 animate-scaleIn" />
                      <span className="text-emerald-700">Copied Invite Message!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-500" />
                      <span>Copy Invite Message</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent('Prepare smarter for UPSC & TNPSC exams with ASPIRES ACADEMY. Interactive syllabus trackers, AI essay evaluations, flashcards, and personalized coaching!')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#24A1DE]/10 hover:bg-[#24A1DE]/20 text-[#1975a2] font-black text-xs py-2 rounded-xl flex items-center justify-center gap-1 transition-all active:scale-[0.98]"
                    id="btn-share-telegram"
                  >
                    <Share2 className="h-3 w-3" />
                    <span>Telegram</span>
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Hey! Try ASPIRES ACADEMY — an amazing AI-powered prep portal for UPSC & TNPSC civil service exams with syllabus trackers, AI essay evaluation, flashcards, and mock tests! Here: ' + window.location.origin)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-black text-xs py-2 rounded-xl flex items-center justify-center gap-1 transition-all active:scale-[0.98]"
                    id="btn-share-whatsapp"
                  >
                    <Share2 className="h-3 w-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Dynamic Community Outreach Post Builder */}
                <div className="border-t border-slate-200/60 pt-3 mt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="h-3 w-3 animate-pulse" /> Outreach Kit
                    </span>
                    <button
                      onClick={() => setShowOutreachKit(!showOutreachKit)}
                      className="text-[11px] font-bold text-slate-600 hover:text-slate-800 underline cursor-pointer"
                    >
                      {showOutreachKit ? 'Hide' : 'Show Daily 5 Questions'}
                    </button>
                  </div>

                  {showOutreachKit && (
                    <div className="bg-white/80 border border-emerald-500/10 rounded-xl p-3 space-y-3 animate-fadeIn text-xs">
                      {/* Dynamic Refresh Controls */}
                      <div className="flex items-center gap-2 justify-between border-b border-slate-100 pb-2 mb-1">
                        <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wide">
                          Mode: <span className="font-extrabold text-emerald-700">{outreachSource === 'daily' ? `Daily Rotation (Set #${dailySeedOffset + 1})` : 'AI Custom'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setDailySeedOffset(prev => prev + 1);
                              setOutreachSource('daily');
                            }}
                            className="text-[9px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 cursor-pointer active:scale-95 transition-all"
                            title="Load next daily set of questions"
                          >
                            🔄 Next Daily
                          </button>
                          <button
                            onClick={handleGenerateAIOutreach}
                            disabled={isGeneratingOutreach}
                            className={`text-[9px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-1.5 py-0.5 rounded cursor-pointer active:scale-95 transition-all flex items-center gap-0.5 ${isGeneratingOutreach ? 'opacity-50 pointer-events-none' : ''}`}
                            title="Generate 5 fresh questions with Gemini AI"
                          >
                            {isGeneratingOutreach ? 'Generating...' : '✨ Gen AI'}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">Select Title Heading:</label>
                        <select
                          value={selectedHeadingIndex}
                          onChange={(e) => setSelectedHeadingIndex(Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 text-slate-750 text-xs rounded-lg px-2 py-1.5 font-sans focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        >
                          <option value={0}>🎯 Daily MCQ Drill</option>
                          <option value={1}>🧠 Can You Crack These 5?</option>
                          <option value={2}>🔥 Prelims Challenge</option>
                          <option value={3}>💡 5 High-Yield MCQs</option>
                        </select>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 max-h-60 overflow-y-auto space-y-3 text-[11px] text-slate-750 font-sans shadow-inner">
                        <div className="font-extrabold text-slate-850 font-display border-b border-slate-200 pb-1.5 mb-2 sticky top-0 bg-slate-50 pt-0.5">
                          {selectedHeadingIndex === 0 && `🎯 ${selectedExam} CSE DAILY MCQ DRILL – Test Your Limits!`}
                          {selectedHeadingIndex === 1 && `🧠 Can You Crack These 5 Elite ${selectedExam} Questions?`}
                          {selectedHeadingIndex === 2 && `🔥 ${selectedExam} Prelims Challenge: 5 High-Yield Questions from ASPIRES!`}
                          {selectedHeadingIndex === 3 && `💡 5 Tough ${selectedExam} Prep MCQs to Boost Your Score Today!`}
                        </div>
                        
                        <div className="space-y-3">
                          {outreachQuestions.map((q, index) => (
                            <div key={q.id || index} className="p-2 bg-white rounded-lg border border-slate-200/60 shadow-xs">
                              <span className="font-bold text-emerald-700 font-mono text-[9px] uppercase tracking-wider">
                                {index + 1}️⃣ {q.subject || 'GENERAL STUDIES'}
                              </span>
                              <p className="font-semibold text-slate-850 mt-0.5">{q.text}</p>
                              <div className="grid grid-cols-2 gap-1 mt-1 pl-2 text-slate-500 font-mono text-[10px]">
                                {q.options.map((opt, oIdx) => (
                                  <div key={oIdx}>{String.fromCharCode(65 + oIdx)}) {opt}</div>
                                ))}
                              </div>
                              <div className="mt-1.5 text-[10px] text-emerald-800 font-semibold bg-emerald-50 p-1 rounded">
                                👉 Answer: {String.fromCharCode(65 + q.correctAnswerIndex)} ({q.options[q.correctAnswerIndex]}) - {q.explanation}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* CTA Footer Preview */}
                        <div className="pt-2.5 mt-2.5 border-t border-slate-200/80 text-[10px] text-slate-500 space-y-1 font-sans">
                          <p className="font-mono text-[8px] uppercase tracking-wider text-slate-400">🎁 Offer Included in Share Post:</p>
                          <p className="font-semibold text-slate-650">🎁 Practice 100+ Free UPSC & TNPSC questions instantly with Interactive Syllabus Trackers & AI Coaches at ASPIRES ACADEMY!</p>
                          <p className="font-extrabold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-500/15 flex items-center gap-1">
                            <span>⚡ Early Bird Special: Get the Annual Pass for just ₹299/yr (Save 87%) - valid for the first 100 aspirants only!</span>
                          </p>
                          <p className="text-blue-600 font-medium">👉 Join and prepare here: {window.location.origin}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const headings = [
                            selectedHeadingIndex === 0 ? `🎯 ${selectedExam} CSE DAILY MCQ DRILL – Test Your Limits!` : '',
                            selectedHeadingIndex === 1 ? `🧠 Can You Crack These 5 Elite ${selectedExam} Questions?` : '',
                            selectedHeadingIndex === 2 ? `🔥 ${selectedExam} Prelims Challenge: 5 High-Yield Questions from ASPIRES!` : '',
                            selectedHeadingIndex === 3 ? `💡 5 Tough ${selectedExam} Prep MCQs to Boost Your Score Today!` : ''
                          ];
                          const heading = headings[selectedHeadingIndex] || `🎯 ${selectedExam} Daily Civil Services Challenge`;
                          
                          let questionsText = '';
                          outreachQuestions.forEach((q, index) => {
                            const optionsText = q.options.map((opt, oIdx) => `${String.fromCharCode(65 + oIdx)}) ${opt}`).join('\n');
                            questionsText += `${index + 1}️⃣ ${q.subject || 'GENERAL STUDIES'}: ${q.text}\n${optionsText}\n👉 Answer: ${String.fromCharCode(65 + q.correctAnswerIndex)} (${q.options[q.correctAnswerIndex]}) - ${q.explanation}\n\n`;
                          });

                          const postText = `${heading}

${questionsText}---
🎁 Practice 100+ Free UPSC & TNPSC questions instantly with Interactive Syllabus Trackers & AI Coaches at ASPIRES ACADEMY!
⚡ Early Bird Special: Get the Annual Pass for just ₹299/yr (Save 87%) - valid for the first 100 aspirants only!
👉 Join and prepare here: ${window.location.origin}`;

                          navigator.clipboard.writeText(postText);
                          setCopiedPost(true);
                          setTimeout(() => setCopiedPost(false), 2500);
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-[0.98] cursor-pointer"
                      >
                        {copiedPost ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Copied Outreach Post!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy Outreach Post</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

              </div>
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
