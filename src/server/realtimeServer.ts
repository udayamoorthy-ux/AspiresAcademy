/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import fs from 'fs';
import path from 'path';
import { 
  ExamType, 
  RealtimePresenceUser, 
  RealtimeRoomMessage, 
  RealtimeActivityItem, 
  RealtimeLiveBattle, 
  RealtimePomodoroState 
} from '../types';

interface ClientConnection {
  ws: WebSocket;
  userId: string;
  user: RealtimePresenceUser;
  isAlive: boolean;
}

// Data persistence paths
const DATA_DIR = process.cwd();
const CHAT_FILE = path.join(DATA_DIR, 'realtime_chat.json');
const ACTIVITY_FILE = path.join(DATA_DIR, 'realtime_activity.json');

// Initial seed chat messages
const INITIAL_MESSAGES: RealtimeRoomMessage[] = [
  {
    id: 'msg-seed-1',
    channel: 'general',
    senderId: 'mentor-1',
    senderName: 'Dr. S. Sundaram (Mentor)',
    senderExam: 'TNPSC_G1',
    senderColor: '#f59e0b',
    text: 'Good morning aspirants! Daily morning unit drill is live. Focus today on Tamil Heritage (Unit 8) & Modern History.',
    timestamp: '08:30 AM',
    likes: 14,
    isMentor: true
  },
  {
    id: 'msg-seed-2',
    channel: 'doubts',
    senderId: 'user-p1',
    senderName: 'Karthik Raja',
    senderExam: 'UPSC',
    senderColor: '#3b82f6',
    text: 'Quick doubt: Does Article 368 allow amending the Preamble without violating Basic Structure?',
    timestamp: '08:34 AM',
    likes: 5,
    isMentor: false
  },
  {
    id: 'msg-seed-3',
    channel: 'doubts',
    senderId: 'mentor-2',
    senderName: 'V. Ramanathan (IAS Academy Faculty)',
    senderExam: 'UPSC',
    senderColor: '#10b981',
    text: 'Yes! In Kesavananda Bharati (1973), the Supreme Court clarified the Preamble is an integral part of the Constitution and can be amended under Art 368, provided the Basic Structure remains intact.',
    timestamp: '08:37 AM',
    likes: 22,
    isMentor: true
  },
  {
    id: 'msg-seed-4',
    channel: 'general',
    senderId: 'user-p2',
    senderName: 'Deepa V.',
    senderExam: 'NEET',
    senderColor: '#ec4899',
    text: 'Just solved 45 Botany questions on Genetics with 96% accuracy! The timer in the mock test helped pace myself.',
    timestamp: '08:42 AM',
    likes: 8,
    isMentor: false
  }
];

// Initial seed activities
const INITIAL_ACTIVITIES: RealtimeActivityItem[] = [
  {
    id: 'act-1',
    userName: 'Ananya S.',
    userColor: '#8b5cf6',
    exam: 'TNPSC_G1',
    action: 'Completed Full Mock Test',
    detail: 'TNPSC Group 1 Prelims Official Paper (Score: 168/200)',
    timestamp: 'Just now',
    score: '168/200'
  },
  {
    id: 'act-2',
    userName: 'Karthik R.',
    userColor: '#3b82f6',
    exam: 'UPSC',
    action: 'Submitted Mains Answer',
    detail: 'Ethics (GS-4): Integrity & Public Administration Case Study',
    timestamp: '2m ago'
  },
  {
    id: 'act-3',
    userName: 'Siddharth M.',
    userColor: '#10b981',
    exam: 'IIT_JEE',
    action: 'Achieved 100% Accuracy',
    detail: 'Rotational Motion & Angular Momentum 10-Question Sprint',
    timestamp: '4m ago',
    score: '10/10'
  },
  {
    id: 'act-4',
    userName: 'Pooja Nair',
    userColor: '#ec4899',
    exam: 'NEET',
    action: 'Generated Study Notes',
    detail: 'High-Yield Mindmap: Human Endocrine Feedback Loops',
    timestamp: '6m ago'
  }
];

