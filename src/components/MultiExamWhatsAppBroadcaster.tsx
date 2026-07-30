import React, { useState } from 'react';
import { 
  Send, 
  Copy, 
  Check, 
  Bot, 
  Code, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw,
  Play,
  Share2,
  Clock,
  Layers,
  MessageSquare
} from 'lucide-react';
import { ExamType, Question } from '../types';

interface MultiExamWhatsAppBroadcasterProps {
  getQuestionsForExam: (exam: ExamType, seedOffset?: number) => Question[];
  currentSeedOffset: number;
  onRefreshAll: () => void;
}

interface ExamInfo {
  id: ExamType;
  name: string;
  badge: string;
  color: string;
  icon: string;
  groupName: string;
  description: string;
}

const EXAM_CHANNELS: ExamInfo[] = [
  {
    id: 'UPSC',
    name: 'UPSC Civil Services (CSE)',
    badge: 'UPSC CSE',
    color: 'bg-amber-600 text-amber-50 border-amber-700',
    icon: '🏛️',
    groupName: 'ASPIRES UPSC Prelims Drill Group',
    description: 'Polity, History, Economy, General Science & CSAT'
  },
  {
    id: 'TNPSC_G1',
    name: 'TNPSC Group 1 (Deputy Collector / DSP)',
    badge: 'TNPSC G1',
    color: 'bg-emerald-600 text-emerald-50 border-emerald-700',
    icon: '👑',
    groupName: 'ASPIRES TNPSC Group 1 Officers Club',
    description: 'Tamil Heritage, Unit 8/9, GS & Aptitude'
  },
  {
    id: 'TNPSC_G2',
    name: 'TNPSC Group 2 & 2A (Executive)',
    badge: 'TNPSC G2',
    color: 'bg-teal-600 text-teal-50 border-teal-700',
    icon: '📜',
    groupName: 'ASPIRES TNPSC Group 2 Study Circle',
    description: 'General Tamil, Social Justice, Aptitude & GS'
  },
  {
    id: 'TNPSC_G4',
    name: 'TNPSC Group 4 & VAO',
    badge: 'TNPSC G4',
    color: 'bg-green-600 text-green-50 border-green-700',
    icon: '🌾',
    groupName: 'ASPIRES TNPSC Group 4 & VAO Daily',
    description: 'Pothu Tamil, Samacheer Kalvi GS & Mental Ability'
  },
  {
    id: 'SSC_CGL',
    name: 'SSC CGL (Tiers 1 & 2)',
    badge: 'SSC CGL',
    color: 'bg-blue-600 text-blue-50 border-blue-700',
    icon: '🏢',
    groupName: 'ASPIRES SSC CGL Tier 1 & 2 Warriors',
    description: 'Quant, Reasoning, General Awareness & English'
  },
  {
    id: 'RRB_NTPC',
    name: 'RRB NTPC (Railway CBT 1 & 2)',
    badge: 'RRB NTPC',
    color: 'bg-indigo-600 text-indigo-50 border-indigo-700',
    icon: '🚆',
    groupName: 'ASPIRES RRB Railway Exams Prep',
    description: 'General Science, Math, General Intelligence'
  },
  {
    id: 'IIT_JEE',
    name: 'IIT JEE (Main & Advanced)',
    badge: 'IIT JEE',
    color: 'bg-purple-600 text-purple-50 border-purple-700',
    icon: '⚛️',
    groupName: 'ASPIRES IIT JEE Physics, Chem & Math Elite',
    description: 'Physics, Chemistry & Higher Mathematics'
  }
];

