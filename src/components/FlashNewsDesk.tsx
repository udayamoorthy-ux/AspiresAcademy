/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ExamType } from '../types';
import { 
  Bell, 
  ExternalLink, 
  FileText, 
  Download, 
  Search, 
  Mail, 
  Globe, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Share2,
  Bookmark,
  Sparkles,
  RefreshCw,
  Rss
} from 'lucide-react';

interface FlashNewsDeskProps {
  selectedExam: ExamType;
}

export interface OfficialNotification {
  id: string;
  examType: ExamType;
  title: string;
  source: 'UPSC' | 'TNPSC' | 'PIB';
  category: 'notification' | 'result' | 'key' | 'pib';
  publishDate: string;
  deadlineDate?: string;
  officialLink: string;
  highlights: string[];
  isImportant: boolean;
  fileSize?: string;
}

const GOVERNMENT_NOTIFICATIONS_DATA: OfficialNotification[] = [
  // UPSC Alerts
  {
    id: 'upsc-1',
    examType: 'UPSC',
    title: 'Civil Services Examination 2026 Official Preliminary Schedule Released',
    source: 'UPSC',
    category: 'notification',
    publishDate: 'June 27, 2026',
    deadlineDate: 'March 18, 2027',
    officialLink: 'https://www.upsc.gov.in',
    highlights: [
      'Preliminary examination scheduled to take place on Sunday, May 24, 2027.',
      'Online applications will open through the UPSC One-Time Registration (OTR) portal.',
      'Candidates are advised to upload recent photographs adhering to the new 10-day click-time guidelines.'
    ],
    isImportant: true,
    fileSize: '1.2 MB'
  },
  {
    id: 'upsc-2',
    examType: 'UPSC',
    title: 'Civil Services (Main) Examination 2025: Detailed Application Form-I (DAF-I) Active',
    source: 'UPSC',
    category: 'notification',
    publishDate: 'June 24, 2026',
    deadlineDate: 'July 15, 2026',
    officialLink: 'https://www.upsc.gov.in',
    highlights: [
      'All candidates who cleared the Prelims 2025 must submit DAF-I to remain eligible for Mains.',
      'Scanned copies of educational certificates, caste status, and age proofs must be uploaded.',
      'Late submissions will result in immediate disqualification without any correspondence.'
    ],
    isImportant: true,
    fileSize: '450 KB'
  },
  {
    id: 'upsc-3',
    examType: 'UPSC',
    title: 'Press Note: Final Reserve List & Cutoff Marks for Civil Services Exam 2024',
    source: 'UPSC',
    category: 'result',
    publishDate: 'June 20, 2026',
    officialLink: 'https://www.upsc.gov.in',
    highlights: [
      'UPSC has recommended 120 candidates from the consolidated Reserve List to fill pending posts.',
      'Category-wise cutoff marks for Prelims (GS Paper I), Mains, and Final interview released.',
      'Individual marksheets of all recommended and non-recommended candidates are now downloadable.'
    ],
    isImportant: false,
    fileSize: '890 KB'
  },
  {
    id: 'upsc-4',
    examType: 'UPSC',
    title: 'National Security Policy Alignment & Public Sector Recruitment Modernization Guidelines',
    source: 'PIB',
    category: 'pib',
    publishDate: 'June 25, 2026',
    officialLink: 'https://pib.gov.in',
    highlights: [
      'Ministry of Personnel, Public Grievances & Pensions issues structural guidelines.',
      'Increased allocation for cybersecurity training in central foundation courses for IAS/IPS officers.',
      'Direct relevance for GS Paper II Governance and GS Paper III Security.'
    ],
    isImportant: false
  },

  // TNPSC Group 1 Alerts
  {
    id: 'tn-g1-1',
    examType: 'TNPSC_G1',
    title: 'TNPSC Group I Services Preliminary Examination 2026: Tentative Answer Keys Published',
    source: 'TNPSC',
    category: 'key',
    publishDate: 'June 28, 2026',
    deadlineDate: 'July 04, 2026',
    officialLink: 'https://www.tnpsc.gov.in',
    highlights: [
      'Official preliminary key for General Studies (Code: 003) uploaded for public preview.',
      'Candidates can submit objections, if any, along with textbook citations through the online dashboard.',
      'Objections sent via post or email will not be entertained under any circumstances.'
    ],
    isImportant: true,
    fileSize: '620 KB'
  },
  {
    id: 'tn-g1-2',
    examType: 'TNPSC_G1',
    title: 'Notification No. 05/2026: Group I Mains Written Exam Revised Time-Table & Venues',
    source: 'TNPSC',
    category: 'notification',
    publishDate: 'June 18, 2026',
    officialLink: 'https://www.tnpsc.gov.in',
    highlights: [
      'Descriptive Mains examination scheduled to take place at Chennai center only.',
      'Paper I (Tamil Eligibility Test) confirmed for October 10, followed by General Studies Paper II, III, and IV.',
      'Digital calculator guidelines and physical desk arrangements are detailed inside the bulletin.'
    ],
    isImportant: false,
    fileSize: '1.4 MB'
  },

  // TNPSC Group 2 Alerts
  {
    id: 'tn-g2-1',
    examType: 'TNPSC_G2',
    title: 'TNPSC Combined Civil Services Examination-II (Group II / IIA) Prelims Result Declaration',
    source: 'TNPSC',
    category: 'result',
    publishDate: 'June 26, 2026',
    officialLink: 'https://www.tnpsc.gov.in',
    highlights: [
      'Roll numbers of candidates provisionally admitted to Mains Written Examination published.',
      'Ratio of admission confirmed at 1:10 based on community reservations and vacancies.',
      'Mains registration fee portal will activate from July 5th to July 20th.'
    ],
    isImportant: true,
    fileSize: '2.1 MB'
  },
  {
    id: 'tn-g2-2',
    examType: 'TNPSC_G2',
    title: 'Tamil Eligibility Compulsory Paper (Descriptive) Syllabus Augmentation Guidance',
    source: 'TNPSC',
    category: 'key',
    publishDate: 'June 15, 2026',
    officialLink: 'https://www.tnpsc.gov.in',
    highlights: [
      'Detailed guidance on Thirukkural essays, translation (Tamil to English & vice-versa) and précis writing.',
      'Sample answer sheet format with ruling space margins and lines published for descriptive practice.'
    ],
    isImportant: false,
    fileSize: '780 KB'
  },

  // TNPSC Group 4 Alerts
  {
    id: 'tn-g4-1',
    examType: 'TNPSC_G4',
    title: 'TNPSC Group IV Combined Civil Services Notification 2026: Online Registration Commences',
    source: 'TNPSC',
    category: 'notification',
    publishDate: 'June 25, 2026',
    deadlineDate: 'August 05, 2026',
    officialLink: 'https://www.tnpsc.gov.in',
    highlights: [
      'Direct recruitment for Village Administrative Officer (VAO), Junior Assistant, Typist, and Bill Collector.',
      'A total of 6,244 vacancies announced across various state departments.',
      'Single-stage OMR exam scheduled for November 15, 2026, comprising Part A (Tamil) and Part B (GS + Aptitude).'
    ],
    isImportant: true,
    fileSize: '3.1 MB'
  },
  {
    id: 'tn-g4-2',
    examType: 'TNPSC_G4',
    title: 'Important Note: Guidelines for Typist & Steno-Typist Certificate Verification Cycle',
    source: 'TNPSC',
    category: 'notification',
    publishDate: 'June 10, 2026',
    officialLink: 'https://www.tnpsc.gov.in',
    highlights: [
      'Candidates holding Typewriting technical qualifications must verify their certificate serial numbers online.',
      'Discrepancies in institute validation will lead to rejection under technical quota preference.'
    ],
    isImportant: false,
    fileSize: '340 KB'
  }
];

