'use client';

import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { castHexagram, type HexagramInfo } from '@/lib/hexagrams';
import { saveRecord } from '@/lib/records';

// Map 3-line binary to trigram name
function linesToTrigram(lines: number[]): string {
  const binary = lines.map(l => l === 7 || l === 9 ? 1 : 0).reverse().join('');
  const map: Record<string, string> = {
    '111': '乾', '110': '兑', '101': '离', '100': '震',
    '011': '巽', '010': '坎', '001': '艮', '000': '坤',
  };
  return map[binary] ?? '乾';
}

// Visual hexagram line renderer
function HexagramLines({ lines, movingLines }: { lines: number[]; movingLines: number[] }) {
  // Draw from bottom (line 1) to top (line 6)
  const reversed = [...lines].reverse();
  return (
    <div className="flex flex-col items-center gap-1 py-3">
      {reversed.map((line, i) => {
        const isMoving = movingLines.includes(lines.length - 1 - i);
        const isYang = line === 7 || line === 9;
        return (
          <div
            key={i}
            className={`h-2 rounded-sm transition-all ${
              isYang
                ? 'w-24 bg-gold/80'
                : 'w-24 flex justify-between'
            } ${isMoving ? 'ring-2 ring-vermillion/60 ring-offset-1 ring-offset-xuan-card' : ''}`}
          >
            {!isYang && (
              <>
                <div className="h-full w-[42%] bg-gold/50 rounded-sm" />
                <div className="h-full w-[42%] bg-gold/50 rounded-sm" />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function HexagramCard({ title, info, lines, movingLines }: {
  title: string;
  info: HexagramInfo | null;
  lines: number[];
  movingLines: number[];
}) {
  return (
    <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-4 shadow-paper backdrop-blur-sm">
      <div className="text-center mb-3">
        <span className="text-xs text-gold/80 tracking-wider">{title}</span>
      </div>
      {info ? (
        <>
          <div className="text-center mb-3">
            <p className="text-2xl text-gold font-display">{info.name}</p>
            <p className="text-xs text-paper-dark/50 mt-1">{info.upper}上{info.lower}下</p>
          </div>
          <HexagramLines lines={lines} movingLines={movingLines} />
          <div className="mt-3 space-y-2 text-sm">
            <p className="text-paper-dark/85"><span className="text-gold">卦辞：</span>{info.judgment}</p>
            <p className="text-paper-dark/85"><span className="text-gold">整体：</span>{info.overall}</p>
            <p className="text-paper-dark/85"><span className="text-gold">事业：</span>{info.career}</p>
            <p className="text-paper-dark/85"><span className="text-gold">财运：</span>{info.wealth}</p>
            <p className="text-paper-dark/85"><span className="text-gold">感情：</span>{info.love}</p>
            <p className="text-paper-dark/85"><span className="text-gold">健康：</span>{info.health}</p>
            <p className="text-paper-dark/85"><span className="text-gold">建议：</span>{info.guidance}</p>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-paper-dark/60">暂无此卦解读</p>
          <p className="text-xs text-paper-dark/40 mt-1">请换一卦再试</p>
        </div>
      )}
    </div>
  );
}

export default function DivinationPage() {
  const [method, setMethod] = useState<'coins' | 'time' | 'number'>('coins');
  const [result, setResult] = useState<{ ben: HexagramInfo | null; hu: string; bian: HexagramInfo | null; movingLines: number[]; lines: number[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [coinResults, setCoinResults] = useState<number[]>([]);
  const [numberInput, setNumberInput] = useState('');

  // Coin toss: 3 coins, 6 or 7, 8 or 9
  const tossCoins = () => {
    if (coinResults.length >= 6) return;
    const toss = [Math.random() > 0.5 ? 3 : 2, Math.random() > 0.5 ? 3 : 2, Math.random() > 0.5 ? 3 : 2];
    const sum = toss.reduce((a, b) => a + b, 0);
    setCoinResults(prev => [...prev, sum]);
  };

  const castFromCoins = useCallback(() => {
    if (coinResults.length < 6) return;
    const lines = coinResults;
    const hex = castHexagram(lines);
    setResult({ ben: hex.ben ?? null, hu: hex.hu, bian: hex.bian ?? null, movingLines: hex.movingLines, lines });
    saveRecord('divination', { method: '铜钱起卦', lines, result: hex.ben?.name ?? '未知' }, `六爻占卜：${hex.ben?.name ?? '未知卦'}`);
  }, [coinResults]);

  // Time divination: use current hour/minute
  const castFromTime = useCallback(() => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    // Generate 6 lines from time
    const lines: number[] = [];
    for (let i = 0; i < 6; i++) {
      const val = ((hour * 60 + minute + i * 17) % 4 === 0) ? 6 : ((hour * 60 + minute + i * 13) % 4 === 1) ? 9 : ((hour * 60 + minute + i * 11) % 4 === 2) ? 7 : 8;
      lines.push(val);
    }
    const hex = castHexagram(lines);
    setResult({ ben: hex.ben ?? null, hu: hex.hu, bian: hex.bian ?? null, movingLines: hex.movingLines, lines });
    setCoinResults(lines);
    saveRecord('divination', { method: '时间起卦', lines, result: hex.ben?.name ?? '未知' }, `六爻占卜（时间）：${hex.ben?.name ?? '未知卦'}`);
  }, []);

  // Number divination
  const castFromNumbers = useCallback(() => {
    const nums = numberInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    if (nums.length < 3) {
      alert('请输入至少3个数字，用逗号分隔');
      return;
    }
    const lines: number[] = [];
    for (let i = 0; i < 6; i++) {
      const val = 6 + (nums[i % nums.length] + i * 7) % 4;
      lines.push(val);
    }
    const hex = castHexagram(lines);
    setResult({ ben: hex.ben ?? null, hu: hex.hu, bian: hex.bian ?? null, movingLines: hex.movingLines, lines });
    setCoinResults(lines);
    saveRecord('divination', { method: '数字起卦', nums, lines, result: hex.ben?.name ?? '未知' }, `六爻占卜（数字）：${hex.ben?.name ?? '未知卦'}`);
  }, [numberInput]);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      if (method === 'coins') castFromCoins();
      else if (method === 'time') castFromTime();
      else castFromNumbers();
      setLoading(false);
    }, 600);
  };

  const resetAll = () => {
    setCoinResults([]);
    setResult(null);
    setNumberInput('');
  };

  return (
    <div className="min-h-screen bg-deep relative overflow-hidden">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-xuan via-xuan-card to-xuan" />
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.20]" style={{ backgroundImage: "url('/temple/temple-mountain.svg')" }} />
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(10,6,4,0.55) 0%, rgba(10,6,4,0.35) 30%, transparent 60%, rgba(10,6,4,0.6) 100%)' }} />
      <div className="fixed inset-x-0 top-0 z-0 h-32 bg-gradient-to-b from-gold/15 to-transparent" />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-5xl space-y-section px-4 pb-24">
          <section className="space-y-3 pt-8 text-center">
            <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
              <svg className="size-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
            </div>
            <h1 className="text-4xl text-gold">六爻占卜</h1>
            <p className="text-base text-paper-dark/85">
              心起一念，三铜起卦，再看本卦、互卦、变卦，为当前事项补一版卦象参考。
            </p>
          </section>

          {/* Method selection */}
          <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm space-y-4">
            <div className="text-center">
              <span className="text-xs text-gold/80 tracking-wider">起卦方式</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'coins' as const, label: '铜钱起卦', icon: '🪙' },
                { key: 'time' as const, label: '时间起卦', icon: '⏰' },
                { key: 'number' as const, label: '数字起卦', icon: '🔢' },
              ].map(m => (
                <button key={m.key} type="button" onClick={() => { setMethod(m.key); resetAll(); }} className={`rounded-lg border p-3 text-center transition-all ${method === m.key ? 'border-gold/60 bg-gold/10 text-gold' : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'}`}>
                  <span className="text-2xl">{m.icon}</span>
                  <p className="text-xs mt-1">{m.label}</p>
                </button>
              ))}
            </div>

            {/* Coin toss area */}
            {method === 'coins' && (
              <div className="space-y-4">
                <div className="flex flex-wrap justify-center gap-3 min-h-[60px]">
                  {coinResults.map((r, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-bold font-number ${
                        r === 9 || r === 6 ? 'bg-gold/20 border-gold/60 text-gold' : 'bg-xuan-surface/50 border-gold/20 text-paper-dark/60'
                      }`}>
                        {r}
                      </div>
                      <span className="text-[10px] text-paper-dark/45 mt-1">第{i + 1}爻</span>
                    </div>
                  ))}
                  {Array.from({ length: 6 - coinResults.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-12 h-12 rounded-full border-2 border-dashed border-gold/10" />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={tossCoins}
                  disabled={coinResults.length >= 6 || loading}
                  className="w-full rounded-lg border border-gold/30 py-2 text-sm text-gold hover:bg-gold/10 transition-all disabled:opacity-50"
                >
                  {coinResults.length >= 6 ? '六爻已满' : '投掷铜钱'}
                </button>
              </div>
            )}

            {/* Time method */}
            {method === 'time' && (
              <p className="text-sm text-paper-dark/70 text-center py-2">
                以当前时间起卦，系统将自动生成卦象
              </p>
            )}

            {/* Number method */}
            {method === 'number' && (
              <div className="space-y-2">
                <label className="text-sm text-paper-dark/75">输入三个数字（逗号分隔）</label>
                <input
                  type="text"
                  value={numberInput}
                  onChange={(e) => setNumberInput(e.target.value)}
                  placeholder="例如：6,8,9"
                  className="w-full h-12 rounded-lg border border-gold/30 bg-xuan-surface px-4 text-sm text-paper-dark focus:border-gold focus:outline-none"
                />
              </div>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || (method === 'coins' && coinResults.length < 6)}
              className="w-full rounded-lg bg-vermillion py-3 text-lg text-white tracking-wider font-medium shadow-lg shadow-vermillion/20 hover:bg-vermillion-light transition-all disabled:opacity-50"
            >
              {loading ? '起卦中...' : '起卦'}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className="space-y-4 animate-slide-up">
              <HexagramCard
                title="本卦（当前）"
                info={result.ben}
                lines={result.lines}
                movingLines={result.movingLines}
              />
              <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-4 text-center">
                <span className="text-xs text-gold/80 tracking-wider">互卦</span>
                <p className="text-lg text-paper-dark/70 mt-2">{result.hu}</p>
                <p className="text-xs text-paper-dark/40 mt-1">由本卦中间四爻演变而来，代表过程</p>
              </div>
              {result.bian && (
                <HexagramCard
                  title={`变卦${result.movingLines.length > 0 ? `（${result.movingLines.length}爻动）` : '（无动爻）'}`}
                  info={result.bian}
                  lines={result.lines.map(l => l === 9 ? 8 : l === 6 ? 7 : l)}
                  movingLines={[]}
                />
              )}
              {result.movingLines.length > 0 && result.ben && (
                <div className="rounded-lg border border-vermillion/20 bg-vermillion/5 p-4 text-center">
                  <p className="text-sm text-paper-dark/80">
                    动爻在第 {result.movingLines.map(i => i + 1).join('、')} 爻，
                    {result.movingLines.length === 1
                      ? `以第${result.movingLines[0] + 1}爻爻辞为主解读`
                      : '多爻齐动，以本卦卦辞为主，变卦为辅'}
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="text-center text-xs text-paper-dark/60">仅作传统文化参考，请结合现实情况判断</p>
        </div>
      </main>

      <BottomNav active="divination" />
    </div>
  );
}
