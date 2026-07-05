'use client';

// 纯 SVG/CSS 图表组件库

// ========== 折线图 ==========
export function LineChart({
  data,
  width = 400,
  height = 200,
  color = '#C43D3D',
  title,
}: {
  data: { label: string; value: number }[];
  width?: number;
  height?: number;
  color?: string;
  title?: string;
}) {
  if (data.length === 0) return null;

  const padding = { top: 30, right: 20, bottom: 40, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map(d => d.value), 1);
  const minVal = Math.min(...data.map(d => d.value), 0);
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => ({
    x: padding.left + (i / Math.max(data.length - 1, 1)) * chartW,
    y: padding.top + chartH - ((d.value - minVal) / range) * chartH,
  }));

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPoints = `${padding.left},${padding.top + chartH} ` + polylinePoints + ` ${points[points.length - 1]?.x},${padding.top + chartH}`;

  const gridLines = 5;
  const yLabels = Array.from({ length: gridLines }, (_, i) =>
    Math.round(minVal + (range * i) / (gridLines - 1))
  );

  return (
    <div className="w-full">
      {title && <h4 className="text-sm text-gold mb-2 font-display">{title}</h4>}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ minHeight: '150px' }}>
        {/* Grid */}
        {yLabels.map((val, i) => {
          const y = padding.top + chartH - (i / (gridLines - 1)) * chartH;
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="rgba(201,169,110,0.1)" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" className="text-[10px]" fill="rgba(212,197,169,0.5)">
                {val}
              </text>
            </g>
          );
        })}
        {/* Area fill */}
        <polygon points={areaPoints} fill={color} fillOpacity="0.1" />
        {/* Line */}
        <polyline points={polylinePoints} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />
        ))}
        {/* X-axis labels */}
        {data.map((d, i) => {
          const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartW;
          return (
            <text key={i} x={x} y={height - 8} textAnchor="middle" className="text-[10px]" fill="rgba(212,197,169,0.5)">
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ========== 环形图 ==========
export function DonutChart({
  data,
  size = 180,
  title,
}: {
  data: { label: string; value: number; color: string }[];
  size?: number;
  title?: string;
}) {
  if (data.length === 0) return null;

  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const center = size / 2;
  const radius = size * 0.38;
  const innerRadius = radius * 0.6;

  let currentAngle = -90;

  const slices = data.map(d => {
    const angle = (d.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    const ix1 = center + innerRadius * Math.cos(startRad);
    const iy1 = center + innerRadius * Math.sin(startRad);
    const ix2 = center + innerRadius * Math.cos(endRad);
    const iy2 = center + innerRadius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const path = [
      `M ${ix1} ${iy1}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}`,
      'Z',
    ].join(' ');

    return { path, color: d.color, label: d.label, percent: Math.round((d.value / total) * 100) };
  });

  return (
    <div className="w-full flex flex-col items-center">
      {title && <h4 className="text-sm text-gold mb-2 font-display">{title}</h4>}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="w-full" style={{ maxWidth: size }}>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="#1A1410" strokeWidth="1" />
        ))}
        <text x={center} y={center - 6} textAnchor="middle" className="text-[14px] font-bold" fill="#f5e6b8" style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'var(--font-family-display)' }}>
          {total}
        </text>
        <text x={center} y={center + 12} textAnchor="middle" className="text-[10px]" fill="rgba(212,197,169,0.5)" style={{ fontSize: '10px' }}>
          总计
        </text>
      </svg>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-1 text-[10px]" style={{ color: 'rgba(212,197,169,0.6)' }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: data[i].color }} />
            <span>{s.label}: {s.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== 柱状图 ==========
export function BarChart({
  data,
  height = 160,
  color = '#C9A96E',
  title,
}: {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  title?: string;
}) {
  if (data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => d.value), 1);
  const barWidth = Math.max(12, Math.min(40, 300 / data.length - 4));

  return (
    <div className="w-full">
      {title && <h4 className="text-sm text-gold mb-2 font-display">{title}</h4>}
      <div className="flex items-end justify-center gap-1" style={{ height }}>
        {data.map((d, i) => {
          const barH = (d.value / maxVal) * (height - 30);
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-gold/70">{d.value > 0 ? d.value : ''}</span>
              <div
                className="rounded-t-sm transition-all duration-300"
                style={{
                  width: barWidth,
                  height: Math.max(barH, 2),
                  background: `linear-gradient(to top, ${color}88, ${color})`,
                }}
              />
              <span className="text-[9px] text-on-dark-muted text-center truncate" style={{ maxWidth: barWidth + 4 }}>
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ========== 进度条 ==========
export function ProgressBar({
  value,
  max,
  color = '#C9A96E',
  label,
}: {
  value: number;
  max: number;
  color?: string;
  label?: string;
}) {
  const pct = Math.min((value / Math.max(max, 1)) * 100, 100);
  const colorClass = pct > 80 ? '#C43D3D' : pct > 60 ? '#D4A017' : color;
  return (
    <div className="space-y-1">
      {label && (
        <div className="flex justify-between text-xs">
          <span style={{ color: 'rgba(212,197,169,0.6)' }}>{label}</span>
          <span style={{ color: 'rgba(212,197,169,0.4)' }}>{pct.toFixed(0)}%</span>
        </div>
      )}
      <div className="w-full rounded-full h-3 bg-xuan-surface overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: colorClass }}
        />
      </div>
    </div>
  );
}