export const MultiExamWhatsAppBroadcaster: React.FC<MultiExamWhatsAppBroadcasterProps> = ({
  getQuestionsForExam,
  currentSeedOffset,
  onRefreshAll
}) => {
  const [activeTab, setActiveTab] = useState<'DISPATCHER' | 'PREVIEW' | 'AUTOMATION_BOT'>('DISPATCHER');
  const [copiedExamId, setCopiedExamId] = useState<string | null>(null);
  const [expandedExam, setExpandedExam] = useState<ExamType | null>('UPSC');
  const [sequenceStep, setSequenceStep] = useState<number | null>(null);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState<boolean>(false);
  const [whatsappGroupLink, setWhatsappGroupLink] = useState<string>(() => {
    return localStorage.getItem('aspires_whatsapp_group_url') || 'https://chat.whatsapp.com/aspiresacademy';
  });
  const [isEditingLink, setIsEditingLink] = useState<boolean>(false);

  const handleSaveGroupLink = (newUrl: string) => {
    setWhatsappGroupLink(newUrl);
    localStorage.setItem('aspires_whatsapp_group_url', newUrl);
  };

  // Helper to format post text for an exam
  const buildExamPostText = (examInfo: ExamInfo): string => {
    const questions = getQuestionsForExam(examInfo.id, currentSeedOffset);
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    let qText = '';
    questions.forEach((q, idx) => {
      const opts = q.options.map((o, oIdx) => `  ${String.fromCharCode(65 + oIdx)}) ${o}`).join('\n');
      qText += `*Q${idx + 1}. [${q.subject || examInfo.badge}]* ${q.text}\n${opts}\n👉 *Answer:* ${String.fromCharCode(65 + q.correctAnswerIndex)} (${q.options[q.correctAnswerIndex]})\n💡 _${q.explanation.replace(/\n/g, ' ')}_\n\n`;
    });

    const groupUrl = whatsappGroupLink.trim() || 'https://chat.whatsapp.com/aspiresacademy';

    return `🎯 *ASPIRES ACADEMY (${examInfo.badge}) DAILY 5 MCQ DRILL*
📅 *Date:* ${dateStr}
📍 *Group:* ${examInfo.groupName}

${qText}---
🚀 *ASPIRES ACADEMY* (https://aspiresacademy.in)
Practice syllabus trackers, AI voice lessons, essay grading, flashcards & mock tests!
👥 *Join Official WhatsApp Group:* ${groupUrl}
🌐 *Practice Web Portal:* https://aspiresacademy.in
🎟️ *SPECIAL DISCOUNT:* Coupon *ANNUAL87* for Annual Pass @ ₹299/year (87% OFF)`;
  };

  // Dispatch single exam to WhatsApp
  const handleSendToWhatsApp = (examInfo: ExamInfo) => {
    const text = buildExamPostText(examInfo);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Copy single exam post text
  const handleCopyPost = (examInfo: ExamInfo) => {
    const text = buildExamPostText(examInfo);
    navigator.clipboard.writeText(text);
    setCopiedExamId(examInfo.id);
    setTimeout(() => setCopiedExamId(null), 2500);
  };

  // Sequential batch launcher
  const handleStartSequence = () => {
    setSequenceStep(0);
    // Launch first
    handleSendToWhatsApp(EXAM_CHANNELS[0]);
  };

  const handleNextSequenceStep = () => {
    if (sequenceStep !== null && sequenceStep < EXAM_CHANNELS.length - 1) {
      const nextStep = sequenceStep + 1;
      setSequenceStep(nextStep);
      handleSendToWhatsApp(EXAM_CHANNELS[nextStep]);
    } else {
      setSequenceStep(null);
    }
  };

  const nodeScriptExample = `// ASPIRES ACADEMY - Daily 5 Questions WhatsApp Auto-Broadcaster Script
// Run via Node.js cron daily at 08:00 AM IST
import fetch from 'node-fetch';

const EXAMS = ['UPSC', 'TNPSC_G1', 'TNPSC_G2', 'TNPSC_G4', 'SSC_CGL', 'RRB_NTPC', 'IIT_JEE'];
const WEBSITE_URL = 'https://aspiresacademy.in';

async function broadcastDaily5ToWhatsApp() {
  console.log('🚀 Fetching Daily 5 questions payload from ASPIRES API...');
  
  const response = await fetch(\`\${WEBSITE_URL}/api/daily-broadcast-payload?exam=ALL\`);
  const data = await response.json();

  for (const examData of data.broadcasts) {
    console.log(\`📲 Broadcasting Daily 5 for \${examData.examName}...\`);
    
    // Example using UltraMsg / Green API / Baileys / WhatsApp Business Webhook
    /*
    await fetch('https://api.ultramsg.com/INSTANCE_ID/messages/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: 'YOUR_WHATSAPP_TOKEN',
        to: examData.whatsappGroupJid, // e.g. 120363041234567890@g.us
        body: examData.formattedText
      })
    });
    */
    console.log(\`✅ Posted to \${examData.groupName}\`);
  }
}

broadcastDaily5ToWhatsApp();`;

  return (
    <div className="bg-white border border-emerald-200 rounded-2xl shadow-sm overflow-hidden" id="whatsapp-auto-broadcaster">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-5 md:p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#25D366] text-slate-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full font-mono tracking-wider flex items-center gap-1 shadow-xs">
                <Send className="h-3 w-3" /> WhatsApp Auto-Broadcast
              </span>
              <span className="bg-emerald-900/60 text-emerald-200 text-xs px-2 py-0.5 rounded font-mono border border-emerald-500/30">
                aspiresacademy.in
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black font-display tracking-tight text-white flex items-center gap-2">
              📱 Multi-Exam WhatsApp Daily 5 Auto-Dispatcher
            </h2>
            <p className="text-xs md:text-sm text-emerald-100/90 font-sans max-w-2xl">
              Automated daily 5 MCQs for all 7 exam categories ready for instant WhatsApp group dispatching & background cron bots!
            </p>

            {/* Editable WhatsApp Group Invite URL */}
            <div className="bg-emerald-900/80 border border-emerald-500/40 p-2.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-2">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-100">
                <span className="font-extrabold text-amber-300 flex items-center gap-1 shrink-0">
                  👥 Group Invite URL:
                </span>
                {isEditingLink ? (
                  <input
                    type="url"
                    value={whatsappGroupLink}
                    onChange={(e) => setWhatsappGroupLink(e.target.value)}
                    className="bg-emerald-950 border border-emerald-400 text-white font-mono text-xs px-2 py-1 rounded w-64 focus:outline-none"
                    placeholder="https://chat.whatsapp.com/..."
                  />
                ) : (
                  <span className="bg-emerald-950/70 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-700/50 truncate max-w-xs sm:max-w-md">
                    {whatsappGroupLink}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {isEditingLink ? (
                  <button
                    onClick={() => {
                      handleSaveGroupLink(whatsappGroupLink);
                      setIsEditingLink(false);
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] px-2.5 py-1 rounded cursor-pointer transition-all"
                  >
                    Save URL
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingLink(true)}
                    className="bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-[11px] font-bold px-2 py-1 rounded cursor-pointer border border-emerald-600 transition-all"
                  >
                    Edit Group URL
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onRefreshAll}
              className="bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 hover:text-white border border-emerald-400/30 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="Refresh questions seed for today"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Next Daily Seed</span>
            </button>
            <button
              onClick={handleStartSequence}
              className="bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Zap className="h-4 w-4 fill-slate-950" />
              <span>Batch Send All 7 Exams</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 border-t border-emerald-600/50 pt-3">
          <button
            onClick={() => setActiveTab('DISPATCHER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'DISPATCHER'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'bg-emerald-800/50 text-emerald-100 hover:bg-emerald-800'
            }`}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Multi-Exam Dispatcher ({EXAM_CHANNELS.length} Exams)</span>
          </button>
          <button
            onClick={() => setActiveTab('PREVIEW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'PREVIEW'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'bg-emerald-800/50 text-emerald-100 hover:bg-emerald-800'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Full Content Inspector</span>
          </button>
          <button
            onClick={() => setActiveTab('AUTOMATION_BOT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'AUTOMATION_BOT'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'bg-emerald-800/50 text-emerald-100 hover:bg-emerald-800'
            }`}
          >
            <Bot className="h-3.5 w-3.5" />
            <span>Webhook & Cron Bot API</span>
          </button>
        </div>
      </div>

      {/* Batch Stepper Modal Banner (if active sequence) */}
      {sequenceStep !== null && (
        <div className="bg-amber-50 border-b border-amber-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white font-extrabold text-sm font-mono shadow-xs">
              {sequenceStep + 1}/7
            </span>
            <div>
              <h4 className="text-xs font-black text-amber-950 font-display">
                Batch Posting Sequence in Progress: {EXAM_CHANNELS[sequenceStep].name}
              </h4>
              <p className="text-[11px] text-amber-800 font-sans">
                WhatsApp tab opened for {EXAM_CHANNELS[sequenceStep].groupName}. Click 'Send' in WhatsApp, then return here to trigger next exam!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSequenceStep(null)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded-lg cursor-pointer"
            >
              Cancel Sequence
            </button>
            <button
              onClick={handleNextSequenceStep}
              className="text-xs font-black text-white bg-amber-600 hover:bg-amber-700 px-4 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
            >
              <span>{sequenceStep < EXAM_CHANNELS.length - 1 ? `Next: ${EXAM_CHANNELS[sequenceStep + 1].badge} ➡️` : 'Finish Sequence ✅'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-5 md:p-6">
        {activeTab === 'DISPATCHER' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 font-display">
                  Daily 5 MCQs Channels for All Exam Types
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Click 'Post on WhatsApp' for each exam group or use 'Copy Post' to paste in your WhatsApp Web / Mobile app.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400 font-mono">
                Updated Daily • Seed #{currentSeedOffset}
              </span>
            </div>

            {/* Exam Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {EXAM_CHANNELS.map((channel) => {
                const questions = getQuestionsForExam(channel.id, currentSeedOffset);
                const isExpanded = expandedExam === channel.id;

                return (
                  <div 
                    key={channel.id} 
                    className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-emerald-300 rounded-xl p-4 transition-all duration-200 space-y-3 shadow-2xs flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${channel.color} font-mono`}>
                          {channel.icon} {channel.badge}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          5 MCQs Ready
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 font-display leading-tight">
                          {channel.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-sans line-clamp-1 mt-0.5">
                          {channel.description}
                        </p>
                      </div>

                      {/* Mini Question Titles list */}
                      <div className="bg-white border border-slate-150 rounded-lg p-2 space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center justify-between">
                          <span>Today's 5 Questions:</span>
                          <button
                            onClick={() => setExpandedExam(isExpanded ? null : channel.id)}
                            className="text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer font-sans text-[10px]"
                          >
                            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            {isExpanded ? 'Hide' : 'Inspect'}
                          </button>
                        </div>

                        {questions.slice(0, 2).map((q, qIdx) => (
                          <div key={qIdx} className="text-[11px] text-slate-700 font-medium truncate flex items-center gap-1">
                            <span className="font-bold text-slate-400 font-mono">Q{qIdx + 1}.</span>
                            <span className="truncate">{q.text}</span>
                          </div>
                        ))}
                        {questions.length > 2 && !isExpanded && (
                          <div className="text-[10px] text-slate-400 font-semibold italic">
                            + 3 more questions ({questions[2].subject || channel.badge}...)
                          </div>
                        )}
                      </div>

                      {/* Accordion view if expanded */}
                      {isExpanded && (
                        <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-2.5 space-y-2 text-xs text-slate-800">
                          {questions.map((q, idx) => (
                            <div key={idx} className="border-b border-emerald-200/60 pb-1.5 last:border-none last:pb-0 space-y-0.5">
                              <span className="font-mono font-bold text-[10px] text-emerald-800">Q{idx + 1} ({q.subject || channel.badge}):</span>
                              <p className="font-semibold text-[11px] text-slate-900">{q.text}</p>
                              <p className="text-[10px] text-emerald-900 font-medium">👉 Ans: {String.fromCharCode(65 + q.correctAnswerIndex)} ({q.options[q.correctAnswerIndex]})</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Channel Buttons */}
                    <div className="pt-2 border-t border-slate-200/80 flex items-center gap-2">
                      <button
                        onClick={() => handleSendToWhatsApp(channel)}
                        className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={() => handleCopyPost(channel)}
                        className="bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs py-2 px-3 rounded-lg border border-slate-300 flex items-center justify-center gap-1 transition-colors active:scale-95 cursor-pointer"
                        title="Copy formatted post text for WhatsApp"
                      >
                        {copiedExamId === channel.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-slate-600" />
                        )}
                        <span>{copiedExamId === channel.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'PREVIEW' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 font-display">
                  Complete WhatsApp Post Formatted Content Inspector
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Select an exam below to review the exact markdown text generated for WhatsApp group broadcast.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1">
                {EXAM_CHANNELS.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setExpandedExam(ch.id)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      expandedExam === ch.id
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                    }`}
                  >
                    {ch.icon} {ch.badge}
                  </button>
                ))}
              </div>
            </div>

            {expandedExam && (
              <div className="bg-slate-900 text-emerald-300 font-mono text-xs p-4 rounded-xl space-y-3 overflow-x-auto border border-slate-800 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-400 text-[11px]">
                  <span>WhatsApp Markdown Preview • {EXAM_CHANNELS.find(c => c.id === expandedExam)?.name}</span>
                  <button
                    onClick={() => {
                      const ch = EXAM_CHANNELS.find(c => c.id === expandedExam);
                      if (ch) handleCopyPost(ch);
                    }}
                    className="text-emerald-400 hover:text-emerald-200 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer font-sans text-xs"
                  >
                    <Copy className="h-3 w-3" /> Copy Raw Post
                  </button>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-emerald-100 leading-relaxed max-h-96 overflow-y-auto">
                  {buildExamPostText(EXAM_CHANNELS.find(c => c.id === expandedExam)!)}
                </pre>
              </div>
            )}
          </div>
        )}

        {activeTab === 'AUTOMATION_BOT' && (
          <div className="space-y-5">
            <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm font-display">
                <Bot className="h-4 w-4 text-emerald-700" />
                <span>Automated Background Daily 5 WhatsApp Bot & Cron API</span>
              </div>
              <p className="text-xs text-emerald-800 font-sans leading-relaxed">
                Connect your WhatsApp Business API, UltraMsg, Green API, or Baileys bot to automatically fetch fresh daily 5 questions for every exam channel at 8:00 AM IST and broadcast to <strong>aspiresacademy.in</strong> WhatsApp groups!
              </p>
            </div>

            {/* API Endpoint Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 font-mono">
                  🌐 REST API Endpoint
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('https://aspiresacademy.in/api/daily-broadcast-payload?exam=ALL');
                    setCopiedEndpoint(true);
                    setTimeout(() => setCopiedEndpoint(false), 2000);
                  }}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1 cursor-pointer"
                >
                  {copiedEndpoint ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedEndpoint ? 'Copied URL' : 'Copy Endpoint URL'}</span>
                </button>
              </div>

              <div className="bg-slate-900 text-slate-100 font-mono text-xs p-3 rounded-lg flex items-center justify-between overflow-x-auto">
                <code>GET https://aspiresacademy.in/api/daily-broadcast-payload?exam=ALL</code>
              </div>
              <p className="text-[11px] text-slate-500 font-sans">
                Query params: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">exam=ALL</code> or <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">exam=IIT_JEE</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">exam=UPSC</code>, etc. Returns pre-formatted WhatsApp markdown strings.
              </p>
            </div>

            {/* Node.js Cron Code Sample */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-slate-700" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 font-mono">
                    Node.js Auto-Cron WhatsApp Script
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(nodeScriptExample);
                    setCopiedScript(true);
                    setTimeout(() => setCopiedScript(false), 2000);
                  }}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1 cursor-pointer"
                >
                  {copiedScript ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedScript ? 'Copied Code' : 'Copy Script'}</span>
                </button>
              </div>

              <div className="bg-slate-900 text-emerald-300 font-mono text-xs p-3.5 rounded-lg overflow-x-auto max-h-72 overflow-y-auto">
                <pre>{nodeScriptExample}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
