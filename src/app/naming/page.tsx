'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';

// 风格选项
const STYLE_OPTIONS = [
  { key: 'poetic', label: '诗意', desc: '诗词典故，文采斐然' },
  { key: 'strong', label: '刚毅', desc: '坚毅果敢，气势磅礴' },
  { key: 'scholarly', label: '儒雅', desc: '温文尔雅，书卷气息' },
  { key: 'trendy', label: '潮流', desc: '现代时尚，不落俗套' },
  { key: 'classic', label: '典雅', desc: '古朴典雅，传承经典' },
  { key: 'gentle', label: '温润', desc: '温润如玉，谦和内敛' },
];

// 模拟起名结果
function generateNames(surname: string, gender: string, year: number, month: number, day: number, hour: number, nameLen: number, styles: string[]): { name: string; meaning: string; wuxing: string }[] {
  const names: { name: string; meaning: string; wuxing: string }[] = [];
  const seed = year * 10000 + month * 100 + day + hour;
  
  const maleNames = [
    { name: '子轩', meaning: '子为天之骄子，轩为气宇轩昂', wuxing: '水土' },
    { name: '浩然', meaning: '浩然正气，光明磊落', wuxing: '水火' },
    { name: '睿哲', meaning: '睿智明达，哲思深远', wuxing: '火金' },
    { name: '景行', meaning: '高山仰止，景行行止', wuxing: '木木' },
    { name: '博文', meaning: '博学多才，文武双全', wuxing: '水水' },
  ];
  
  const femaleNames = [
    { name: '婉清', meaning: '婉约清雅，如水般纯净', wuxing: '水土' },
    { name: '诗涵', meaning: '诗情画意，涵养深厚', wuxing: '水水' },
    { name: '雅琴', meaning: '雅致如琴，音律和谐', wuxing: '木木' },
    { name: '思颖', meaning: '思维敏捷，才华出众', wuxing: '金木' },
    { name: '雨桐', meaning: '细雨梧桐，清新脱俗', wuxing: '水木' },
  ];
  
  const pool = gender === '男' ? maleNames : femaleNames;
  const count = Math.min(nameLen + 1, pool.length);
  
  for (let i = 0; i < count; i++) {
    const idx = (seed + i * 7) % pool.length;
    names.push({
      name: pool[idx].name,
      meaning: pool[idx].meaning,
      wuxing: pool[idx].wuxing,
    });
  }
  
  return names;
}

