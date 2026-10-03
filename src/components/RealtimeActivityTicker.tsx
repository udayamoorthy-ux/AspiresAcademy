/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Radio, Zap, Trophy, Award, Flame, Users } from 'lucide-react';
import { RealtimeActivityItem } from '../types';

interface RealtimeActivityTickerProps {
  activities: RealtimeActivityItem[];
  activeCount: number;
  onOpenArena: () => void;
}

export const RealtimeActivityTicker: React.FC<RealtimeActivityTickerProps> = ({
  activities,
  activeCount,
  onOpenArena
}) => {
  const latest = activities.slice(0, 5);

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-y border-slate-800 text-xs py-2 px-4 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Live Badge */}
        <div 
          onClick={onOpenArena}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[11px] text-emerald-400 font-mono">
            <Radio className="h-3 w-3 animate-pulse" />
            <span className="hidden sm:inline">LIVE NETWORK</span>
            <span className="sm:hidden">LIVE</span>
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            {activeCount} active
          </span>
        </div>

        {/* Center Scrolling / Latest Real-Time Activity Feed */}
        <div className="flex-1 overflow-hidden">
          {latest.length > 0 ? (
            <div className="flex items-center gap-6 animate-pulse truncate text-slate-300">
              {latest.map((item, idx) => (
                <div key={item.id || idx} className="flex items-center gap-1.5 shrink-0 text-[11px]">
                  <span 
                    className="w-1.5 h-1.5 rounded-full shrink-0" 
                    style={{ backgroundColor: item.userColor || '#f59e0b' }} 
                  />
                  <strong className="text-white font-medium">{item.userName}</strong>
                  <span className="text-slate-400 font-normal">({item.exam}):</span>
                  <span className="text-amber-300 font-semibold">{item.action}</span>
                  {item.score && (
                    <span className="bg-emerald-950/80 text-emerald-300 px-1 py-0.2 rounded font-mono text-[10px] border border-emerald-800">
                      {item.score}
                    </span>
                  )}
                  <span className="text-slate-500 text-[10px]">&bull; {item.timestamp}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-slate-400 text-xs italic">Connecting to nationwide aspirant real-time network...</span>
          )}
        </div>

        {/* Right CTA */}
        <button
          onClick={onOpenArena}
          className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-lg transition-all active:scale-95 cursor-pointer"
        >
          <Flame className="h-3 w-3 text-amber-400 fill-amber-400" />
          <span className="hidden md:inline">Open Live Arena</span>
          <span className="md:hidden">Arena</span>
        </button>
      </div>
    </div>
  );
};
