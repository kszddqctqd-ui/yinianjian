'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';

export default function QifuPage() {
  const [familyMembers, setFamilyMembers] = useState([{ name: '', relation: '自己' }]);
  const [amount, setAmount] = useState(0);
  const [wish, setWish] = useState('');

  const relations = ['自己', '父亲', '母亲', '丈夫', '妻子', '儿子', '女儿', '兄弟', '姐妹', '朋友', '同事', '恩师', '长辈', '祖先', '冤亲债主', '孤魂野鬼', '堕胎婴灵', '其他'];

  const addMember = () => setFamilyMembers([...familyMembers, { name: '', relation: '自己' }]);
  const removeMember = (i: number) => setFamilyMembers(familyMembers.filter((_, idx) => idx !== i));
  const updateMember = (i: number, field: string, value: string) => {
    const copy = [...familyMembers];
    copy[i] = { ...copy[i], [field]: value };
    setFamilyMembers(copy);
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
                <path d="M12 2C8 2 4 6 4 10c0 6 8 12 8 12s8-6 8-12c0-4-4-8-8-8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h1 className="text-4xl text-gold">为家人祈福</h1>
            <p className="text-base text-paper-dark/85">
              心愿供灯 · 传统签谱 · 看八字
            </p>
          </section>

          {/* 心愿供灯 */}
          <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-xs text-gold/80 tracking-wider">心愿供灯</span>
              </div>
              <p className="text-sm text-paper-dark/80 text-center">
                点一盏灯，写下一份祝愿。适合生日纪念、平安祝福、学业心愿与日常仪式感表达。
              </p>

              {/* Family members */}
              <div className="space-y-2">
                <label className="text-sm text-paper-dark/75">为谁祈福</label>
                {familyMembers.map((member, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <select
                      value={member.relation}
                      onChange={(e) => updateMember(i, 'relation', e.target.value)}
                      className="flex-1 h-10 rounded-lg border border-gold/30 bg-xuan-surface px-3 text-sm text-paper-dark focus:border-gold focus:outline-none"
                    >
                      {relations.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <input
                      type="text"
                      placeholder="姓名（选填）"
                      value={member.name}
                      onChange={(e) => updateMember(i, 'name', e.target.value)}
                      className="flex-1 h-10 rounded-lg border border-gold/30 bg-xuan-surface px-3 text-sm text-paper-dark focus:border-gold focus:outline-none"
                    />
                    {familyMembers.length > 1 && (
                      <button type="button" onClick={() => removeMember(i)} className="text-paper-dark/50 hover:text-gold px-2">×</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addMember} className="text-sm text-gold/70 hover:text-gold transition-colors">+ 添加</button>
              </div>

              {/* Wish */}
              <div>
                <label className="text-sm text-paper-dark/75">心愿描述（选填）</label>
                <textarea
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  rows={3}
                  className="w-full mt-1 rounded-lg border border-gold/30 bg-xuan-surface px-3 py-2 text-sm text-paper-dark focus:border-gold focus:outline-none resize-none"
                  placeholder="写下你的心愿..."
                />
              </div>

              {/* Light count */}
              <div className="flex items-center justify-between rounded-lg bg-xuan-surface/50 p-3">
                <div className="text-center">
                  <div className="text-xs text-paper-dark/60">已点亮</div>
                  <div className="text-2xl text-gold font-number">{amount}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-paper-dark/60">功德</div>
                  <div className="text-2xl text-gold font-number">¥{amount * 6.6}</div>
                </div>
              </div>

              {/* Donate buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[66, 166, 366].map(val => (
                  <button key={val} type="button" onClick={() => setAmount(val)} className={`rounded-lg border p-3 text-center transition-all ${amount === val ? 'border-gold/60 bg-gold/10 text-gold' : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'}`}>
                    <div className="text-lg font-display">{val}</div>
                    <div className="text-[10px] text-paper-dark/50">元</div>
                  </button>
                ))}
              </div>

              {/* Submit */}
              <button type="button" className="w-full rounded-lg bg-vermillion py-3 text-lg text-white tracking-wider font-medium shadow-lg shadow-vermillion/20 hover:bg-vermillion-light transition-all active:scale-[0.98]">
                供灯祈福
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNav active="qifu" />
    </div>
  );
}
