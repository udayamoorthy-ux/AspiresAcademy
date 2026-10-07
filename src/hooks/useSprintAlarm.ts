/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { startAlarmSound, stopAlarmSound, previewAlarmSound } from '../utils/alarmAudio';

export type AlarmOffset = 'exact' | '5min' | 'both';
export type AlarmSoundType = 'chime' | 'silent';

export interface SprintAlarmState {
  isAlarmEnabled: boolean;
  alarmOffset: AlarmOffset;
  alarmSound: AlarmSoundType;
  isAlarmTriggered: boolean;
  alarmTriggerReason: 'live' | '5min_prep' | 'test' | null;
  isMuted: boolean;
  permissionStatus: NotificationPermission | 'unsupported';
  toggleAlarm: (enabled: boolean) => void;
  setAlarmOffset: (offset: AlarmOffset) => void;
  setAlarmSound: (sound: AlarmSoundType) => void;
  triggerTestAlarm: () => void;
  dismissAlarm: () => void;
  snoozeAlarm: (minutes?: number) => void;
  toggleMute: () => void;
  requestNotificationPermission: () => Promise<boolean>;
}

export function useSprintAlarm(): SprintAlarmState {
  const [isAlarmEnabled, setIsAlarmEnabled] = useState<boolean>(() => {
    return localStorage.getItem('aspires_alarm_enabled') !== 'false';
  });

  const [alarmOffset, setAlarmOffsetState] = useState<AlarmOffset>(() => {
    return (localStorage.getItem('aspires_alarm_offset') as AlarmOffset) || 'both';
  });

  const [alarmSound, setAlarmSoundState] = useState<AlarmSoundType>(() => {
    return (localStorage.getItem('aspires_alarm_sound') as AlarmSoundType) || 'chime';
  });

  const [isAlarmTriggered, setIsAlarmTriggered] = useState<boolean>(false);
  const [alarmTriggerReason, setAlarmTriggerReason] = useState<'live' | '5min_prep' | 'test' | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');

  const snoozeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check initial notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
    } else {
      setPermissionStatus('unsupported');
    }
  }, []);

  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    try {
      const res = await Notification.requestPermission();
      setPermissionStatus(res);
      return res === 'granted';
    } catch (e) {
      return false;
    }
  }, []);

  const toggleAlarm = (enabled: boolean) => {
    setIsAlarmEnabled(enabled);
    localStorage.setItem('aspires_alarm_enabled', enabled ? 'true' : 'false');
    if (enabled && permissionStatus === 'default') {
      requestNotificationPermission();
    }
  };

  const setAlarmOffset = (offset: AlarmOffset) => {
    setAlarmOffsetState(offset);
    localStorage.setItem('aspires_alarm_offset', offset);
  };

  const setAlarmSound = (sound: AlarmSoundType) => {
    setAlarmSoundState(sound);
    localStorage.setItem('aspires_alarm_sound', sound);
    if (sound === 'chime') {
      previewAlarmSound();
    } else {
      stopAlarmSound();
    }
  };

  const fireSystemNotification = (title: string, body: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'sprint-alarm',
          renotify: true,
          requireInteraction: true,
          // Mobile vibration pattern: [vibrate, pause, vibrate, pause, vibrate]
          vibrate: [300, 150, 300, 150, 500]
        } as any);

        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      } catch (e) {
        // Fallback for browsers with restricted notification constructor
      }
    }
  };

  const triggerAlarm = useCallback((reason: 'live' | '5min_prep' | 'test') => {
    setIsAlarmTriggered(true);
    setAlarmTriggerReason(reason);
    setIsMuted(false);

    // Audio alarm
    if (alarmSound === 'chime') {
      startAlarmSound();
    }

    // System Notification
    if (reason === 'live') {
      fireSystemNotification(
        '🚨 8:00 PM Sprint is LIVE NOW!',
        'Today\'s 10-Question Blitz has begun! Join your peer aspirants on the live nationwide leaderboard.'
      );
    } else if (reason === '5min_prep') {
      fireSystemNotification(
        '⏰ 5 Minutes to 8:00 PM Sprint!',
        'Get ready! The Evening 10-Question Sprint starts in 5 minutes at 8:00 PM IST.'
      );
    } else {
      fireSystemNotification(
        '🔔 ASPIRES Sprint Alarm Test Alert',
        'Your 8:00 PM Sprint alarm sound, alert popup, and device vibration are working perfectly!'
      );
    }
  }, [alarmSound]);

  const triggerTestAlarm = () => {
    triggerAlarm('test');
  };

  const dismissAlarm = () => {
    stopAlarmSound();
    setIsAlarmTriggered(false);
    setAlarmTriggerReason(null);
    if (snoozeTimeoutRef.current) {
      clearTimeout(snoozeTimeoutRef.current);
      snoozeTimeoutRef.current = null;
    }
  };

  const snoozeAlarm = (minutes: number = 5) => {
    stopAlarmSound();
    setIsAlarmTriggered(false);
    setAlarmTriggerReason(null);

    if (snoozeTimeoutRef.current) clearTimeout(snoozeTimeoutRef.current);
    snoozeTimeoutRef.current = setTimeout(() => {
      triggerAlarm('live');
    }, minutes * 60 * 1000);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      startAlarmSound();
    } else {
      setIsMuted(true);
      stopAlarmSound();
    }
  };

  // Real-time IST clock checker running every second
  useEffect(() => {
    if (!isAlarmEnabled) return;

    const checkInterval = setInterval(() => {
      const now = new Date();
      // UTC + 5:30 = IST
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
      const istTime = new Date(utcTime + (5.5 * 60 * 60 * 1000));

      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      const seconds = istTime.getSeconds();
      const dateStr = istTime.toISOString().split('T')[0];

      // 1. 7:55 PM IST (19:55:00) 5-minute prep alert
      if (hours === 19 && minutes === 55 && seconds === 0) {
        if (alarmOffset === '5min' || alarmOffset === 'both') {
          const key = `alarm_5min_${dateStr}`;
          if (localStorage.getItem(key) !== 'fired') {
            localStorage.setItem(key, 'fired');
            triggerAlarm('5min_prep');
          }
        }
      }

      // 2. 8:00 PM IST (20:00:00) EXACT sprint launch alert
      if (hours === 20 && minutes === 0 && seconds === 0) {
        if (alarmOffset === 'exact' || alarmOffset === 'both') {
          const key = `alarm_exact_${dateStr}`;
          if (localStorage.getItem(key) !== 'fired') {
            localStorage.setItem(key, 'fired');
            triggerAlarm('live');
          }
        }
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [isAlarmEnabled, alarmOffset, triggerAlarm]);

  return {
    isAlarmEnabled,
    alarmOffset,
    alarmSound,
    isAlarmTriggered,
    alarmTriggerReason,
    isMuted,
    permissionStatus,
    toggleAlarm,
    setAlarmOffset,
    setAlarmSound,
    triggerTestAlarm,
    dismissAlarm,
    snoozeAlarm,
    toggleMute,
    requestNotificationPermission
  };
}
