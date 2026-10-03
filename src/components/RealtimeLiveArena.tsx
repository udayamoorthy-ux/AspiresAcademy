/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  MessageSquare, 
  Clock, 
  Users, 
  Send, 
  Heart, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Radio,
  Share2,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Headphones
} from 'lucide-react';
import { 
  ExamType, 
  RealtimeRoomMessage, 
  RealtimeLiveBattle, 
  RealtimePomodoroState, 
  RealtimePresenceUser 
} from '../types';

interface RealtimeLiveArenaProps {
  exam: ExamType;
  messages: RealtimeRoomMessage[];
  battle: RealtimeLiveBattle | null;
  pomodoro: RealtimePomodoroState | null;
  activeCount: number;
  onlineUsers: RealtimePresenceUser[];
  onSendMessage: (channel: 'general' | 'doubts' | 'exam_specific' | 'study_lounge', text: string) => void;
  onLikeMessage: (messageId: string) => void;
  onVoteBattle: (optionIndex: number) => void;
  onPublishActivity: (action: string, detail: string, score?: string) => void;
  onClose?: () => void;
}

export const RealtimeLiveArena: React.FC<RealtimeLiveArenaProps> = ({
  exam,
  messages,
  battle,
  pomodoro,
  activeCount,
  onlineUsers,
  onSendMessage,
  onLikeMessage,
  onVoteBattle,
  onPublishActivity,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'battle' | 'chat' | 'focus'>('battle');
  const [chatChannel, setChatChannel] = useState<'general' | 'doubts' | 'exam_specific' | 'study_lounge'>('general');
  const [inputText, setInputText] = useState('');
  const [selectedBattleOption, setSelectedBattleOption] = useState<number | null>(null);
  const [hasVotedBattle, setHasVotedBattle] = useState(false);
  const [isInDeepWork, setIsInDeepWork] = useState(false);
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'alpha'>('none');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodeRef = useRef<{ stop: () => void } | null>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Reset vote state when battle question changes
  useEffect(() => {
    setSelectedBattleOption(null);
    setHasVotedBattle(false);
  }, [battle?.id]);

  // Audio synthesis for ambient focus sound (Web Audio API)
  const toggleAmbientSound = (type: 'none' | 'rain' | 'alpha') => {
    if (soundNodeRef.current) {
      try {
        soundNodeRef.current.stop();
      } catch (e) {}
      soundNodeRef.current = null;
    }

    if (type === 'none') {
      setAmbientSound('none');
      return;
    }

    try {
      const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      if (type === 'rain') {
        // Synthesize soft pink noise rain
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.05;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;

        const gain = ctx.createGain();
        gain.gain.value = 0.15;

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        whiteNoise.start();

        soundNodeRef.current = { stop: () => whiteNoise.stop() };
        setAmbientSound('rain');
      } else if (type === 'alpha') {
        // Binaural 10Hz Alpha Waves
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(210, ctx.currentTime); // 210 Hz
        gain.gain.setValueAtTime(0.08, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        soundNodeRef.current = { stop: () => osc.stop() };
        setAmbientSound('alpha');
      }
    } catch (err) {
      console.warn('Audio synthesis not supported or blocked:', err);
    }
  };

  useEffect(() => {
    return () => {
      if (soundNodeRef.current) {
        try {
          soundNodeRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const handleVote = (optionIndex: number) => {
    if (hasVotedBattle || !battle) return;
    setSelectedBattleOption(optionIndex);
    setHasVotedBattle(true);
    onVoteBattle(optionIndex);

    const isCorrect = optionIndex === battle.correctAnswerIndex;
    onPublishActivity(
      isCorrect ? 'Cracked Live Speed Challenge' : 'Participated in Live MCQ Battle',
      `Question: ${battle.subject} (${isCorrect ? 'Correct!' : 'Attempted'})`,
      isCorrect ? '+100 XP' : '+25 XP'
    );
  };

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(chatChannel, inputText.trim());
    setInputText('');
  };

  // Filter messages by selected channel
  const filteredMessages = messages.filter((m) => {
    if (chatChannel === 'general') return true;
    return m.channel === chatChannel;
  });

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-white">
      {/* Real-Time Hub Top Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                Real-Time Aspirant Arena
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {activeCount} students connected across India &bull; Synced via WebSocket
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-2xl border border-slate-700">
          <button
            onClick={() => setActiveTab('battle')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'battle'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Speed Battle</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === 'chat'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Live Lounge</span>
            {messages.length > 0 && (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('focus')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'focus'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Deep Work</span>
            {pomodoro && (
              <span className="text-[10px] opacity-80 font-mono">
                {Math.floor(pomodoro.remainingSeconds / 60)}m
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: LIVE MCQ SPEED CHALLENGE */}
      {activeTab === 'battle' && (
        <div className="p-5 sm:p-6 space-y-6">
          {battle ? (
            <div className="space-y-5">
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500/20 text-amber-300 font-extrabold px-2.5 py-1 rounded-lg border border-amber-500/30">
                    {battle.subject}
                  </span>
                  <span className="text-slate-400">Target: {battle.exam}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 font-mono">
                  <Users className="h-3.5 w-3.5 text-blue-400" />
                  <span className="font-bold text-white">{battle.totalAnswers}</span>
                  <span className="text-slate-400">live submissions</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="bg-slate-850 p-5 rounded-2xl border border-slate-750">
                <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {battle.questionText}
                </h4>
              </div>

              {/* Interactive Options / Live Distribution */}
              <div className="grid grid-cols-1 gap-3">
                {battle.options.map((option, index) => {
                  const isSelected = selectedBattleOption === index;
                  const isCorrect = index === battle.correctAnswerIndex;
                  const percent = battle.stats ? battle.stats[index] : 0;
                  const rawCount = battle.rawCounts ? battle.rawCounts[index] : 0;

                  return (
                    <button
                      key={index}
                      onClick={() => handleVote(index)}
                      disabled={hasVotedBattle}
                      className={`relative overflow-hidden text-left p-4 rounded-2xl border transition-all text-sm group ${
                        !hasVotedBattle
                          ? 'border-slate-800 bg-slate-850/80 hover:border-amber-500/60 hover:bg-slate-800 cursor-pointer active:scale-[0.99]'
                          : isCorrect
                          ? 'border-emerald-500/80 bg-emerald-950/40 text-emerald-200'
                          : isSelected
                          ? 'border-red-500/80 bg-red-950/40 text-red-200'
                          : 'border-slate-800 bg-slate-850/40 text-slate-400 opacity-70'
                      }`}
                    >
                      {/* Live Voting Bar Background (renders when voted) */}
                      {hasVotedBattle && (
                        <div
                          className={`absolute top-0 bottom-0 left-0 transition-all duration-700 ease-out opacity-20 ${
                            isCorrect ? 'bg-emerald-400' : isSelected ? 'bg-red-400' : 'bg-slate-400'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      )}

                      <div className="relative z-10 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-7 w-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              hasVotedBattle && isCorrect
                                ? 'bg-emerald-500 text-slate-950'
                                : hasVotedBattle && isSelected
                                ? 'bg-red-500 text-white'
                                : 'bg-slate-800 text-slate-300 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors'
                            }`}
                          >
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="font-medium text-slate-100">{option}</span>
                        </div>

                        {/* Real-Time Live Stats Pill */}
                        {hasVotedBattle && (
                          <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                            <span className="font-extrabold text-white">{percent}%</span>
                            <span className="text-[10px] text-slate-400">({rawCount})</span>
                            {isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                            {!isCorrect && isSelected && <XCircle className="h-4 w-4 text-red-400" />}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Feedback & Detailed Explanation */}
              {hasVotedBattle && (
                <div className="bg-slate-850 border border-slate-750 p-4 rounded-2xl space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400">Verified Answer &amp; Conceptual Rationalization</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {battle.explanation}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 space-y-2">
              <Sparkles className="h-8 w-8 text-amber-400 mx-auto animate-spin" />
              <p className="text-slate-400 text-sm">Preparing next nationwide speed question...</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LIVE ASPIRANT LOUNGE & DOUBT CLEARING CHAT */}
      {activeTab === 'chat' && (
        <div className="flex flex-col h-[460px]">
          {/* Sub-channel Filters */}
          <div className="px-5 py-2.5 bg-slate-850/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
            {[
              { id: 'general', label: '#general-study' },
              { id: 'doubts', label: '#doubts-clearing' },
              { id: 'exam_specific', label: `#${exam.toLowerCase()}-aspirants` },
              { id: 'study_lounge', label: '#night-owls' },
            ].map((ch) => (
              <button
                key={ch.id}
                onClick={() => setChatChannel(ch.id as any)}
                className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  chatChannel === ch.id
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-800/40'
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className="bg-slate-850 border border-slate-800/80 rounded-2xl p-3.5 space-y-2 text-xs transition-all hover:border-slate-700"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: msg.senderColor || '#3b82f6' }}
                    />
                    <strong className="font-bold text-white text-xs">
                      {msg.senderName}
                    </strong>
                    {msg.isMentor && (
                      <span className="flex items-center gap-0.5 bg-amber-500/20 text-amber-300 font-extrabold text-[10px] px-1.5 py-0.2 rounded border border-amber-500/30">
                        <ShieldCheck className="h-3 w-3" /> MENTOR
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">({msg.senderExam})</span>
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono">
                    {msg.timestamp}
                  </span>
                </div>

                <p className="text-slate-200 text-xs leading-relaxed break-words">
                  {msg.text}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px] text-slate-400">
                  <span className="text-[10px] text-slate-500">Channel: #{msg.channel}</span>
                  <button
                    onClick={() => onLikeMessage(msg.id)}
                    className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Heart className="h-3 w-3 fill-rose-500/20 text-rose-400" />
                    <span>{msg.likes || 0}</span>
                  </button>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Composer */}
          <form
            onSubmit={handleSendChat}
            className="p-3 bg-slate-850 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Post message to #${chatChannel}...`}
              className="flex-1 bg-slate-900 border border-slate-750 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Send</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: SYNCHRONIZED DEEP WORK STUDY ROOM */}
      {activeTab === 'focus' && pomodoro && (
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
            {/* Visual Synced Pomodoro Dial */}
            <div className="relative flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center bg-slate-850/80 shadow-2xl relative">
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 font-mono">
                  {pomodoro.mode === 'focus' ? 'DEEP WORK CYCLE' : 'REST BREAK'}
                </span>
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white my-1">
                  {formatTime(pomodoro.remainingSeconds)}
                </span>
                <span className="text-[11px] text-slate-400">
                  Cycle #{pomodoro.cycle} &bull; 25m Focus
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-extrabold text-base text-white">
                {pomodoro.statusMessage}
              </h4>
              <p className="text-xs text-slate-400">
                Synchronized nationwide timer &bull; {pomodoro.activeLearnersCount} aspirants in deep work right now
              </p>
            </div>

            {/* Ambient Audio Synth */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Headphones className="h-3.5 w-3.5 text-amber-400" /> Focus Audio:
              </span>
              <button
                onClick={() => toggleAmbientSound('none')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  ambientSound === 'none' ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Mute
              </button>
              <button
                onClick={() => toggleAmbientSound('rain')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  ambientSound === 'rain' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                🌧️ Pink Rain
              </button>
              <button
                onClick={() => toggleAmbientSound('alpha')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  ambientSound === 'alpha' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                🧠 10Hz Alpha Waves
              </button>
            </div>
          </div>

          {/* Active Peer Avatars */}
          <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-white flex items-center gap-1.5">
                <Users className="h-4 w-4 text-emerald-400" />
                <span>Connected Aspirants in Study Room</span>
              </span>
              <span className="text-slate-400">{onlineUsers.length} in room</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {onlineUsers.slice(0, 16).map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-1.5 bg-slate-900 border border-slate-750 px-2.5 py-1 rounded-xl text-xs"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: u.color || '#f59e0b' }}
                  />
                  <span className="text-slate-200 font-medium">{u.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">[{u.exam}]</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
