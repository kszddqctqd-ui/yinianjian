'use client';

import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';

export default function AiNoticePage() {
  return (
    <div className="min-h-screen bg-xuan relative overflow-hidden">
      <GoldenLotusBg />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-4xl px-4 pb-24">
          <div className="pt-8 text-center space-y-3">
            <h1 className="text-3xl text-gold font-display tracking-[0.15em]">AI 生成说明</h1>
            <p className="text-xs text-paper-dark/50">最后更新日期：2026年7月1日</p>
          </div>

          <div className="mt-8 space-y-6 text-sm leading-8 text-paper-dark/85">
            <section className="rounded-lg border border-gold/20 bg-xuan-card/95 p-5">
              <h2 className="text-gold font-display text-lg mb-3">一、AI 分析性质</h2>
              <p>本平台的手相分析、宝宝起名、六爻占卜等功能中涉及的结果生成，是基于传统规则和算法的自动化处理。这些结果属于传统文化范畴的算法化呈现，并非真正意义上的人工智能决策。所有分析结果仅供娱乐和文化学习参考。</p>
            </section>

            <section className="rounded-lg border border-gold/20 bg-xuan-card/95 p-5">
              <h2 className="text-gold font-display text-lg mb-3">二、数据来源</h2>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li><strong>八字排盘：</strong>基于开源库 lunar-javascript 的权威历法计算，确保干支、五行、大运等数据的准确性。</li>
                <li><strong>六爻占卜：</strong>基于《周易》六十四卦的传统卦辞和象数理论。</li>
                <li><strong>宝宝起名：</strong>基于传统五行理论和古典诗词用字库。</li>
                <li><strong>周公解梦：</strong>基于《周公解梦》等传统典籍的释义。</li>
                <li><strong>手相/面相：</strong>基于传统相学理论的规则匹配，非真正的图像识别。</li>
              </ul>
            </section>

            <section className="rounded-lg border border-gold/20 bg-xuan-card/95 p-5">
              <h2 className="text-gold font-display text-lg mb-3">三、结果局限性</h2>
              <p>需要明确告知您：</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>所有命理分析、占卜结果均为传统文化形式的娱乐参考，不具备科学依据。</li>
                <li>手相/面相分析基于预设规则匹配，无法替代专业医师的诊断。</li>
                <li>宝宝起名建议仅供参考，最终名字应由家长自行决定。</li>
                <li>算法生成的结果可能存在偏差或不准确之处。</li>
              </ul>
            </section>

            <section className="rounded-lg border border-gold/20 bg-xuan-card/95 p-5">
              <h2 className="text-gold font-display text-lg mb-3">四、免责声明</h2>
              <p>本平台不提供任何医疗、法律、财务等专业建议。所有功能结果均不应被用作做出重要人生决策的唯一依据。请您结合现实情况、专业意见和个人判断，审慎对待所有生成内容。本平台不对任何因使用或依赖生成内容而产生的后果承担责任。</p>
            </section>
          </div>
        </div>
      </main>

      <BottomNav active="more" />
    </div>
  );
}