// Live Battle Questions Pool
const LIVE_BATTLE_QUESTIONS: Omit<RealtimeLiveBattle, 'endsAt' | 'totalAnswers' | 'stats' | 'rawCounts'>[] = [
  {
    id: 'battle-q1',
    questionText: 'Under the Indian Constitution, which Article guarantees the Right to Constitutional Remedies and was called the "Heart and Soul of the Constitution" by Dr. B.R. Ambedkar?',
    options: ['Article 19', 'Article 21', 'Article 32', 'Article 226'],
    correctAnswerIndex: 2,
    explanation: 'Dr. B.R. Ambedkar famously called Article 32 the "heart and soul of the Constitution" because it empowers citizens to directly approach the Supreme Court for enforcement of Fundamental Rights via prerogative writs.',
    subject: 'Indian Polity & Governance',
    exam: 'UPSC'
  },
  {
    id: 'battle-q2',
    questionText: 'Which Tamil archaeological site recently confirmed human settlement and literate urbanization dating back to 6th Century BCE (circa 580 BCE) through carbon dating of inscribed potsherds?',
    options: ['Adichanallur', 'Keezhadi (Sivaganga)', 'Kodumanal', 'Poompuhar'],
    correctAnswerIndex: 1,
    explanation: 'The Keezhadi excavations along the Vaigai river basin in Sivaganga district provided definitive evidence of an advanced urban civilization in Tamil Nadu dating to the 6th century BCE.',
    subject: 'Tamil Heritage (Unit 8)',
    exam: 'TNPSC_G1'
  },
  {
    id: 'battle-q3',
    questionText: 'Why is the oxygen molecule (O2) paramagnetic in nature despite having an even total of 16 electrons?',
    options: [
      'Presence of 2 unpaired electrons in degenerate anti-bonding π*2p orbitals',
      'Presence of unpaired electrons in bonding σ2p orbital',
      'High electronegativity of oxygen atoms',
      'Hybridization state of sp2'
    ],
    correctAnswerIndex: 0,
    explanation: 'According to Molecular Orbital Theory (MOT), the highest occupied molecular orbitals of O2 are degenerate anti-bonding π*2px and π*2py orbitals, each containing one unpaired electron with parallel spins.',
    subject: 'Chemistry (Chemical Bonding)',
    exam: 'NEET'
  },
  {
    id: 'battle-q4',
    questionText: 'A solid cylinder and a thin hollow hoop of identical mass and radius roll down an inclined plane without slipping. Which reaches the bottom first?',
    options: [
      'The thin hollow hoop',
      'The solid cylinder',
      'Both reach at the exact same time',
      'Depends on the angle of inclination'
    ],
    correctAnswerIndex: 1,
    explanation: 'Linear acceleration a = (g*sin θ)/(1 + I/(m*R^2)). For solid cylinder, I/(m*R^2) = 1/2 = 0.5. For hoop, I/(m*R^2) = 1.0. Lower moment of inertia coefficient yields greater acceleration, so the solid cylinder reaches first.',
    subject: 'Physics (Rotational Dynamics)',
    exam: 'IIT_JEE'
  },
  {
    id: 'battle-q5',
    questionText: 'The Reserve Bank of India’s Monetary Policy Committee (MPC) comprises how many total members and who acts as the ex-officio Chairperson?',
    options: [
      '5 members, Union Finance Minister',
      '6 members, Governor of RBI',
      '6 members, Chief Economic Advisor',
      '7 members, Governor of RBI'
    ],
    correctAnswerIndex: 1,
    explanation: 'The MPC has 6 members (3 from RBI and 3 external experts appointed by the Central Government). The Governor of the RBI serves as the ex-officio Chairperson with a casting vote in case of a tie.',
    subject: 'Indian Economy & Banking',
    exam: 'SSC_CGL'
  }
];

