import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  ChevronDown, 
  ChevronUp, 
  Settings, 
  User, 
  Mic, 
  BookOpen,
  Sparkles,
  Layers,
  Check,
  X
} from 'lucide-react';

interface VoicePersona {
  id: string;
  name: string;
  role: string;
  lang: string;
  rate: number;
  pitch: number;
  description: string;
}

const VOICE_PERSONAS: VoicePersona[] = [
  {
    id: 'priya_didi',
    name: 'Priya Didi',
    role: 'Sassy & Supportive Mentor',
    lang: 'en-IN',
    rate: 0.95,
    pitch: 1.05,
    description: 'Warm, smart Indian sister persona. Frequently uses slang like "Arre Yaar", "Tension nakko", and "Simple na!" to make learning fun.'
  },
  {
    id: 'lakshmi',
    name: 'Mrs. Lakshmi',
    role: 'Indian Polity Specialist',
    lang: 'en-IN',
    rate: 0.90,
    pitch: 1.00,
    description: 'Loving but strict maternal Auntie. Uses classic motherly slang like "Beta", "Jaldi se", and "Aiyyo!" to keep you focused.'
  },
  {
    id: 'pooja',
    name: 'Pooja',
    role: 'Fast Current Affairs Expert',
    lang: 'en-IN',
    rate: 1.15,
    pitch: 1.10,
    description: 'Energetic fast-paced tutor. Uses modern slang like "Bas karo", "Sort out ho gaya", and "Superb!" for rapid revision.'
  }
];

