/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ExamType, 
  RealtimePresenceUser, 
  RealtimeRoomMessage, 
  RealtimeActivityItem, 
  RealtimeLiveBattle, 
  RealtimePomodoroState 
} from '../types';

export type SocketStatus = 'connected' | 'connecting' | 'disconnected' | 'reconnecting';

export interface UseRealtimeSocketReturn {
  status: SocketStatus;
  pingMs: number;
  userId: string;
  user: RealtimePresenceUser | null;
  activeCount: number;
  onlineUsers: RealtimePresenceUser[];
  messages: RealtimeRoomMessage[];
  activities: RealtimeActivityItem[];
  battle: RealtimeLiveBattle | null;
  pomodoro: RealtimePomodoroState | null;
  sendMessage: (channel: 'general' | 'doubts' | 'exam_specific' | 'study_lounge', text: string) => void;
  likeMessage: (messageId: string) => void;
  voteBattle: (optionIndex: number) => void;
  publishActivity: (action: string, detail: string, score?: string) => void;
  updateProfile: (name: string, exam: ExamType, status?: 'studying' | 'mock_test' | 'quiz_battle' | 'discussing', currentTopic?: string) => void;
  reconnect: () => void;
}

export function useRealtimeSocket(currentExam: ExamType): UseRealtimeSocketReturn {
  const [status, setStatus] = useState<SocketStatus>('connecting');
  const [pingMs, setPingMs] = useState<number>(18);
  const [userId, setUserId] = useState<string>('');
  const [user, setUser] = useState<RealtimePresenceUser | null>(null);
  const [activeCount, setActiveCount] = useState<number>(142);
  const [onlineUsers, setOnlineUsers] = useState<RealtimePresenceUser[]>([]);
  const [messages, setMessages] = useState<RealtimeRoomMessage[]>([]);
  const [activities, setActivities] = useState<RealtimeActivityItem[]>([]);
  const [battle, setBattle] = useState<RealtimeLiveBattle | null>(null);
  const [pomodoro, setPomodoro] = useState<RealtimePomodoroState | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pingStartRef = useRef<number>(0);
  const retryCountRef = useRef<number>(0);
  const mountedRef = useRef<boolean>(true);

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (socketRef.current) {
      try {
        socketRef.current.close();
      } catch (e) {}
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;

    setStatus('connecting');

    try {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        setStatus('connected');
        retryCountRef.current = 0;

        // Sync exam if already known
        ws.send(JSON.stringify({
          type: 'presence:update',
          payload: { exam: currentExam }
        }));

        // Measure ping
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            pingStartRef.current = Date.now();
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 15000);
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        try {
          const { type, payload } = JSON.parse(event.data);

          switch (type) {
            case 'init:state': {
              setUserId(payload.userId);
              setUser(payload.user);
              if (payload.presence) {
                setActiveCount(payload.presence.activeCount || 145);
                setOnlineUsers(payload.presence.activeConnectedUsers || []);
              }
              if (payload.messages) setMessages(payload.messages);
              if (payload.activities) setActivities(payload.activities);
              if (payload.battle) setBattle(payload.battle);
              if (payload.pomodoro) setPomodoro(payload.pomodoro);
              break;
            }

            case 'presence:sync': {
              if (payload.activeCount) setActiveCount(payload.activeCount);
              if (payload.activeConnectedUsers) setOnlineUsers(payload.activeConnectedUsers);
              break;
            }

            case 'chat:new_message': {
              setMessages((prev) => {
                // Idempotent duplicate check
                if (prev.some((m) => m.id === payload.id)) return prev;
                return [...prev, payload];
              });
              break;
            }

            case 'chat:like_updated': {
              setMessages((prev) =>
                prev.map((m) => (m.id === payload.messageId ? { ...m, likes: payload.likes } : m))
              );
              break;
            }

            case 'activity:new': {
              setActivities((prev) => {
                if (prev.some((a) => a.id === payload.id)) return prev;
                return [payload, ...prev.slice(0, 49)];
              });
              break;
            }

            case 'battle:new_question': {
              setBattle(payload);
              break;
            }

            case 'battle:stats_update': {
              setBattle((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  totalAnswers: payload.totalAnswers,
                  stats: payload.stats,
                  rawCounts: payload.rawCounts
                };
              });
              break;
            }

            case 'pomodoro:sync': {
              setPomodoro(payload);
              break;
            }

            case 'pong': {
              if (pingStartRef.current > 0) {
                const latency = Math.max(12, Math.round(Date.now() - pingStartRef.current));
                setPingMs(latency);
              }
              break;
            }
          }
        } catch (e) {
          console.warn('Error handling WebSocket frame:', e);
        }
      };

      ws.onclose = () => {
        if (!mountedRef.current) return;
        setStatus('disconnected');
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);

        // Exponential backoff reconnect: 1s, 2s, 4s, max 10s
        const delay = Math.min(1000 * Math.pow(1.5, retryCountRef.current), 10000);
        retryCountRef.current += 1;
        setStatus('reconnecting');
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      };

      ws.onerror = () => {
        try {
          ws.close();
        } catch (e) {}
      };
    } catch (err) {
      console.warn('WebSocket connection error:', err);
      setStatus('disconnected');
    }
  }, [currentExam]);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (socketRef.current) {
        try {
          socketRef.current.close();
        } catch (e) {}
      }
    };
  }, [connect]);

  // Keep exam synced to server when active user switches exam target
  useEffect(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'presence:update',
          payload: { exam: currentExam }
        })
      );
    }
  }, [currentExam]);

  // Client actions
  const sendMessage = useCallback((channel: 'general' | 'doubts' | 'exam_specific' | 'study_lounge', text: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
    socketRef.current.send(
      JSON.stringify({
        type: 'chat:send',
        payload: { channel, text }
      })
    );
  }, []);

  const likeMessage = useCallback((messageId: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
    socketRef.current.send(
      JSON.stringify({
        type: 'chat:like',
        payload: { messageId }
      })
    );
  }, []);

  const voteBattle = useCallback((optionIndex: number) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
    socketRef.current.send(
      JSON.stringify({
        type: 'battle:vote',
        payload: { optionIndex }
      })
    );
  }, []);

  const publishActivity = useCallback((action: string, detail: string, score?: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
    socketRef.current.send(
      JSON.stringify({
        type: 'activity:publish',
        payload: { action, detail, score }
      })
    );
  }, []);

  const updateProfile = useCallback(
    (name: string, exam: ExamType, status?: 'studying' | 'mock_test' | 'quiz_battle' | 'discussing', currentTopic?: string) => {
      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
      socketRef.current.send(
        JSON.stringify({
          type: 'presence:update',
          payload: { name, exam, status, currentTopic }
        })
      );
    },
    []
  );

  return {
    status,
    pingMs,
    userId,
    user,
    activeCount,
    onlineUsers,
    messages,
    activities,
    battle,
    pomodoro,
    sendMessage,
    likeMessage,
    voteBattle,
    publishActivity,
    updateProfile,
    reconnect: connect
  };
}
