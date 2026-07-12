'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';
import { saveRecord } from '@/lib/records';
import { t, getLocale } from '@/lib/i18n';
import type { SupportedLang } from '@/lib/i18n';
import { DREAMS } from '@/lib/dreams';
import type { Dream } from '@/lib/dreams';

function resolve(key: string): string {
  return t(key);
}

// 梦境分类
const DREAM_CATEGORIES = [
  { emoji: '👥', label: '人物' },
  { emoji: '🫀', label: '身体' },
  { emoji: '🐎', label: '动物' },
  { emoji: '🌿', label: '植物' },
  { emoji: '🌤', label: '天象自然' },
  { emoji: '📿', label: '物品' },
  { emoji: '🏠', label: '房舍宅院' },
  { emoji: '🕯', label: '生死婚丧' },
  { emoji: '🚶', label: '行为' },
  { emoji: '🙏', label: '鬼神宗教' },
  { emoji: '💰', label: '财运钱帛' },
];

// 热门梦境（从菩提苑源码提取）
const HOT_DREAMS = [
  { keyword: '贵人', title: '梦见贵人', fortune: '上上', desc: '事业上将遇贵人扶持，或得到上级器重。' },
  { keyword: '父母', title: '梦见父母', fortune: '上吉', desc: '近期家中诸事顺遂，家人安康。若双亲已故，则提示需多缅怀祭祀。' },
  { keyword: '孩子', title: '梦见孩子', fortune: '中吉', desc: '象征新的开始与希望。怀孕者梦此为胎气稳固，未孕者主未来三月有喜事。' },
  { keyword: '已故亲人', title: '梦见已故亲人', fortune: '上吉', desc: '已故亲人入梦多为思念所致，亦为先祖庇佑之兆。若亡者面色和悦，家中将逢喜事。' },
  { keyword: '僧人', title: '梦见僧人', fortune: '上吉', desc: '象征心灵将得开悟，迷茫之事将有指引。亦为虔诚信佛者之吉兆。' },
  { keyword: '自己死了', title: '梦见自己死了', fortune: '上上', desc: '梦中死亡是"重生"的象征，旧的告一段落，新的将启。莫怕。' },
  { keyword: '亲戚', title: '梦见亲戚', fortune: '中吉', desc: '近期可能有久未联系之亲戚相聚。彼此应多走动，互相扶持。' },
  { keyword: '陌生人', title: '梦见陌生人', fortune: '中平', desc: '提示生活中将有新缘分到来，可能是贵人或新友。需明辨善恶。' },
  { keyword: '头发', title: '梦见头发', fortune: '中平', desc: '白发主长寿与智慧；脱发反而是烦恼脱落、轻装前行之意。' },
  { keyword: '掉牙', title: '梦见掉牙', fortune: '中平', desc: '传统认为掉牙主长辈安康。现代心理学解为压力释放或对衰老的担忧，不必过虑。' },
  { keyword: '眼睛', title: '梦见眼睛', fortune: '中吉', desc: '象征对事物有新洞察。若梦中视物不清，则提示当下判断需谨慎。' },
  { keyword: '流血', title: '梦见流血', fortune: '上吉', desc: '鲜血在解梦学中反主财运将至，尤其大量流血更佳。莫被字面吓到。' },
];

// 热门梦境卡片颜色等级
function getFortuneStyle(fortune: string) {
  if (fortune === '上上') return 'border-vermillion/40 bg-vermillion/10';
  if (fortune === '上吉') return 'border-vermillion/30 bg-vermillion/5';
  if (fortune === '中吉') return 'border-gold/40 bg-gold/10';
  if (fortune === '中平') return 'border-gold/20 bg-xuan-surface/50';
  return 'border-gold/20 bg-xuan-surface/50';
}

function getFortuneColor(fortune: string) {
  if (fortune === '上上') return 'text-vermillion-light';
  if (fortune === '上吉') return 'text-vermillion-light';
  if (fortune === '中吉') return 'text-gold';
  return 'text-paper';
}

