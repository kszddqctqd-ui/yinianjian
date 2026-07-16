'use client';

import { useState, useCallback, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';

// 三位大师
const MASTERS = [
  {
    icon: '🧘',
    name: '慧明长者',
    title: '古灵古怪，庄严肃穆',
    desc: '引经据典。通读《周易》《道德经》，言简意赅克制。适合喜欢深度解读、看古籍出处的施主。',
    bg: 'from-orange-500/20 to-transparent',
  },
  {
    icon: '🙏',
    name: '明心师父',
    title: '慈悲温柔，劝人向善',
    desc: '娓娓道来，如沐春风。适合家庭、感情、亲人祈福场景。',
    bg: 'from-purple-500/20 to-transparent',
  },
  {
    icon: '☯️',
    name: '文真道长',
    title: '直爽通透，说大白话',
    desc: '山中高人，不卖弄奇术。把命运讲成大白话，适合急性子。',
    bg: 'from-blue-500/20 to-transparent',
  },
];

// 六十四卦名称
const HEXAGRAM_NAMES = [
  '乾为天', '坤为地', '水雷屯', '山水蒙', '水天需', '天水讼', '地水师', '水地比',
  '风天小畜', '天泽履', '地天泰', '天地否', '天火同人', '火天大有', '地山谦', '雷地豫',
  '泽雷随', '山风蛊', '地泽临', '风地观', '火雷噬嗑', '山火贲', '山地剥', '地雷复',
  '天雷无妄', '山天大畜', '山雷颐', '泽风大过', '坎为水', '离为火', '泽山咸', '雷风恒',
  '天山遁', '雷天大壮', '火地晋', '地火明夷', '风火家人', '火泽睽', '水山蹇', '雷水解',
  '山泽损', '风雷益', '泽天夬', '天风姤', '泽地萃', '地风升', '泽水困', '水风井',
  '泽火革', '火风鼎', '震为雷', '艮为山', '风山渐', '雷泽归妹', '雷火丰', '火山旅',
  '巽为风', '兑为泽', '风水涣', '风泽中孚', '水泽节', '水火既济', '火水未济',
];

// 模拟卦象解读
function generateReading(question: string, hexagramIdx: number, masterIdx: number): string {
  const hexagram = HEXAGRAM_NAMES[hexagramIdx];
  const readings = [
    `此卦为${hexagram}，${question}？卦象显示当前形势较为复杂，需耐心等待时机。`,
    `${hexagram}卦，${question}？吉。但需注意循序渐进，不可急躁冒进。`,
    `${hexagram}卦，${question}？此卦暗示需要调整心态，顺应自然规律。`,
  ];
  return readings[(hexagramIdx + masterIdx) % readings.length];
}

// 投掷铜钱生成卦象
function castCoins(): { lines: number[]; movingLines: number[]; hexagramIdx: number } {
  const lines: number[] = [];
  const movingLines: number[] = [];
  
  for (let i = 0; i < 6; i++) {
    // 三枚铜钱：3个正面=9(老阴动), 3个反面=6(老阳动), 1正2反=8(少阴), 2正1反=7(少阳)
    const coins = [Math.random() > 0.5 ? 3 : 2, Math.random() > 0.5 ? 3 : 2, Math.random() > 0.5 ? 3 : 2];
    const sum = coins.reduce((a, b) => a + b, 0);
    if (sum === 6 || sum === 9) {
      movingLines.push(i);
    }
    lines.push(sum);
  }
  
  // 计算卦象索引
  const binary = lines.map(l => (l === 7 || l === 9) ? 1 : 0).join('');
  const hexagramIdx = parseInt(binary, 2) % HEXAGRAM_NAMES.length;
  
  return { lines, movingLines, hexagramIdx };
}

export default function DivinationPage() {
  const [selectedMaster, setSelectedMaster] = useState<number | null>(null);
  const [question, setQuestion] = useState('');
  const [casting, setCasting] = useState(false);
  const [result, setResult] = useState<{ lines: number[]; movingLines: number[]; hexagramIdx: number } | null>(null);
  const [reading, setReading] = useState('');
  const [freeCount, setFreeCount] = useState(1);
  const [shaking, setShaking] = useState(false);

  const handleCast = useCallback(() => {
    if (!question.trim()) {
      alert('请先写下您要问的事');
      return;
    }
    if (selectedMaster === null) {
      alert('请先选择一位师父');
      return;
    }
    if (freeCount <= 0) {
      alert('今日免费次数已用完');
      return;
    }
    
    setCasting(true);
    setShaking(true);
    
    setTimeout(() => {
      const castResult = castCoins();
      setResult(castResult);
      
      const rd = generateReading(question, castResult.hexagramIdx, selectedMaster || 0);
      setReading(rd);
      
      setCasting(false);
      setShaking(false);
      setFreeCount(prev => prev - 1);
    }, 2000);
  }, [question, selectedMaster, freeCount]);

  // 绘制卦象线条
  const renderHexagramLines = () => {
    if (!result) {
      // 显示6个空圈
      return Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="w-20 h-2 rounded-full border-2 border-dashed border-gold/30" />
      ));
    }
    
    // 从下到上显示（line 0是底部）
    return [...result.lines].reverse().map((line, i) => {
      const isYang = line === 7 || line === 9;
      const isMoving = result.movingLines.includes(result.lines.length - 1 - i);
      
      return (
        <div
          key={i}
          className={`w-20 h-2 rounded-sm transition-all ${
            isYang
              ? 'bg-gold/80'
              : 'flex justify-between w-20 h-2'
          } ${isMoving ? 'ring-2 ring-vermillion/60' : ''}`}
        >
          {!isYang && (
            <>
              <div className="h-full w-[42%] bg-gold/50 rounded-sm" />
              <div className="h-full w-[42%] bg-gold/50 rounded-sm" />
            </>
          )}
        </div>
      );
    });
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
            <div className="text-5xl mb-2">☯️</div>
            <h1 className="text-4xl text-gold font-display">六爻占卜</h1>
            <p className="text-paper-dark/80 text-sm">
              心诚则灵 · 摇动签筒 · 六爻成卦
            </p>
            <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs">
              今日免费 {freeCount}/1
            </div>
          </div>

          {/* Master Selection */}
          <div className="rounded-2xl border border-gold/20 bg-[#1a1510]/80 p-4 backdrop-blur-md">
            <p className="text-center text-sm text-gold/80 mb-3">请选一位师父为您开示</p>
            <div className="space-y-3">
              {MASTERS.map((master, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { setSelectedMaster(idx); setResult(null); setReading(''); }}
                  className={`w-full text-left rounded-xl border p-4 transition-all bg-gradient-to-r ${master.bg} ${
                    selectedMaster === idx
                      ? 'border-gold/60 bg-gold/10'
                      : 'border-gold/20 bg-[#1a1510]/80 hover:border-gold/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{master.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gold font-medium text-sm">{master.name}</span>
                        <span className="text-paper-dark/50 text-xs">·</span>
                        <span className="text-paper-dark/60 text-xs">{master.title}</span>
                      </div>
                      <p className="text-xs text-paper-dark/70">{master.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Question Input */}
          <div className="rounded-2xl border border-gold/20 bg-[#1a1510]/80 p-6 backdrop-blur-md">
            <label className="block text-sm text-gold/80 mb-2">默念心中所问，写下您要问的事</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="例如：这次出行是否顺利？"
              className="w-full rounded-lg border border-gold/20 bg-[#2e2518] px-4 py-3 text-sm text-gold placeholder:text-paper-dark/30 focus:border-gold/60 focus:outline-none"
            />
            <p className="text-xs text-paper-dark/50 mt-2">先静心默念，再摇签筒，一卦一事。</p>
          </div>

          {/* Hexagram Display */}
          <div className="rounded-2xl border border-gold/20 bg-[#1a1510]/80 p-6 backdrop-blur-md text-center">
            <div className="flex flex-col-reverse gap-2 items-center mb-4">
              {renderHexagramLines()}
            </div>
            
            {/* 摇动签筒按钮 */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className={`w-32 h-40 rounded-lg border-2 border-gold/30 bg-gradient-to-b from-amber-800 to-amber-900 flex items-center justify-center ${shaking ? 'animate-bounce' : ''}`}>
                  <div className="text-4xl">🎋</div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-vermillion flex items-center justify-center text-white text-xs">
                    签
                  </div>
                </div>
                <p className="text-xs text-paper-dark/50 mt-2">关圣帝君 · 灵签筒</p>
              </div>
              
              <button
                type="button"
                onClick={handleCast}
                disabled={casting || shaking}
                className="w-full max-w-xs px-8 py-3 rounded-full bg-vermillion text-white text-sm hover:bg-vermillion-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {casting ? '起卦中...' : shaking ? '摇动中...' : '摇动签筒'}
              </button>
            </div>
          </div>

          {/* Result */}
          {result && reading && (
            <div className="rounded-2xl border border-gold/20 bg-[#1a1510]/80 p-6 backdrop-blur-md">
              <h3 className="text-lg text-gold font-medium text-center mb-3">
                第{HEXAGRAM_NAMES[result.hexagramIdx]}卦
              </h3>
              <p className="text-paper-dark/80 text-sm leading-relaxed text-center">{reading}</p>
              
              {/* Moving lines info */}
              {result.movingLines.length > 0 && (
                <div className="mt-4 text-center">
                  <p className="text-xs text-vermillion">动爻：第{result.movingLines.map(l => l + 1).join('、')}爻</p>
                </div>
              )}
            </div>
          )}

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

      <BottomNav active="divination" />
    </div>
  );
}