export default function NamingPage() {
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState<'男' | '女'>('男');
  const [birthYear, setBirthYear] = useState(2024);
  const [birthMonth, setBirthMonth] = useState(7);
  const [birthDay, setBirthDay] = useState(1);
  const [birthHour, setBirthHour] = useState(7);
  const [nameLen, setNameLen] = useState(3);
  const [styles, setStyles] = useState<string[]>(['poetic']);
  const [generationChar, setGenerationChar] = useState('');
  const [avoidChars, setAvoidChars] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [names, setNames] = useState<{ name: string; meaning: string; wuxing: string }[]>([]);
  const [mode, setMode] = useState<'professional' | 'evaluate'>('professional');
  const [evaluating, setEvaluating] = useState(false);

  const toggleStyle = (key: string) => {
    setStyles(prev => {
      if (prev.includes(key)) {
        return prev.filter(s => s !== key);
      }
      if (prev.length >= 3) return prev;
      return [...prev, key];
    });
  };

  const handleGenerate = () => {
    if (!surname.trim()) {
      alert('请输入姓氏');
      return;
    }
    if (styles.length === 0) {
      alert('请至少选择一种风格');
      return;
    }
    const result = generateNames(surname, gender, birthYear, birthMonth, birthDay, birthHour, nameLen, styles);
    setNames(result);
    setShowResult(true);
  };

  const handleEvaluate = () => {
    if (!surname.trim()) {
      alert('请输入姓氏');
      return;
    }
    setEvaluating(true);
    setTimeout(() => {
      setEvaluating(false);
      setShowResult(true);
      setNames([{ name: '李安', meaning: '安然自得，平安喜乐', wuxing: '木土' }]);
    }, 1500);
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
            <div className="text-4xl mb-2">📖</div>
            <h1 className="text-4xl text-gold font-display">宝宝起名</h1>
            <p className="text-paper-dark/80 text-sm max-w-md mx-auto">
              起名不只看好不好听，更要贴八字、讲字义、讲音韵、讲为什么适合。
              <br />
              先把命盘查看清，再把适合孩子长期使用的名字讲明白。
            </p>
          </div>

          {/* Service Mode Selection */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => { setMode('professional'); setShowResult(false); }}
              className={`flex-1 rounded-xl border p-4 text-center transition-all ${
                mode === 'professional'
                  ? 'border-gold/60 bg-gold/10'
                  : 'border-gold/20 bg-[#1a1510]/80 hover:border-gold/40'
              }`}
            >
              <div className="text-gold font-medium text-sm mb-1">专业起名</div>
              <div className="text-xs text-paper-dark/60">
                先算排八字，再结合字义、音韵与五行补益，讲清每个名字为什么适合。
              </div>
            </button>
            <button
              type="button"
              onClick={() => { setMode('evaluate'); setShowResult(false); }}
              className={`flex-1 rounded-xl border p-4 text-center transition-all ${
                mode === 'evaluate'
                  ? 'border-gold/60 bg-gold/10'
                  : 'border-gold/20 bg-[#1a1510]/80 hover:border-gold/40'
              }`}
            >
              <div className="text-gold font-medium text-sm mb-1">姓名测评</div>
              <div className="text-xs text-paper-dark/60">
                可测正在用的名字，也可对比备选名，看它是否贴八字、顺口、耐用。
              </div>
            </button>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-gold/20 bg-[#1a1510]/80 p-6 backdrop-blur-md space-y-5">
            {/* Surname */}
            <div>
              <label className="block text-xs text-gold/80 mb-1">姓氏</label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="请输入姓氏"
                className="w-full rounded-lg border border-gold/20 bg-[#2e2518] px-4 py-2 text-sm text-gold placeholder:text-paper-dark/30 focus:border-gold/60 focus:outline-none"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs text-gold/80 mb-2">性别</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setGender('男')}
                  className={`flex-1 py-2 rounded-full text-sm border transition-all ${
                    gender === '男'
                      ? 'border-gold/60 bg-gold/10 text-gold'
                      : 'border-gold/20 text-paper-dark/60 hover:border-gold/40'
                  }`}
                >
                  男
                </button>
                <button
                  type="button"
                  onClick={() => setGender('女')}
                  className={`flex-1 py-2 rounded-full text-sm border transition-all ${
                    gender === '女'
                      ? 'border-gold/60 bg-gold/10 text-gold'
                      : 'border-gold/20 text-paper-dark/60 hover:border-gold/40'
                  }`}
                >
                  女
                </button>
              </div>
            </div>

            {/* Birth Info */}
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-paper-dark/60 mb-1">年</label>
                <select
                  value={birthYear}
                  onChange={(e) => setBirthYear(Number(e.target.value))}
                  className="w-full rounded-lg border border-gold/20 bg-[#2e2518] px-2 py-2 text-xs text-gold focus:border-gold/60 focus:outline-none"
                >
                  {Array.from({ length: 30 }, (_, i) => 2025 - i).map(y => (
                    <option key={y} value={y}>{y}年</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-paper-dark/60 mb-1">月</label>
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(Number(e.target.value))}
                  className="w-full rounded-lg border border-gold/20 bg-[#2e2518] px-2 py-2 text-xs text-gold focus:border-gold/60 focus:outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{m}月</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-paper-dark/60 mb-1">日</label>
                <select
                  value={birthDay}
                  onChange={(e) => setBirthDay(Number(e.target.value))}
                  className="w-full rounded-lg border border-gold/20 bg-[#2e2518] px-2 py-2 text-xs text-gold focus:border-gold/60 focus:outline-none"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>{d}日</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-paper-dark/60 mb-1">时辰</label>
                <select
                  value={birthHour}
                  onChange={(e) => setBirthHour(Number(e.target.value))}
                  className="w-full rounded-lg border border-gold/20 bg-[#2e2518] px-2 py-2 text-xs text-gold focus:border-gold/60 focus:outline-none"
                >
                  {[
                    { label: '子时', time: '23:00-01:00', hour: 0 },
                    { label: '丑时', time: '01:00-03:00', hour: 1 },
                    { label: '寅时', time: '03:00-05:00', hour: 2 },
                    { label: '卯时', time: '05:00-07:00', hour: 3 },
                    { label: '辰时', time: '07:00-09:00', hour: 4 },
                    { label: '巳时', time: '09:00-11:00', hour: 5 },
                    { label: '午时', time: '11:00-13:00', hour: 6 },
                    { label: '未时', time: '13:00-15:00', hour: 7 },
                    { label: '申时', time: '15:00-17:00', hour: 8 },
                    { label: '酉时', time: '17:00-19:00', hour: 9 },
                    { label: '戌时', time: '19:00-21:00', hour: 10 },
                    { label: '亥时', time: '21:00-23:00', hour: 11 },
                  ].map(s => (
                    <option key={s.hour} value={s.hour}>{s.label} ({s.time})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Name Length */}
            <div>
              <label className="block text-xs text-gold/80 mb-2">姓名总字数（含姓）</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setNameLen(2)}
                  className={`flex-1 py-2 rounded-full text-xs border transition-all ${
                    nameLen === 2
                      ? 'border-gold/60 bg-gold/10 text-gold'
                      : 'border-gold/20 text-paper-dark/60 hover:border-gold/40'
                  }`}
                >
                  2字（如 李安）
                </button>
                <button
                  type="button"
                  onClick={() => setNameLen(3)}
                  className={`flex-1 py-2 rounded-full text-xs border transition-all ${
                    nameLen === 3
                      ? 'border-gold/60 bg-gold/10 text-gold'
                      : 'border-gold/20 text-paper-dark/60 hover:border-gold/40'
                  }`}
                >
                  3字（如 李思远）
                </button>
              </div>
            </div>

            {/* Style Preference */}
            <div>
              <label className="block text-xs text-gold/80 mb-2">偏好风格（最多3项）</label>
              <div className="grid grid-cols-3 gap-2">
                {STYLE_OPTIONS.map(style => (
                  <button
                    key={style.key}
                    type="button"
                    onClick={() => toggleStyle(style.key)}
                    className={`py-2 rounded-full text-xs border transition-all ${
                      styles.includes(style.key)
                        ? 'border-gold/60 bg-gold/10 text-gold'
                        : 'border-gold/20 text-paper-dark/60 hover:border-gold/40'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generation Character */}
            <div>
              <label className="block text-xs text-gold/80 mb-1">家族辈分字（选填）</label>
              <input
                type="text"
                value={generationChar}
                onChange={(e) => setGenerationChar(e.target.value)}
                placeholder="如：承 / 世 / 文"
                className="w-full rounded-lg border border-gold/20 bg-[#2e2518] px-4 py-2 text-sm text-gold placeholder:text-paper-dark/30 focus:border-gold/60 focus:outline-none"
              />
              <p className="text-xs text-paper-dark/40 mt-1">若家已按辈分字，可交给父亲一起纳入。</p>
            </div>

            {/* Avoid Characters */}
            <div>
              <label className="block text-xs text-gold/80 mb-1">想避开的字（选填）</label>
              <input
                type="text"
                value={avoidChars}
                onChange={(e) => setAvoidChars(e.target.value)}
                placeholder="如：伟、强、敏"
                className="w-full rounded-lg border border-gold/20 bg-[#2e2518] px-4 py-2 text-sm text-gold placeholder:text-paper-dark/30 focus:border-gold/60 focus:outline-none"
              />
              <p className="text-xs text-paper-dark/40 mt-1">可填写多名，家中忌讳或不喜之字。</p>
            </div>

            {/* Naming Principles */}
            <div className="rounded-lg border border-gold/10 bg-gold/5 p-4">
              <p className="text-xs text-paper-dark/70 leading-relaxed">
                先看生辰八字，再看五行喜忌、音韵美感与古典典出，缺一不可。<br />
                不是随意拼字凑名，而是为孩子定一份伴随一生、经得起推敲的姓名。
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={mode === 'professional' ? handleGenerate : handleEvaluate}
              disabled={evaluating}
              className="w-full py-3 rounded-full bg-vermillion text-white text-sm hover:bg-vermillion-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {evaluating ? '测评中...' : mode === 'professional' ? '开始专业起名' : '开始姓名测评'}
            </button>
          </div>

          {/* Consent */}
          <div className="rounded-2xl border border-gold/20 bg-[#1a1510]/80 p-4 backdrop-blur-md">
            <div className="flex items-start gap-2">
              <span className="text-paper-dark/50 mt-0.5">ℹ️</span>
              <div className="text-xs text-paper-dark/50 leading-relaxed">
                <p>点击"开始专业起名"即表示您已阅读并同意《用户协议》《隐私政策》与《AI生成说明》，并同意我们收集和处理您上述提交的生辰信息与起名偏好。</p>
                <p className="mt-1">仅作传统文化参考，请结合实际情况判断；未满18周岁请勿使用本服务。请勿提交他人的照片、生辰或其他信息。</p>
              </div>
            </div>
          </div>

          {/* Result */}
          {showResult && names.length > 0 && (
            <div className="rounded-2xl border border-gold/20 bg-[#1a1510]/80 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-lg text-gold font-medium text-center">起名结果</h3>
              {names.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-gold/10 bg-gold/5 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl text-gold font-display">{surname}{item.name}</span>
                    <span className="text-xs text-paper-dark/50">五行：{item.wuxing}</span>
                  </div>
                  <p className="text-xs text-paper-dark/70">{item.meaning}</p>
                </div>
              ))}
            </div>
          )}

          {/* Legal Links */}
          <div className="flex justify-center gap-4 text-xs text-paper-dark/40">
            <a href="/terms/" className="hover:text-gold/60">《用户协议》</a>
            <a href="/privacy/" className="hover:text-gold/60">《隐私说明》</a>
            <a href="/ai-notice/" className="hover:text-gold/60">《AI 生成说明》</a>
          </div>
        </div>
      </main>

      <BottomNav active="naming" />
    </div>
  );
}
