'use client';

import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';

export default function TermsPage() {
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
            <h1 className="text-3xl text-gold font-display tracking-[0.15em]">用户协议</h1>
            <p className="text-xs text-paper-dark/50">最后更新日期：2026年7月1日</p>
          </div>

          <div className="mt-8 space-y-6 text-sm leading-8 text-paper-dark/85">
            <section className="rounded-lg border border-gold/20 bg-xuan-card/95 p-5">
              <h2 className="text-gold font-display text-lg mb-3">一、服务条款确认</h2>
              <p>欢迎使用"一念间"服务。本协议是您（以下简称"用户"）与一念间运营方（以下简称"我们"）之间关于使用本平台各项服务所订立的法律协议。当您注册、登录或使用我们的服务时，即表示您已阅读并同意接受本协议的全部内容。</p>
            </section>

            <section className="rounded-lg border border-gold/20 bg-xuan-card/95 p-5">
              <h2 className="text-gold font-display text-lg mb-3">二、服务内容</h2>
              <p>本平台提供中国传统民俗文化相关服务，包括但不限于：八字排盘、黄历查询、灵签求解、周公解梦、手相面相分析、宝宝起名、六爻占卜、静心禅坐等功能。所有服务仅供传统文化学习和娱乐参考。</p>
            </section>

            <section className="rounded-lg border border-gold/20 bg-xuan-card/95 p-5">
              <h2 className="text-gold font-display text-lg mb-3">三、用户行为规范</h2>
              <ul className="list-disc ml-5 space-y-1">
                <li>用户应确保提交的信息真实、准确，不得提交虚假或误导性信息。</li>
                <li>用户不得利用本平台从事任何违法违规活动。</li>
                <li>用户不得恶意爬取、复制平台内容用于商业用途。</li>
                <li>用户不得上传包含他人隐私的照片或信息。</li>
                <li>未满18周岁的用户应在监护人指导下使用本服务。</li>
              </ul>
            </section>

            <section className="rounded-lg border border-gold/20 bg-xuan-card/95 p-5">
              <h2 className="text-gold font-display text-lg mb-3">四、免责声明</h2>
              <p>本平台提供的所有命理分析、占卜预测等服务结果，均基于传统算法和规则生成，仅供参考学习之用。平台不对任何预测结果的准确性、完整性作出保证。用户应结合自身实际情况做出判断，本平台不承担因依赖服务结果而产生的任何直接或间接损失。</p>
            </section>

            <section className="rounded-lg border border-gold/20 bg-xuan-card/95 p-5">
              <h2 className="text-gold font-display text-lg mb-3">五、知识产权</h2>
              <p>本平台所有内容（包括但不限于文字、图片、图表、界面设计、代码等）的知识产权归一念间运营方所有。未经书面许可，用户不得以任何形式复制、传播、修改或用于商业用途。</p>
            </section>

            <section className="rounded-lg border border-gold/20 bg-xuan-card/95 p-5">
              <h2 className="text-gold font-display text-lg mb-3">六、隐私保护</h2>
              <p>我们重视用户的隐私保护。关于个人信息的收集、使用和保护，请参阅《隐私说明》。您的生辰八字等个人信息仅存储在本地设备中，不会被上传至我们的服务器。</p>
            </section>

            <section className="rounded-lg border border-gold/20 bg-xuan-card/95 p-5">
              <h2 className="text-gold font-display text-lg mb-3">七、争议解决</h2>
              <p>本协议的解释、效力及纠纷的解决，适用中华人民共和国法律。若您与我们发生任何争议，应首先通过友好协商解决；协商不成的，任何一方均有权向运营方所在地有管辖权的人民法院提起诉讼。</p>
            </section>

            <section className="rounded-lg border border-gold/20 bg-xuan-card/95 p-5">
              <h2 className="text-gold font-display text-lg mb-3">八、协议更新</h2>
              <p>我们有权根据需要不时修订本协议。修订后的协议将在平台上公布，公布后立即生效。如您继续使用本平台服务，即视为接受修订后的协议。</p>
            </section>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
