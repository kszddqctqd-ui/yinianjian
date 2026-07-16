'use client';

import { useState, useRef, useCallback } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';

// 三位大师
const MASTERS = [
  {
    icon: '🧘',
    name: '慧明长老',
    title: '古寺住持',
    desc: '庄重持重，引经据典',
    detail: '通读《渊海子平》《滴天髓》，言语稳重克制。适合希望深度解读、看古籍出处的施主。',
  },
  {
    icon: '🙏',
    name: '明心师父',
    title: '尼众法师',
    desc: '慈悲温柔，劝人向善',
    detail: '语调温和，慈悲为怀。适合家庭、感情、亲人祈福场景。',
  },
  {
    icon: '☯️',
    name: '玄真道长',
    title: '山中道人',
    desc: '直爽通透，说大白话',
    detail: '山中道人，不爱绕弯子。把命理讲成大白话，适合急性子。',
  },
];

// 手相主线参考
const HAND_LINES = [
  { name: '生命线', desc: '环绕金星丘的大弧线，反映体质强弱与生命力起伏，非寿命长短。' },
  { name: '智慧线', desc: '起点与生命线相近横穿手掌，代表思维方式与决断风格。' },
  { name: '感情线', desc: '位于掌心上部，反映情感表达模式与关系节奏。' },
  { name: '命运线', desc: '从手腕附近向上延伸的竖线，象征事业轨迹与人生转折。' },
  { name: '太阳线', desc: '无名指下方的竖纹，关联名声、创造力与生活热情。' },
];

// 面相区域参考
const FACE_ZONES = [
  { name: '额头（天庭）', desc: '看早年运势、思维格局与学业事业起步。' },
  { name: '眉眼', desc: '眉形看性情，眼神看气场与专注力。' },
  { name: '鼻子', desc: '鼻梁看魄力，鼻头看财帛与包容度。' },
  { name: '口唇', desc: '唇形与闭合状态反映表达习惯与情绪管理。' },
  { name: '下庭（下巴）', desc: '看晚年安稳与行事收尾能力。' },
];

// 模拟分析结果
function generateAnalysis(type: 'hand' | 'face', handSide: 'left' | 'right', masterIdx: number): string {
  const seeds = [
    type === 'hand' ? '手相左手' : '手相右手',
    type === 'face' ? '面相' : '',
    ['慧明长老', '明心师父', '玄真道长'][masterIdx],
  ].join('');
  const hash = seeds.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  
  const handResults = [
    '您的生命线弧度饱满，体质基础良好。智慧线与生命线起点相连，做事谨慎有规划。感情线末端分叉，情感丰富但容易犹豫。',
    '命运线从掌心偏下位置升起，早年事业起步稍缓但中年后渐入佳境。太阳线隐约可见， creativity 与表达能力有待发掘。',
    '左手代表先天禀赋，右手代表后天养成。您的两条手相显示思维模式稳定，但近期感情线有波动，注意情绪管理。',
  ];
  
  const faceResults = [
    '额头方正开阔，早年运势不错，思维清晰有远见。眉眼有神，做事有定力。鼻头圆润，财运良好但需守成。',
    '天庭饱满，地阁方圆，整体面相格局不错。眼神温和但有神，人际关系处理得当。口唇闭合紧密，言而有信。',
    '面相整体偏柔和，适合从事与人打交道的工作。鼻翼略收，理财需谨慎。下巴圆润，晚年运势平稳。',
  ];
  
  const results = type === 'hand' ? handResults : faceResults;
  return results[hash % results.length];
}

