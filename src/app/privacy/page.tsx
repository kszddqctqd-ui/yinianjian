'use client';

import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';

export default function PrivacyPage() {
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
            <h1 className="text-3xl text-gold font-display tracking-[0.15em]">隐私说明</h1>
            <p className="text-xs text-paper-dark/50">最后更新日期：2026年7月1日</p>
          </div>

          <div className="mt-8 space-y-6 text-sm leading-8 text-paper-dark/85">
            <section className="rounded-lg border border-gold/20 bg-xuan-card/95 p-5">
              <h2 className="text-gold font-display text-lg mb-3">一、信息收集</h2>
              <p>我们仅收集您主动提交的信息，包括：</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li><strong>生辰信息：</strong>您输入的出生年、月、日、时辰，仅存储在您的本地设备中（localStorage），不会上传至任何服务器。</li>
                <li><strong>照片信息：</strong>在手相/面相功能中上传的照片，仅在本地进行处理和分析，不会上传或分享给第三方。</li>
                <li><strong>姓名信息：</strong>祈福和起名功能中填写的姓名，仅存储在本地设备中。</li>
              </ul>
            </section>

            <section className="rounded-lg border border-gold/20 bg-xuan-card/95 p-5">
              <h2 className="text-gold font-display text-lg mb-3">二、信息使用</h2>
              <p>您提交的信息仅用于以下目的：</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>为您提供八字排盘、命理分析等传统民俗文化服务。</li>
                <li>保存您的历史记录，方便您随时回顾。</li>
                <li>改善和优化平台体验。</li>
              </ul>
            </section>

            <section className="rounded-lg border border-gold/20 bg-xuan-card/95 p-5">
              <h2 className="text-gold font-display text-lg mb-3">三、信息存储</h2>
              <p>所有个人信息均存储在您的本地设备中（localStorage）。我们不会将您的个人信息传输至我们的服务器或任何第三方服务器。当您清除浏览器缓存或卸载应用时，这些信息将被删除。</p>
            </section>

            <section className="rounded-lg border border-gold/20 bg-xuan-card/95 p-5">
              <h2 className="text-gold font-display text-lg mb-3">四、信息共享</h2>
              <p>我们承诺：绝不会将您的个人信息出售、出租、共享或披露给任何第三方。除非法律法规要求或您明确授权，否则您的信息仅对您本人可见。</p>
            </section>

            <section className="rounded-lg border border-gold/20 bg-xuan-card/95 p-5">
              <h2 className="text-gold font-display text-lg mb-3">五、您的权利</h2>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li><strong>访问权：</strong>您可以在"我的记录"中查看所有历史查询。</li>
                <li><strong>删除权：</strong>您可以随时删除单条记录或清空所有记录。</li>
                <li><strong>撤回同意：</strong>您可以清除浏览器数据来撤回对个人信息存储的同意。</li>
              </ul>
            </section>

            <section className="rounded-lg border border-gold/20 bg-xuan-card/95 p-5">
              <h2 className="text-gold font-display text-lg mb-3">六、儿童隐私</h2>
              <p>本平台不适合未满18周岁的未成年人独立使用。如果监护人在征得同意后为未成年人提供信息，请确保信息真实准确，并指导未成年人正确使用本服务。</p>
            </section>

            <section className="rounded-lg border border-gold/20 bg-xuan-card/95 p-5">
              <h2 className="text-gold font-display text-lg mb-3">七、联系我们</h2>
              <p>如果您对本隐私说明有任何疑问，请通过平台内的反馈渠道联系我们。我们将在合理期限内回复您的请求。</p>
            </section>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
