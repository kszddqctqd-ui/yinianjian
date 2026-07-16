'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';

// 禅音曲库
const SONGS = [
  { id: 1, title: '菩提花主题曲', desc: '金光普照·寺院庄严', duration: '2:57', genre: '佛教音乐' },
  { id: 2, title: '菩提花', desc: '你的睡眠/深度冥想', duration: '2:51', genre: '佛教音乐' },
  { id: 3, title: '菩提花·观音乐', desc: '轻柔佛曲·心境澄明', duration: '3:15', genre: '佛教音乐' },
  { id: 4, title: '菩提花·波尘缘', desc: '渡己之缘·超脱本心', duration: '3:33', genre: '佛教音乐' },
  { id: 5, title: '立定晨课', desc: '晨钟暮鼓·清净如海', duration: '2:48', genre: '佛教音乐' },
  { id: 6, title: '禅坐', desc: '静默观息·身心安住', duration: '3:20', genre: '佛教音乐' },
  { id: 7, title: '禅音', desc: '万籁皆空·处处是道场', duration: '3:12', genre: '佛教音乐' },
  { id: 8, title: '观自在', desc: '月光皎洁·照见五蕴', duration: '3:11', genre: '佛教音乐' },
  { id: 9, title: '大悲咒', desc: '观音大士·消灾解厄', duration: '4:06', genre: '佛教音乐' },
  { id: 10, title: '心经', desc: '般若智慧·照见空性', duration: '3:55', genre: '佛教音乐' },
];

// 禅修引导模式
const MEDITATION_MODES = [
  {
    icon: '🔔',
    title: '十分钟入门',
    subtitle: '适合初学者',
    duration: '10分钟',
    steps: [
      '盘腿端坐，背挺直',
      '深呼吸三次，吸气数4秒，呼气数6秒',
      '把注意力放在鼻尖呼吸的进出',
      '杂念升起时不评判，温柔回到呼吸',
      '结束时双手合掌，回向众生',
    ],
  },
  {
    icon: '🧘',
    title: '二十分钟正念',
    subtitle: '进阶练习',
    duration: '20分钟',
    steps: [
      '三下轻叩闻息',
      '观呼吸：注意力锁定鼻尖出入气',
      '扫描身体：从头到脚紧绷，依次放松每一处',
      '观念头来去：见妄念升起即知见，不跟随',
      '回向：愿一切众生离苦得乐',
    ],
  },
  {
    icon: '🙏',
    title: '南无阿弥陀佛',
    subtitle: '持名念佛',
    duration: '15分钟',
    steps: [
      '盘坐，掐念珠或合掌',
      '心中默念或低声出「南无阿弥陀佛」六字',
      '字字分明，心心相续',
      '杂念起，回到佛号',
      '下座前合掌回向',
    ],
  },
];

export default function MeditationPage() {
  const [playingSong, setPlayingSong] = useState<number | null>(null);
  const [currentMode, setCurrentMode] = useState<number | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlaySong = (id: number) => {
    if (playingSong === id) {
      setPlayingSong(null);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setPlayingSong(id);
      // 模拟播放
      setTimeout(() => {
        setPlayingSong(null);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1410] relative overflow-hidden">
      <GoldenLotusBg />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto max-w-4xl px-4 pb-24 pt-20">
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center space-y-2">
            <div className="text-5xl mb-2">🪷</div>
            <h1 className="text-4xl text-gold font-display">静心禅坐</h1>
            <p className="text-paper-dark/80 text-sm max-w-md mx-auto">
              钟磬古乐、佛号梵音、深山溪水。日日一坐，让自己慢下来。
            </p>
            <div className="mt-4 p-4 rounded-xl border border-gold/20 bg-gold/5">
              <p className="text-gold/80 text-sm italic">
                「心不动，则不痛」
              </p>
              <p className="text-paper-dark/50 text-xs mt-1">—— 佛家语</p>
            </div>
          </div>

          {/* Zen Sound Library */}
          <div className="rounded-2xl border border-gold/20 bg-[#1a1510]/80 p-6 backdrop-blur-md">
            <h2 className="text-xl text-gold font-medium text-center mb-2">禅音曲库</h2>
            <p className="text-center text-xs text-paper-dark/50 mb-4">
              精选十首冥想音乐 · 全部为13项版权 · 离开页面后自动播放结束
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SONGS.map(song => (
                <div
                  key={song.id}
                  className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
                    playingSong === song.id
                      ? 'border-gold/60 bg-gold/10'
                      : 'border-gold/10 bg-[#2e2518]/50 hover:border-gold/30'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gold truncate">{song.title}</div>
                    <div className="text-xs text-paper-dark/60 truncate">{song.desc}</div>
                    <div className="text-xs text-paper-dark/40 mt-1">{song.duration} · {song.genre}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePlaySong(song.id)}
                    className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors flex-shrink-0"
                  >
                    {playingSong === song.id ? '⏸' : '▶️'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Meditation Modes */}
          <div className="rounded-2xl border border-gold/20 bg-[#1a1510]/80 p-6 backdrop-blur-md">
            <h2 className="text-xl text-gold font-medium text-center mb-4">选择禅修模式</h2>
            
            <div className="space-y-3">
              {MEDITATION_MODES.map((mode, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { setCurrentMode(idx); setShowGuide(true); }}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    currentMode === idx
                      ? 'border-gold/60 bg-gold/10'
                      : 'border-gold/20 bg-[#1a1510]/80 hover:border-gold/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{mode.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gold font-medium text-sm">{mode.title}</span>
                        <span className="text-paper-dark/50 text-xs">·</span>
                        <span className="text-paper-dark/60 text-xs">{mode.subtitle}</span>
                      </div>
                      <div className="inline-block px-2 py-1 rounded-full bg-gold/10 text-xs text-gold/80">
                        {mode.duration}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Meditation Guide */}
            {showGuide && currentMode !== null && (
              <div className="mt-4 rounded-xl border border-gold/20 bg-gold/5 p-4">
                <h3 className="text-gold font-medium text-sm mb-3">
                  {MEDITATION_MODES[currentMode].title} 引导步骤
                </h3>
                <ol className="space-y-2">
                  {MEDITATION_MODES[currentMode].steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-paper-dark/70">
                      <span className="text-gold/80 font-medium flex-shrink-0">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Quote */}
          <div className="rounded-2xl border border-gold/20 bg-[#1a1510]/80 p-6 backdrop-blur-md text-center">
            <div className="text-3xl mb-3">🪷</div>
            <blockquote className="text-gold/80 text-sm italic leading-relaxed max-w-md mx-auto">
              菩提本无树，明镜亦非台。<br />
              本来无一物，何处惹尘埃。
            </blockquote>
            <p className="text-paper-dark/50 text-xs mt-3">—— 六祖惠能</p>
          </div>

          {/* Disclaimer */}
          <div className="rounded-2xl border border-gold/20 bg-[#1a1510]/80 p-4 backdrop-blur-md">
            <div className="flex items-start gap-2">
              <span className="text-paper-dark/50 mt-0.5">ℹ️</span>
              <p className="text-xs text-paper-dark/50">
                仅作传统文化参考，请结合现实情况判断。未满18周岁请勿使用本服务。
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav active="meditation" />
    </div>
  );
}
