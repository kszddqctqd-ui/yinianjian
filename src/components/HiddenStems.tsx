import { getShiShen } from '@/lib/bazi';

export function HiddenStems({ gan, zhi, riGan, hideGan }: {
  gan: string; zhi: string; riGan: string; hideGan: string[];
}) {
  if (hideGan.length === 0) return null;

  return (
    <div className="flex justify-center gap-2 text-[10px]">
      {hideGan.map((cg) => (
        <span key={cg} className="text-paper-dark/45">
          {cg} <span className="text-paper-dark/25">({getShiShen(cg, riGan)})</span>
        </span>
      ))}
    </div>
  );
}