export default function PalmistryPage() {
  const [mode, setMode] = useState<'hand' | 'face'>('hand');
  const [handSide, setHandSide] = useState<'left' | 'right'>('left');
  const [selectedMaster, setSelectedMaster] = useState<number | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [showLines, setShowLines] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target?.result as string);
      setUploading(false);
      setShowResult(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAnalyze = () => {
    if (!photo) return;
    if (selectedMaster === null) {
      alert('请先选择一位大师');
      return;
    }
    const result = generateAnalysis(mode, handSide, selectedMaster);
    setAnalysis(result);
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-[#1a1410] relative overflow-hidden">
      <GoldenLotusBg />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto max-w-4xl px-4 pb-24 pt-20">
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl text-gold font-display">图解手相/面相</h1>
            <p className="text-paper-dark/80 text-sm">上传照片，AI 辅助解读</p>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={() => { setMode('hand'); setShowResult(false); }}
              className={`px-6 py-3 rounded-full text-sm border transition-all ${
                mode === 'hand'
                  ? 'border-gold/60 bg-gold/10 text-gold'
                  : 'border-gold/20 text-paper-dark/60 hover:border-gold/40'
              }`}
            >
              🤚 手相
            </button>
            <button
              type="button"
              onClick={() => { setMode('face'); setShowResult(false); }}
              className={`px-6 py-3 rounded-full text-sm border transition-all ${
                mode === 'face'
                  ? 'border-gold/60 bg-gold/10 text-gold'
                  : 'border-gold/20 text-paper-dark/60 hover:border-gold/40'
              }`}
            >
              😊 面相
            </button>
          </div>

          {/* Master Selection */}
          <div className="space-y-3">
            <p className="text-center text-sm text-gold/80">选择为你解读的大师</p>
            <div className="space-y-3">
              {MASTERS.map((master, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { setSelectedMaster(idx); setShowResult(false); }}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    selectedMaster === idx
                      ? 'border-gold/60 bg-gold/10'
                      : 'border-gold/20 bg-[#1a1510]/80 hover:border-gold/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{master.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gold font-medium text-sm">{master.name}</span>
                        <span className="text-paper-dark/50 text-xs">·</span>
                        <span className="text-paper-dark/60 text-xs">{master.title}</span>
                      </div>
                      <p className="text-xs text-paper-dark/70">{master.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Hand Side Toggle (only for hand mode) */}
          {mode === 'hand' && (
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => { setHandSide('left'); setShowResult(false); }}
                className={`px-4 py-2 rounded-full text-xs border transition-all ${
                  handSide === 'left'
                    ? 'border-gold/60 bg-gold/10 text-gold'
                    : 'border-gold/20 text-paper-dark/60'
                }`}
              >
                左手（先天）
              </button>
              <button
                type="button"
                onClick={() => { setHandSide('right'); setShowResult(false); }}
                className={`px-4 py-2 rounded-full text-xs border transition-all ${
                  handSide === 'right'
                    ? 'border-gold/60 bg-gold/10 text-gold'
                    : 'border-gold/20 text-paper-dark/60'
                }`}
              >
                右手（后天）
              </button>
            </div>
          )}

          {/* Photo Upload */}
          {!photo ? (
            <div className="rounded-2xl border border-gold/20 bg-[#1a1510]/80 p-8 text-center backdrop-blur-md space-y-4">
              <p className="text-paper-dark/60 text-sm">请上传清晰照片进行分析</p>
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-6 py-3 rounded-full bg-vermillion text-white text-sm hover:bg-vermillion-light transition-colors"
                >
                  📷 拍摄{mode === 'hand' ? '手相' : '面相'}
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 rounded-full border border-gold/40 text-gold text-sm hover:bg-gold/10 transition-colors"
                >
                  📁 从相册选{mode === 'hand' ? '手相' : '面相'}
                </button>
              </div>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            /* Photo Preview */
            <div className="rounded-2xl border border-gold/20 bg-[#1a1510]/80 p-4 backdrop-blur-md">
              <div className="relative">
                <img src={photo} alt="上传的照片" className="w-full rounded-lg max-h-80 object-contain" />
                <button
                  type="button"
                  onClick={() => { setPhoto(null); setShowResult(false); setAnalysis(''); }}
                  className="absolute top-2 right-2 px-3 py-1 rounded-full bg-black/50 text-white text-xs hover:bg-black/70"
                >
                  重新上传
                </button>
              </div>
              
              {/* Analyze Button */}
              <div className="mt-4 flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={!selectedMaster || uploading}
                  className="px-8 py-3 rounded-full bg-vermillion text-white text-sm hover:bg-vermillion-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {uploading ? '上传中...' : '开始专业解读'}
                </button>
              </div>
            </div>
          )}

          {/* Analysis Result */}
          {showResult && analysis && (
            <div className="rounded-2xl border border-gold/20 bg-[#1a1510]/80 p-6 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{MASTERS[selectedMaster || 0]?.icon}</span>
                <span className="text-gold font-medium text-sm">{MASTERS[selectedMaster || 0]?.name} 解读</span>
              </div>
              <p className="text-paper-dark/80 text-sm leading-relaxed">{analysis}</p>
            </div>
          )}

          {/* Main Lines Reference */}
          <div className="rounded-2xl border border-gold/20 bg-[#1a1510]/80 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setShowLines(!showLines)}
              className="w-full p-4 flex items-center justify-between text-gold/80 hover:text-gold transition-colors"
            >
              <span className="text-sm">
                {mode === 'hand' ? '🖐️ 手相深看' : '😊 面相深看'}会重点对照这些部位
              </span>
              <span className={`transition-transform ${showLines ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {showLines && (
              <div className="px-4 pb-4 space-y-2">
                {(mode === 'hand' ? HAND_LINES : FACE_ZONES).map((item, idx) => (
                  <div key={idx} className="rounded-lg bg-gold/5 p-3">
                    <div className="text-xs text-gold mb-1">{item.name}</div>
                    <div className="text-xs text-paper-dark/70">{item.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Legal Links */}
          <div className="flex justify-center gap-4 text-xs text-paper-dark/40">
            <a href="/terms/" className="hover:text-gold/60">《用户协议》</a>
            <a href="/privacy/" className="hover:text-gold/60">《隐私说明》</a>
            <a href="/ai-notice/" className="hover:text-gold/60">《AI 生成说明》</a>
          </div>
        </div>
      </main>

      <BottomNav active="palmistry" />
    </div>
  );
}
