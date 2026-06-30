'use client';

import { Share2 } from 'lucide-react';

export function ShareButton() {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '一念间 · 八字精批',
        text: '来看看我的八字排盘',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('链接已复制到剪贴板');
      });
    }
  };

  return (
    <button
      aria-label="分享八字排盘结果"
      onClick={handleShare}
      className="flex items-center justify-center gap-2 mx-auto px-6 py-2 rounded-full border border-gold/20 bg-xuan-card/80 text-gold/60 hover:text-gold hover:border-gold/30 transition-all duration-base"
    >
      <Share2 size={16} />
      <span className="text-sm">分享</span>
    </button>
  );
}
