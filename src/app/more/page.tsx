'use client';

import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';

const FEATURES = [
  { icon: '☯', title: '八字精批', desc: '真排盘，看格局、大运、流年', href: '/' },
  { icon: '🪷', title: '为家人祈福', desc: '心愿供灯，传统签谱', href: '/qifu/' },
  { icon: '📅', title: '今日黄历', desc: '干支宜忌，神煞冲煞', href: '/almanac/' },
  { icon: '🏮', title: '求灵签', desc: '心诚则灵，一签一事', href: '/lottery/' },
  { icon: '📖', title: '周公解梦', desc: '百梦皆有意，古今相参证', href: '/dream/' },
  { icon: '🤚', title: '手相 / 面相', desc: 'AI 分析，预览解锁详批', href: '/palmistry/' },
  { icon: '✍', title: '宝宝起名', desc: '结合八字喜忌，典故诗词', href: '/naming/' },
  { icon: '🪙', title: '六爻占卜', desc: '三铜起卦，本互变卦象', href: '/divination/' },
  { icon: '🧘', title: '静心禅坐', desc: '钟磬古乐，松涛溪水', href: '/meditation/' },
  { icon: '📜', title: '用户协议', desc: '服务条款与免责声明', href: '/terms/' },
  { icon: '🔒', title: '隐私说明', desc: '个人信息保护政策', href: '/privacy/' },
  { icon: '🤖', title: 'AI 生成说明', desc: '算法分析与结果局限性', href: '/ai-notice/' },
  { icon: '📋', title: '查看记录', desc: '历史查询记录汇总', href: '/records/' },
  { icon: '👤', title: '个人中心', desc: '统计、设置、关于', href: '/profile/' },
];

export default function MorePage() {
  return (
    <div className="min-h-screen bg-deep relative overflow-hidden">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-xuan via-xuan-card to-xuan" />
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.20]" style={{ backgroundImage: "url('/temple/temple-mountain.svg')" }} />
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(10,6,4,0.55) 0%, rgba(10,6,4,0.35) 30%, transparent 60%, rgba(10,6,4,0.6) 100%)' }} />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-4xl px-4 pb-24">
          <div className="pt-8 text-center space-y-3">
            <h1 className="text-3xl text-gold font-display tracking-[0.15em]">更多服务</h1>
            <p className="text-xs text-paper-dark/50">一念之间，万事皆通</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <a
                key={i}
                href={f.href}
                className="group rounded-lg border border-gold/20 bg-xuan-card/95 p-4 transition-all duration-300 hover:border-gold/40 hover:bg-xuan-card/97"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/5 text-xl transition-colors group-hover:border-gold/40 group-hover:bg-gold/10">
                    {f.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-gold group-hover:text-gold-light transition-colors truncate">{f.title}</div>
                    <div className="text-[10px] text-paper-dark/50 truncate">{f.desc}</div>
                  </div>
                </div>
                <svg className="w-4 h-4 text-paper-dark/20 ml-auto group-hover:text-gold/40 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </a>
            ))}
          </div>
        </div>
      </main>

      <BottomNav active="more" />
    </div>
  );
}
