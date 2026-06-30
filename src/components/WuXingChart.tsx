'use client';

const WUXING_COLORS: Record<string, string> = {
  '金': '#e8c56d',
  '木': '#6db86d',
  '水': '#5b9bd5',
  '火': '#e06c4c',
  '土': '#c9a05c',
};

export function WuXingChart({ wuXingCount }: { wuXingCount: Record<string, number> }) {
  const total = Object.values(wuXingCount).reduce((a, b) => a + b, 0);
  const wuxingOrder = ['金', '木', '水', '火', '土'];

  return (
    <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
      <div className="text-center mb-3">
        <span className="text-xs text-gold/80 tracking-wider">五行统计</span>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {wuxingOrder.map((wx) => {
          const count = wuXingCount[wx] || 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={wx} className="text-center space-y-2">
              <div className="text-xl" style={{ color: WUXING_COLORS[wx] }}>{wx}</div>
              <div className="relative h-24 rounded-md bg-xuan/50 overflow-hidden border border-gold/10">
                <div
                  className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out rounded-b-md"
                  style={{
                    height: `${Math.max(pct, 5)}%`,
                    backgroundColor: WUXING_COLORS[wx],
                    opacity: 0.7,
                  }}
                />
              </div>
              <div className="text-sm text-gold">{count}</div>
              <div className="text-[10px] text-paper-dark/40">{pct}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
