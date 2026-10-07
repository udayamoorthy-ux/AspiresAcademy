/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API Synthesizer for 8:00 PM Sprint Alarm & Alerts
let audioCtx: AudioContext | null = null;
let isRinging = false;
let currentLoopTimeout: any = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a single melodic bell chime note
 */
function playNote(ctx: AudioContext, freq: number, startTime: number, duration: number, volume: number = 0.25) {
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Warm bell harmonic
    const harmonicOsc = ctx.createOscillator();
    const harmonicGain = ctx.createGain();
    harmonicOsc.type = 'triangle';
    harmonicOsc.frequency.setValueAtTime(freq * 2, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    harmonicGain.gain.setValueAtTime(0, startTime);
    harmonicGain.gain.linearRampToValueAtTime(volume * 0.35, startTime + 0.02);
    harmonicGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    harmonicOsc.connect(harmonicGain);
    harmonicGain.connect(ctx.destination);

    osc.start(startTime);
    harmonicOsc.start(startTime);

    osc.stop(startTime + duration);
    harmonicOsc.stop(startTime + duration);
  } catch (e) {
    console.warn('Audio playback error', e);
  }
}

/**
 * Plays a bright, urgent 4-note ascending chime pattern
 */
export function playChimePattern(loop: boolean = false) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Notes: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
  const notes = [523.25, 659.25, 783.99, 1046.50];
  const step = 0.14;

  notes.forEach((freq, idx) => {
    playNote(ctx, freq, now + (idx * step), 0.7, 0.3);
  });

  // Second echo chord for rich presence
  setTimeout(() => {
    if (!isRinging && loop) return;
    const ctx2 = getAudioContext();
    if (!ctx2) return;
    const now2 = ctx2.currentTime;
    playNote(ctx2, 783.99, now2, 0.9, 0.35);
    playNote(ctx2, 1046.50, now2 + 0.08, 1.2, 0.4);
  }, 700);

  if (loop && isRinging) {
    currentLoopTimeout = setTimeout(() => {
      if (isRinging) {
        playChimePattern(true);
      }
    }, 2400);
  }
}

/**
 * Start the ringing alarm (continuous repeating chime until stopped)
 */
export function startAlarmSound() {
  isRinging = true;
  if (currentLoopTimeout) clearTimeout(currentLoopTimeout);
  playChimePattern(true);
}

/**
 * Stop the alarm sound immediately
 */
export function stopAlarmSound() {
  isRinging = false;
  if (currentLoopTimeout) {
    clearTimeout(currentLoopTimeout);
    currentLoopTimeout = null;
  }
}

/**
 * Play a short 1-second preview tone for testing
 */
export function previewAlarmSound() {
  stopAlarmSound();
  playChimePattern(false);
}
