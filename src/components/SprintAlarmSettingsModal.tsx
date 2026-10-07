/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Bell, 
  BellRing, 
  Clock, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  X, 
  Smartphone,
  Play
} from 'lucide-react';
import { AlarmOffset, AlarmSoundType } from '../hooks/useSprintAlarm';

interface SprintAlarmSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAlarmEnabled: boolean;
  alarmOffset: AlarmOffset;
  alarmSound: AlarmSoundType;
  permissionStatus: NotificationPermission | 'unsupported';
  onToggleAlarm: (enabled: boolean) => void;
  onSetAlarmOffset: (offset: AlarmOffset) => void;
  onSetAlarmSound: (sound: AlarmSoundType) => void;
  onRequestPermission: () => Promise<boolean>;
  onTriggerTestAlarm: () => void;
}

export const SprintAlarmSettingsModal: React.FC<SprintAlarmSettingsModalProps> = ({
  isOpen,
  onClose,
  isAlarmEnabled,
  alarmOffset,
  alarmSound,
  permissionStatus,
  onToggleAlarm,
  onSetAlarmOffset,
  onSetAlarmSound,
  onRequestPermission,
  onTriggerTestAlarm
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl relative overflow-hidden animate-scaleUp space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                8:00 PM Sprint Alarm
              </h3>
              <p className="text-xs text-slate-400">
                Audible chime & system alert settings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Master Alarm Toggle */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-sm font-bold text-white block">
              Enable Daily Sprint Alarm
            </span>
            <span className="text-xs text-slate-400 block">
              Rings automatically every evening for the sprint
            </span>
          </div>

          <button
            onClick={() => onToggleAlarm(!isAlarmEnabled)}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
              isAlarmEnabled ? 'bg-amber-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-200 ${
                isAlarmEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Notification Permission Card */}
        {permissionStatus !== 'granted' && (
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-start gap-2 text-xs text-amber-200">
              <Smartphone className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                To ring when your phone screen is off or in background, allow notifications:
              </span>
            </div>
            <button
              onClick={onRequestPermission}
              className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow transition-all cursor-pointer"
            >
              Allow Phone / Browser Notifications
            </button>
          </div>
        )}

        {/* Alarm Timing Option */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            When Should It Ring?
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onSetAlarmOffset('both')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                alarmOffset === 'both'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <span className="block text-xs font-bold">Both</span>
              <span className="block text-[10px] text-slate-400">7:55 & 8:00 PM</span>
            </button>

            <button
              onClick={() => onSetAlarmOffset('exact')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                alarmOffset === 'exact'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <span className="block text-xs font-bold">8:00 PM</span>
              <span className="block text-[10px] text-slate-400">At Sprint Live</span>
            </button>

            <button
              onClick={() => onSetAlarmOffset('5min')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                alarmOffset === '5min'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <span className="block text-xs font-bold">7:55 PM</span>
              <span className="block text-[10px] text-slate-400">5 Mins Before</span>
            </button>
          </div>
        </div>

        {/* Audio Sound Choice */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Alarm Sound
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSetAlarmSound('chime')}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                alarmSound === 'chime'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Volume2 className="h-4 w-4" />
              <span className="text-xs font-bold">Bell Chime</span>
            </button>

            <button
              onClick={() => onSetAlarmSound('silent')}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                alarmSound === 'silent'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <VolumeX className="h-4 w-4" />
              <span className="text-xs font-bold">Vibrate / Silent</span>
            </button>
          </div>
        </div>

        {/* TEST ALARM BUTTON */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <button
            onClick={() => {
              onClose();
              onTriggerTestAlarm();
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BellRing className="h-4 w-4 fill-current animate-pulse" />
            <span>🔊 Test Alarm & Sound Now</span>
          </button>
          <p className="text-[10px] text-center text-slate-400">
            Clicking this rings the audio chime and shows the full alert popup immediately so you can test it.
          </p>
        </div>
      </div>
    </div>
  );
};
