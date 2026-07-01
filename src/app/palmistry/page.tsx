'use client';

import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { saveRecord } from '@/lib/records';

const PALM_ANALYSIS = {
  '生命线': [
    { pattern: '深长', desc: '生命线深长且无明显中断，代表生命力旺盛，体质强健，抗病能力较强。中年后运势渐入佳境，晚年安康。' },
    { pattern: '浅淡', desc: '生命线较浅淡，说明体质偏弱，需注意日常养生。通过规律作息和适度锻炼可以改善。' },
    { pattern: '弯曲', desc: '生命线弧度较大，代表性格开朗外向，社交能力强。适合从事与人打交道的工作。' },
    { pattern: '笔直', desc: '生命线较为笔直，说明性格内敛稳重，做事有条理。适合从事技术性工作。' },
  ],
  '智慧线': [
    { pattern: '清晰', desc: '智慧线清晰明朗，思维敏捷，学习能力强。适合从事脑力劳动，学业运佳。' },
    { pattern: '模糊', desc: '智慧线不够清晰，说明注意力容易分散。建议培养专注力，养成良好学习习惯。' },
    { pattern: '长', desc: '智慧线较长，代表思考深入，有远见。适合从事研究、策划类工作。' },
    { pattern: '短', desc: '智慧线较短，说明行事果断，不拘小节。适合从事实操性强的工作。' },
  ],
  '感情线': [
    { pattern: '上扬', desc: '感情线上扬，代表热情开朗，善于表达情感。恋爱运佳，容易获得异性好感。' },
    { pattern: '平直', desc: '感情线平直，说明感情态度理性稳重。不轻易动心，但一旦投入便专一持久。' },
    { pattern: '深长', desc: '感情线深长，代表情感丰富，富有同情心。在感情中愿意付出，但也需要被理解。' },
    { pattern: '有岛纹', desc: '感情线上有岛纹，说明感情路上曾经历挫折。但这些经历会让您更加成熟懂事。' },
  ],
  '事业线': [
    { pattern: '明显', desc: '事业线清晰可见，代表事业心强，有明确的人生目标。中年后事业有成。' },
    { pattern: '不明显', desc: '事业线不太明显，说明事业运势较为平稳。适合按部就班地发展，不必急于求成。' },
    { pattern: '多条', desc: '有多条事业线，代表兴趣广泛，多才多艺。可能从事多种职业，生活丰富多彩。' },
    { pattern: '中断', desc: '事业线中途有中断，说明事业生涯会有转折。转折后往往有新的机遇。' },
  ],
};

const FACE_ANALYSIS = {
  '上停': [
    { pattern: '饱满', desc: '上停（额头）饱满宽阔，代表早年运势佳，聪明好学，家庭教育良好。适合从事学术或管理工作。' },
    { pattern: '低窄', desc: '上停偏低窄，说明早年生活较为辛苦，需要靠自己努力奋斗。中年后运势会逐渐好转。' },
    { pattern: '有痣', desc: '额头上有痣，代表有特殊才华，但需注意人际关系。痣的位置不同含义也不同。' },
  ],
  '中停': [
    { pattern: '端正', desc: '中停（眉毛到鼻尖）端正有势，代表中年运势旺盛，事业有成，财运亨通。' },
    { pattern: '鼻梁高', desc: '鼻梁高挺，说明自尊心强，有领导才能。适合从事管理或创业。' },
    { pattern: '颧骨', desc: '颧骨饱满，代表有管理能力和社会地位。在职场中容易获得晋升。' },
  ],
  '下停': [
    { pattern: '圆润', desc: '下停（鼻子以下）圆润饱满，代表晚年运势佳，子孙孝顺，生活富足。' },
    { pattern: '下巴尖', desc: '下巴较尖，说明性格灵活多变，适应能力强。但需注意稳定性。' },
    { pattern: '嘴唇', desc: '嘴唇厚薄适中，代表表达能力好，人际关系和谐。唇形饱满者富有魅力。' },
  ],
  '五官': [
    { pattern: '眼睛', desc: '眼睛有神，代表意志坚定，精力充沛。眼神清澈者心地善良。' },
    { pattern: '耳朵', desc: '耳朵厚实，代表福泽深厚，听力灵敏，善于倾听他人意见。' },
    { pattern: '鼻子', desc: '鼻头有肉，代表财运佳，善于理财。鼻梁挺直者事业运强。' },
    { pattern: '嘴巴', desc: '嘴唇红润，代表健康良好，表达能力强。说话得体，人缘好。' },
    { pattern: '眉毛', desc: '眉毛浓密整齐，代表兄弟姐妹缘分深，朋友多，贵人运佳。' },
  ],
};

// Deterministic hash from image data URL
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < Math.min(s.length, 500); i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number, idx: number): T {
  return arr[(seed + idx * 7) % arr.length];
}

