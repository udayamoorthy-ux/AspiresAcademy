/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BellRing, 
  Play, 
  Volume2, 
  VolumeX, 
  Clock, 
  X, 
  Sparkles, 
  Flame, 
  Trophy 
} from 'lucide-react';

interface SprintAlarmAlertModalProps {
  isOpen: boolean;
  reason: 'live' | '5min_prep' | 'test' | null;
  isMuted: boolean;
  onStartSprint: () => void;
  onDismiss: () => void;
  onSnooze: () => void;
  onToggleMute: () => void;
}

export const SprintAlarmAlertModal: React.FC<SprintAlarmAlertModalProps> = ({
  isOpen,
  reason,
  isMuted,
  onStartSprint,
  onDismiss,
  onSnooze,
  onToggleMute
}) => {
  if (!isOpen) return null;

  const isLive = reason === 'live';
  const is5Min = reason === '5min_prep';
  const isTest = reason === 'test';

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      role="alertdialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-lg bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 border-2 border-amber-500/80 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden animate-scaleUp"
      >
        {/* Ambient Ringing Glow */}
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-rose-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Top Dismiss Button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer border border-slate-700"
          title="Dismiss Alarm"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Alarm Bell Visual Icon */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/40 animate-bounce">
              <BellRing className="h-10 w-10 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500" />
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 border border-amber-500/40 text-amber-300">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              <span>
                {isLive ? '8:00 PM Live Sprint Ringing!' : is5Min ? '7:55 PM 5-Minute Warning' : 'Sprint Alarm Test Mode'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isLive ? (
                'Time for the 10-MCQ Sprint!'
              ) : is5Min ? (
                'Sprint Starts in 5 Minutes!'
              ) : (
                'Alarm Ringing Successfully!'
              )}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
              {isLive ? (
                'The daily sprint window is active right now. Jump in to test your speed and lock your national leaderboard spot!'
              ) : is5Min ? (
                'Sprint launches at 8:00 PM sharp. Get your focus ready!'
              ) : (
                'Your audio chime, device vibration, and visual alert are all verified and active for 8:00 PM IST.'
              )}
            </p>
          </div>

          {/* Sound Mute / Unmute Quick Control */}
          <button
            onClick={onToggleMute}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
          >
            {isMuted ? (
              <>
                <VolumeX className="h-4 w-4 text-rose-400" />
                <span>Alarm Sound Muted (Unmute)</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 text-emerald-400 animate-pulse" />
                <span>Alarm Playing (Click to Mute)</span>
              </>
            )}
          </button>

          {/* Primary Action Button */}
          <div className="w-full space-y-2.5 pt-2">
            <button
              onClick={() => {
                onDismiss();
                onStartSprint();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Enter Today's 10-Question Sprint Now</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onSnooze}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Snooze 5 Min</span>
              </button>

              <button
                onClick={onDismiss}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
