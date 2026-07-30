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
  generateAptitudeQuestion,
  getQuestionsForExam
} from './utils/questionPool';
import { STATIC_QUIZ_QUESTIONS } from './data';
import { MultiExamWhatsAppBroadcaster } from './components/MultiExamWhatsAppBroadcaster';
import { isOwnerEmail } from './utils/authUtils';

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
  Check,
  Send
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
  ],
  SSC_CGL: [
    'SSC CGL 2026: Official Tier I computer-based exams are scheduled for Autumn 2026.',
    'Tier II Syllabus Update: Quantitative, English, Reasoning, and Computer sections compiled under new pattern.',
    'Advisory Note: Data Entry Speed Test is mandatory for all posts. Candidates are advised to practice typing regularly.'
  ],
  RRB_NTPC: [
    'RRB NTPC 2026: Official Stage 1 Computer-Based Tests (CBT-1) are scheduled to begin in Autumn 2026.',
    'Syllabus Advisory: Focus intensively on 10th-standard General Science (Physics, Chemistry, Life Sciences) which constitutes 40% of CBT General Awareness.',
    'Preparation Tip: Practice high-speed quantitative tricks and alphabetical logic series regularly to optimize your 90-minute limit.'
  ],
  IIT_JEE: [
    'JEE Main 2027 Session 1 & Session 2 Information Bulletin & Registration dates published by NTA at jeemain.nta.nic.in.',
    'JEE Advanced 2027 organizing IIT syllabus press release: Focus on Physics Mechanics, Organic Mechanisms, and Calculus Integration.',
    'JoSAA Counseling 2026: Seat allocation round results and opening/closing ranks updated for IITs, NITs, and IIITs.'
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
  const [showOutreachKit, setShowOutreachKit] = useState(true);
  const [highlightShareCard, setHighlightShareCard] = useState(false);
  const [outreachQuestions, setOutreachQuestions] = useState<Question[]>([]);
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState(false);
  const [outreachSource, setOutreachSource] = useState<'daily' | 'ai'>('daily');
  const [dailySeedOffset, setDailySeedOffset] = useState(0);

  const getDailyQuestionsForOutreach = (exam: ExamType, seedOffset = 0) => {
    return getQuestionsForExam(exam, seedOffset, 5);
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
      const promptSubject = selectedExam === 'IIT_JEE'
        ? 'Mixed High-Yield IIT JEE Main and Advanced topics spanning Physics, Chemistry, and Mathematics'
        : selectedExam === 'SSC_CGL' || selectedExam === 'RRB_NTPC'
        ? 'Mixed Quantitative Aptitude, Reasoning, General Awareness, and English questions'
        : 'Mixed High-Yield civil services topics spanning Indian Polity, Modern History, Economy, and Science';

      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exam: selectedExam,
          subject: promptSubject
        }),
      });
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        // Map the generated questions to ensure they have subjects mapped for the Outreach visualizer
        const mappedQuestions = data.questions.map((q: any, idx: number) => {
          const defaultSubjects = selectedExam === 'IIT_JEE'
            ? ['PHYSICS', 'CHEMISTRY', 'MATHEMATICS', 'PHYSICS', 'CHEMISTRY']
            : selectedExam === 'SSC_CGL' || selectedExam === 'RRB_NTPC'
            ? ['QUANTITATIVE APTITUDE', 'REASONING', 'GENERAL AWARENESS', 'ENGLISH', 'MATHEMATICS']
            : ['POLITY', 'HISTORY', 'ECONOMY', 'GENERAL SCIENCE', 'CSAT'];
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

  const isUserAdmin = isOwnerEmail(userEmail);

  // Premium Subscription State loaded securely from Cache standard
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    // If they are owner, auto unlock
    const savedEmail = localStorage.getItem('aspires_logged_in_email') || '';
    if (isOwnerEmail(savedEmail)) {
      return true;
    }
    return localStorage.getItem('aspires_is_premium') === 'true';
  });
  const [premiumPlan, setPremiumPlan] = useState<string>(() => {
    const savedEmail = localStorage.getItem('aspires_logged_in_email') || '';
    if (isOwnerEmail(savedEmail)) {
      return 'annual';
    }
    return localStorage.getItem('aspires_premium_plan') || '';
  });

  const handleLoginSuccess = (email: string) => {
    localStorage.setItem('aspires_logged_in_email', email);
    setUserEmail(email);
    
    if (isOwnerEmail(email)) {
      localStorage.setItem('aspires_is_premium', 'true');
      localStorage.setItem('aspires_premium_plan', 'annual');
      setIsPremium(true);
      setPremiumPlan('annual');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('aspires_logged_in_email');
    setUserEmail('');
    
    if (isOwnerEmail(userEmail)) {
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
    // Auto-align premium state if they are logged in as owner on launch
    const savedEmail = localStorage.getItem('aspires_logged_in_email') || '';
    if (isOwnerEmail(savedEmail)) {
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
    { id: 'syllabus', label: 'Official Syllabus', icon: Compass, component: SyllabusView },
    { id: 'planner', label: 'AI Study Planner', icon: Calendar, component: PlannerView },
    { id: 'notes', label: 'AI Notes Generator', icon: BrainCircuit, component: NotesGeneratorView },
    { id: 'materials', label: 'Reference Materials', icon: ShieldCheck, component: MaterialsLibraryView },
    { id: 'subjectQuiz', label: 'Topic Quizzes', icon: Sparkles, component: SubjectQuizView },
    { id: 'activeRecall', label: 'Recall Flashcards', icon: Layers, component: FlashcardsView },
    { id: 'quiz', label: 'Practice Mock Tests', icon: Award, component: QuizView },
    { id: 'mainsSprints', label: 'Daily Sprints', icon: FileText, component: MainsSprintsView },
    { id: 'essay', label: 'Essay Evaluator', icon: GraduationCap, component: EssayEvaluatorView },
    { id: 'mentor', label: 'Personal AI Coach', icon: MessageSquare, component: MentorChatView },
    { id: 'gk', label: 'Current Affairs Feed', icon: Globe, component: GKFeedView },
    { id: 'notifications', label: 'Notification Desk', icon: Bell, component: FlashNewsDesk },
    { id: 'analytics', label: 'Performance Tracker', icon: TrendingUp, component: PerformanceAnalyticsView },
    { id: 'reviews', label: 'Reviews & Feedback', icon: Star, component: ReviewsView },
  ] as const;

  const handleSelectExam = (exam: ExamType) => {
    setSelectedExam(exam);
  };

  const ActiveComponent = tabDetails.find(tab => tab.id === activeTab)?.component || SyllabusView;

  const NAVIGATION_GROUPS = [
    {
      title: 'Study Planning',
      tabs: ['syllabus', 'planner', 'notes', 'materials']
    },
    {
      title: 'Practice & Prep',
      tabs: ['subjectQuiz', 'activeRecall', 'quiz']
    },
    {
      title: 'Mains & Writing',
      tabs: ['mainsSprints', 'essay']
    },
    {
      title: 'Support & Analytics',
      tabs: ['mentor', 'gk', 'notifications', 'analytics', 'reviews']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 font-sans selection:bg-emerald-600 selection:text-white text-slate-800 antialiased" id="portal-app-root">
      {/* Top Floating Navigation Header */}
      <header className="border-b border-slate-200/60 bg-white/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4 transition-all duration-300" id="portal-header">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Logo & Headline */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 transition-transform duration-300 hover:scale-105">
              <AspiresLogo size={50} showText={false} className="rounded-xl bg-white border border-slate-150 p-1 shadow-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight font-display">
                  ASPIRES <span className="text-emerald-600">ACADEMY</span>
                </h1>
                <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-100/60 border border-emerald-200/50 text-emerald-800 font-mono tracking-wider">
                  AI-Powered ⚡
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5 font-sans leading-none">
                UPSC • TNPSC • SSC • RRB Prep & Automated Descriptive Evaluation
              </p>
            </div>
          </div>

          {/* Quick Info Bar & Premium Controls */}
          <div className="flex items-center gap-3.5 flex-wrap justify-between lg:justify-end w-full lg:w-auto" id="header-quick-info">
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const el = document.getElementById('share-card');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setHighlightShareCard(true);
                    setTimeout(() => setHighlightShareCard(false), 2500);
                  }
                }}
                className="bg-emerald-50/50 hover:bg-emerald-100/80 border border-emerald-200/60 text-emerald-800 font-extrabold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm hover:shadow"
                id="header-share-btn"
              >
                <Share2 className="h-3.5 w-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Invite Buddies</span>
              </button>

              <button 
                onClick={() => setIsContactModalOpen(true)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 font-extrabold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm hover:shadow"
                id="header-support-btn"
              >
                <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
                <span className="hidden sm:inline">Support Desk</span>
              </button>
            </div>

            <span className="h-5 w-px bg-slate-200 hidden lg:inline" />

            <div className="flex items-center gap-3">
              {userEmail ? (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer transition-all active:scale-95 shadow-sm hover:shadow"
                  id="header-user-profile-btn"
                >
                  <div className="h-5.5 w-5.5 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-extrabold text-[10px] flex items-center justify-center shadow-sm">
                    {userEmail.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-700 truncate max-w-[100px]" title={userEmail}>
                    {userEmail.split('@')[0]}
                  </span>
                </button>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm hover:shadow"
                  id="header-sign-in-btn"
                >
                  <UserCheck className="h-3.5 w-3.5 text-slate-500" />
                  <span>Login</span>
                </button>
              )}

              {isPremium ? (
                <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500/10 to-yellow-500/15 border border-amber-500/30 text-amber-900 font-extrabold text-[10.5px] px-3.5 py-2 rounded-xl shadow-sm">
                  <Crown className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                  <span className="font-display">PREMIUM ACTIVE</span>
                  <button
                    onClick={() => setIsSupportModalOpen(true)}
                    className="text-[9.5px] text-amber-800 hover:text-amber-950 font-mono underline ml-1.5 cursor-pointer"
                  >
                    Manage
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSupportModalOpen(true)}
                  className="bg-gradient-to-r from-slate-900 to-slate-950 hover:from-slate-850 hover:to-slate-900 text-white font-extrabold text-xs px-4.5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm hover:shadow transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
                  id="header-upgrade-btn"
                >
                  <Crown className="h-3.5 w-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span>Upgrade</span>
                </button>
              )}
            </div>

            <span className="h-5 w-px bg-slate-200 hidden lg:inline" />

            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-600">
              <span className="text-slate-700 flex items-center gap-1.5">
                Goal: <strong className="text-emerald-700 font-black bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">{selectedExam}</strong>
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
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-sm relative overflow-hidden" id="exam-pitch-banner">
          <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-1.5 max-w-xl relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-800 uppercase tracking-wider font-mono">
              <Sparkles className="h-3 w-3 text-emerald-600 animate-pulse" />
              Active Goal Configuration
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight font-display">
              Select Your Target Examination
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              All study materials, practice quizzes, syllabus items, and AI responses automatically realign to the selected board pattern.
            </p>
          </div>

          {/* Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-7 gap-2 w-full lg:w-auto relative z-10" id="exam-selector-buttons">
            {[
              { id: 'UPSC', label: 'UPSC IAS/IPS' },
              { id: 'TNPSC_G1', label: 'TNPSC Group 1' },
              { id: 'TNPSC_G2', label: 'TNPSC Group 2' },
              { id: 'TNPSC_G4', label: 'TNPSC Group 4' },
              { id: 'SSC_CGL', label: 'SSC CGL' },
              { id: 'RRB_NTPC', label: 'RRB NTPC' },
              { id: 'IIT_JEE', label: 'IIT JEE (Main/Adv)' }
            ].map((examItem) => {
              const isActive = selectedExam === examItem.id;
              return (
                <button
                  key={examItem.id}
                  id={`btn-select-exam-${examItem.id}`}
                  onClick={() => handleSelectExam(examItem.id as ExamType)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 border border-emerald-500 text-white shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-950'
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
          <div className="lg:col-span-3 space-y-6" id="navigation-sidebar-column">
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-6" id="navigation-card-container">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight font-display mb-0.5">Study Desk Dashboard</h3>
                <p className="text-[11px] text-slate-400 font-medium">All modules aligned to {selectedExam}</p>
              </div>

              <nav className="space-y-5" id="navigation-menu">
                {NAVIGATION_GROUPS.map((group) => (
                  <div key={group.title} className="space-y-1.5">
                    <div className="px-1">
                      <span className="text-[10px] font-extrabold tracking-wider text-slate-400 font-mono uppercase">
                        {group.title}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {group.tabs.map((tabId) => {
                        const tab = tabDetails.find((t) => t.id === tabId);
                        if (!tab) return null;
                        const isActive = activeTab === tabId;
                        const Icon = tab.icon;

                        return (
                          <button
                            key={tabId}
                            id={`nav-tab-${tabId}`}
                            onClick={() => {
                              setActiveTab(tabId);
                              // Smooth scroll to work area on mobile
                              if (window.innerWidth < 1024) {
                                document.getElementById('active-work-area')?.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                              isActive
                                ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                                : 'bg-transparent hover:bg-slate-50 text-slate-650 hover:text-slate-900'
                            }`}
                          >
                            <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            {/* Premium Status Widget / Promo Inside Sidebar */}
            {isPremium ? (
              <div className="bg-gradient-to-br from-amber-500/10 to-emerald-500/10 border border-amber-500/35 p-4 rounded-2xl space-y-2 shadow-sm" id="premium-sidebar-active">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amber-500 shrink-0" />
                  <h4 className="font-extrabold text-xs text-slate-900 font-display">Premium Active</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                  You have unlimited access to all AI evaluators, planners & mock tests.
                </p>
                <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-800 font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>ALL LIMITS REMOVED</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 text-white border border-slate-800 p-4.5 rounded-2xl space-y-3 shadow-md" id="premium-sidebar-promo">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-widest text-amber-400 font-bold font-mono">ASPIRES Elite</span>
                  <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5 font-display">
                    ASPIRES Premium 👑
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Unlock unlimited essay evaluations, AI notes & diagnostic mock tests.
                </p>
                <button
                  onClick={() => setIsSupportModalOpen(true)}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-1"
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

            {/* Compact Invite & Outreach Link */}
            <div 
              className="bg-white border border-slate-200 p-4.5 rounded-2xl space-y-3 shadow-xs" 
              id="share-card-sidebar"
            >
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase tracking-widest text-emerald-700 font-bold font-mono">Growth & Outreach 📢</span>
                <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5 font-display">
                  Daily 5 MCQs & WhatsApp Group
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                Join or invite study buddies to our official <strong>aspiresacademy.in</strong> WhatsApp group for daily 5 high-yield MCQs!
              </p>

              <div className="grid grid-cols-1 gap-2 pt-0.5">
                {/* Direct Join WhatsApp Group Link */}
                <a
                  href={localStorage.getItem('aspires_whatsapp_group_url') || 'https://chat.whatsapp.com/aspiresacademy'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-extrabold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Join ASPIRES ACADEMY WhatsApp Group</span>
                </a>

                {/* Share WhatsApp Group & Site Link */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Join official ASPIRES ACADEMY WhatsApp Study Group & Portal for Daily 5 MCQs, AI Voice Lessons, Essay Grading & Mock Tests!\n\n👥 Join Official WhatsApp Group (ASPIRES ACADEMY Study Group): ${localStorage.getItem('aspires_whatsapp_group_url') || 'https://chat.whatsapp.com/aspiresacademy'}\n🌐 Practice Web Portal: https://aspiresacademy.in`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Share Group on WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    const groupUrl = localStorage.getItem('aspires_whatsapp_group_url') || 'https://chat.whatsapp.com/aspiresacademy';
                    const shareText = `Hey! Join official ASPIRES ACADEMY WhatsApp Study Group & Portal for Daily 5 High-Yield MCQs (UPSC, TNPSC, SSC, RRB & IIT JEE), AI Voice Lessons, Essay Evaluation & Mock Tests!\n\n👥 Join Official WhatsApp Group (ASPIRES ACADEMY Study Group): ${groupUrl}\n🌐 Practice Web Portal: https://aspiresacademy.in`;
                    navigator.clipboard.writeText(shareText);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied Group & Site Links!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-500" />
                      <span>Copy Group & Site Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Active Work Area Panel */}
          <div className="lg:col-span-9 space-y-6" id="active-work-area">

            {/* Automated WhatsApp Multi-Exam Broadcast Hub - RESTRICTED TO OWNER ONLY */}
            {isUserAdmin ? (
              <MultiExamWhatsAppBroadcaster 
                getQuestionsForExam={getDailyQuestionsForOutreach}
                currentSeedOffset={dailySeedOffset}
                onRefreshAll={() => {
                  setDailySeedOffset(prev => prev + 1);
                  setOutreachSource('daily');
                }}
              />
            ) : (
              <div className="bg-slate-900 border border-slate-800 text-slate-300 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Send className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white font-display flex items-center gap-1.5">
                      👑 Owner Multi-Exam WhatsApp Broadcaster Control Hub
                    </h4>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Automated 7-exam WhatsApp group dispatcher is reserved for authorized platform administrators.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
                >
                  Sign In as Owner
                </button>
              </div>
            )}

            {/* Prominent Daily 5 Questions to Post on FB, WhatsApp, Telegram */}
            <div 
              className={`bg-white border p-5 md:p-6 rounded-2xl space-y-4 shadow-sm transition-all duration-300 ${
                highlightShareCard 
                  ? 'ring-4 ring-amber-400 border-amber-400 shadow-md' 
                  : 'border-slate-200'
              }`} 
              id="share-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                      {selectedExam} Daily Feed
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Updated for Today</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 font-display mt-1 flex items-center gap-2">
                    📢 Daily 5 MCQs – Post on WhatsApp & Facebook
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    Publish 5 daily high-yield practice MCQs directly to your WhatsApp study groups, Facebook pages, or Telegram channels!
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setDailySeedOffset(prev => prev + 1);
                      setOutreachSource('daily');
                    }}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 cursor-pointer active:scale-95 transition-all flex items-center gap-1"
                    title="Load next daily set of questions"
                  >
                    🔄 Next Daily Set
                  </button>
                  <button
                    onClick={handleGenerateAIOutreach}
                    disabled={isGeneratingOutreach}
                    className={`text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-xl shadow-sm cursor-pointer active:scale-95 transition-all flex items-center gap-1 ${isGeneratingOutreach ? 'opacity-50 pointer-events-none' : ''}`}
                    title="Generate 5 fresh questions with Gemini AI"
                  >
                    {isGeneratingOutreach ? 'Generating...' : '✨ Gen AI Set'}
                  </button>
                </div>
              </div>

              {/* Title & Sharing Controls */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-4 space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase font-mono">Select Title Heading:</label>
                  <select
                    value={selectedHeadingIndex}
                    onChange={(e) => setSelectedHeadingIndex(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-sans focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    <option value={0}>🎯 Daily MCQ Drill</option>
                    <option value={1}>🧠 Can You Crack These 5?</option>
                    <option value={2}>🔥 Prelims Challenge</option>
                    <option value={3}>💡 5 High-Yield MCQs</option>
                  </select>
                </div>

                <div className="md:col-span-8 flex flex-wrap items-center justify-start md:justify-end gap-2 pt-1 md:pt-4">
                  {/* WhatsApp Direct Post Button */}
                  <button
                    onClick={() => {
                      const examName = selectedExam === 'IIT_JEE' ? 'IIT JEE' : selectedExam === 'SSC_CGL' ? 'SSC CGL' : selectedExam === 'RRB_NTPC' ? 'RRB NTPC' : selectedExam.startsWith('TNPSC') ? 'TNPSC' : 'UPSC CSE';
                      const headings = [
                        `🎯 ${examName} DAILY MCQ DRILL – Test Your Limits!`,
                        `🧠 Can You Crack These 5 Elite ${examName} Questions?`,
                        `🔥 ${selectedExam === 'IIT_JEE' ? 'IIT JEE Main & Adv Challenge' : examName + ' Prelims Challenge'}: 5 High-Yield Questions from ASPIRES!`,
                        `💡 5 High-Yield ${examName} Prep MCQs to Boost Your Score Today!`
                      ];
                      const heading = headings[selectedHeadingIndex] || `🎯 ${examName} Daily Challenge`;
                      let questionsText = '';
                      outreachQuestions.forEach((q, index) => {
                        const optionsText = q.options.map((opt, oIdx) => `${String.fromCharCode(65 + oIdx)}) ${opt}`).join('\n');
                        questionsText += `${index + 1}️⃣ ${q.subject || (selectedExam === 'IIT_JEE' ? 'IIT JEE' : 'GENERAL STUDIES')}: ${q.text}\n${optionsText}\n👉 Answer: ${String.fromCharCode(65 + q.correctAnswerIndex)} (${q.options[q.correctAnswerIndex]})\n\n`;
                      });
                      const groupUrl = localStorage.getItem('aspires_whatsapp_group_url') || 'https://chat.whatsapp.com/aspiresacademy';
                      const examGroupName = selectedExam === 'UPSC' ? 'ASPIRES UPSC Prelims Drill Group' :
                        selectedExam === 'TNPSC_G1' ? 'ASPIRES TNPSC Group 1 Officers Club' :
                        selectedExam === 'TNPSC_G2' ? 'ASPIRES TNPSC Group 2 Study Circle' :
                        selectedExam === 'TNPSC_G4' ? 'ASPIRES TNPSC Group 4 & VAO Daily' :
                        selectedExam === 'SSC_CGL' ? 'ASPIRES SSC CGL Tier 1 & 2 Warriors' :
                        selectedExam === 'RRB_NTPC' ? 'ASPIRES RRB Railway Exams Prep' :
                        selectedExam === 'IIT_JEE' ? 'ASPIRES IIT JEE Physics, Chem & Math Elite' :
                        'ASPIRES ACADEMY Study Group';

                      const postText = `${heading}\n\n${questionsText}👥 Join Official WhatsApp Group (${examGroupName}): ${groupUrl}\n\n🚀 Practice on ASPIRES ACADEMY Web Portal: https://aspiresacademy.in\n⚡ Web Portal Features:\n• ✍️ Full-Length Mock Tests\n• 📚 Reference Materials & Study Notes\n• 📅 AI Study Planner & Syllabus Tracker\n• 📊 Performance Analytics & Score Predictor`;
                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(postText)}`, '_blank');
                    }}
                    className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                    id="btn-post-outreach-whatsapp"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Post on WhatsApp</span>
                  </button>

                  {/* Facebook Direct Post Button */}
                  <button
                    onClick={() => {
                      const examName = selectedExam === 'IIT_JEE' ? 'IIT JEE' : selectedExam === 'SSC_CGL' ? 'SSC CGL' : selectedExam === 'RRB_NTPC' ? 'RRB NTPC' : selectedExam.startsWith('TNPSC') ? 'TNPSC' : 'UPSC CSE';
                      const headings = [
                        `🎯 ${examName} DAILY MCQ DRILL`,
                        `🧠 Can You Crack These 5 Elite ${examName} Questions?`,
                        `🔥 ${selectedExam === 'IIT_JEE' ? 'IIT JEE Main & Adv Challenge' : examName + ' Prelims Challenge'}`,
                        `💡 5 High-Yield ${examName} Prep MCQs`
                      ];
                      const heading = headings[selectedHeadingIndex] || `🎯 ${examName} Daily Challenge`;
                      let questionsText = '';
                      outreachQuestions.forEach((q, index) => {
                        const optionsText = q.options.map((opt, oIdx) => `${String.fromCharCode(65 + oIdx)}) ${opt}`).join('\n');
                        questionsText += `${index + 1}️⃣ ${q.subject || (selectedExam === 'IIT_JEE' ? 'IIT JEE' : 'GENERAL STUDIES')}: ${q.text}\n${optionsText}\n👉 Answer: ${String.fromCharCode(65 + q.correctAnswerIndex)}\n\n`;
                      });
                      const postText = `${heading}\n\n${questionsText}🔗 Practice on ASPIRES ACADEMY: https://aspiresacademy.in`;
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://aspiresacademy.in')}&quote=${encodeURIComponent(postText)}`, '_blank');
                    }}
                    className="bg-[#1877F2] hover:bg-[#166fe5] text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                    id="btn-post-outreach-facebook"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Post on Facebook</span>
                  </button>

                  {/* Copy Complete Post Text */}
                  <button
                    onClick={() => {
                      const examName = selectedExam === 'IIT_JEE' ? 'IIT JEE' : selectedExam === 'SSC_CGL' ? 'SSC CGL' : selectedExam === 'RRB_NTPC' ? 'RRB NTPC' : selectedExam.startsWith('TNPSC') ? 'TNPSC' : 'UPSC CSE';
                      const headings = [
                        `🎯 ${examName} DAILY MCQ DRILL – Test Your Limits!`,
                        `🧠 Can You Crack These 5 Elite ${examName} Questions?`,
                        `🔥 ${selectedExam === 'IIT_JEE' ? 'IIT JEE Main & Adv Challenge' : examName + ' Prelims Challenge'}: 5 High-Yield Questions from ASPIRES!`,
                        `💡 5 High-Yield ${examName} Prep MCQs to Boost Your Score Today!`
                      ];
                      const heading = headings[selectedHeadingIndex] || `🎯 ${examName} Daily Challenge`;
                      
                      let questionsText = '';
                      outreachQuestions.forEach((q, index) => {
                        const optionsText = q.options.map((opt, oIdx) => `${String.fromCharCode(65 + oIdx)}) ${opt}`).join('\n');
                        questionsText += `${index + 1}️⃣ ${q.subject || (selectedExam === 'IIT_JEE' ? 'IIT JEE' : 'GENERAL STUDIES')}: ${q.text}\n${optionsText}\n👉 Answer: ${String.fromCharCode(65 + q.correctAnswerIndex)} (${q.options[q.correctAnswerIndex]}) - ${q.explanation}\n\n`;
                      });

                      const groupUrl = localStorage.getItem('aspires_whatsapp_group_url') || 'https://chat.whatsapp.com/aspiresacademy';
                      const examGroupName = selectedExam === 'UPSC' ? 'ASPIRES UPSC Prelims Drill Group' :
                        selectedExam === 'TNPSC_G1' ? 'ASPIRES TNPSC Group 1 Officers Club' :
                        selectedExam === 'TNPSC_G2' ? 'ASPIRES TNPSC Group 2 Study Circle' :
                        selectedExam === 'TNPSC_G4' ? 'ASPIRES TNPSC Group 4 & VAO Daily' :
                        selectedExam === 'SSC_CGL' ? 'ASPIRES SSC CGL Tier 1 & 2 Warriors' :
                        selectedExam === 'RRB_NTPC' ? 'ASPIRES RRB Railway Exams Prep' :
                        selectedExam === 'IIT_JEE' ? 'ASPIRES IIT JEE Physics, Chem & Math Elite' :
                        'ASPIRES ACADEMY Study Group';

                      const postText = `${heading}\n\n${questionsText}---\n🌐 PRACTICE ON ASPIRES ACADEMY WEB PORTAL: https://aspiresacademy.in\n⚡ Web Portal Features:\n• ✍️ Full-Length Mock Tests\n• 📚 Reference Materials & Study Notes\n• 📅 AI Study Planner & Syllabus Tracker\n• 📊 Performance Analytics & Score Predictor\n\n👥 Join Official WhatsApp Group (${examGroupName}): ${groupUrl}\n🎟️ SPECIAL ASPIRANT DISCOUNT: Use Coupon Code "ANNUAL87" to get the ASPIRES Elite Annual Pass for just ₹299/year (87% OFF)!\n🔗 Start Practice on Web Portal: https://aspiresacademy.in`;

                      navigator.clipboard.writeText(postText);
                      setCopiedPost(true);
                      setTimeout(() => setCopiedPost(false), 2500);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm active:scale-95 cursor-pointer"
                  >
                    {copiedPost ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Copied Complete Post!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Post Text</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Question Preview Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-80 overflow-y-auto space-y-3 text-xs text-slate-800 font-sans shadow-inner">
                <div className="font-extrabold text-slate-900 font-display border-b border-slate-200 pb-1.5 mb-2 sticky top-0 bg-slate-50 pt-0.5">
                  {(() => {
                    const examName = selectedExam === 'IIT_JEE' ? 'IIT JEE' : selectedExam === 'SSC_CGL' ? 'SSC CGL' : selectedExam === 'RRB_NTPC' ? 'RRB NTPC' : selectedExam.startsWith('TNPSC') ? 'TNPSC' : 'UPSC CSE';
                    if (selectedHeadingIndex === 0) return `🎯 ${examName} DAILY MCQ DRILL – Test Your Limits!`;
                    if (selectedHeadingIndex === 1) return `🧠 Can You Crack These 5 Elite ${examName} Questions?`;
                    if (selectedHeadingIndex === 2) return `🔥 ${selectedExam === 'IIT_JEE' ? 'IIT JEE Main & Adv Challenge' : examName + ' Prelims Challenge'}: 5 High-Yield Questions from ASPIRES!`;
                    return `💡 5 High-Yield ${examName} Prep MCQs to Boost Your Score Today!`;
                  })()}
                </div>
                
                <div className="space-y-3">
                  {outreachQuestions.map((q, qIdx) => (
                    <div key={q.id || qIdx} className="bg-white border border-slate-200 p-3 rounded-lg space-y-2 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          Q{qIdx + 1} • {q.subject || 'GENERAL STUDIES'}
                        </span>
                      </div>
                      <p className="font-bold text-slate-900 leading-snug">{q.text}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pl-1 text-[11px] text-slate-650">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className={oIdx === q.correctAnswerIndex ? 'font-bold text-emerald-800' : ''}>
                            {String.fromCharCode(65 + oIdx)}) {opt}
                          </div>
                        ))}
                      </div>
                      <div className="text-[10.5px] text-emerald-700 bg-emerald-50/60 p-2 rounded border border-emerald-100 font-medium leading-relaxed">
                        <strong>Correct Answer:</strong> Option {String.fromCharCode(65 + q.correctAnswerIndex)} ({q.options[q.correctAnswerIndex]}).
                        <div className="text-[10px] text-slate-500 mt-0.5">{q.explanation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

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
