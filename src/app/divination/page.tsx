'use client';

import { useState, useCallback, useEffect } from 'react';
import { t, getLocale } from '@/lib/i18n';
import type { SupportedLang } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';
import { castHexagram, type HexagramInfo } from '@/lib/hexagrams';
import { saveRecord } from '@/lib/records';

function resolve(key: string): string {
  return t(key);
}

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
            <p className="text-[1.5rem] text-gold font-display">{info.name}</p>
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
          <p className="text-sm text-on-dark-muted">{resolve('divination.noReading')}</p>
          <p className="text-xs text-paper-dark/40 mt-1">{resolve('divination.tryAgain')}</p>
        </div>
      )}
    </div>
  );
}

export default function DivinationPage() {
  const [lang, setLang] = useState<SupportedLang>(getLocale());
  useEffect(() => {
    setLang(getLocale());
    const handler = () => setLang(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  const [method, setMethod] = useState<'coins' | 'time' | 'number'>('coins');
  const [result, setResult] = useState<{ ben: HexagramInfo | null; hu: string; bian: HexagramInfo | null; movingLines: number[]; lines: number[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [coinResults, setCoinResults] = useState<number[]>([]);
  const [numberInput, setNumberInput] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [todayCount, setTodayCount] = useState(() => {
    try {
      const s = localStorage.getItem('yinianjian_div_today');
      const d = localStorage.getItem('yinianjian_div_date');
      const today = new Date().toDateString();
      if (d === today && s) return parseInt(s) || 0;
      return 0;
    } catch { return 0; }
  });
  const FREE_LIMIT = 1;

  // Coin toss: 3 coins, 6 or 7, 8 or 9
  const tossCoins = () => {
    if (coinResults.length >= 6) return;
    const toss = [Math.random() > 0.5 ? 3 : 2, Math.random() > 0.5 ? 3 : 2, Math.random() > 0.5 ? 3 : 2];
    const sum = toss.reduce((a, b) => a + b, 0);
    setCoinResults(prev => [...prev, sum]);
  };

  const castFromCoins = useCallback(() => {
    if (coinResults.length < 6) return;
    if (todayCount >= FREE_LIMIT) {
      setShowPayment(true);
      return;
    }
    const lines = coinResults;
    const hex = castHexagram(lines);
    setResult({ ben: hex.ben ?? null, hu: hex.hu, bian: hex.bian ?? null, movingLines: hex.movingLines, lines });
    try {
      localStorage.setItem('yinianjian_div_today', (todayCount + 1).toString());
      localStorage.setItem('yinianjian_div_date', new Date().toDateString());
      setTodayCount(c => c + 1);
    } catch {}
    saveRecord('divination', { method: resolve('divination.method.coins'), lines, result: hex.ben?.name ?? '未知' }, `${resolve('divination.title')}${hex.ben?.name ? `：${hex.ben.name}` : ''}`);
  }, [coinResults, todayCount]);

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
    saveRecord('divination', { method: resolve('divination.method.time'), lines, result: hex.ben?.name ?? '未知' }, `${resolve('divination.title')}（${resolve('divination.method.time')}）${hex.ben?.name ? `：${hex.ben.name}` : ''}`);
  }, []);

  // Number divination
  const castFromNumbers = useCallback(() => {
    const nums = numberInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    if (nums.length < 3) {
      alert(resolve('divination.numberError'));
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
    saveRecord('divination', { method: resolve('divination.method.number'), nums, lines, result: hex.ben?.name ?? '未知' }, `${resolve('divination.title')}（${resolve('divination.method.number')}）${hex.ben?.name ? `：${hex.ben.name}` : ''}`);
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
    <div className="min-h-screen bg-xuan relative overflow-hidden">
      <GoldenLotusBg />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-5xl space-y-section px-4 pb-24">
          <section className="space-y-3 pt-8 text-center">
            <div className="mx-auto mb-3 flex size-20 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-compass size-[2.25rem] text-gold" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </div>
            <h1 className="text-4xl tracking-widest" style={{ color: '#C9A96E', fontFamily: "'ZhiMangXing', cursive" }}>{resolve('divination.title')}</h1>
            <p className="text-base" style={{ color: '#D4C5A9' }}>
              {resolve('divination.subtitle')}
            </p>
          </section>

          {/* Method selection */}
          <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm space-y-4">
            {/* 免费次数提示 */}
            <div className="text-center">
              <span className="text-xs text-gold/80 tracking-wider">{resolve('divination.methodTitle')}</span>
              <p className="text-sm mt-2" style={{ color: todayCount >= FREE_LIMIT ? '#EF4444' : '#D4C5A9' }}>
                {todayCount >= FREE_LIMIT
                  ? resolve('payment.outOfTrials')
                  : `${resolve('payment.freeTrial')}：${FREE_LIMIT - todayCount}/${FREE_LIMIT}`}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'coins' as const },
                { key: 'time' as const },
                { key: 'number' as const },
              ].map(m => (
                <button key={m.key} type="button" onClick={() => { setMethod(m.key); resetAll(); }} className={`rounded-lg border p-3 text-center transition-all ${method === m.key ? 'border-gold/60 bg-gold/10 text-gold' : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'}`}>
                  <span className="text-[1.5rem]">{m.key === 'coins' ? '🪙' : m.key === 'time' ? '⏰' : '🔢'}</span>
                  <p className="text-xs mt-1">{resolve(`divination.method.${m.key}`)}</p>
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
                        r === 9 || r === 6 ? 'bg-gold/20 border-gold/60 text-gold' : 'bg-xuan-surface/50 border-gold/20 text-on-dark-muted'
                      }`}>
                        {r}
                      </div>
                      <span className="text-[10px] text-on-dark-dim mt-1">{resolve('divination.line').replace('{num}', (i + 1).toString())}</span>
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
                  {coinResults.length >= 6 ? resolve('divination.coin.full') : resolve('divination.coin.toss')}
                </button>
              </div>
            )}

            {/* Time method */}
            {method === 'time' && (
              <p className="text-sm text-on-dark-muted text-center py-2">
                {resolve('divination.timeHint')}
              </p>
            )}

            {/* Number method */}
            {method === 'number' && (
              <div className="space-y-2">
                <label className="text-sm text-paper-dark/80">{resolve('divination.numberLabel')}</label>
                <input
                  type="text"
                  value={numberInput}
                  onChange={(e) => setNumberInput(e.target.value)}
                  placeholder={resolve('divination.numberPlaceholder')}
                  className="input-standard w-full"
                />
              </div>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || (method === 'coins' && coinResults.length < 6)}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? resolve('divination.btn.casting') : resolve('divination.btn.cast')}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className="space-y-4 animate-slide-up">
              <HexagramCard
                title={resolve('divination.primary')}
                info={result.ben}
                lines={result.lines}
                movingLines={result.movingLines}
              />
              <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-4 text-center">
                <span className="text-xs text-gold/80 tracking-wider">{resolve('divination.mutual')}</span>
                <p className="text-lg text-on-dark-muted mt-2">{result.hu}</p>
                <p className="text-xs text-paper-dark/40 mt-1">{resolve('divination.mutualNote')}</p>
              </div>
              {result.bian && (
                <HexagramCard
                  title={`${resolve('divination.transformed')}${result.movingLines.length > 0 ? `（${result.movingLines.length}爻动）` : '（无动爻）'}`}
                  info={result.bian}
                  lines={result.lines.map(l => l === 9 ? 8 : l === 6 ? 7 : l)}
                  movingLines={[]}
                />
              )}
              {result.movingLines.length > 0 && result.ben && (
                <div className="rounded-lg border border-vermillion/20 bg-vermillion/5 p-4 text-center">
                  <p className="text-sm text-paper-dark/80">
                    {resolve('divination.movingLineNote').replace('{lines}', result.movingLines.map(i => i + 1).join('、')).replace('{detail}',
                      result.movingLines.length === 1
                        ? resolve('divination.movingDetail.one').replace('{num}', (result.movingLines[0] + 1).toString())
                        : resolve('divination.movingDetail.multi')
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="text-center text-xs text-on-dark-muted">{resolve('common.disclaimer')}</p>
        </div>
      </main>

      {/* 支付弹窗 */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowPayment(false)}>
          <div className="rounded-2xl border-2 border-gold/40 bg-xuan-card p-6 max-w-sm w-full text-center space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl text-gold font-display">{resolve('payment.title')}</h3>
            <p className="text-sm" style={{ color: '#D4C5A9' }}>{resolve('payment.desc')}</p>
            <div className="rounded-lg border border-gold/20 bg-xuan-surface p-4">
              <p className="text-vermillion text-2xl font-display">¥6.6</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(212,197,169,0.5)' }}>{resolve('payment.unlockDivinationPrice')}</p>
            </div>
            <img src="/zfb-payment.png" alt="支付宝收款码" className="mx-auto rounded-lg border-2 border-gold/30 w-48 h-48 object-cover" />
            <p className="text-xs" style={{ color: 'rgba(212,197,169,0.5)' }}>{resolve('payment.confirm')}</p>
            <button type="button" onClick={() => setShowPayment(false)} className="w-full rounded-md border border-gold/30 py-2 text-sm text-paper-dark/80 hover:text-gold transition-colors">{resolve('payment.close')}</button>
          </div>
        </div>
      )}

      <BottomNav active="divination" />
    </div>
  );
}
