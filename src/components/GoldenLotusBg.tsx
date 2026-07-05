'use client';

/**
 * GoldenLotusBg — 金色荷花艺术背景
 * 用 SVG 绘制非重复分布的荷花、荷叶、花苞，作为深色背景装饰
 */

// 单个荷花 SVG 组件（不同尺寸和朝向）
function LotusFlower({
  x, y, size, rotation, opacity, petalCount = 8,
}: {
  x: string; y: string; size: string; rotation: string; opacity: string; petalCount?: number;
}) {
  const petals = Array.from({ length: petalCount }, (_, i) => {
    const angle = (360 / petalCount) * i;
    return (
      <ellipse
        key={i}
        cx="0"
        cy="-1"
        rx="1.2"
        ry="4"
        fill={`rgba(201, 160, 92, ${parseFloat(opacity) * 0.6})`}
        stroke="rgba(224, 185, 122, 0.15)"
        strokeWidth="0.05"
        transform={`rotate(${angle})`}
      />
    );
  });

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${size})`}>
      {petals}
      <circle cx="0" cy="0" r="1" fill="rgba(224, 185, 122, 0.5)" />
    </g>
  );
}

// 荷叶 SVG
function LotusLeaf({
  x, y, size, rotation, opacity,
}: {
  x: string; y: string; size: string; rotation: string; opacity: string;
}) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${size})`}>
      <path
        d="M 0 -5 C 6 -5, 8 2, 5 5 C 2 7, -2 7, -5 5 C -8 2, -6 -5, 0 -5 Z"
        fill={`rgba(80, 100, 60, ${opacity})`}
        stroke={`rgba(120, 150, 90, ${parseFloat(opacity) * 0.5})`}
        strokeWidth="0.1"
      />
      {/* 叶脉 */}
      <path
        d="M 0 -4 L 0 4 M 0 0 L 4 -2 M 0 0 L -4 -2 M 0 0 L 3 2 M 0 0 L -3 2"
        stroke={`rgba(120, 150, 90, ${parseFloat(opacity) * 0.3})`}
        strokeWidth="0.08"
        fill="none"
      />
    </g>
  );
}

// 花苞
function LotusBud({
  x, y, size, rotation, opacity,
}: {
  x: string; y: string; size: string; rotation: string; opacity: string;
}) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${size})`}>
      <ellipse cx="0" cy="0" rx="1.2" ry="3" fill={`rgba(201, 160, 92, ${parseFloat(opacity) * 0.5})`} />
      <ellipse cx="-0.6" cy="0.3" rx="0.8" ry="2.5" fill={`rgba(180, 140, 70, ${parseFloat(opacity) * 0.4})`} transform="rotate(-15, -0.6, 0.3)" />
      <ellipse cx="0.6" cy="0.3" rx="0.8" ry="2.5" fill={`rgba(180, 140, 70, ${parseFloat(opacity) * 0.4})`} transform="rotate(15, 0.6, 0.3)" />
    </g>
  );
}

export function GoldenLotusBg() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* 层2: 寺庙山脉 SVG 纹理叠加 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/temple/temple-mountain.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.20,
        }}
      />

      {/* 层3: 径向暗角 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(10,6,4,0.55) 0%, rgba(10,6,4,0.35) 30%, transparent 60%, rgba(10,6,4,0.6) 100%)',
        }}
      />

      {/* 荷花元素（保留原有艺术效果） */}
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="lotusGlow1" cx="30%" cy="20%">
            <stop offset="0%" stopColor="rgba(201, 160, 92, 0.06)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="lotusGlow2" cx="70%" cy="80%">
            <stop offset="0%" stopColor="rgba(201, 160, 92, 0.04)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="lotusGlow3" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(224, 185, 122, 0.03)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* 光晕层 */}
        <rect width="100%" height="100%" fill="url(#lotusGlow1)" />
        <rect width="100%" height="100%" fill="url(#lotusGlow2)" />
        <rect width="100%" height="100%" fill="url(#lotusGlow3)" />

        {/* 左上角 — 盛开的荷花 */}
        <LotusFlower x="8%" y="12%" size="1.8" rotation="15" opacity="0.35" petalCount={10} />

        {/* 右上角 — 花苞 */}
        <LotusBud x="82%" y="8%" size="1.5" rotation="-10" opacity="0.3" />

        {/* 中间偏左 — 荷叶 */}
        <LotusLeaf x="15%" y="45%" size="2.2" rotation="25" opacity="0.2" />

        {/* 中间偏右 — 盛开的荷花 */}
        <LotusFlower x="75%" y="35%" size="1.5" rotation="-20" opacity="0.3" />

        {/* 左下角 — 花苞 + 荷叶组合 */}
        <LotusBud x="20%" y="78%" size="1.2" rotation="5" opacity="0.25" />
        <LotusLeaf x="10%" y="85%" size="1.8" rotation="-15" opacity="0.15" />

        {/* 右下角 — 盛开的荷花 */}
        <LotusFlower x="85%" y="75%" size="2.0" rotation="10" opacity="0.3" petalCount={12} />

        {/* 底部中间 — 荷叶 */}
        <LotusLeaf x="50%" y="90%" size="1.6" rotation="40" opacity="0.12" />

        {/* 分散的小花苞 */}
        <LotusBud x="45%" y="15%" size="0.8" rotation="-5" opacity="0.2" />
        <LotusBud x="60%" y="55%" size="0.9" rotation="20" opacity="0.18" />
        <LotusBud x="30%" y="60%" size="0.7" rotation="-15" opacity="0.22" />
        <LotusBud x="90%" y="50%" size="0.85" rotation="10" opacity="0.15" />

        {/* 小型点缀花朵 */}
        <LotusFlower x="35%" y="25%" size="0.6" rotation="30" opacity="0.2" petalCount={6} />
        <LotusFlower x="68%" y="65%" size="0.55" rotation="-25" opacity="0.18" petalCount={6} />
        <LotusFlower x="55%" y="80%" size="0.5" rotation="5" opacity="0.15" petalCount={8} />

        {/* 极小的金色光点装饰 */}
        {[
          [25, 30], [40, 50], [70, 20], [55, 40], [15, 65],
          [80, 55], [35, 70], [65, 85], [48, 10], [92, 35],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={`${cx}%`}
            cy={`${cy}%`}
            r={0.3 + Math.random() * 0.3}
            fill={`rgba(224, 185, 122, ${0.08 + Math.random() * 0.08})`}
          />
        ))}
      </svg>
    </div>
  );
}
