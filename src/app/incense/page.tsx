'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';

export default function IncensePage() {
  const [incenseType, setIncenseType] = useState('tan'); // tan=檀香, chen=沉香, an=安神香
  const [offerings, setOfferings] = useState(0);
  const [sticks, setSticks] = useState(0);
  const [merit, setMerit] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('yinianjian_incense_data');
      if (saved) {
        const data = JSON.parse(saved);
        const today = new Date().toISOString().slice(0, 10);
        if (data.date === today) {
          setOfferings(data.offerings || 0);
          setSticks(data.sticks || 0);
          setMerit(data.merit || 0);
        }
      }
    } catch {}
  }, []);

  const saveData = (off: number, stk: number, mer: number) => {
    const data = {
      date: new Date().toISOString().slice(0, 10),
      offerings: off,
      sticks: stk,
      merit: mer,
    };
    try {
      localStorage.setItem('yinianjian_incense_data', JSON.stringify(data));
    } catch {}
  };

  const handleOffer = () => {
    if (offerings >= 3) {
      alert('今日已奉香3礼，明日再来');
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      const newOfferings = offerings + 1;
      const newSticks = sticks + 3;
      const newMerit = merit + 5;
      setOfferings(newOfferings);
      setSticks(newSticks);
      setMerit(newMerit);
      saveData(newOfferings, newSticks, newMerit);
      setAnimating(false);
    }, 2000);
  };

  const incenseTypes = [
    { key: 'tan', name: '檀香', desc: '清净辟邪' },
    { key: 'chen', name: '沉香', desc: '安神定志' },
    { key: 'an', name: '安神香', desc: '平和安宁' },
  ];

  return (
    <div className="min-h-screen bg-xuan relative overflow-hidden">
      <GoldenLotusBg />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto max-w-4xl px-4 pb-24 pt-20">
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl text-gold font-display">在线上香</h1>
            <p className="text-paper-dark/80 text-sm">心诚则灵，每日最多三礼，每礼三炷清香</p>
          </div>

          {/* Left Panel - Incense Burner */}
          <div className="rounded-2xl border border-gold/20 bg-xuan-card/80 p-6 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-gold/80">三礼九炷</span>
              <span className="text-xs text-paper-dark/60">{offerings}/3 礼</span>
            </div>
            
            {/* Incense Burner SVG */}
            <div className="flex justify-center mb-4">
              <svg viewBox="0 0 200 220" fill="none" className="w-48 h-56">
                {/* Tripod legs */}
                <path d="M60 180 L50 210 L65 210 L70 180" fill="#8B6914" stroke="#C9A05C" strokeWidth="1"/>
                <path d="M140 180 L135 210 L150 210 L140 180" fill="#8B6914" stroke="#C9A05C" strokeWidth="1"/>
                <path d="M100 180 L95 215 L105 215 L100 180" fill="#8B6914" stroke="#C9A05C" strokeWidth="1"/>
                {/* Body */}
                <ellipse cx="100" cy="140" rx="55" ry="45" fill="url(#dingGrad)" stroke="#C9A05C" strokeWidth="1.5"/>
                {/* Handles */}
                <path d="M45 100 Q30 80 45 60" stroke="#C9A05C" strokeWidth="2" fill="none"/>
                <path d="M155 100 Q170 80 155 60" stroke="#C9A05C" strokeWidth="2" fill="none"/>
                {/* Lid */}
                <ellipse cx="100" cy="95" rx="50" ry="10" fill="#8B6914" stroke="#C9A05C" strokeWidth="1"/>
                {/* Seal */}
                <rect x="85" y="125" width="30" height="30" rx="2" fill="#C43D3D"/>
                <text x="100" y="147" textAnchor="middle" fill="#F5E6B8" fontSize="18" fontWeight="bold">福</text>
                {/* Smoke animation */}
                {animating && (
                  <>
                    <circle cx="90" cy="70" r="3" fill="rgba(201,160,92,0.3)">
                      <animate attributeName="cy" from="70" to="20" dur="2s" repeatCount="1"/>
                      <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="1"/>
                    </circle>
                    <circle cx="100" cy="65" r="4" fill="rgba(201,160,92,0.3)">
                      <animate attributeName="cy" from="65" to="15" dur="2.5s" repeatCount="1"/>
                      <animate attributeName="opacity" from="0.5" to="0" dur="2.5s" repeatCount="1"/>
                    </circle>
                    <circle cx="110" cy="70" r="3" fill="rgba(201,160,92,0.3)">
                      <animate attributeName="cy" from="70" to="20" dur="2.2s" repeatCount="1"/>
                      <animate attributeName="opacity" from="0.5" to="0" dur="2.2s" repeatCount="1"/>
                    </circle>
                  </>
                )}
                <defs>
                  <radialGradient id="dingGrad" cx="0.5" cy="0.4" r="0.6">
                    <stop offset="0%" stopColor="#C9A05C" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#8B6914" stopOpacity="0.5"/>
                  </radialGradient>
                </defs>
              </svg>
            </div>
            
            <p className="text-center text-xs text-paper-dark/60 mb-4">轻触下方按钮，敬上3炷清香</p>
            
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleOffer}
                disabled={offerings >= 3 || animating}
                className="px-8 py-3 rounded-lg bg-vermillion text-white font-medium shadow-lg shadow-vermillion/20 hover:bg-vermillion-light active:bg-vermillion-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {animating ? '奉香中...' : offerings >= 3 ? '今日已满' : '敬上三炷清香'}
              </button>
            </div>
          </div>

          {/* Right Panel - Status */}
          <div className="rounded-2xl border border-gold/20 bg-xuan-card/80 p-6 backdrop-blur-md space-y-4">
            <div className="text-center">
              <h3 className="text-lg text-gold mb-1">今日已奉香</h3>
              <div className="text-3xl text-gold font-display">{offerings}/3 礼</div>
              <p className="text-xs text-paper-dark/60 mt-1">已插入 {sticks} 炷清香</p>
            </div>

            <div>
              <h4 className="text-sm text-gold/80 mb-2">选择香火</h4>
              <div className="flex gap-2">
                {incenseTypes.map(type => (
                  <button
                    key={type.key}
                    type="button"
                    onClick={() => setIncenseType(type.key)}
                    className={`flex-1 py-2 rounded-full text-xs border transition-all ${
                      incenseType === type.key
                        ? 'border-gold/60 bg-gold/10 text-gold'
                        : 'border-gold/20 text-paper-dark/60 hover:border-gold/40'
                    }`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-gold/5 p-4 text-center">
              <div className="text-xs text-gold/80 mb-1">当前功德值</div>
              <div className="text-2xl text-gold font-display">{merit}</div>
              <p className="text-xs text-paper-dark/60 mt-2 leading-relaxed">
                一礼三炷清香，记5点功德。香火不在多，在心念端正、持之以恒。
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  );
}
