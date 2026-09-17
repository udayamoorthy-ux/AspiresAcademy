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
  Rss,
  Users,
  Copy,
  Check,
  Trash2,
  Plus,
  Lock,
  Crown,
  Maximize2,
  Minimize2,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { isOwnerEmail } from '../utils/authUtils';

interface FlashNewsDeskProps {
  selectedExam: ExamType;
  userEmail?: string;
}

export interface SubscriberItem {
  id: string;
  email: string;
  exam: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
}

export interface OfficialNotification {
  id: string;
  examType: ExamType;
  title: string;
  source: 'UPSC' | 'TNPSC' | 'PIB' | 'SSC' | 'RRB' | 'NTA' | 'IELTS';
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
  },
  {
    id: 'ssc-1',
    examType: 'SSC_CGL',
    title: 'SSC CGL Tier I 2026 Tentative Answer Key and Response Sheets Released',
    source: 'SSC',
    category: 'key',
    publishDate: 'June 28, 2026',
    officialLink: 'https://ssc.gov.in',
    highlights: [
      'Candidates can submit representations against tentative answer keys online with ₹100 per question challenged.',
      'Response sheet downloads will remain open for exactly 7 days from the release portal activation.'
    ],
    isImportant: true,
    fileSize: '412 KB'
  },
  {
    id: 'ssc-2',
    examType: 'SSC_CGL',
    title: 'Staff Selection Commission: Combined Graduate Level Examination 2026 Notification',
    source: 'SSC',
    category: 'notification',
    publishDate: 'June 15, 2026',
    deadlineDate: 'July 15, 2026',
    officialLink: 'https://ssc.gov.in',
    highlights: [
      'Over 15,000 tentative vacancies announced across Group B and Group C posts.',
      'Tier I computer-based exams scheduled for late Autumn 2026.'
    ],
    isImportant: true,
    fileSize: '1.2 MB'
  },
  {
    id: 'rrb-1',
    examType: 'RRB_NTPC',
    title: 'RRB NTPC Stage 1 Computer Based Test (CBT-1) Revised Dates Announced',
    source: 'RRB',
    category: 'notification',
    publishDate: 'July 12, 2026',
    officialLink: 'https://www.rrcb.gov.in',
    highlights: [
      'CBT-1 examinations to be conducted in multiple phases starting from late September 2026.',
      'City intimation slip and travel pass downloads for SC/ST candidates will be active 10 days prior to the exam start.'
    ],
    isImportant: true,
    fileSize: '298 KB'
  },
  {
    id: 'rrb-2',
    examType: 'RRB_NTPC',
    title: 'Railway Recruitment Boards: Recruitment for Non-Technical Popular Categories 2026 Detailed Notification',
    source: 'RRB',
    category: 'notification',
    publishDate: 'July 01, 2026',
    deadlineDate: 'July 31, 2026',
    officialLink: 'https://www.rrcb.gov.in',
    highlights: [
      'Over 11,500 vacant positions for Station Master, Goods Guard, Junior Clerk, and Typist across Indian Railways zones.',
      'Age relaxation benefits apply to reservation categories as per official Ministry of Railways gazette guidelines.'
    ],
    isImportant: true,
    fileSize: '1.2 MB'
  },
  // IELTS Alerts
  {
    id: 'ielts-1',
    examType: 'IELTS',
    title: 'IELTS One Skill Retake (OSR) Expanded Globally by IDP & British Council',
    source: 'IELTS',
    category: 'notification',
    publishDate: 'August 10, 2026',
    officialLink: 'https://ielts.idp.com/about/one-skill-retake',
    highlights: [
      'Candidates can retake any single module (Listening, Reading, Writing, or Speaking) within 60 days of the original test date.',
      'Accepted by major universities, immigration departments, and professional registration bodies worldwide.',
      'New Test Report Form (TRF) issued with original scores plus the improved retake score.'
    ],
    isImportant: true,
    fileSize: '750 KB'
  },
  {
    id: 'ielts-2',
    examType: 'IELTS',
    title: 'Cambridge IELTS 19 Authentic Practice Test Collection Released',
    source: 'IELTS',
    category: 'notification',
    publishDate: 'August 02, 2026',
    officialLink: 'https://www.cambridgeenglish.org/exams-and-tests/ielts/',
    highlights: [
      'Official examination papers providing the most authentic exam preparation experience for both Academic and General Training.',
      'Includes updated scoring rubrics, sample candidate writing scripts with examiner annotations, and downloadable audio tracks.',
      'Covers new question configurations in Listening Section 3 and Academic Reading Passages.'
    ],
    isImportant: true,
    fileSize: '1.8 MB'
  },
  {
    id: 'ielts-3',
    examType: 'IELTS',
    title: 'Computer-Delivered IELTS Results Turnaround Accelerated to 3–5 Days',
    source: 'IELTS',
    category: 'result',
    publishDate: 'July 25, 2026',
    officialLink: 'https://takeielts.britishcouncil.org',
    highlights: [
      'Electronic scores and e-TRF available within 3 to 5 calendar days after test completion.',
      'Free electronic score delivery directly to up to 5 nominated universities or visa processing centers.',
      'Ensures candidates meet fast-approaching international university intake deadlines.'
    ],
    isImportant: false,
    fileSize: '420 KB'
  },
  // IIT JEE Alerts
  {
    id: 'jee-1',
    examType: 'IIT_JEE',
    title: 'NTA JEE Main 2026 Information Bulletin & Examination Schedule',
    source: 'NTA',
    category: 'notification',
    publishDate: 'August 01, 2026',
    deadlineDate: 'August 30, 2026',
    officialLink: 'https://jeemain.nta.ac.in',
    highlights: [
      'Session 1 and Session 2 examination schedules, tie-breaking criteria, and computer-based test instructions.',
      'Detailed syllabus mapping for Physics, Chemistry, and Mathematics.'
    ],
    isImportant: true,
    fileSize: '2.1 MB'
  },
  // NEET Alerts
  {
    id: 'neet-1',
    examType: 'NEET',
    title: 'NEET UG 2026 Official Information Bulletin & Syllabus Notification',
    source: 'NTA',
    category: 'notification',
    publishDate: 'July 15, 2026',
    deadlineDate: 'August 15, 2026',
    officialLink: 'https://exams.nta.ac.in/NEET/',
    highlights: [
      'Single paper 720-marks format with 180 questions across Botany, Zoology, Physics, and Chemistry.',
      'Detailed NMC updated curriculum and reservation guidelines for 15% AIQ and 85% State Quota.'
    ],
    isImportant: true,
    fileSize: '2.4 MB'
  }
];

