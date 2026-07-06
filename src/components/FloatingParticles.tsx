'use client';

/**
 * FloatingParticles — 金色光点漂浮动画
 * 完全对齐菩提苑: 6个光点, 不同位置/延迟
 */

export function FloatingParticles() {
  const particles = [
    { left: '12%', top: '20%', delay: '0s' },
    { left: '32%', top: '65%', delay: '1.2s' },
    { left: '55%', top: '38%', delay: '2.4s' },
    { left: '72%', top: '72%', delay: '0.8s' },
    { left: '85%', top: '28%', delay: '3.1s' },
    { left: '20%', top: '82%', delay: '2s' },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute size-1.5 rounded-full bg-gold/40 animate-glow-rise"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: '5s',
            animationIterationCount: 'infinite',
            animationFillMode: 'both',
          }}
        />
      ))}
    </div>
  );
}
