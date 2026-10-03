/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Share2, 
  PlusSquare, 
  CheckCircle2, 
  X, 
  Zap, 
  WifiOff, 
  ShieldCheck, 
  BellRing
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallPromptProps {
  variant?: 'button' | 'banner' | 'card';
  className?: string;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ 
  variant = 'button',
  className = '' 
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(() => {
    return localStorage.getItem('aspires_pwa_dismissed') === 'true';
  });

  // If already installed and running as standalone app, suppress completely
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Fallback for browsers that don't support beforeinstallprompt yet
      setShowIOSModal(true);
    }
  };

  const handleDismissBanner = () => {
    setIsBannerDismissed(true);
    localStorage.setItem('aspires_pwa_dismissed', 'true');
  };

  // Compact Header Button Variant
  if (variant === 'button') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all select-none cursor-pointer ${className}`}
          title="Install ASPIRES Mobile App"
          aria-label="Install App"
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">App</span>
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping ml-0.5" />
        </button>

        {showIOSModal && <IOSInstallGuideModal onClose={() => setShowIOSModal(false)} />}
      </>
    );
  }

  // Dismissed banner state
  if (isBannerDismissed) {
    return null;
  }

  // Mobile App Banner Variant
  return (
    <>
      <div className={`relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 text-white shadow-xl ${className}`}>
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 shrink-0">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black tracking-wider text-emerald-400 uppercase font-mono bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                  OFFICIAL MOBILE APP
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">&bull; 0 MB Storage</span>
              </div>
              <h4 className="font-extrabold text-sm text-white mt-0.5">
                Get the ASPIRES App on Your Phone
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed hidden sm:block">
                Install directly to your home screen for lightning-fast mock tests, offline study notes, and zero lag.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Install Now</span>
            </button>
            <button
              onClick={handleDismissBanner}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>Instant Launch</span>
          </div>
          <div className="flex items-center gap-1.5">
            <WifiOff className="h-3.5 w-3.5 text-blue-400 shrink-0" />
            <span>Offline Tests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BellRing className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Daily 5 MCQs</span>
          </div>
        </div>
      </div>

      {showIOSModal && <IOSInstallGuideModal onClose={() => setShowIOSModal(false)} />}
    </>
  );
};

// Modal for iOS Safari / Unsupported Browsers
interface IOSInstallGuideModalProps {
  onClose: () => void;
}

export const IOSInstallGuideModal: React.FC<IOSInstallGuideModalProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-750 p-6 text-white shadow-2xl relative space-y-5 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          title="Close guide"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/25">
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Install ASPIRES App</h3>
            <p className="text-xs text-slate-400">Add to your Home Screen in 2 taps</p>
          </div>
        </div>

        <div className="space-y-3.5 bg-slate-850 p-4 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="text-slate-200">
                Tap the <strong className="text-white font-semibold">Share</strong> button <Share2 className="h-3.5 w-3.5 inline mx-1 text-blue-400" /> on your browser toolbar (bottom on iPhone, top on iPad/Safari).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div>
              <p className="text-slate-200">
                Scroll down and tap <strong className="text-emerald-400 font-semibold">"Add to Home Screen"</strong> <PlusSquare className="h-3.5 w-3.5 inline mx-1 text-emerald-400" />.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              3
            </div>
            <div>
              <p className="text-slate-200">
                Tap <strong className="text-white font-semibold">Add</strong> in the top right corner. The ASPIRES app icon will appear on your home screen!
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Runs full-screen like a native app with offline caching and faster load speeds.</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 font-bold text-xs text-white border border-slate-700 transition-all cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
