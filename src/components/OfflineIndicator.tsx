/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div 
      className="fixed bottom-20 md:bottom-4 left-4 right-4 md:right-auto z-50 flex items-center justify-between gap-3 rounded-2xl bg-slate-900 border border-amber-500/40 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl animate-bounce"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
        </span>
        <WifiOff className="h-4 w-4 text-amber-400" />
        <span>Offline Mode &bull; Cached exam papers &amp; notes are available</span>
      </div>
    </div>
  );
};