function injectSlang(text: string, personaId: string): string {
  if (!text) return text;
  
  // Clean markdown a bit for speech synthesis
  const cleanText = text
    .replace(/[*#`_\-]/g, ' ') // remove markdown characters
    .replace(/\s+/g, ' ')
    .trim();

  const sentences = cleanText.split(/[.!?]+\s+/).filter(Boolean);
  if (sentences.length === 0) return cleanText;

  let result = "";

  if (personaId === 'priya_didi') {
    result = "Arre Yaar! Let's check out this topic together, chalo. ";
    sentences.forEach((s, index) => {
      if (index > 0) {
        const slangs = [
          " Simple na? Toh, ",
          " Acha look here, ",
          " Focus, okay? ",
          " Hain na? So, "
        ];
        result += slangs[index % slangs.length];
      }
      result += s;
    });
    result += ". Superb na? Tension nakko lo, chalo study hard!";
  } else if (personaId === 'lakshmi') {
    result = "Suno Beta, pay attention jaldi se. ";
    sentences.forEach((s, index) => {
      if (index > 0) {
        const slangs = [
          " Aiyyo, hear this carefully. ",
          " Acha? So listen, beta, ",
          " Very important, beta. ",
          " Understand this, "
        ];
        result += slangs[index % slangs.length];
      }
      result += s;
    });
    result += ". Do not forget this, beta! Revision is the key, acha?";
  } else {
    // pooja
    result = "Hey yaar! Let's fast-track this topic right now, bas! ";
    sentences.forEach((s, index) => {
      if (index > 0) {
        const slangs = [
          " Basically, toh, ",
          " And seriously, ",
          " Simple na? ",
          " Sorted now! So, "
        ];
        result += slangs[index % slangs.length];
      }
      result += s;
    });
    result += ". That is all you need to know, super simple na?";
  }

  return result;
}

interface AIVoiceTeacherProps {
  currentText: string;
  currentTitle: string;
  onClearText?: () => void;
}

export default function AIVoiceTeacher({ currentText, currentTitle, onClearText }: AIVoiceTeacherProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<VoicePersona>(VOICE_PERSONAS[0]);
  const [customText, setCustomText] = useState('');
  const [isMinimized, setIsMinimized] = useState(true);
  const [isDismissed, setIsDismissed] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedNativeVoice, setSelectedNativeVoice] = useState<string>('');
  
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        
        // Pick best default native voice matching en-IN or en-GB or en-US
        const fallback = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en-US'))?.name || '';
        setSelectedNativeVoice(fallback);
      };

      updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Sync external text loaded (from notes or analytics)
  useEffect(() => {
    if (currentText) {
      setCustomText(currentText);
      setIsDismissed(false); // Make sure it's visible when user triggers audio!
      setIsMinimized(false); // Automatically expand to show playing state
      
      // Stop current playback to queue new lecture
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [currentText]);

  const handlePlay = () => {
    if (!synthRef.current) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }

    // If paused, simply resume
    if (isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    synthRef.current.cancel(); // Clear any existing speech queue

    const rawText = customText.trim() || "Welcome back, aspirant. Input or select any study topic above, and let's begin our auditory lecture session.";
    const textToSpeak = injectSlang(rawText, selectedPersona.id);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;

    // Apply Persona parameters
    utterance.rate = selectedPersona.rate * speed;
    utterance.pitch = selectedPersona.pitch;

    // Apply native browser voice if matching lang is found
    if (availableVoices.length > 0) {
      // 1st priority: user manual selected browser voice
      let chosenVoice = availableVoices.find(v => v.name === selectedNativeVoice);
      
      // 2nd priority: matches persona language
      if (!chosenVoice) {
        chosenVoice = availableVoices.find(v => v.lang.includes(selectedPersona.lang));
      }
      
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      if (onClearText) onClearText();
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis trigger warning:", e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    setIsPlaying(true);
    setIsPaused(false);
    synthRef.current.speak(utterance);
  };

  const handlePause = () => {
    if (synthRef.current && isPlaying) {
      synthRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      if (onClearText) onClearText();
    }
  };

  const handleSelectPersona = (p: VoicePersona) => {
    setSelectedPersona(p);
    
    // Attempt to automatically match browser native voice options
    const matchedVoice = availableVoices.find(v => v.lang.includes(p.lang))?.name || selectedNativeVoice;
    setSelectedNativeVoice(matchedVoice);

    if (isPlaying) {
      // Restart speech with new voice parameters
      setTimeout(() => {
        handlePlay();
      }, 100);
    }
  };

  if (isDismissed) {
    return (
      <button
        onClick={() => {
          setIsDismissed(false);
          setIsMinimized(false);
        }}
        className="fixed bottom-6 right-6 z-45 h-12 w-12 rounded-full bg-slate-900 border border-slate-800 text-amber-500 shadow-2xl flex items-center justify-center hover:bg-slate-850 hover:scale-110 active:scale-95 transition-all cursor-pointer group"
        id="voice-teacher-floating-trigger"
        title="Open AI Voice Teacher Room"
      >
        <Mic className={`h-5 w-5 text-amber-500 ${isPlaying ? 'animate-pulse' : ''}`} />
        {isPlaying && (
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-emerald-500 rounded-full border border-slate-900 animate-ping" />
        )}
        <span className="absolute right-14 bg-slate-900 text-white text-[10px] font-mono font-bold uppercase tracking-wider py-1.5 px-3 rounded-xl border border-slate-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          {isPlaying ? '🔊 Speaking now...' : 'AI Voice Teacher'}
        </span>
      </button>
    );
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 z-45 bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl transition-all duration-300 w-80 sm:w-96 ${
        isMinimized ? 'h-14 overflow-hidden' : 'h-auto max-h-[500px] overflow-y-auto'
      }`}
      id="global-ai-voice-teacher-widget"
    >
      {/* Header Dock Controls */}
      <div 
        onClick={() => setIsMinimized(!isMinimized)}
        className="px-4 py-3 bg-slate-950 flex items-center justify-between cursor-pointer border-b border-slate-850"
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className={`h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black relative z-10 shadow-md ${isPlaying ? 'animate-pulse' : ''}`}>
              <Mic className="h-4.5 w-4.5 text-slate-950" />
            </div>
            {isPlaying && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-ping z-20" />
            )}
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-100 flex items-center gap-1">
              AI Voice Teacher Room
              {isPlaying && (
                <span className="text-[8px] px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold uppercase tracking-wider animate-pulse ml-1">
                  LECTURING
                </span>
              )}
            </h4>
            <p className="text-[10px] text-slate-400 truncate w-32 sm:w-44">
              {isPlaying ? `Speaking: ${currentTitle || 'Lecture notes'}` : `Persona: ${selectedPersona.name}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${
              isPlaying ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title={isPlaying ? "Pause Lecture" : "Play/Resume Lecture"}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current ml-0.5" />}
          </button>
          
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 bg-slate-850 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
            title={isMinimized ? "Expand Controls" : "Collapse Controls"}
          >
            {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 bg-slate-850 hover:bg-red-950 hover:text-red-400 rounded-lg text-slate-400 transition-all"
            title="Minimize to Floating Icon"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expanded Interface Panel */}
      {!isMinimized && (
        <div className="p-5 space-y-4" id="voice-teacher-panel-content">
          
          {/* Animated Waveform Sound Indicator */}
          {isPlaying && (
            <div className="flex items-center justify-center gap-1 py-2 bg-slate-950/40 border border-slate-800/40 rounded-xl">
              {[1.2, 0.6, 1.8, 1.4, 0.8, 1.6, 1.0, 1.5, 0.7, 1.3].map((val, i) => (
                <span 
                  key={i} 
                  className="w-1 bg-amber-500 rounded-full animate-wave" 
                  style={{ 
                    height: '16px',
                    animationDelay: `${i * 0.1}s`,
                    transformOrigin: 'bottom'
                  }} 
                />
              ))}
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest pl-3">Auditory stream live</span>
            </div>
          )}

          {/* Persona Selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Teacher Persona Profile
            </label>
            <div className="grid grid-cols-3 gap-2">
              {VOICE_PERSONAS.map((p) => {
                const isSelected = selectedPersona.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPersona(p)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                        : 'bg-slate-850 border-slate-800 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="font-extrabold text-[11px] leading-tight truncate">{p.name}</div>
                    <div className={`text-[8px] truncate mt-0.5 leading-none ${isSelected ? 'text-slate-850 font-bold' : 'text-slate-400'}`}>
                      {p.role.split(' ')[0]} Specialist
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-sans bg-slate-950/30 p-2.5 rounded-xl border border-slate-850/60">
              ✍️ <strong>{selectedPersona.name} says:</strong> "{selectedPersona.description}"
            </p>
          </div>

          {/* Quick manual speech settings */}
          <div className="space-y-2 bg-slate-950/30 p-3.5 rounded-xl border border-slate-850">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                <span>Lecture Playback Rate</span>
                <span className="text-amber-400">{speed.toFixed(2)}x Speed</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.5"
                step="0.05"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Native browser voice options selector (in case they want deep customizations) */}
            {availableVoices.length > 0 && (
              <div className="space-y-1 pt-1">
                <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block">Native Device Voice Accent</label>
                <select
                  value={selectedNativeVoice}
                  onChange={(e) => setSelectedNativeVoice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-slate-300 focus:outline-none"
                >
                  {availableVoices
                    .filter(v => v.lang.startsWith('en') || v.lang.startsWith('ta'))
                    .map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          {/* Custom Text Paste Sandbox */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Lecture Text Sandbox
            </label>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Paste any article paragraph, Thirukkural quote, or revision point here and click Play to hear the voice lecture..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          {/* Direct Sandbox Playback Controls */}
          <div className="flex gap-2">
            <button
              onClick={handlePlay}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/15 flex items-center justify-center gap-1.5"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              {isPlaying ? 'Speak / Resume' : 'Play Lecture'}
            </button>
            
            {isPaused && (
              <button
                onClick={handlePlay}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs px-3 py-2.5 rounded-xl transition-all"
              >
                Resume
              </button>
            )}

            {(isPlaying || isPaused) && (
              <button
                onClick={handleStop}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-extrabold text-xs px-3.5 py-2.5 rounded-xl transition-all"
                title="Stop Speech"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
              </button>
            )}
          </div>

        </div>
      )}

      {/* Styled inline keyframes for soundwave animation */}
      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
