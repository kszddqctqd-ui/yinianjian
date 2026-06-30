'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';

export default function NamingPage() {
  const [formData, setFormData] = useState({
    surname: '',
    gender: '男' as '男' | '女',
    birthYear: 1990,
    birthMonth: 5,
    birthDay: 15,
    style: '诗词典故',
    generation: '',
  });

  const styles = ['诗词典故', '五行互补', '音韵优美', '寓意吉祥', '国学经典', '现代简约'];

  const handleSubmit = () => {
    if (!formData.surname.trim()) {
      alert('请输入姓氏');
      return;
    }
    alert(`正在为"${formData.surname}宝宝"生成名字...\n风格：${formData.style}\n（AI 名字生成功能开发中）`);
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
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-4xl text-gold">宝宝起名</h1>
            <p className="text-base text-paper-dark/85">
              结合八字喜忌、音韵笔画、典故诗词，给孩子一个耐看的名字。
            </p>
          </section>

          <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm space-y-4">
            {/* Surname */}
            <div>
              <label className="text-sm text-paper-dark/75">姓氏</label>
              <input
                type="text"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                placeholder="请输入姓氏"
                className="w-full mt-1 h-12 rounded-lg border border-gold/30 bg-xuan-surface px-4 text-sm text-paper-dark focus:border-gold focus:outline-none"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm text-paper-dark/75">性别</label>
              <div className="flex gap-3 mt-1">
                <button type="button" onClick={() => setFormData({ ...formData, gender: '男' })} className={`flex-1 h-12 rounded-lg border text-sm transition-all ${formData.gender === '男' ? 'border-gold/60 bg-gold/10 text-gold' : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'}`}>
                  男
                </button>
                <button type="button" onClick={() => setFormData({ ...formData, gender: '女' })} className={`flex-1 h-12 rounded-lg border text-sm transition-all ${formData.gender === '女' ? 'border-gold/60 bg-gold/10 text-gold' : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'}`}>
                  女
                </button>
              </div>
            </div>

            {/* Birth info */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-paper-dark/50">年</label>
                <input type="number" value={formData.birthYear} onChange={(e) => setFormData({ ...formData, birthYear: parseInt(e.target.value) || 1990 })} className="w-full mt-1 h-12 rounded-lg border border-gold/30 bg-xuan-surface px-3 text-sm text-paper-dark focus:border-gold focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-paper-dark/50">月</label>
                <input type="number" value={formData.birthMonth} onChange={(e) => setFormData({ ...formData, birthMonth: parseInt(e.target.value) || 5 })} className="w-full mt-1 h-12 rounded-lg border border-gold/30 bg-xuan-surface px-3 text-sm text-paper-dark focus:border-gold focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-paper-dark/50">日</label>
                <input type="number" value={formData.birthDay} onChange={(e) => setFormData({ ...formData, birthDay: parseInt(e.target.value) || 15 })} className="w-full mt-1 h-12 rounded-lg border border-gold/30 bg-xuan-surface px-3 text-sm text-paper-dark focus:border-gold focus:outline-none" />
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="text-sm text-paper-dark/75">起名风格</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {styles.map(s => (
                  <button key={s} type="button" onClick={() => setFormData({ ...formData, style: s })} className={`rounded-lg border p-2 text-xs transition-all ${formData.style === s ? 'border-gold/60 bg-gold/10 text-gold' : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Generation name */}
            <div>
              <label className="text-sm text-paper-dark/75">辈分字（选填）</label>
              <input
                type="text"
                value={formData.generation}
                onChange={(e) => setFormData({ ...formData, generation: e.target.value })}
                placeholder="如有家谱辈分字请填写"
                className="w-full mt-1 h-12 rounded-lg border border-gold/30 bg-xuan-surface px-4 text-sm text-paper-dark focus:border-gold focus:outline-none"
              />
            </div>

            {/* Submit */}
            <button type="button" onClick={handleSubmit} className="w-full rounded-lg bg-vermillion py-3 text-lg text-white tracking-wider font-medium shadow-lg shadow-vermillion/20 hover:bg-vermillion-light transition-all active:scale-[0.98]">
              AI 起名
            </button>
          </div>

          <p className="text-center text-xs text-paper-dark/60">仅作传统文化参考，请结合现实情况判断</p>
        </div>
      </main>

      <BottomNav active="naming" />
    </div>
  );
}
