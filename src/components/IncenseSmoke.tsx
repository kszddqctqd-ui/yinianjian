'use client';

/**
 * IncenseSmoke — 线上香烟雾动画组件
 * 完全对齐菩提苑 incense-smoke 动画效果
 */

export function IncenseSmoke() {
  return (
    <div className="relative flex flex-col items-center">
      {/* 香炉 */}
      <div className="relative flex items-end justify-center">
        {/* 烟雾 */}
        <div className="absolute -top-20 left-1/2 flex flex-col items-center" style={{ transform: 'translateX(-50%)' }}>
          <div
            className="absolute w-3 h-3 rounded-full bg-paper-dark/30"
            style={{ animation: 'incense-smoke 3s ease-out infinite' }}
          />
          <div
            className="absolute w-2.5 h-2.5 rounded-full bg-paper-dark/25"
            style={{ animation: 'incense-smoke 3s ease-out infinite 1s' }}
          />
          <div
            className="absolute w-2 h-2 rounded-full bg-paper-dark/20"
            style={{ animation: 'incense-smoke 3s ease-out infinite 2s' }}
          />
        </div>
        {/* 香 */}
        <div className="w-1 h-24 rounded-t-sm bg-gradient-to-b from-amber-700 to-amber-900" />
        {/* 香炉 */}
        <div className="w-16 h-10 rounded-b-lg bg-gradient-to-b from-gold/40 to-gold/20 border border-gold/30 mt-[-2px]" />
      </div>
    </div>
  );
}
