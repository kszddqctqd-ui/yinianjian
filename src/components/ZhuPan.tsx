'use client';

import { HiddenStems } from './HiddenStems';
import { type BaZiResult } from '@/lib/bazi';

const ZHI_SHICHEN: Record<string, string> = {
  '子': '23:00-01:00', '丑': '01:00-03:00', '寅': '03:00-05:00', '卯': '05:00-07:00',
  '辰': '07:00-09:00', '巳': '09:00-11:00', '午': '11:00-13:00', '未': '13:00-15:00',
  '申': '15:00-17:00', '酉': '17:00-19:00', '戌': '19:00-21:00', '亥': '21:00-23:00',
};

export function ZhuPan({ result, gender }: { result: BaZiResult; gender: string }) {
  const pillars = [
    { label: '年柱', ...result.year, isXunShou: true },
    { label: '月柱', ...result.month },
    { label: '日柱', ...result.day, riZhu: true },
    { label: '时柱', ...result.hour },
  ];

  return (
    <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm transition-all duration-base hover:border-gold/30 hover:shadow-card">
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <span className="font-display text-[18px] text-gold drop-shadow-[0_0_10px_rgba(201,162,39,0.35)] md:text-[24px]">
            八字排盘
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {pillars.map((pillar) => (
            <PillarCard key={pillar.label} pillar={pillar} gender={gender} riGan={result.riZhu[0]} />
          ))}
        </div>

        <div className="text-center text-xs text-on-dark-dim pt-1">
          旬空地支索引 {result.xunKong.length ? result.xunKong.join(', ') : '无'}
        </div>
      </div>
    </div>
  );
}

function PillarCard({ pillar, gender, riGan }: {
  pillar: { label: string; gan: string; zhi: string; naYin: string; shiShen?: string; riZhu?: boolean; hideGan: string[] };
  gender: string;
  riGan: string;
}) {
  return (
    <div className={`rounded-xl border border-gold/30 bg-xuan-surface overflow-hidden ${pillar.riZhu ? 'ring-1 ring-gold/50' : ''}`}>
      <div className="bg-gold/10 text-center py-1.5">
        <span className="text-xs text-gold/80 tracking-wider">{pillar.label}</span>
      </div>

      <div className="flex items-center justify-center gap-1 py-3">
        <div className="text-center">
          <span className="font-number text-2xl text-gold">{pillar.gan}</span>
          {pillar.shiShen && (
            <span className="text-[10px] text-on-dark-dim block mt-0.5">{pillar.shiShen}</span>
          )}
        </div>
        <span className="mx-1 text-gold">│</span>
        <div className="text-center">
          <span className="font-number text-2xl text-gold">{pillar.zhi}</span>
          <span className="text-[10px] text-on-dark-dim block mt-0.5">{ZHI_SHICHEN[pillar.zhi] ?? '--'}</span>
        </div>
      </div>

      {pillar.hideGan.length > 0 && (
        <div className="border-t border-gold/10 py-2 px-3">
          <HiddenStems gan={pillar.gan} zhi={pillar.zhi} riGan={riGan} hideGan={pillar.hideGan} />
        </div>
      )}

      <div className="text-center text-xs text-paper-dark/50 pb-2">
        {pillar.naYin}
      </div>
    </div>
  );
}