export default function DreamPage() {
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState<Dream | null>(null);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<SupportedLang>(getLocale());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    setLang(getLocale());
    const handler = () => setLang(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  const searchDream = () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setTimeout(() => {
      // 精确匹配
      const exact = DREAMS.find(d => d.keyword === keyword);
      // 模糊匹配
      const fuzzy = DREAMS.find(d => keyword.includes(d.keyword) || d.keyword.includes(keyword));
      const found = exact || fuzzy;
      const res = found || { keyword, title: keyword, result: `暂无"${keyword}"的直接解释，但梦见此物通常反映您近期的心理状态。建议静心思考此梦与您生活的关联。`, luck: '中平' as const };
      setResult(res);
      setLoading(false);
      saveRecord('dream', { keyword, result: res.result }, `${resolve('dream.resultTitle')}：${keyword}`);
    }, 500);
  };

  const hotDreamClick = (hot: typeof HOT_DREAMS[0]) => {
    setKeyword(hot.keyword);
    // 模拟搜索结果
    setResult({
      keyword: hot.keyword,
      title: hot.title,
      result: hot.desc,
      luck: hot.fortune as any,
    });
    saveRecord('dream', { keyword: hot.keyword, result: hot.desc }, hot.title);
  };

  return (
    <div className="min-h-screen bg-xuan relative overflow-hidden">
      <GoldenLotusBg />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-4xl space-y-6 px-4 pb-24">
          {/* Title */}
          <section className="space-y-3 pt-6 text-center">
            <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon size-8 text-gold" aria-hidden="true">
                <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
              </svg>
            </div>
            <h1 className="font-display text-4xl tracking-widest text-gold">{resolve('dream.title')}</h1>
            <p className="text-base text-paper-dark/85">
              {resolve('dream.subtitle')}
            </p>
          </section>

          {/* Search */}
          <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm hover:border-gold/30 hover:shadow-card space-y-3">
            <p className="text-base text-paper-dark/85">{resolve('dream.searchPlaceholder')}</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchDream()}
                placeholder={resolve('dream.searchPlaceholder')}
                maxLength={100}
                className="rounded-md border border-gold/20 bg-xuan-surface px-3 text-paper-dark placeholder:text-ink-muted transition-all duration-fast focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 h-12 w-full text-base sm:flex-1"
              />
              <button
                type="button"
                onClick={searchDream}
                disabled={loading || !keyword.trim()}
                className="inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-fast focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/40 disabled:cursor-not-allowed disabled:opacity-50 min-w-[180px] rounded-lg bg-vermillion tracking-wider text-white shadow-lg shadow-vermillion/20 hover:bg-vermillion-light active:bg-vermillion-dark px-5 text-base h-12 w-full whitespace-nowrap sm:w-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search mr-1 size-4" aria-hidden="true">
                  <path d="m21 21-4.34-4.34" />
                  <circle cx="11" cy="11" r="8" />
                </svg>
                {loading ? resolve('dream.loading') : resolve('dream.btn.search')}
              </button>
            </div>
          </div>

          {/* 按类查梦 */}
          <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm hover:border-gold/30 hover:shadow-card space-y-3">
            <h2 className="font-display text-xl text-gold">{resolve('dream.categoryTitle') || '按类查梦'}</h2>
            <div className="flex flex-wrap gap-2">
              {DREAM_CATEGORIES.map(cat => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setSelectedCategory(selectedCategory === cat.label ? null : cat.label)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    selectedCategory === cat.label
                      ? 'border-gold/60 bg-gold/10 text-gold'
                      : 'border-gold/20 text-paper-dark/85 hover:border-gold/40'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 热门梦境 */}
          <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm hover:border-gold/30 hover:shadow-card space-y-3">
            <h2 className="flex items-center gap-2 font-display text-xl text-gold">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles size-5" aria-hidden="true">
                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
                <path d="M20 2v4" />
                <path d="M22 4h-4" />
                <circle cx="4" cy="20" r="2" />
              </svg>
              {resolve('dream.hotDreams') || '热门梦境'}
            </h2>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {HOT_DREAMS.map(hot => (
                <button
                  key={hot.keyword}
                  type="button"
                  onClick={() => hotDreamClick(hot)}
                  className={`rounded-lg border p-3 text-left transition-colors ${getFortuneStyle(hot.fortune)} hover:border-gold/60`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base text-gold">{hot.title}</span>
                    <span className={`text-sm ${getFortuneColor(hot.fortune)}`}>{hot.fortune}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-paper-dark/75">{hot.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 搜索结果 */}
          {result && (
            <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm hover:border-gold/30 hover:shadow-card space-y-2 animate-slide-up">
              <div className="text-center">
                <span className="text-xs text-gold/80 tracking-wider">{resolve('dream.resultTitle')}</span>
              </div>
              <p className="text-lg text-gold text-center font-display">"{result.keyword}"</p>
              <p className="text-sm text-paper-dark/85 text-center leading-7">{result.result}</p>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-center text-xs text-on-dark-muted">{resolve('common.disclaimer')}</p>
        </div>
      </main>

      <BottomNav active="dream" />
    </div>
  );
}