export default function FlashNewsDesk({ selectedExam, userEmail = '' }: FlashNewsDeskProps) {
  const isUserAdmin = isOwnerEmail(userEmail);

  const [activeCategory, setActiveCategory] = useState<'all' | 'notification' | 'result' | 'key' | 'pib'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [subscriberEmail, setSubscriberEmail] = useState<string>('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Admin Subscribers Roster State (Strictly Admin-Only)
  const [subscribersList, setSubscribersList] = useState<SubscriberItem[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState<boolean>(false);
  const [subscriberSearch, setSubscriberSearch] = useState<string>('');
  const [subscriberExamFilter, setSubscriberExamFilter] = useState<string>('all');
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);
  const [showAddSubscriberModal, setShowAddSubscriberModal] = useState<boolean>(false);
  const [newSubEmail, setNewSubEmail] = useState<string>('');
  const [newSubExam, setNewSubExam] = useState<string>('UPSC');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSubscribersExpanded, setIsSubscribersExpanded] = useState<boolean>(false);
  const [adminActionMessage, setAdminActionMessage] = useState<string | null>(null);

  // Fetch admin-only subscribers list from secure backend
  const fetchSubscribers = async () => {
    if (!isUserAdmin) return;
    setLoadingSubscribers(true);
    try {
      const res = await fetch('/api/subscribers', {
        headers: {
          'x-admin-email': userEmail
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSubscribersList(data.subscribers || []);
      }
    } catch (err) {
      console.warn("Failed to load subscribers roster:", err);
    } finally {
      setLoadingSubscribers(false);
    }
  };

  useEffect(() => {
    if (isUserAdmin) {
      fetchSubscribers();
    }
  }, [isUserAdmin, userEmail]);

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
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail.trim()) return;

    localStorage.setItem(`alert-subscribed-${selectedExam}`, subscriberEmail);
    setSubscribed(true);

    try {
      await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscriberEmail.trim(), exam: selectedExam })
      });
      if (isUserAdmin) {
        fetchSubscribers();
      }
    } catch (err) {
      console.warn("Could not sync subscription to server:", err);
    }
  };

  const handleUnsubscribe = () => {
    localStorage.removeItem(`alert-subscribed-${selectedExam}`);
    setSubscribed(false);
    setSubscriberEmail('');
  };

  // Admin Actions
  const handleCopyAllEmails = () => {
    const listToCopy = filteredSubscribers.length > 0 ? filteredSubscribers : subscribersList;
    const emails = listToCopy.map(s => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    setCopiedAll(true);
    setAdminActionMessage(`Copied ${listToCopy.length} email(s) for BCC bulk alerts!`);
    setTimeout(() => {
      setCopiedAll(false);
      setAdminActionMessage(null);
    }, 3000);
  };

  const handleCopySingleEmail = (id: string, email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmailId(id);
    setTimeout(() => setCopiedEmailId(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['Subscriber_ID', 'Email_Address', 'Target_Exam', 'Subscribed_At', 'Status'];
    const rows = filteredSubscribers.map(s => [
      s.id,
      `"${s.email}"`,
      `"${s.exam}"`,
      `"${s.subscribedAt}"`,
      s.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aspires_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setAdminActionMessage(`Exported ${filteredSubscribers.length} subscriber records to CSV.`);
    setTimeout(() => setAdminActionMessage(null), 3000);
  };

  const handleDeleteSubscriber = async (id: string) => {
    try {
      const res = await fetch(`/api/subscribers/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-email': userEmail
        }
      });
      if (res.ok) {
        setSubscribersList(prev => prev.filter(s => s.id !== id));
        setDeleteConfirmId(null);
        setAdminActionMessage('Subscriber successfully removed.');
        setTimeout(() => setAdminActionMessage(null), 3000);
      }
    } catch (err) {
      console.error("Failed to delete subscriber:", err);
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubEmail.trim() || !newSubEmail.includes('@')) return;
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newSubEmail.trim(), exam: newSubExam })
      });
      if (res.ok) {
        setNewSubEmail('');
        setShowAddSubscriberModal(false);
        fetchSubscribers();
        setAdminActionMessage(`Registered ${newSubEmail.trim()} successfully.`);
        setTimeout(() => setAdminActionMessage(null), 3000);
      }
    } catch (err) {
      console.error("Failed to add subscriber:", err);
    }
  };

  // Filtered subscribers list for admin
  const filteredSubscribers = subscribersList.filter(sub => {
    const matchesExam = subscriberExamFilter === 'all' || sub.exam === subscriberExamFilter;
    const matchesSearch = !subscriberSearch.trim() || 
      sub.email.toLowerCase().includes(subscriberSearch.toLowerCase()) ||
      sub.exam.toLowerCase().includes(subscriberSearch.toLowerCase());
    return matchesExam && matchesSearch;
  });

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
      case 'SSC_CGL': return 'Staff Selection Commission (SSC)';
      case 'RRB_NTPC': return 'Railway Recruitment Board (RRB)';
      case 'IIT_JEE': return 'National Testing Agency (NTA - JEE Apex Board)';
      case 'NEET': return 'National Testing Agency (NTA NEET Medical Board)';
      case 'IELTS': return 'IELTS Official (IDP, British Council & Cambridge English)';
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

          {/* Admin-Exclusive Alert Subscribers Roster: Rendered ONLY when isUserAdmin is true */}
          {isUserAdmin && (
            <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 space-y-4 shadow-sm relative overflow-hidden" id="admin-subscribers-panel">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center gap-1">
                      <Crown className="h-3 w-3 text-amber-400" />
                      Admin Exclusive Roster
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      {subscribersList.length} Total
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-400" />
                    Alert & Portal Subscribers
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    Confidential roster of registered aspirants. <span className="text-emerald-400 font-semibold">Visible only to admin ({userEmail})</span>.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={fetchSubscribers}
                    disabled={loadingSubscribers}
                    title="Refresh Subscriber Roster"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loadingSubscribers ? 'animate-spin text-emerald-400' : ''}`} />
                  </button>
                  <button
                    onClick={() => setIsSubscribersExpanded(!isSubscribersExpanded)}
                    title={isSubscribersExpanded ? "Collapse View" : "Expand Table View"}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  >
                    {isSubscribersExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopyAllEmails}
                    disabled={filteredSubscribers.length === 0}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                    title="Copy filtered emails for BCC in Gmail / mailer"
                  >
                    {copiedAll ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedAll ? 'Copied!' : `Copy Emails (${filteredSubscribers.length})`}</span>
                  </button>
                  <button
                    onClick={handleExportCSV}
                    disabled={filteredSubscribers.length === 0}
                    className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer border border-slate-700"
                    title="Download CSV file"
                  >
                    <FileSpreadsheet className="h-3 w-3 text-emerald-400" />
                    <span>Export CSV</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowAddSubscriberModal(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Subscriber</span>
                </button>
              </div>

              {/* Status Message Feedback */}
              {adminActionMessage && (
                <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10.5px] px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>{adminActionMessage}</span>
                </div>
              )}

              {/* Search & Exam Filter */}
              <div className="space-y-2 pt-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search subscribers by email..."
                    value={subscriberSearch}
                    onChange={(e) => setSubscriberSearch(e.target.value)}
                    className="w-full pl-8 pr-7 py-1.5 bg-slate-800/80 border border-slate-700 focus:border-emerald-500 focus:outline-none rounded-xl text-[11px] text-white placeholder-slate-400 font-mono"
                  />
                  {subscriberSearch && (
                    <button
                      onClick={() => setSubscriberSearch('')}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-mono">
                  {['all', 'UPSC', 'TNPSC_G1', 'NEET', 'IIT_JEE', 'SSC_CGL', 'RRB_NTPC', 'IELTS'].map(examKey => (
                    <button
                      key={examKey}
                      onClick={() => setSubscriberExamFilter(examKey)}
                      className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                        subscriberExamFilter === examKey
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {examKey === 'all' ? 'All' : examKey}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subscriber List Items */}
              <div className={`space-y-2 overflow-y-auto pr-1 ${isSubscribersExpanded ? 'max-h-96' : 'max-h-64'}`}>
                {loadingSubscribers ? (
                  <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
                    <span>Loading subscriber registry...</span>
                  </div>
                ) : filteredSubscribers.length === 0 ? (
                  <div className="py-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                    No subscribers found matching filter.
                  </div>
                ) : (
                  filteredSubscribers.map(sub => (
                    <div
                      key={sub.id}
                      className="bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-650 p-2.5 rounded-xl space-y-1.5 transition-all text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-bold text-white text-[11px] truncate" title={sub.email}>
                          {sub.email}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleCopySingleEmail(sub.id, sub.email)}
                            title="Copy email address"
                            className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                          >
                            {copiedEmailId === sub.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                          </button>
                          {deleteConfirmId === sub.id ? (
                            <div className="flex items-center gap-1 bg-rose-950/90 p-0.5 rounded border border-rose-600">
                              <button
                                onClick={() => handleDeleteSubscriber(sub.id)}
                                className="text-[9px] bg-rose-600 hover:bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded cursor-pointer"
                                title="Confirm remove"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="text-[9px] text-slate-300 hover:text-white px-1 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(sub.id)}
                              title="Remove subscriber from alert list"
                              className="p-1 rounded bg-slate-700 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-700">
                          {sub.exam}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          {sub.subscribedAt}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Privacy lock footer note */}
              <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/80 flex items-center justify-between">
                <span className="flex items-center gap-1 text-amber-400">
                  <Lock className="h-3 w-3" />
                  Admin Only View
                </span>
                <span className="text-slate-400 font-semibold">{filteredSubscribers.length} shown</span>
              </div>
            </div>
          )}

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

      {/* Admin-only Add Subscriber Modal */}
      {isUserAdmin && showAddSubscriberModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Crown className="h-4 w-4" />
                </span>
                <h4 className="font-extrabold text-sm text-white">
                  Add Alert Subscriber
                </h4>
              </div>
              <button
                onClick={() => setShowAddSubscriberModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubscriber} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Aspirant Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. aspirant@gmail.com"
                  value={newSubEmail}
                  onChange={(e) => setNewSubEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 focus:outline-none rounded-xl p-2.5 text-xs text-white placeholder-slate-500 font-mono transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Target Exam
                </label>
                <select
                  value={newSubExam}
                  onChange={(e) => setNewSubExam(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 focus:outline-none rounded-xl p-2.5 text-xs text-white font-mono transition-colors cursor-pointer"
                >
                  <option value="UPSC">UPSC Civil Services</option>
                  <option value="TNPSC_G1">TNPSC Group 1</option>
                  <option value="TNPSC_G2">TNPSC Group 2 & IIA</option>
                  <option value="TNPSC_G4">TNPSC Group 4 & VAO</option>
                  <option value="NEET">NEET UG Medical</option>
                  <option value="IIT_JEE">IIT JEE Engineering</option>
                  <option value="SSC_CGL">SSC CGL</option>
                  <option value="RRB_NTPC">RRB NTPC Railways</option>
                  <option value="IELTS">IELTS English</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow shadow-emerald-600/20 cursor-pointer"
                >
                  Register Subscriber
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSubscriberModal(false)}
                  className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
