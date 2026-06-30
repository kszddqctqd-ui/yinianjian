'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

function createZenAudio(ctx: AudioContext) {
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(ctx.destination);

  const drone = ctx.createOscillator();
  drone.type = 'sine';
  drone.frequency.value = 65.41;
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.15;
  drone.connect(droneGain);
  droneGain.connect(masterGain);
  drone.start();

  const fifth = ctx.createOscillator();
  fifth.type = 'sine';
  fifth.frequency.value = 98.0;
  const fifthGain = ctx.createGain();
  fifthGain.gain.value = 0.08;
  fifth.connect(fifthGain);
  fifthGain.connect(masterGain);
  fifth.start();

  const pentatonic = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63];
  function pingBell() {
    const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)];
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 3);
    setTimeout(pingBell, 2000 + Math.random() * 5000);
  }
  setTimeout(pingBell, 1000);
  return { masterGain, drone, fifth };
}

let audioCtx: AudioContext | null = null;
let zenAudio: ReturnType<typeof createZenAudio> | null = null;
let isPlaying = false;

function toggleMusic(): boolean {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    zenAudio = createZenAudio(audioCtx);
  }
  if (!zenAudio) return isPlaying;
  if (isPlaying) {
    zenAudio.masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
    isPlaying = false;
  } else {
    zenAudio.masterGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.5);
    if (audioCtx.state === 'suspended') audioCtx.resume();
    isPlaying = true;
  }
  return isPlaying;
}

export function MusicToggle() {
  const [playing, setPlaying] = useState(isPlaying);
  const toggle = () => {
    const next = toggleMusic();
    setPlaying(next);
  };
  useEffect(() => { return () => { audioCtx?.close(); }; }, []);
  return (
    <button
      aria-label="禅修音乐开关"
      onClick={toggle}
      className="relative inline-flex size-9 items-center justify-center rounded-full border transition-colors border-gold/25 text-paper-dark hover:border-gold/40 hover:text-gold"
    >
      {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  );
}

export function MusicToggleFloat() {
  const [playing, setPlaying] = useState(isPlaying);
  const toggle = () => {
    const next = toggleMusic();
    setPlaying(next);
  };
  useEffect(() => { return () => { audioCtx?.close(); }; }, []);
  return (
    <button
      aria-label="禅修音乐开关"
      title="禅修音乐"
      onClick={toggle}
      className="fixed right-3 z-40 flex size-10 items-center justify-center rounded-full border border-gold/50 bg-gradient-to-br from-gold/35 via-gold/20 to-vermillion/20 text-gold shadow-lg shadow-gold/20 backdrop-blur-md hover:from-gold/45 hover:to-vermillion/30 bottom-[calc(env(safe-area-inset-bottom)+88px)] md:right-4 md:bottom-4 md:size-14"
    >
      <Music size={16} />
    </button>
  );
}