export function setupRealtimeServer(httpServer: http.Server) {
  // Use noServer mode with explicit upgrade matching to avoid colliding with Vite or proxy
  const wss = new WebSocketServer({ noServer: true });

  const clients = new Map<WebSocket, ClientConnection>();

  // Load or initialize state
  let messages: RealtimeRoomMessage[] = [];
  try {
    if (fs.existsSync(CHAT_FILE)) {
      messages = JSON.parse(fs.readFileSync(CHAT_FILE, 'utf8'));
    } else {
      messages = [...INITIAL_MESSAGES];
      fs.writeFileSync(CHAT_FILE, JSON.stringify(messages, null, 2), 'utf8');
    }
  } catch (e) {
    messages = [...INITIAL_MESSAGES];
  }

  let activities: RealtimeActivityItem[] = [];
  try {
    if (fs.existsSync(ACTIVITY_FILE)) {
      activities = JSON.parse(fs.readFileSync(ACTIVITY_FILE, 'utf8'));
    } else {
      activities = [...INITIAL_ACTIVITIES];
      fs.writeFileSync(ACTIVITY_FILE, JSON.stringify(activities, null, 2), 'utf8');
    }
  } catch (e) {
    activities = [...INITIAL_ACTIVITIES];
  }

  // Current Live Battle Question state
  let currentBattleIndex = 0;
  let currentBattle: RealtimeLiveBattle = {
    ...LIVE_BATTLE_QUESTIONS[0],
    endsAt: Date.now() + 10 * 60 * 1000,
    totalAnswers: 74,
    rawCounts: [8, 12, 48, 6],
    stats: [11, 16, 65, 8]
  };

  // Synchronized Pomodoro State
  const pomodoroState: RealtimePomodoroState = {
    mode: 'focus',
    remainingSeconds: 25 * 60,
    totalSeconds: 25 * 60,
    cycle: 1,
    activeLearnersCount: 42,
    statusMessage: 'Deep Work Session • No Phone • Silent Study'
  };

  // Helper: Broadcast to all active clients
  function broadcast(type: string, payload: any) {
    const data = JSON.stringify({ type, payload });
    for (const [ws, client] of clients.entries()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    }
  }

  // Calculate live presence list
  function getPresencePayload() {
    const connectedUsers: RealtimePresenceUser[] = [];
    for (const client of clients.values()) {
      connectedUsers.push(client.user);
    }
    // Baseline simulated active count added to real connected count
    const totalOnlineCount = Math.max(145, 140 + connectedUsers.length);
    return {
      activeCount: totalOnlineCount,
      activeConnectedUsers: connectedUsers
    };
  }

  // Recalculate battle stats
  function updateBattleStats() {
    const total = currentBattle.rawCounts.reduce((a, b) => a + b, 0);
    currentBattle.totalAnswers = total;
    if (total > 0) {
      currentBattle.stats = currentBattle.rawCounts.map(count => 
        Math.round((count / total) * 100)
      ) as [number, number, number, number];
    }
  }

  // Periodic Pomodoro Tick (Server Authoritative)
  setInterval(() => {
    if (pomodoroState.remainingSeconds > 0) {
      pomodoroState.remainingSeconds -= 1;
    } else {
      // Toggle mode
      if (pomodoroState.mode === 'focus') {
        pomodoroState.mode = 'break';
        pomodoroState.remainingSeconds = 5 * 60;
        pomodoroState.totalSeconds = 5 * 60;
        pomodoroState.statusMessage = '5-Minute Refresh Break • Hydrate & Stretch';
      } else {
        pomodoroState.mode = 'focus';
        pomodoroState.remainingSeconds = 25 * 60;
        pomodoroState.totalSeconds = 25 * 60;
        pomodoroState.cycle += 1;
        pomodoroState.statusMessage = 'Deep Work Session • Focus Mode Active';
      }
    }

    // Adjust learner count dynamically with real clients
    pomodoroState.activeLearnersCount = 38 + clients.size;

    // Send tick every 10 seconds or when minute rolls over
    if (pomodoroState.remainingSeconds % 10 === 0) {
      broadcast('pomodoro:sync', pomodoroState);
    }
  }, 1000);

  // Periodic Battle Question Rotation (Every 8 minutes)
  setInterval(() => {
    currentBattleIndex = (currentBattleIndex + 1) % LIVE_BATTLE_QUESTIONS.length;
    const nextQ = LIVE_BATTLE_QUESTIONS[currentBattleIndex];
    currentBattle = {
      ...nextQ,
      endsAt: Date.now() + 8 * 60 * 1000,
      totalAnswers: Math.floor(Math.random() * 30) + 20,
      rawCounts: [
        Math.floor(Math.random() * 8) + 3,
        Math.floor(Math.random() * 10) + 4,
        Math.floor(Math.random() * 25) + 15,
        Math.floor(Math.random() * 6) + 2
      ],
      stats: [12, 18, 60, 10]
    };
    updateBattleStats();
    broadcast('battle:new_question', currentBattle);
  }, 8 * 60 * 1000);

  // Periodic Ambient Community Activity (Every ~30 seconds)
  const ambientActivities = [
    { name: 'Sanjay Kumar', exam: 'UPSC' as ExamType, action: 'Solved 10 CSAT Problems', detail: 'Permutations & Logical Syllogisms', score: '10/10' },
    { name: 'Kavitha M.', exam: 'TNPSC_G1' as ExamType, action: 'Read Thirukkural Chapter', detail: 'Unit 8: Ethics of Governance & Social Justice' },
    { name: 'Rahul V.', exam: 'NEET' as ExamType, action: 'Completed Botany Sprint', detail: 'Plant Kingdom & Photosynthesis (40 MCQs)', score: '38/40' },
    { name: 'Tanvi Shah', exam: 'IELTS' as ExamType, action: 'Submitted Task 2 Essay', detail: 'AI in Higher Education - Band 8.5 Predicted' },
    { name: 'Gowtham R.', exam: 'SSC_CGL' as ExamType, action: 'Mastered Reasoning Test', detail: 'Number Series & Syllogisms Speed Drill', score: '25/25' },
    { name: 'Aakash Verma', exam: 'IIT_JEE' as ExamType, action: 'Solved Electrostatics Set', detail: 'Gauss Law & Field Flux (JEE Advanced Level)', score: '9/10' }
  ];
  let ambientIdx = 0;

  setInterval(() => {
    const item = ambientActivities[ambientIdx % ambientActivities.length];
    ambientIdx++;
    const newAct: RealtimeActivityItem = {
      id: `act-live-${Date.now()}`,
      userName: item.name,
      userColor: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'][ambientIdx % 5],
      exam: item.exam,
      action: item.action,
      detail: item.detail,
      timestamp: 'Just now',
      score: item.score
    };

    activities.unshift(newAct);
    if (activities.length > 50) activities.pop();
    broadcast('activity:new', newAct);
  }, 25000);

  // WebSocket Connection Handler
  wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    const defaultUserId = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const randomColors = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4'];
    const chosenColor = randomColors[Math.floor(Math.random() * randomColors.length)];

    const connectionInfo: ClientConnection = {
      ws,
      userId: defaultUserId,
      user: {
        id: defaultUserId,
        name: `Aspirant #${defaultUserId.slice(-4)}`,
        exam: 'UPSC',
        status: 'studying',
        joinedAt: Date.now(),
        color: chosenColor
      },
      isAlive: true
    };

    clients.set(ws, connectionInfo);

    // Initial state bundle
    ws.send(JSON.stringify({
      type: 'init:state',
      payload: {
        userId: connectionInfo.userId,
        user: connectionInfo.user,
        presence: getPresencePayload(),
        messages: messages.slice(0, 50),
        activities: activities.slice(0, 30),
        battle: currentBattle,
        pomodoro: pomodoroState
      }
    }));

    // Broadcast updated presence to other peers
    broadcast('presence:sync', getPresencePayload());

    // Message handler
    ws.on('message', (rawData: string) => {
      try {
        const parsed = JSON.parse(rawData.toString());
        const { type, payload } = parsed;

        switch (type) {
          case 'presence:update': {
            if (payload.name) connectionInfo.user.name = String(payload.name).slice(0, 30);
            if (payload.exam) connectionInfo.user.exam = payload.exam;
            if (payload.status) connectionInfo.user.status = payload.status;
            if (payload.currentTopic) connectionInfo.user.currentTopic = String(payload.currentTopic).slice(0, 50);
            broadcast('presence:sync', getPresencePayload());
            break;
          }

          case 'chat:send': {
            if (!payload.text || typeof payload.text !== 'string' || !payload.text.trim()) return;
            const cleanText = payload.text.trim().slice(0, 500);
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const newMsg: RealtimeRoomMessage = {
              id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              channel: payload.channel || 'general',
              senderId: connectionInfo.userId,
              senderName: connectionInfo.user.name,
              senderExam: connectionInfo.user.exam,
              senderColor: connectionInfo.user.color,
              text: cleanText,
              timestamp: timeStr,
              likes: 0,
              isMentor: payload.isMentor || false
            };

            messages.push(newMsg);
            if (messages.length > 200) messages.shift();

            // Persist async
            try {
              fs.writeFileSync(CHAT_FILE, JSON.stringify(messages, null, 2), 'utf8');
            } catch (err) {}

            broadcast('chat:new_message', newMsg);
            break;
          }

          case 'chat:like': {
            const { messageId } = payload;
            const targetMsg = messages.find(m => m.id === messageId);
            if (targetMsg) {
              targetMsg.likes = (targetMsg.likes || 0) + 1;
              broadcast('chat:like_updated', { messageId, likes: targetMsg.likes });
            }
            break;
          }

          case 'battle:vote': {
            const { optionIndex } = payload;
            if (typeof optionIndex === 'number' && optionIndex >= 0 && optionIndex < 4) {
              currentBattle.rawCounts[optionIndex] += 1;
              updateBattleStats();
              broadcast('battle:stats_update', {
                totalAnswers: currentBattle.totalAnswers,
                stats: currentBattle.stats,
                rawCounts: currentBattle.rawCounts,
                voterName: connectionInfo.user.name
              });
            }
            break;
          }

          case 'activity:publish': {
            if (!payload.action || !payload.detail) return;
            const newAct: RealtimeActivityItem = {
              id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              userName: connectionInfo.user.name,
              userColor: connectionInfo.user.color,
              exam: connectionInfo.user.exam,
              action: String(payload.action).slice(0, 50),
              detail: String(payload.detail).slice(0, 100),
              timestamp: 'Just now',
              score: payload.score ? String(payload.score) : undefined
            };

            activities.unshift(newAct);
            if (activities.length > 50) activities.pop();

            try {
              fs.writeFileSync(ACTIVITY_FILE, JSON.stringify(activities, null, 2), 'utf8');
            } catch (err) {}

            broadcast('activity:new', newAct);
            break;
          }

          case 'ping': {
            ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
            break;
          }
        }
      } catch (err) {
        console.error('Error parsing client WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      broadcast('presence:sync', getPresencePayload());
    });

    ws.on('error', (err) => {
      console.warn('WebSocket client error:', err.message);
      clients.delete(ws);
    });
  });

  // Upgrade handler attached to the HTTP server
  httpServer.on('upgrade', (request, socket, head) => {
    try {
      const parsedUrl = new URL(request.url || '', `http://${request.headers.host || 'localhost'}`);
      if (parsedUrl.pathname === '/ws' || parsedUrl.pathname === '/api/ws') {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      }
    } catch (e) {
      console.warn('Error handling WebSocket upgrade:', e);
    }
  });

  console.log('Real-Time WebSocket Server initialized on path /ws');
  return wss;
}