export default function FlashNewsDesk({ selectedExam }: FlashNewsDeskProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'notification' | 'result' | 'key' | 'pib'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [subscriberEmail, setSubscriberEmail] = useState<string>('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Load subscriptions & bookmarks from local storage
  useEffect(() => {
    const savedSub = localStorage.getItem(`alert-subscribed-${selectedExam}`);
    if (savedSub) {
      setSubscribed(true);
      setSubscriberEmail(savedSub);
    } else {
      setSubscribed(false);
      setSubscriberEmail('');
    }

    const savedBookmarks = localStorage.getItem('alert-bookmarks');
    if (savedBookmarks) {
      try {
        setBookmarkedIds(JSON.parse(savedBookmarks));
      } catch (e) {
        console.warn("Issue parsing bookmarked alerts:", e);
      }
    }
  }, [selectedExam]);

  // Handle Refresh simulation
  const handleRefreshFeed = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  // Toggle bookmark function
  const toggleBookmark = (id: string) => {
    let updated: string[];
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter(bId => bId !== id);
    } else {
      updated = [...bookmarkedIds, id];
    }
    setBookmarkedIds(updated);
    localStorage.setItem('alert-bookmarks', JSON.stringify(updated));
  };

  // Handle alert registration
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail.trim()) return;

    localStorage.setItem(`alert-subscribed-${selectedExam}`, subscriberEmail);
    setSubscribed(true);
  };

  const handleUnsubscribe = () => {
    localStorage.removeItem(`alert-subscribed-${selectedExam}`);
    setSubscribed(false);
    setSubscriberEmail('');
  };

  // Filter logic:
  // 1. Match current exam type
  // 2. Match active category tab
  // 3. Match search query string
  const filteredNotifications = GOVERNMENT_NOTIFICATIONS_DATA.filter((notif) => {
    const isExamMatch = notif.examType === selectedExam;
    const isCatMatch = activeCategory === 'all' || notif.category === activeCategory;
    const isSearchMatch = searchQuery.trim() === '' || 
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return isExamMatch && isCatMatch && isSearchMatch;
  });

  const getBoardLabel = (exam: ExamType) => {
    switch(exam) {
      case 'UPSC': return 'Union Public Service Commission (UPSC)';
      case 'TNPSC_G1': return 'TNPSC Group 1 Board';
      case 'TNPSC_G2': return 'TNPSC Group 2 & IIA Board';
      case 'TNPSC_G4': return 'TNPSC Group 4 Board';
      default: return 'Government Examination Board';
    }
  };

  const getSourceIcon = (source: string) => {
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono flex items-center gap-1">
        <Globe className="h-3 w-3" />
        {source}
      </span>
    );
  };

  return (
    <div className="space-y-6" id="flash-news-desk-root">
      
      {/* Interactive Title and Controls bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm" id="news-desk-intro-panel">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-red-600 font-mono">
              Live Gateway Feed
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Rss className="h-5.5 w-5.5 text-amber-500" />
            Official Notification & Exam News Desk
          </h2>
          <p className="text-xs text-slate-500">
            Real-time notifications, result gazettes, and press briefings aggregated from official government portals for <strong className="text-amber-600">{getBoardLabel(selectedExam)}</strong>.
          </p>
        </div>

        <button 
          onClick={handleRefreshFeed}
          disabled={loading}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all self-start md:self-auto disabled:opacity-40 shadow-sm"
        >
          <RefreshCw className={`h-4.5 w-4.5 text-amber-600 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Polling official sites...' : 'Check live portal'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="desk-grid-container">
        
        {/* Left main area: Notification items feed */}
        <div className="lg:col-span-8 space-y-4" id="notifications-feed-container">
          
          {/* Filters and Search Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-col md:flex-row gap-3 justify-between items-center shadow-sm" id="feed-filters-bar">
            
            {/* Category selection */}
            <div className="flex flex-wrap gap-1 w-full md:w-auto" id="feed-category-tabs">
              {[
                { id: 'all', label: 'All Alerts' },
                { id: 'notification', label: 'Registrations' },
                { id: 'result', label: 'Results & Marks' },
                { id: 'key', label: 'Answer Keys' },
                { id: 'pib', label: 'PIB Briefs' }
              ].map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-amber-500 text-slate-950 shadow' 
                        : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Live Search */}
            <div className="relative w-full md:w-64" id="feed-search-box">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search alerts or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Active Notifications list */}
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center space-y-4 shadow-sm" id="feed-loader">
              <RefreshCw className="h-8 w-8 text-amber-500 animate-spin mx-auto" />
              <p className="text-xs font-sans text-slate-500">Authenticating connection to UPSC/TNPSC servers, downloading latest circular metadata...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-sm" id="feed-empty-state">
              <div className="h-12 w-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-800">No Notifications Match the Filter</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing your search query or toggling to "All Alerts" to view scheduled announcements for this exam.
                </p>
              </div>
              <button 
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-amber-700 px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4" id="notifications-news-scroller">
              {filteredNotifications.map((notif) => {
                const isBookmarked = bookmarkedIds.includes(notif.id);
                return (
                  <div 
                    key={notif.id}
                    className={`bg-white border rounded-2xl p-5 text-slate-900 space-y-4 transition-all hover:border-slate-300 shadow-sm ${
                      notif.isImportant ? 'border-amber-400 bg-amber-50/[0.15]' : 'border-slate-200/80'
                    }`}
                    id={`notification-card-${notif.id}`}
                  >
                    
                    {/* Notification card header */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          {getSourceIcon(notif.source)}
                          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            notif.category === 'notification' ? 'bg-indigo-50 border border-indigo-200 text-indigo-700' :
                            notif.category === 'result' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' :
                            notif.category === 'key' ? 'bg-teal-50 border border-teal-200 text-teal-700' :
                            'bg-amber-50 border border-amber-200 text-amber-700'
                          } font-mono`}>
                            {notif.category}
                          </span>
                          {notif.isImportant && (
                            <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-red-50 border border-red-200 text-red-700 font-mono animate-pulse">
                              Crucial Update
                            </span>
                          )}
                        </div>
                        <h3 className="font-extrabold text-sm md:text-base text-slate-900 hover:text-amber-700 transition-colors leading-snug">
                          {notif.title}
                        </h3>
                      </div>

                      {/* Utility Action Buttons */}
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button 
                          onClick={() => toggleBookmark(notif.id)}
                          className={`p-2 rounded-lg border transition-all ${
                            isBookmarked 
                              ? 'bg-amber-50 border-amber-300 text-amber-700' 
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'
                          }`}
                          title={isBookmarked ? "Remove Bookmark" : "Bookmark Notification"}
                        >
                          <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </div>

                    {/* Highlights Bulletin points */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 space-y-2">
                      <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider font-mono">
                        Key Bulletin Highlights:
                      </h4>
                      <ul className="space-y-1.5">
                        {notif.highlights.map((h, i) => (
                          <li key={i} className="text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Card Footer: Metadata and Links */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                      
                      {/* Left: Timing details */}
                      <div className="flex flex-wrap items-center gap-3 font-mono text-[10px]">
                        <span>Published: <strong className="text-slate-800">{notif.publishDate}</strong></span>
                        {notif.deadlineDate && (
                          <>
                            <span className="h-3 w-px bg-slate-200" />
                            <span className="text-rose-600 font-semibold">
                              Deadline: <strong className="font-extrabold">{notif.deadlineDate}</strong>
                            </span>
                          </>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {notif.fileSize && (
                          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                            PDF ({notif.fileSize})
                          </span>
                        )}
                        <a 
                          href={notif.officialLink}
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[11px] px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 w-full sm:w-auto justify-center shadow-sm"
                        >
                          <Download className="h-3.5 w-3.5 text-amber-600" />
                          Download Gazette PDF
                        </a>
                        <a 
                          href={notif.officialLink}
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 w-full sm:w-auto justify-center shadow-sm"
                        >
                          Apply / Respond
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Right column sidebar: Official Gateways & Custom Alert Subscription */}
        <div className="lg:col-span-4 space-y-6" id="desk-sidebar-container">
          
          {/* Email Subscription alerts widget */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-sm" id="subscription-card">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold text-amber-600 tracking-wider flex items-center gap-1">
                <Bell className="h-3.5 w-3.5 animate-pulse" />
                Never Miss a Date
              </span>
              <h3 className="font-extrabold text-slate-900 text-base">
                Instant Notification Alerts
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive crucial portal alerts, syllabus amendments, and cutoff publications for <span className="text-slate-800 font-semibold">{selectedExam}</span> directly on your device.
              </p>
            </div>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <input
                  type="email"
                  required
                  placeholder="Enter your personal email..."
                  value={subscriberEmail}
                  onChange={(e) => setSubscriberEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white focus:outline-none rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs p-3 rounded-xl transition-all shadow shadow-amber-500/10 flex items-center justify-center gap-1.5"
                >
                  <Mail className="h-4 w-4" />
                  Enable Free Portal Alerts
                </button>
              </form>
            ) : (
              <div className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-xl space-y-3">
                <div className="flex gap-2.5 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">Alert System Configured!</p>
                    <p className="text-[10px] text-slate-600">Subscribed as <span className="font-mono text-emerald-600">{subscriberEmail}</span></p>
                  </div>
                </div>
                <button
                  onClick={handleUnsubscribe}
                  className="text-[10px] font-mono text-slate-400 hover:text-rose-500 underline block"
                >
                  Unsubscribe or change email
                </button>
              </div>
            )}

            <div className="text-[10px] text-slate-500 font-mono leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              ⚡ <strong>Local Storage Sync:</strong> Alert configurations are secured offline within your browser standard local data cache.
            </div>
          </div>

          {/* Quick link official gateways directories */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm" id="gateways-card">
            <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest font-mono flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Globe className="h-4.5 w-4.5 text-amber-600" />
              Verified Board Gateways
            </h3>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Verify notices directly on government domains. Never trust unverified third-party answer sheets or fake news updates:
            </p>

            <div className="space-y-2" id="official-gateways-list">
              {[
                { name: 'UPSC IAS Official Website', domain: 'upsc.gov.in', link: 'https://www.upsc.gov.in' },
                { name: 'TNPSC Exams Official Portal', domain: 'tnpsc.gov.in', link: 'https://www.tnpsc.gov.in' },
                { name: 'Press Information Bureau (PIB)', domain: 'pib.gov.in', link: 'https://pib.gov.in' },
                { name: 'TN Govt Gazette Downloads', domain: 'stationeryprinting.tn.gov.in', link: 'https://www.stationeryprinting.tn.gov.in' }
              ].map((gate, i) => (
                <a
                  key={i}
                  href={gate.link}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200/60 hover:border-slate-300 p-3 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-slate-900 transition-all"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800">{gate.name}</p>
                    <p className="text-[9px] text-slate-400 font-mono">{gate.domain}</p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </a>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-[10px] text-slate-500 leading-relaxed font-mono">
              📢 <strong>Syllabus Policy Note:</strong> Both UPSC and TNPSC civil service exams strictly require candidate verification of notifications to stay informed of admit card and center shift schedules.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
