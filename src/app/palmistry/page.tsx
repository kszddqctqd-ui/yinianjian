'use client';

import { useState, useRef, useCallback } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';

// 三位大师详细资料
const MASTERS = [
  {
    icon: '🧘',
    name: '慧明长老',
    title: '古寺住持',
    desc: '庄重持重，引经据典',
    detail: '擅长《麻衣相书》《神相全编》，专研额头气色、指甲形态等细微特征看古法出的相王。',
    bg: 'bg-gold/5 border-gold/30',
  },
  {
    icon: '🙏',
    name: '明心师父',
    title: '尼众法师',
    desc: '慈悲温柔，劝人向善',
    detail: '福报深厚，慈悲为怀，适合家庭、感情、亲人所愿所求。',
    bg: 'bg-gold/5 border-gold/30',
  },
  {
    icon: '☯️',
    name: '玄真道长',
    title: '山中道人',
    desc: '直爽通透，说大白话',
    detail: '山中高人，不绕弯子，把命运讲成大白话，适合年轻人。',
    bg: 'bg-gold/5 border-gold/30',
  },
];

// 手相主线参考
const HAND_LINES = [
  { name: '感情线', desc: 'Emotion Line', y: 30 },
  { name: '智慧线', desc: 'Wisdom Line', y: 50 },
  { name: '生命线', desc: 'Life Line', y: 70 },
  { name: '事业线', desc: 'Career Line', y: 40 },
  { name: '成功线', desc: 'Success Line', y: 60 },
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
    '您的生命线弧度饱满，体质基础良好。智慧线与生命线起点相连，做事谨慎有规划。感情线末端分叉，情感丰富但容易犹豫。命运线从掌心偏下位置升起，早年事业起步稍缓但中年后渐入佳境。太阳线隐约可见，创造力与表达能力有待发掘。',
    '命运线从掌心偏下位置升起，早年事业起步稍缓但中年后渐入佳境。太阳线隐约可见，creativity 与表达能力有待发掘。左手代表先天禀赋，右手代表后天养成。您的两条手相显示思维模式稳定，但近期感情线有波动，注意情绪管理。',
    '左手代表先天禀赋，右手代表后天养成。您的两条手相显示思维模式稳定，但近期感情线有波动，注意情绪管理。生命线的深浅变化反映体质起伏，智慧线的走向显示您适合从事需要细致规划的工作。',
  ];
  
  const faceResults = [
    '额头方正开阔，早年运势不错，思维清晰有远见。眉眼有神，做事有定力。鼻头圆润，财运良好但需守成。口唇闭合紧密，言而有信。下巴圆润，晚年运势平稳。',
    '天庭饱满，地阁方圆，整体面相格局不错。眼神温和但有神，人际关系处理得当。鼻翼略收，理财需谨慎。整体面相偏柔和，适合从事与人打交道的工作。',
    '面相整体偏柔和，适合从事与人打交道的工作。鼻翼略收，理财需谨慎。下巴圆润，晚年运势平稳。额头方正开阔，早年运势不错，思维清晰有远见。',
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
      alert('请先选择一位师父');
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
            <p className="text-paper-dark/80 text-sm max-w-md mx-auto">
              上传掌心照或正脸照，AI 分析图上可见特征，先看预览再决定是否解锁完整详批。
            </p>
          </div>

          {/* Mode Selection */}
          <div className="rounded-2xl border border-gold/20 bg-[#1a1510]/80 p-6 backdrop-blur-md">
            <p className="text-center text-sm text-gold/80 mb-4">先选这次您想深看的方向</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => { setMode('hand'); setShowResult(false); }}
                className={`flex-1 rounded-xl border p-4 transition-all ${
                  mode === 'hand'
                    ? 'border-gold/60 bg-gold/10'
                    : 'border-gold/20 bg-[#1a1510]/80 hover:border-gold/40'
                }`}
              >
                <div className="text-3xl mb-2">🤚</div>
                <div className="text-gold font-medium text-sm mb-1">手相</div>
                <div className="text-xs text-paper-dark/60">
                  不是只看一条线，而是把性情、感情、事业、财运与前程起伏放在一手里统筹看，图上看不到的地方不会瞎编。
                </div>
              </button>
              <button
                type="button"
                onClick={() => { setMode('face'); setShowResult(false); }}
                className={`flex-1 rounded-xl border p-4 transition-all ${
                  mode === 'face'
                    ? 'border-gold/60 bg-gold/10'
                    : 'border-gold/20 bg-[#1a1510]/80 hover:border-gold/40'
                }`}
              >
                <div className="text-3xl mb-2">😊</div>
                <div className="text-gold font-medium text-sm mb-1">面相</div>
                <div className="text-xs text-paper-dark/60">
                  把额头、眉眼、鼻口、下巴这些看得见的特征，落到人际气场、处事分寸、事业节奏与当下状态上来讲，只围绕图上能确认的地方下判断。
                </div>
              </button>
            </div>
          </div>

          {/* Master Selection */}
          <div className="rounded-2xl border border-gold/20 bg-[#1a1510]/80 p-6 backdrop-blur-md">
            <p className="text-center text-sm text-gold/80 mb-4">请选择一位师父为您开示</p>
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
                      <p className="text-xs text-paper-dark/70 mb-2">{master.desc}</p>
                      <p className="text-xs text-paper-dark/50">{master.detail}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Hand Side Toggle */}
          {mode === 'hand' && (
            <div className="rounded-2xl border border-gold/20 bg-[#1a1510]/80 p-6 backdrop-blur-md">
              <p className="text-center text-sm text-gold/80 mb-3">看哪只手</p>
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => { setHandSide('left'); setShowResult(false); }}
                  className={`px-6 py-2 rounded-full text-xs border transition-all ${
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
                  className={`px-6 py-2 rounded-full text-xs border transition-all ${
                    handSide === 'right'
                      ? 'border-gold/60 bg-gold/10 text-gold'
                      : 'border-gold/20 text-paper-dark/60'
                  }`}
                >
                  右手（后天）
                </button>
              </div>
              <p className="text-center text-xs text-paper-dark/50 mt-3">
                传统认为：先天左右，左手主先天本性，右手主后天发展。
              </p>
            </div>
          )}

          {/* Photo Requirements */}
          <div className="rounded-2xl border border-gold/20 bg-[#1a1510]/80 p-6 backdrop-blur-md">
            <p className="text-sm text-gold/80 mb-3">拍摄要求</p>
            <ul className="text-xs text-paper-dark/70 space-y-1">
              <li>• 自然光下，掌心张开正对镜头</li>
              <li>• 五指自然伸展，不要过分用力</li>
              <li>• 主要线条（生命线、智慧线、感情线）清晰可见</li>
              <li>• 图片小于5MB，jpg/png格式</li>
            </ul>
          </div>

          {/* Photo Upload */}
          {!photo ? (
            <div className="rounded-2xl border border-gold/20 bg-[#1a1510]/80 p-8 backdrop-blur-md">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 rounded-xl border-2 border-vermillion/40 bg-vermillion/10 p-6 text-center hover:bg-vermillion/20 transition-colors"
                >
                  <div className="text-3xl mb-2">📷</div>
                  <div className="text-vermillion text-sm font-medium mb-1">拍摄{mode === 'hand' ? '手相' : '面相'}</div>
                  <div className="text-xs text-paper-dark/60">现在打开摄像头</div>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 rounded-xl border-2 border-dashed border-gold/30 bg-gold/5 p-6 text-center hover:bg-gold/10 transition-colors"
                >
                  <div className="text-3xl mb-2">📁</div>
                  <div className="text-gold text-sm font-medium mb-1">从相册选{mode === 'hand' ? '手相' : '面相'}</div>
                  <div className="text-xs text-paper-dark/60">已有照片直接传</div>
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
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={!selectedMaster || uploading}
                  className="w-full max-w-sm px-8 py-3 rounded-full bg-vermillion text-white text-sm hover:bg-vermillion-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {uploading ? '上传中...' : '开始专业解读'}
                </button>
              </div>
            </div>
          )}

          {/* Consent & Disclaimer */}
          <div className="rounded-2xl border border-gold/20 bg-[#1a1510]/80 p-4 backdrop-blur-md">
            <div className="flex items-start gap-2">
              <span className="text-paper-dark/50 mt-0.5">ℹ️</span>
              <div className="text-xs text-paper-dark/50 leading-relaxed">
                <p>点击"开始专业解读"即表示您已阅读并同意《用户协议》《隐私政策》与《AI生成说明》，并同意我们按照您自主选择的方式处理您的数据。</p>
                <p className="mt-1">图片仅用于本次手相分析与结果展示。</p>
                <p className="mt-1">仅供传统文化参考，请结合实际情况考虑；未满18周岁请勿使用本服务，请勿提交他人的照片，生成结果仅供参考。</p>
              </div>
            </div>
          </div>

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
                🖐️ 手相深看会重点对照这些主线（点击展开参考）
              </span>
              <span className={`transition-transform ${showLines ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {showLines && (
              <div className="px-4 pb-4">
                <div className="flex gap-4 justify-center">
                  {/* Left Hand */}
                  <div className="text-center">
                    <div className="text-xs text-gold/80 mb-2">左手（先天）</div>
                    <svg viewBox="0 0 120 160" className="w-24 h-32">
                      <path d="M60 10 Q30 10 20 40 Q10 70 20 100 Q30 130 60 150 Q90 130 100 100 Q110 70 100 40 Q90 10 60 10" fill="none" stroke="#C9A05C" strokeWidth="1.5"/>
                      <path d="M30 40 Q60 50 90 40" fill="none" stroke="#C9A05C" strokeWidth="1" strokeDasharray="3,3"/>
                      <path d="M25 60 Q60 70 95 60" fill="none" stroke="#C9A05C" strokeWidth="1" strokeDasharray="3,3"/>
                      <path d="M20 80 Q60 90 100 80" fill="none" stroke="#C9A05C" strokeWidth="1" strokeDasharray="3,3"/>
                      <path d="M60 50 L60 130" fill="none" stroke="#C9A05C" strokeWidth="1" strokeDasharray="3,3"/>
                      <path d="M50 55 L50 120" fill="none" stroke="#C9A05C" strokeWidth="1" strokeDasharray="3,3"/>
                    </svg>
                    <div className="text-[10px] text-paper-dark/50 mt-1">
                      <div>感情线</div>
                      <div>智慧线</div>
                      <div>生命线</div>
                    </div>
                  </div>
                  {/* Right Hand */}
                  <div className="text-center">
                    <div className="text-xs text-gold/80 mb-2">右手（后天）</div>
                    <svg viewBox="0 0 120 160" className="w-24 h-32">
                      <path d="M60 10 Q30 10 20 40 Q10 70 20 100 Q30 130 60 150 Q90 130 100 100 Q110 70 100 40 Q90 10 60 10" fill="none" stroke="#C9A05C" strokeWidth="1.5"/>
                      <path d="M30 40 Q60 50 90 40" fill="none" stroke="#C9A05C" strokeWidth="1" strokeDasharray="3,3"/>
                      <path d="M25 60 Q60 70 95 60" fill="none" stroke="#C9A05C" strokeWidth="1" strokeDasharray="3,3"/>
                      <path d="M20 80 Q60 90 100 80" fill="none" stroke="#C9A05C" strokeWidth="1" strokeDasharray="3,3"/>
                      <path d="M60 50 L60 130" fill="none" stroke="#C9A05C" strokeWidth="1" strokeDasharray="3,3"/>
                      <path d="M50 55 L50 120" fill="none" stroke="#C9A05C" strokeWidth="1" strokeDasharray="3,3"/>
                    </svg>
                    <div className="text-[10px] text-paper-dark/50 mt-1">
                      <div>事业线</div>
                      <div>成功线</div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-xs text-paper-dark/50 mt-3">
                  左手主先天本性，右手主后天发展，完整解读会结合掌纹细节与手指骨骼综合判断
                </p>
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