function analyzePalm(type: 'hand' | 'face', imageData: string) {
  const seed = hashStr(imageData);
  const results: { title: string; items: { pattern: string; desc: string }[] }[] = [];

  if (type === 'hand') {
    const lines = ['生命线', '智慧线', '感情线', '事业线'];
    const analysis = lines.map((line, i) => ({
      pattern: pick(PALM_ANALYSIS[line as keyof typeof PALM_ANALYSIS], seed, i).pattern,
      desc: pick(PALM_ANALYSIS[line as keyof typeof PALM_ANALYSIS], seed, i).desc,
    }));
    results.push({ title: '手掌分析', items: analysis });
  } else {
    const sections = [
      { title: '面相分析', data: ['上停', '中停', '下停'] },
      { title: '五官分析', data: ['五官'] },
    ];
    sections.forEach(sec => {
      const pool = sec.title === '面相分析' ? FACE_ANALYSIS['上停'] : FACE_ANALYSIS['五官'];
      const items = sec.data.map((key, i) => {
        const source = key === '上停' ? FACE_ANALYSIS['上停'] :
                       key === '中停' ? FACE_ANALYSIS['中停'] :
                       key === '下停' ? FACE_ANALYSIS['下停'] : FACE_ANALYSIS['五官'];
        return { pattern: pick(source, seed, i).pattern, desc: pick(source, seed, i).desc };
      });
      results.push({ title: sec.title, items });
    });
  }

  return results;
}

