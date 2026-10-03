/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Lock, Crown, Sparkles, Check, KeyRound, ArrowRight } from 'lucide-react';

interface ProFeatureLockProps {
  title: string;
  description: string;
  perks?: string[];
  onOpenPaywall: () => void;
  priceStartingFrom?: number;
}

export const ProFeatureLock: React.FC<ProFeatureLockProps> = ({
  title,
  description,
  perks = [
    'Unlimited AI evaluations with detailed rubric scores',
    'Full access to all 8 national examination mock banks',
    'Voice AI lectures and policy brief summaries',
    'Live multiplayer speed battles and nationwide ranking'
  ],
  onOpenPaywall,
  priceStartingFrom = 350
}) => {
  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-10 text-center shadow-2xl relative overflow-hidden my-6 max-w-2xl mx-auto">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Lock Icon Badge */}
      <div className="h-16 w-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-xl shadow-amber-500/25 mx-auto mb-5">
        <div className="h-full w-full bg-slate-950 rounded-[22px] flex items-center justify-center">
          <Lock className="h-8 w-8 text-amber-400" />
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-black uppercase tracking-wider">
          <Crown className="h-3.5 w-3.5 fill-amber-400" />
          <span>PRO MEMBERSHIP REQUIRED</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {/* Perks Checklist */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 sm:p-5 max-w-lg mx-auto text-left mb-6 space-y-2.5">
        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
          Included in ASPIRES Pro:
        </span>
        {perks.map((perk, idx) => (
          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
            <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{perk}</span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
        <button
          onClick={onOpenPaywall}
          className="w-full sm:w-auto flex-1 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black py-3 px-6 rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <Crown className="h-4 w-4 text-slate-950 fill-slate-950" />
          <span>Unlock Annual Pass — ₹{priceStartingFrom} (50% OFF)</span>
          <ArrowRight className="h-4 w-4 text-slate-950" />
        </button>

        <button
          onClick={onOpenPaywall}
          className="w-full sm:w-auto bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <KeyRound className="h-4 w-4 text-amber-400" />
          <span>Enter License Key</span>
        </button>
      </div>

      <p className="text-[10px] text-slate-400 mt-4">
        ⚡ Instant activation via Google Pay, PhonePe, Paytm, or Credit/Debit Cards.
      </p>
    </div>
  );
};
