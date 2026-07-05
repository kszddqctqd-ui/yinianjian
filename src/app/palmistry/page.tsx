'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';
import { saveRecord } from '@/lib/records';
import { loadFaceApiModels, analyzeFace, analyzePalm, type FaceAnalysisResult, type PalmAnalysisResult } from '@/lib/palm-face-analyzer';
import { sanitizeHTML } from '@/lib/sanitize';
import { t, getLocale } from '@/lib/i18n';
import type { SupportedLang } from '@/lib/i18n';

let modelsLoaded = false;

export default function PalmistryPage() {
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [type, setType] = useState<'hand' | 'face'>('hand');
  const [faceResult, setFaceResult] = useState<FaceAnalysisResult | null>(null);
  const [palmResult, setPalmResult] = useState<PalmAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lang, setLang] = useState<SupportedLang>(getLocale());
  const imgRef = useRef<HTMLImageElement | null>(null);

  const STORAGE_KEY = 'yinianjian_palm_photo';
  const TYPE_KEY = 'yinianjian_palm_type';
  const SAVED_KEY = 'yinianjian_palm_saved';

  useEffect(() => {
    setLang(getLocale());
    const handler = () => setLang(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  function resolve(key: string): string {
    return t(key);
  }

  const savePhoto = () => {
    if (!photo) return;
    try {
      localStorage.setItem(STORAGE_KEY, photo);
      localStorage.setItem(TYPE_KEY, type);
      localStorage.setItem(SAVED_KEY, 'true');
      setSaved(true);
    } catch {
      alert(resolve('palmistry.photoTooLarge'));
    }
  };

  const loadSavedPhoto = () => {
    try {
      const saved_ = localStorage.getItem(SAVED_KEY);
      if (saved_ === 'true') {
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

  const handlePreview = useCallback(async () => {
    if (!photo || !imgRef.current) return;

    setLoading(true);
    setStep(3);

    try {
      // 首次加载 face-api.js 模型
      if (!modelsLoaded) {
        await loadFaceApiModels();
        modelsLoaded = true;
      }

      // 等待图片加载完成
      await new Promise<void>((resolve) => {
        const img = imgRef.current!;
        if (img.complete) resolve();
        else img.onload = () => resolve();
      });

      if (type === 'face') {
        const result = await analyzeFace(imgRef.current);
        setFaceResult(result);
        setPalmResult(null);
        saveRecord('palmistry', { type: 'face', result }, resolve('palmistry.type.face'));
      } else {
        const result = await analyzePalm(imgRef.current);
        setPalmResult(result);
        setFaceResult(null);
        saveRecord('palmistry', { type: 'hand', result }, resolve('palmistry.type.hand'));
      }

      setStep(4);
    } catch (err) {
      console.error('Analysis error:', err);
      alert(resolve('palmistry.analysisFail'));
      setStep(2);
    } finally {
      setLoading(false);
    }
  }, [photo, type]);

  const renderResult = () => {
    if (type === 'face' && faceResult) {
      return (
        <div className="space-y-4">
          {/* 人脸检测结果 */}
          <div className="rounded-lg border border-gold/20 bg-xuan-surface/40 p-4 text-center">
            {faceResult.faceDetected ? (
              <>
                <div className="text-lg font-display" style={{ color: '#C9A96E' }}>{resolve('palmistry.face.detected')}</div>
                <div className="text-xs mt-1" style={{ color: '#D4C5A9/65' }}>
                  {resolve('palmistry.faceSize').replace('{width}', String(faceResult.faceWidth)).replace('{height}', String(faceResult.faceHeight))}
                </div>
              </>
            ) : (
              <div className="text-lg font-display" style={{ color: '#C9A96E' }}>{resolve('palmistry.face.notDetected')}</div>
            )}
          </div>

          {/* 各部位分析 */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="card-standard">
              <h4 className="font-display text-lg mb-2" style={{ color: '#C9A96E' }}>{resolve('palmistry.section.forehead')}</h4>
              <p className="text-sm" style={{ color: '#D4C5A9' }} dangerouslySetInnerHTML={{ __html: sanitizeHTML(faceResult.forehead) }} />
            </div>
            <div className="card-standard">
              <h4 className="font-display text-lg mb-2" style={{ color: '#C9A96E' }}>{resolve('palmistry.section.eyes')}</h4>
              <p className="text-sm" style={{ color: '#D4C5A9' }} dangerouslySetInnerHTML={{ __html: sanitizeHTML(faceResult.eyes) }} />
            </div>
            <div className="card-standard">
              <h4 className="font-display text-lg mb-2" style={{ color: '#C9A96E' }}>{resolve('palmistry.section.nose')}</h4>
              <p className="text-sm" style={{ color: '#D4C5A9' }} dangerouslySetInnerHTML={{ __html: sanitizeHTML(faceResult.nose) }} />
            </div>
            <div className="card-standard">
              <h4 className="font-display text-lg mb-2" style={{ color: '#C9A96E' }}>{resolve('palmistry.section.mouth')}</h4>
              <p className="text-sm" style={{ color: '#D4C5A9' }} dangerouslySetInnerHTML={{ __html: sanitizeHTML(faceResult.mouth) }} />
            </div>
          </div>

          <div className="card-standard">
            <h4 className="font-display text-lg mb-2" style={{ color: '#C9A96E' }}>{resolve('palmistry.section.chin')}</h4>
            <p className="text-sm" style={{ color: '#D4C5A9' }} dangerouslySetInnerHTML={{ __html: sanitizeHTML(faceResult.chin) }} />
          </div>

          <div className="card-standard">
            <h4 className="font-display text-lg mb-2" style={{ color: '#C9A96E' }}>{resolve('palmistry.section.summary')}</h4>
            <p className="text-sm leading-loose" style={{ color: '#D4C5A9' }} dangerouslySetInnerHTML={{ __html: sanitizeHTML(faceResult.overall) }} />
          </div>
        </div>
      );
    }

    if (type === 'hand' && palmResult) {
      return (
        <div className="space-y-4">
          <div className="rounded-lg border border-gold/20 bg-xuan-surface/40 p-4 text-center">
            {palmResult.palmDetected ? (
              <div className="text-lg font-display" style={{ color: '#C9A96E' }}>{resolve('palmistry.analysis.completed')}</div>
            ) : (
              <div className="text-lg font-display" style={{ color: '#C9A96E' }}>{resolve('palmistry.ensureVisible')}</div>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="card-standard">
              <h4 className="font-display text-lg mb-2" style={{ color: '#C9A96E' }}>{resolve('palmistry.section.lifeLine')}</h4>
              <p className="text-sm" style={{ color: '#D4C5A9' }}>{palmResult.lifeLine}</p>
            </div>
            <div className="card-standard">
              <h4 className="font-display text-lg mb-2" style={{ color: '#C9A96E' }}>{resolve('palmistry.section.wisdomLine')}</h4>
              <p className="text-sm" style={{ color: '#D4C5A9' }}>{palmResult.wisdomLine}</p>
            </div>
            <div className="card-standard">
              <h4 className="font-display text-lg mb-2" style={{ color: '#C9A96E' }}>{resolve('palmistry.section.heartLine')}</h4>
              <p className="text-sm" style={{ color: '#D4C5A9' }}>{palmResult.heartLine}</p>
            </div>
            <div className="card-standard">
              <h4 className="font-display text-lg mb-2" style={{ color: '#C9A96E' }}>{resolve('palmistry.section.fateLine')}</h4>
              <p className="text-sm" style={{ color: '#D4C5A9' }}>{palmResult.fateLine}</p>
            </div>
          </div>

          <div className="card-standard">
            <h4 className="font-display text-lg mb-2" style={{ color: '#C9A96E' }}>{resolve('palmistry.section.summary')}</h4>
            <p className="text-sm leading-loose" style={{ color: '#D4C5A9' }} dangerouslySetInnerHTML={{ __html: palmResult.overall }} />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-xuan relative overflow-hidden">
      <GoldenLotusBg />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-4xl space-y-section px-4 pb-24">
          {/* Title */}
          <section className="space-y-3 pt-8 text-center">
            <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hand size-8 text-gold" aria-hidden="true">
                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
              </svg>
            </div>
            <h1 className="font-display text-4xl tracking-widest" style={{ color: '#C9A96E' }}>{resolve('palmistry.title')}</h1>
            <p className="text-base" style={{ color: '#D4C5A9' }}>
              {resolve('palmistry.subtitle')}
            </p>
          </section>

          {/* Hidden image ref for analysis */}
          {photo && (
            <img
              ref={imgRef}
              src={photo}
              alt="分析用图"
              className="hidden"
              onLoad={() => {
                // Ensure image is loaded for face-api.js
              }}
            />
          )}

          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="card-standard space-y-4">
              {saved && photo && (
                <div className="rounded-lg border border-gold/20 bg-gold/5 p-3 text-center">
                  <img src={photo} alt="已保存的照片" className="mx-auto max-h-40 rounded-lg border border-gold/20" />
                  <p className="text-xs text-gold mt-2">{resolve('palmistry.savedPhoto')}</p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm" style={{ color: '#D4C5A9' }}>{resolve('palmistry.selectType')}</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setType('hand')}
                    className={`flex-1 rounded-md border p-3 text-center transition-all ${
                      type === 'hand'
                        ? 'border-gold/60 bg-gold/10 text-gold'
                        : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'
                    }`}
                  >
                    <span className="text-2xl">🤚</span>
                    <p className="text-sm mt-1">{resolve('palmistry.type.hand')}</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('face')}
                    className={`flex-1 rounded-md border p-3 text-center transition-all ${
                      type === 'face'
                        ? 'border-gold/60 bg-gold/10 text-gold'
                        : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'
                    }`}
                  >
                    <span className="text-2xl">😊</span>
                    <p className="text-sm mt-1">{resolve('palmistry.type.face')}</p>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm" style={{ color: '#D4C5A9' }}>{resolve('palmistry.upload')}</p>
                <label className="flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed border-gold/30 bg-xuan-surface/40 cursor-pointer hover:border-gold/40 hover:bg-xuan-surface/70 transition-all">
                  <svg className="size-8 text-gold/40 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="text-sm" style={{ color: '#D4C5A9' }}>{resolve('palmistry.uploadText')} {type === 'hand' ? resolve('palmistry.uploadHand') : resolve('palmistry.uploadFace')}</span>
                  <span className="text-xs" style={{ color: '#D4C5A9/50' }}>{resolve('palmistry.uploadHint')}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </label>
              </div>

              {/* 拍照指导 */}
              <div className="rounded-lg border border-gold/20 bg-xuan-surface/40 p-4 space-y-2">
                <p className="text-sm font-medium" style={{ color: '#C9A96E' }}>{resolve('palmistry.photoGuide')}</p>
                {type === 'hand' ? (
                  <>
                    <p className="text-xs" style={{ color: '#D4C5A9/80' }}>• {resolve('palmistry.handGuide.0')}</p>
                    <p className="text-xs" style={{ color: '#D4C5A9/80' }}>• {resolve('palmistry.handGuide.1')}</p>
                    <p className="text-xs" style={{ color: '#D4C5A9/80' }}>• {resolve('palmistry.handGuide.2')}</p>
                    <p className="text-xs" style={{ color: '#D4C5A9/80' }}>• {resolve('palmistry.handGuide.3')}</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs" style={{ color: '#D4C5A9/80' }}>• {resolve('palmistry.faceGuide.0')}</p>
                    <p className="text-xs" style={{ color: '#D4C5A9/80' }}>• {resolve('palmistry.faceGuide.1')}</p>
                    <p className="text-xs" style={{ color: '#D4C5A9/80' }}>• {resolve('palmistry.faceGuide.2')}</p>
                    <p className="text-xs" style={{ color: '#D4C5A9/80' }}>• {resolve('palmistry.faceGuide.3')}</p>
                  </>
                )}
              </div>

              <p className="text-xs text-center" style={{ color: '#D4C5A9/50' }}>
                {resolve('palmistry.uploadHint')}
              </p>
            </div>
          )}

          {/* Step 2: Preview photo */}
          {step === 2 && photo && (
            <div className="card-standard space-y-4">
              <img src={photo} alt="预览" className="w-full max-h-64 object-contain rounded-lg border border-gold/20" />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-md border border-gold/30 py-3 text-sm text-paper-dark/80 hover:text-gold transition-colors"
                >
                  {resolve('palmistry.btn.reupload')}
                </button>
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={loading}
                  className="flex-1 rounded-md bg-vermillion py-3 text-sm text-white shadow-lg shadow-vermillion/20 hover:bg-vermillion-light transition-all disabled:opacity-50"
                >
                  {resolve('palmistry.btn.analyze')}
                </button>
              </div>
              {!saved && (
                <button
                  type="button"
                  onClick={savePhoto}
                  className="w-full rounded-md border border-gold/30 py-2 text-sm text-gold hover:bg-gold/10 transition-all"
                >
                  {resolve('palmistry.btn.save')}
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
                  className="w-full rounded-md border border-vermillion/30 py-2 text-sm text-vermillion hover:bg-vermillion/10 transition-all"
                >
                  {resolve('palmistry.btn.clear')}
                </button>
              )}
            </div>
          )}

          {/* Step 3: Loading */}
          {step === 3 && (
            <div className="card-standard text-center py-12 space-y-3">
              <div className="text-4xl animate-pulse">🔍</div>
              <p className="text-sm" style={{ color: '#D4C5A9' }}>{resolve('palmistry.analyzing')}</p>
              <p className="text-xs" style={{ color: '#D4C5A9/50' }}>{resolve('palmistry.modelLoading')}</p>
            </div>
          )}

          {/* Step 4: Result */}
          {step === 4 && renderResult()}

          {/* Paywall */}
          {step === 4 && (
            <div className="card-standard text-center space-y-3">
              <p className="text-sm" style={{ color: '#D4C5A9' }}>{resolve('palmistry.unlock.desc')}</p>
              <button
                type="button"
                className="w-full rounded-md bg-vermillion py-3 text-lg text-white tracking-wider font-medium shadow-lg shadow-vermillion/20 hover:bg-vermillion-light transition-all"
                onClick={() => setShowPayment(true)}
              >
                {resolve('palmistry.unlock.price')}
              </button>
            </div>
          )}

          {/* Payment modal */}
          {showPayment && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowPayment(false)}>
              <div className="rounded-2xl border border-gold/30 bg-xuan-card p-6 max-w-sm w-full text-center space-y-4" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl text-gold font-display">{resolve('palmistry.unlock.title')}</h3>
                <p className="text-sm" style={{ color: '#D4C5A9' }}>{resolve('palmistry.payment.desc')}</p>
                <img src="/zfb-payment.png" alt="支付宝收款码" className="mx-auto rounded-lg border-2 border-gold/30" />
                <p className="text-xs" style={{ color: '#D4C5A9/50' }}>{resolve('palmistry.payment.confirm')}</p>
                <button
                  type="button"
                  onClick={() => setShowPayment(false)}
                  className="w-full rounded-md border border-gold/30 py-2 text-sm text-paper-dark/80 hover:text-gold transition-colors"
                >
                  {resolve('common.close')}
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
