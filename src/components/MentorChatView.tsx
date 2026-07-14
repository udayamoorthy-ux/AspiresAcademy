/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ExamType, ChatMessage } from '../types';
import { Send, Sparkles, HelpCircle, User, MessageCircle, AlertCircle, Loader2, Crown } from 'lucide-react';

interface MentorChatViewProps {
  selectedExam: ExamType;
  isPremium?: boolean;
  onPremiumClick?: () => void;
}

export default function MentorChatView({ selectedExam, isPremium = false, onPremiumClick }: MentorChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Free Tier Usage Counting state
  const [chatCount, setChatCount] = useState<number>(() => {
    const val = localStorage.getItem('aspires_mentor_chat_count');
    return val ? parseInt(val, 10) : 0;
  });

  // Initialize with introductory welcome message
  useEffect(() => {
    let introText = "Greetings, aspirant! I am your AI Civil Services Mentor. I am ready to guide you through the syllabus details, preparation strategies, or critical questions for your exam. Ask me anything in English or தமிழ்!";
    
    if (selectedExam === 'UPSC') {
      introText = "Greetings, UPSC Civil Services aspirant! I am your IAS/IPS exam guide. Ask me about M. Laxmikanth chapters, Modern Indian History, Economics, Essay strategies, or Mains answer reviews. Let's make your administrative dreams a reality!";
    } else if (selectedExam.startsWith('TNPSC')) {
      introText = "வணக்கம்! உங்கள் டி.என்.பி.எஸ்.சி (TNPSC) தேர்வுக்கு உங்களை வழிநடத்தும் வழிகாட்டி நான். பொதுத்தமிழ் (Part A), தமிழ் மரபு மற்றும் பண்பாடு, திருக்குறள் அறநெறிகள், அல்லது கணித திறனறிவுகளுக்கான (Aptitude) சந்தேகங்களை நீங்கள் என்னிடம் கேட்கலாம். வெற்றியை நோக்கிப் பயணிப்போம்!";
    } else if (selectedExam === 'SSC_CGL') {
      introText = "Hello, SSC CGL aspirant! I am your dedicated Staff Selection Commission Combined Graduate Level guide. Ask me about high-speed Quantitative Aptitude shortcuts, core English Grammar rules, Logical Reasoning strategies, or general computer basics. Let's ace Tier-I and Tier-II together!";
    } else if (selectedExam === 'RRB_NTPC') {
      introText = "Welcome, Railway (RRB NTPC) aspirant! I am your Railway Recruitment Board guide. Ask me about speed-distance-time shortcuts, general science formulas (physics/chemistry/biology), railway history facts, or reasoning hacks. Let's get you on track to success!";
    }

    setMessages([
      {
        id: 'initial-welcome',
        sender: 'assistant',
        text: introText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [selectedExam]);

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle prefilled query from Study Planner
  useEffect(() => {
    const prefill = localStorage.getItem('mentor_chat_prefill');
    if (prefill) {
      localStorage.removeItem('mentor_chat_prefill');
      setTimeout(() => {
        handleSendMessage(prefill);
      }, 300);
    }
  }, [selectedExam]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    if (!isPremium && chatCount >= 3) {
      alert("Free Tier Limit Reached: You have reached your limit of 3 free daily interactions with the AI Personal Coach. Upgrade to ASPIRES Premium via Google Pay to get unlimited expert mentorship!");
      onPremiumClick?.();
      return;
    }

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setLoading(true);

    try {
      const response = await fetch('/api/mentor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].slice(-8), // Send last 8 messages for context
          exam: selectedExam
        }),
      });

      const data = await response.json();
      if (data && data.reply) {
        setMessages(prev => [...prev, {
          id: `msg-ai-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);

        if (!isPremium) {
          const newCount = chatCount + 1;
          setChatCount(newCount);
          localStorage.setItem('aspires_mentor_chat_count', String(newCount));
        }
      }
    } catch (error) {
      console.warn("AI Coach Chat fallback activated:", error);
      setMessages(prev => [...prev, {
        id: `msg-ai-error-${Date.now()}`,
        sender: 'assistant',
        text: "I apologize, but I am experiencing trouble coordinating with the server pipeline right now. Focus on revising your core syllabus topics while I re-establish connection!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const QUICK_PROMPTS = selectedExam === 'RRB_NTPC'
    ? [
        { label: "Train Math Tricks", text: "How do I solve train speed, relative speed, and bridge crossing math problems quickly?" },
        { label: "General Science Key Notes", text: "What are the most commonly asked Physics and Chemistry concepts in RRB NTPC exams?" },
        { label: "Railway History GK", text: "Summarize the critical facts about Indian Railways, zones, headquarters, and history for General Awareness." }
      ]
    : selectedExam === 'SSC_CGL'
    ? [
        { label: "Quant Shortcuts", text: "What are the most effective short-cut strategies for scoring full marks in Quantitative Aptitude?" },
        { label: "Grammar Master Rules", text: "List the absolute non-negotiable grammar rules for Active/Passive and Direct/Indirect speech in SSC CGL." },
        { label: "Tier-II Strategy", text: "Explain the Tier-II exam structure and how to balance Quant, English, and Computer awareness." }
      ]
    : selectedExam.startsWith('TNPSC') 
    ? [
        { label: "திருக்குறள் - நிர்வாகம்", text: "நிர்வாகத் தரம் மற்றும் அறநெறிகளுக்கு திருக்குறள் கூறும் கருத்துக்களைப் பற்றி விளக்குக." },
        { label: "Aptitude Study Method", text: "How can I score full 25/25 in TNPSC Aptitude and Mental Ability?" },
        { label: "Group 2 Exam Pattern", text: "Explain the details of TNPSC Group 2 Prelims and Mains stages." }
      ]
    : [
        { label: "Laxmikanth Strategy", text: "How should I revise Indian Polity from M. Laxmikanth for UPSC Prelims?" },
        { label: "Thirukkural in Essay", text: "Can we use Thirukkural quotes in UPSC CSE General Studies and Essay papers?" },
        { label: "History Timeline Guidance", text: "Give me a breakdown of critical milestones during Modern Indian Freedom Struggle." }
      ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl h-[550px] shadow-sm flex flex-col justify-between overflow-hidden text-slate-800" id="mentor-chat-view">
      
      {/* Header */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              Personal Exam Guide
              <span className="text-[9px] uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-extrabold font-mono border border-amber-200">
                {selectedExam} Coach
              </span>
            </h3>
            <p className="text-[10px] text-slate-550 font-mono">Status: Interactive AI Active</p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Box */}
      <div className="flex-grow p-6 overflow-y-auto space-y-4" id="chat-messages-container">
        {messages.map((msg) => {
          const isAI = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${isAI ? 'self-start mr-auto' : 'self-end ml-auto flex-row-reverse'}`}
            >
              {/* Avatar Icon */}
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs border ${
                isAI 
                  ? 'bg-amber-50 border-amber-200 text-amber-700' 
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700'
              }`}>
                {isAI ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>

              {/* Message bubble */}
              <div className={`p-4 rounded-2xl space-y-1 text-xs md:text-sm leading-relaxed ${
                isAI 
                  ? 'bg-slate-50 text-slate-850 border border-slate-200 rounded-tl-none' 
                  : 'bg-amber-500 text-slate-950 font-bold rounded-tr-none shadow shadow-amber-500/5'
              }`}>
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className={`text-[9px] block text-right font-mono ${isAI ? 'text-slate-400' : 'text-slate-950/60'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          /* Thinking indicator */
          <div className="flex gap-3 max-w-[80%] self-start mr-auto animate-pulse">
            <div className="h-8 w-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="p-4 bg-slate-50 text-slate-500 border border-slate-200 rounded-2xl rounded-tl-none text-xs leading-relaxed font-mono">
              Drafting tactical suggestions and guidelines...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-6 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-2 items-center" id="quick-prompts-row">
        <span className="text-[10px] uppercase font-bold text-slate-500 mr-1 flex items-center gap-1">
          <HelpCircle className="h-3 w-3" />
          Topics:
        </span>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            disabled={loading}
            onClick={() => handleSendMessage(prompt.text)}
            className="text-[10px] bg-white border border-slate-200 hover:border-amber-500 text-slate-600 hover:text-amber-700 font-semibold px-2.5 py-1 rounded-lg transition-colors disabled:opacity-40 shadow-sm"
          >
            {prompt.label}
          </button>
        ))}
      </div>

      {/* Input Form Footer */}
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 space-y-3" id="chat-input-bar">
        {!isPremium && (
          <div className="bg-amber-500/10 border border-amber-500/30 px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-4 text-xs font-semibold text-slate-800 animate-fadeIn">
            <div className="flex items-center gap-1.5">
              <Crown className="h-4 w-4 text-amber-500 animate-bounce shrink-0" />
              <span>Personal Coach Free Daily Limit: <strong className="text-amber-700">{chatCount} / 3</strong> replies.</span>
            </div>
            <button
              type="button"
              onClick={onPremiumClick}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-2.5 py-1 rounded-lg text-[10px] font-black shadow-sm transition-all cursor-pointer"
            >
              Go Unlimited 💎
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-3"
        >
          <input
            id="chat-user-input"
            type="text"
            disabled={loading}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              selectedExam === 'RRB_NTPC'
                ? "Ask about train math, general science, or Indian Railways GK..."
                : selectedExam === 'SSC_CGL'
                ? "Ask about Quant, English grammar rules, or Computer basics..."
                : selectedExam.startsWith('TNPSC')
                ? "பொதுத்தமிழ், கணிதம் அல்லது திருக்குறள் பற்றி கேட்கவும்..."
                : "Ask your civil services query in English or Tamil..."
            }
            className="flex-grow bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-900 focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-400 font-medium shadow-sm"
          />

          <button
            id="btn-chat-send"
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="bg-amber-500 hover:bg-amber-400 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none text-slate-950 h-11 w-11 rounded-xl flex items-center justify-center shadow shadow-amber-500/10 active:scale-95 transition-all flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
