'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';

export default function PalmistryPage() {
  const [step, setStep] = useState(1); // 1: upload, 2: preview, 3: unlock
  const [photo, setPhoto] = useState<string | null>(null);
  const [type, setType] = useState<'hand' | 'face'>('hand');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target?.result as string);
      reader.readAsDataURL(file);
      setStep(2);
    }
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
              上传掌心照或正脸照，围绕图上可见特征逐段分析，先预览再解锁完整详批。
            </p>
          </section>

          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-paper-dark/75">选择类型</p>
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
                <p className="text-sm text-paper-dark/75">上传照片</p>
                <label className="flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed border-gold/30 bg-xuan-surface/40 cursor-pointer hover:border-gold/40 hover:bg-xuan-surface/70 transition-all">
                  <svg className="size-8 text-gold/40 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  <span className="text-sm text-paper-dark/60">点击上传 {type === 'hand' ? '掌心照' : '正脸照'}</span>
                  <span className="text-xs text-paper-dark/45 mt-1">支持 jpg/png，最大 5MB</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </label>
              </div>

              <p className="text-xs text-paper-dark/50 text-center leading-relaxed">
                拍照提示：手掌平放，光线充足，不要遮挡掌纹；面部正面免冠，不要戴帽子墨镜。
              </p>
            </div>
          )}

          {/* Step 2: Preview */}
          {step === 2 && photo && (
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm space-y-4">
              <img src={photo} alt="预览" className="w-full max-h-64 object-contain rounded-lg border border-gold/20" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-lg border border-gold/30 py-3 text-sm text-paper-dark/70 hover:text-gold transition-colors">
                  重新上传
                </button>
                <button type="button" onClick={() => setStep(3)} className="flex-1 rounded-lg bg-vermillion py-3 text-sm text-white shadow-lg shadow-vermillion/20 hover:bg-vermillion-light transition-all">
                  预览分析
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Preview result */}
          {step === 3 && (
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm space-y-4">
              <div className="text-center">
                <span className="text-xs text-gold/80 tracking-wider">AI 分析预览</span>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg bg-xuan-surface/50 p-3">
                  <p className="text-sm text-gold mb-1">【手相/面相特征】</p>
                  <p className="text-sm text-paper-dark/85 leading-7">基于您上传的照片，AI 已识别主要特征...</p>
                </div>
                <div className="rounded-lg bg-xuan-surface/50 p-3 opacity-60">
                  <p className="text-sm text-gold mb-1">【详细解读】</p>
                  <p className="text-sm text-paper-dark/85 leading-7">此处为付费解锁内容...</p>
                </div>
              </div>
              <button type="button" className="w-full rounded-lg bg-vermillion py-3 text-lg text-white tracking-wider font-medium shadow-lg shadow-vermillion/20 hover:bg-vermillion-light transition-all">
                解锁完整详批 ¥9.9
              </button>
              <p className="text-center text-xs text-paper-dark/60">仅作传统文化参考，请结合现实情况判断</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav active="palmistry" />
    </div>
  );
}
