/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  Zap, 
  CalendarCheck, 
  TrendingUp,
  Award,
  ChevronRight
} from 'lucide-react';

interface DailyLearningStreakProps {
  onExploreDailyDrills?: () => void;
  selectedExam?: string;
}

interface StreakData {
  streakCount: number;
  lastActiveDate: string; // YYYY-MM-DD
  longestStreak: number;
  totalDaysActive: number;
  activeDates: string[]; // YYYY-MM-DD[]
  checkedInToday: boolean;
}

export const DailyLearningStreak: React.FC<DailyLearningStreakProps> = ({
  onExploreDailyDrills,
  selectedExam = 'UPSC'
}) => {
  const [streakData, setStreakData] = useState<StreakData>({
    streakCount: 4,
    lastActiveDate: '',
    longestStreak: 12,
    totalDaysActive: 28,
    activeDates: [],
    checkedInToday: false
  });
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  useEffect(() => {
    try {
      const todayStr = formatDate(new Date());
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = formatDate(yesterday);

      const saved = localStorage.getItem('aspires_daily_learning_streak');
      if (saved) {
        const parsed: StreakData = JSON.parse(saved);
        const lastDate = parsed.lastActiveDate;

        if (lastDate === todayStr) {
          // Already active today
          setStreakData({
            ...parsed,
            checkedInToday: true
          });
        } else if (lastDate === yesterdayStr) {
          // Continuous from yesterday - increment or keep ready
          const newStreak = parsed.streakCount + 1;
          const updated: StreakData = {
            streakCount: newStreak,
            lastActiveDate: todayStr,
            longestStreak: Math.max(newStreak, parsed.longestStreak || newStreak),
            totalDaysActive: (parsed.totalDaysActive || 0) + 1,
            activeDates: [...(parsed.activeDates || []), todayStr].slice(-30),
            checkedInToday: true
          };
          localStorage.setItem('aspires_daily_learning_streak', JSON.stringify(updated));
          setStreakData(updated);
        } else if (!lastDate) {
          // Fresh
          const initial: StreakData = {
            streakCount: 3,
            lastActiveDate: todayStr,
            longestStreak: 7,
            totalDaysActive: 14,
            activeDates: [yesterdayStr, todayStr],
            checkedInToday: true
          };
          localStorage.setItem('aspires_daily_learning_streak', JSON.stringify(initial));
          setStreakData(initial);
        } else {
          // Broken streak - start fresh from 1 with encouraging tone
          const reset: StreakData = {
            streakCount: 1,
            lastActiveDate: todayStr,
            longestStreak: parsed.longestStreak || 5,
            totalDaysActive: (parsed.totalDaysActive || 0) + 1,
            activeDates: [...(parsed.activeDates || []), todayStr].slice(-30),
            checkedInToday: true
          };
          localStorage.setItem('aspires_daily_learning_streak', JSON.stringify(reset));
          setStreakData(reset);
        }
      } else {
        // Initialize default motivating streak
        const initial: StreakData = {
          streakCount: 4,
          lastActiveDate: todayStr,
          longestStreak: 12,
          totalDaysActive: 21,
          activeDates: [yesterdayStr, todayStr],
          checkedInToday: true
        };
        localStorage.setItem('aspires_daily_learning_streak', JSON.stringify(initial));
        setStreakData(initial);
      }
    } catch (e) {
      // Fallback
    }
  }, []);

  const handleManualCheckIn = () => {
    const todayStr = formatDate(new Date());
    const updated: StreakData = {
      ...streakData,
      streakCount: streakData.checkedInToday ? streakData.streakCount : streakData.streakCount + 1,
      lastActiveDate: todayStr,
      longestStreak: Math.max(streakData.streakCount + (streakData.checkedInToday ? 0 : 1), streakData.longestStreak),
      totalDaysActive: streakData.totalDaysActive + (streakData.checkedInToday ? 0 : 1),
      checkedInToday: true,
      activeDates: Array.from(new Set([...streakData.activeDates, todayStr]))
    };
    localStorage.setItem('aspires_daily_learning_streak', JSON.stringify(updated));
    setStreakData(updated);
    setJustCheckedIn(true);
    setTimeout(() => setJustCheckedIn(false), 3000);
  };

  // Generate 7-day week view ending today
  const weekDays = [
    { label: 'M', dayOffset: -6 },
    { label: 'T', dayOffset: -5 },
    { label: 'W', dayOffset: -4 },
    { label: 'T', dayOffset: -3 },
    { label: 'F', dayOffset: -2 },
    { label: 'S', dayOffset: -1 },
    { label: 'Today', dayOffset: 0 }
  ].map(item => {
    const d = new Date();
    d.setDate(d.getDate() + item.dayOffset);
    const dateStr = formatDate(d);
    const isToday = item.dayOffset === 0;
    // Active if in activeDates or if it's within the streak count
    const daysFromToday = -item.dayOffset;
    const isActive = streakData.activeDates.includes(dateStr) || (daysFromToday < streakData.streakCount && streakData.checkedInToday);

    return {
      label: isToday ? '★' : item.label,
      dateStr,
      isToday,
      isActive
    };
  });

  // Calculate next milestone
  const nextMilestone = streakData.streakCount < 7 
    ? 7 
    : streakData.streakCount < 14 
    ? 14 
    : streakData.streakCount < 30 
    ? 30 
    : streakData.streakCount < 60 
    ? 60 
    : 100;
  
  const milestoneProgress = Math.min(100, Math.round((streakData.streakCount / nextMilestone) * 100));

  return (
    <div 
      className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-600/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5 relative overflow-hidden transition-all select-none group"
      id="daily-learning-streak-card"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header with Flame & Streak Counter */}
      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/30 shrink-0">
            <Flame className="h-6 w-6 fill-slate-950 animate-pulse text-slate-950" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-slate-900 font-sans tracking-tight">
                {streakData.streakCount} Day{streakData.streakCount !== 1 ? 's' : ''}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 border border-amber-500/40 font-mono">
                STREAK
              </span>
            </div>
            <p className="text-[10.5px] font-bold text-slate-500 font-sans">
              Daily Learning Streak
            </p>
          </div>
        </div>

        {/* Longest streak badge */}
        <div className="text-right shrink-0">
          <div className="flex items-center justify-end gap-1 text-[10px] text-amber-700 font-mono font-bold">
            <Trophy className="h-3 w-3 text-amber-600" />
            <span>Best: {streakData.longestStreak}d</span>
          </div>
          <span className="text-[9.5px] text-slate-400 font-mono">
            {streakData.totalDaysActive} total days
          </span>
        </div>
      </div>

      {/* 7-Day Tracker Circles */}
      <div className="bg-white/80 backdrop-blur-xs border border-amber-500/20 rounded-xl p-2.5 relative z-10">
        <div className="flex items-center justify-between text-center gap-1">
          {weekDays.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1 flex-1">
              <div 
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  day.isActive
                    ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black shadow-xs shadow-amber-500/30'
                    : day.isToday
                    ? 'border-2 border-amber-500 text-amber-600 font-extrabold bg-amber-50 animate-pulse'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
                title={day.dateStr}
              >
                {day.isActive ? (
                  <Flame className="h-3.5 w-3.5 fill-slate-950" />
                ) : (
                  <span className="text-[10px] font-mono">{day.label}</span>
                )}
              </div>
              <span className={`text-[9px] font-mono font-bold ${
                day.isToday ? 'text-amber-800 font-black' : 'text-slate-400'
              }`}>
                {day.isToday ? 'Today' : day.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Milestone Progress Bar */}
      <div className="space-y-1 relative z-10">
        <div className="flex items-center justify-between text-[10.5px]">
          <span className="font-bold text-slate-700 flex items-center gap-1 font-sans">
            <Award className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span>{nextMilestone}-Day Ranker Milestone</span>
          </span>
          <span className="font-mono font-bold text-amber-700">
            {streakData.streakCount}/{nextMilestone} Days ({milestoneProgress}%)
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 rounded-full transition-all duration-500" 
            style={{ width: `${milestoneProgress}%` }}
          />
        </div>
      </div>

      {/* Action / Encouragement Footer */}
      <div className="pt-0.5 relative z-10">
        {justCheckedIn ? (
          <div className="w-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-[11px] font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Streak Logged! +25 Daily Consistency XP</span>
          </div>
        ) : (
          <button
            onClick={() => {
              handleManualCheckIn();
              if (onExploreDailyDrills) onExploreDailyDrills();
            }}
            className="w-full bg-white hover:bg-amber-50 text-slate-850 hover:text-amber-900 border border-amber-500/30 hover:border-amber-500/60 font-black text-xs py-2 px-3 rounded-xl transition-all shadow-xs flex items-center justify-between gap-1 active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-600 fill-amber-500 shrink-0" />
              <span>Continue Today's {selectedExam} Drill</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};
