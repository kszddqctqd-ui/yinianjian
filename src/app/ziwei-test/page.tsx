'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';

function resolve(key: string): string {
  return key; // 简化版，直接用key
}

export default function ZiweiPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    console.log('[TEST] Button clicked!');
    setLoading(true);
    setError('');
    setResult(null);
    
    setTimeout(() => {
      try {
        // Simulate calculation
        const mockResult = `
八字排盘结果（模拟数据）：

【基本信息】
出生：1990年5月15日 未时
生肖：马
星座：金牛座

【四柱八字】
年柱：庚午
月柱：辛巳
日柱：壬寅
时柱：丁未

【十神】
年柱：偏财 / 正财
月柱：正财 / 正财
日柱：日元 / 食神
时柱：正财 / 正官

【五行统计】
金：2
木：1
水：1
火：2
土：1

【大运】
2岁起运，顺行
第一步大运：壬午 (2-12岁)
第二步大运：癸未 (12-22岁)
第三步大运：甲申 (22-32岁)
第四步大运：乙酉 (32-42岁)
第五步大运：丙戌 (42-52岁)
        `;
        setResult(mockResult);
      } catch (e) {
        setError('排盘失败：' + (e instanceof Error ? e.message : String(e)));
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-xuan relative overflow-hidden">
      <GoldenLotusBg />
      <FloatingParticles />

      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto max-w-4xl px-4 pb-24 pt-20">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl text-gold">紫微斗数</h1>
            <p className="text-paper-dark/80">中华第一命理术数</p>
          </div>

          {/* Test button */}
          <div className="rounded-xl border border-gold/20 bg-xuan-card/80 p-6 space-y-4">
            <h2 className="text-xl text-gold">测试按钮</h2>
            <button
              type="button"
              onClick={handleCalculate}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 font-medium rounded-lg bg-vermillion text-white shadow-lg h-12 px-8 text-lg disabled:opacity-50"
            >
              {loading ? '计算中...' : '点击测试'}
            </button>
            
            {loading && <p className="text-center text-gold">正在计算...</p>}
            {error && <p className="text-center text-sm text-red-500">{error}</p>}
            {result && (
              <pre className="whitespace-pre-wrap text-sm text-paper p-4 bg-xuan rounded-lg border border-gold/20">
                {result}
              </pre>
            )}
          </div>
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  );
}