export default function PalmistryPage() {
  const [step, setStep] = useState(1); // 1: upload, 2: preview, 3: analyzing, 4: result
  const [photo, setPhoto] = useState<string | null>(null);
  const [type, setType] = useState<'hand' | 'face'>('hand');
  const [analysis, setAnalysis] = useState<{ title: string; items: { pattern: string; desc: string }[] }[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load saved photo from localStorage on mount
  const STORAGE_KEY = 'yinianjian_palm_photo';
  const TYPE_KEY = 'yinianjian_palm_type';
  const SAVED_KEY = 'yinianjian_palm_saved';

  const savePhoto = () => {
    if (!photo) return;
    try {
      localStorage.setItem(STORAGE_KEY, photo);
      localStorage.setItem(TYPE_KEY, type);
      localStorage.setItem(SAVED_KEY, 'true');
      setSaved(true);
      alert('照片已保存到本地相册');
    } catch {
      alert('照片太大无法保存，请缩小后重试');
    }
  };

  const loadSavedPhoto = () => {
    try {
      const saved = localStorage.getItem(SAVED_KEY);
      if (saved === 'true') {
        const p = localStorage.getItem(STORAGE_KEY);
        const t = localStorage.getItem(TYPE_KEY);
        if (p) {
          setPhoto(p);
          setType(t === 'face' ? 'face' : 'hand');
          setSaved(true);
          setStep(2);
        }
      }
    } catch {}
  };

  // Try load on mount
  loadSavedPhoto();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target?.result as string);
      reader.readAsDataURL(file);
      setStep(2);
    }
  };

  const handlePreview = () => {
    if (!photo) return;
    setLoading(true);
    setStep(3);
    setTimeout(() => {
      const result = analyzePalm(type, photo);
      setAnalysis(result);
      setLoading(false);
      setStep(4);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-deep relative overflow-hidden">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-xuan via-xuan-card to-xuan" />
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.20]" style={{ backgroundImage: "url('/temple/temple-mountain.svg')" }} />
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(10,6,4,0.55) 0%, rgba(10,6,4,0.35) 30%, transparent 60%, rgba(10,6,4,0.6) 100%)' }} />
      <div className="fixed inset-x-0 top-0 z-0 h-32 bg-gradient-to-b from-gold/15 to-transparent" />
      <FloatingParticles />

      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-5xl space-y-section px-4 pb-24">
          {/* Title */}
          <section className="space-y-3 pt-8 text-center">
            <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
              <svg className="size-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.94-2.27l-1.56-1.92A2 2 0 0 1 3 16.5v-4a2 2 0 1 1 4 0" />
              </svg>
            </div>
            <h1 className="text-4xl text-gold">手相 / 面相</h1>
            <p className="text-base text-paper-dark/85">
              上传掌心照或正脸照，围绕图上可见特征逐段分析，先看预览再决定是否解锁完整详批。
            </p>
          </section>

          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm space-y-4">
              {saved && photo && (
                <div className="rounded-lg border border-gold/20 bg-gold/5 p-3 text-center">
                  <img src={photo} alt="已保存的照片" className="mx-auto max-h-40 rounded-lg border border-gold/20" />
                  <p className="text-xs text-gold mt-2">📸 已保存上次上传的照片</p>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-sm text-label">选择类型</p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setType('hand')} className={`flex-1 rounded-lg border p-3 text-center transition-all ${type === 'hand' ? 'border-gold/60 bg-gold/10 text-gold' : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'}`}>
                    <span className="text-2xl">🤚</span>
                    <p className="text-sm mt-1">手相</p>
                  </button>
                  <button type="button" onClick={() => setType('face')} className={`flex-1 rounded-lg border p-3 text-center transition-all ${type === 'face' ? 'border-gold/60 bg-gold/10 text-gold' : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'}`}>
                    <span className="text-2xl">😊</span>
                    <p className="text-sm mt-1">面相</p>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-label">上传照片</p>
                <label className="flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed border-gold/30 bg-xuan-surface/40 cursor-pointer hover:border-gold/40 hover:bg-xuan-surface/70 transition-all">
                  <svg className="size-8 text-gold/40 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  <span className="text-sm text-on-dark-muted">点击上传 {type === 'hand' ? '掌心照' : '正脸照'}</span>
                  <span className="text-xs text-on-dark-dim mt-1">支持 jpg/png，最大 5MB</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </label>
              </div>

              <p className="text-xs text-paper-dark/50 text-center leading-relaxed">
                拍照提示：手掌平放，光线充足，不要遮挡掌纹；面部正面免冠，不要戴帽子墨镜。
              </p>
            </div>
          )}

          {/* Step 2: Preview photo */}
          {step === 2 && photo && (
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm space-y-4">
              <img src={photo} alt="预览" className="w-full max-h-64 object-contain rounded-lg border border-gold/20" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-lg border border-gold/30 py-3 text-sm text-on-dark-muted hover:text-gold transition-colors">
                  重新上传
                </button>
                <button type="button" onClick={handlePreview} className="flex-1 rounded-lg bg-vermillion py-3 text-sm text-white shadow-lg shadow-vermillion/20 hover:bg-vermillion-light transition-all disabled:opacity-50">
                  预览分析
                </button>
              </div>
              {!saved && (
                <button
                  type="button"
                  onClick={savePhoto}
                  className="w-full rounded-lg border border-gold/30 py-3 text-sm text-gold hover:bg-gold/10 transition-all"
                >
                  📸 保存到相册
                </button>
              )}
              {saved && (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem(STORAGE_KEY);
                    localStorage.removeItem(TYPE_KEY);
                    localStorage.removeItem(SAVED_KEY);
                    setSaved(false);
                    setPhoto(null);
                    setStep(1);
                  }}
                  className="w-full rounded-lg border border-vermillion/30 py-3 text-sm text-vermillion hover:bg-vermillion/10 transition-all"
                >
                  🗑 清除已保存的照片
                </button>
              )}
            </div>
          )}

          {/* Step 3: Loading */}
          {step === 3 && (
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm text-center py-12">
              <div className="text-4xl animate-pulse">🔍</div>
              <p className="mt-3 text-sm text-on-dark-muted">AI 正在分析中...</p>
              <p className="text-xs text-on-dark-dim mt-1">请稍候</p>
            </div>
          )}

          {/* Step 4: Result */}
          {step === 4 && analysis && (
            <div className="space-y-4 animate-slide-up">
              {analysis.map((section, si) => (
                <div key={si} className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm space-y-3">
                  <div className="text-center">
                    <span className="text-xs text-gold/80 tracking-wider">{section.title}</span>
                  </div>
                  {section.items.map((item, ii) => (
                    <div key={ii} className="rounded-lg bg-xuan-surface/50 p-3 space-y-1">
                      <p className="text-sm text-gold mb-1">【{item.pattern}】</p>
                      <p className="text-sm text-paper-dark/85 leading-7">{item.desc}</p>
                    </div>
                  ))}
                </div>
              ))}

              {/* Paywall */}
              <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm text-center space-y-3">
                <p className="text-sm text-on-dark-muted">以上为预览内容，完整详批包含更深入的分析和个性化建议。</p>
                <button
                  type="button"
                  className="w-full rounded-lg bg-vermillion py-3 text-lg text-white tracking-wider font-medium shadow-lg shadow-vermillion/20 hover:bg-vermillion-light transition-all"
                  onClick={() => setShowPayment(true)}
                >
                  解锁完整详批 ¥9.9
                </button>
              </div>
            </div>
          )}

          {/* Payment modal */}
          {showPayment && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowPayment(false)}>
              <div className="rounded-2xl border border-gold/30 bg-xuan-card p-6 max-w-sm w-full text-center space-y-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl text-gold font-display">解锁完整详批</h3>
                <p className="text-sm text-on-dark-muted">请扫描下方二维码完成支付 ¥9.9</p>
                <img src="/zfb-payment.png" alt="支付宝收款码" className="mx-auto rounded-lg border-2 border-gold/30" />
                <p className="text-xs text-paper-dark/50">支付完成后请截图发送给我们确认</p>
                <button
                  type="button"
                  onClick={() => setShowPayment(false)}
                  className="w-full rounded-lg border border-gold/30 py-2 text-sm text-on-dark-muted hover:text-gold transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNav active="palmistry" />
    </div>
  );
}
