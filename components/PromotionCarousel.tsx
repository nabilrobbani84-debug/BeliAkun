import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { CartoonAiHeroIllustration, CartoonSpeedIllustration } from '@/components/CartoonIllustrations';
import { PROMOTION_BANNERS } from '@/data/mockData';

interface PromotionCarouselProps {
  onCtaClick: (categoryTarget?: string) => void;
}

export function PromotionCarousel({ onCtaClick }: PromotionCarouselProps) {
  const [autoplay] = useState(() =>
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section id="hero" className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-8">
      <div className="relative group">
        {/* Carousel Container */}
        <div className="overflow-hidden rounded-3xl border-4 border-slate-900 shadow-[6px_6px_0px_0px_#0F172A] bg-blue-600" ref={emblaRef}>
          <div className="flex">
            {/* Slide 1: Akun Premium, Harga Lebih Santai */}
            <div className="flex-[0_0_100%] min-w-0 relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-6 sm:p-10 md:p-12 overflow-hidden flex items-center">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full relative z-10">
                <div className="md:col-span-7 space-y-4">
                  <span className="inline-flex items-center gap-1.5 bg-amber-300 text-slate-950 font-extrabold text-xs px-3 py-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" /> PROMO MINGGU INI
                  </span>

                  <h1 className="font-black text-2xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] text-white">
                    Akun Premium, <br />
                    <span className="text-amber-300 underline decoration-amber-400 decoration-wavy decoration-2">
                      Harga Lebih Santai.
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg font-medium text-blue-100 max-w-xl leading-relaxed">
                    Nikmati aplikasi favorit tanpa bikin dompet panik. Akses ChatGPT Plus, Gemini, Claude, Canva Pro & Streaming murah, cepat & bergaransi.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => onCtaClick('all')}
                      className="cartoon-button-accent px-6 py-3 text-sm sm:text-base flex items-center gap-2"
                    >
                      Belanja Sekarang <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-amber-200 bg-blue-900/40 px-3 py-2 rounded-xl border border-blue-400/40">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>100% Bergaransi & Legal</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 flex justify-center items-center">
                  <CartoonAiHeroIllustration />
                </div>
              </div>
            </div>

            {/* Slide 2: ChatGPT, Gemini dan Claude Tersedia */}
            <div className="flex-[0_0_100%] min-w-0 relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-6 sm:p-10 md:p-12 overflow-hidden flex items-center">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full relative z-10">
                <div className="md:col-span-7 space-y-4">
                  <span className="inline-flex items-center gap-1.5 bg-indigo-300 text-indigo-950 font-extrabold text-xs px-3 py-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] uppercase tracking-wider">
                    ⚡ AI POWER PACK
                  </span>

                  <h2 className="font-black text-2xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] text-white">
                    ChatGPT, Gemini & <br />
                    <span className="text-emerald-300">Claude Pro Tersedia</span>
                  </h2>

                  <p className="text-sm sm:text-base md:text-lg font-medium text-indigo-100 max-w-xl leading-relaxed">
                    Pilihan akun AI premium terbaik untuk belajar, bekerja, coding, dan berkarya tanpa batasan limit.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => onCtaClick('ai')}
                      className="cartoon-button-primary bg-emerald-400 hover:bg-emerald-500 text-slate-950 px-6 py-3 text-sm sm:text-base flex items-center gap-2 border-slate-900"
                    >
                      Lihat Produk AI <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="md:col-span-5 flex justify-center items-center">
                  {/* Vector AI Graphics */}
                  <div className="relative w-full max-w-[320px] h-[220px] flex items-center justify-center">
                    <div className="absolute top-2 left-2 cartoon-card p-4 bg-emerald-400 text-slate-950 border-slate-900 rotate-[-6deg] shadow-[4px_4px_0px_0px_#0F172A]">
                      <span className="font-black text-lg block">GPT-4o</span>
                      <span className="text-xs font-extrabold">Advanced Voice</span>
                    </div>

                    <div className="absolute bottom-2 right-2 cartoon-card p-4 bg-amber-400 text-slate-950 border-slate-900 rotate-[8deg] shadow-[4px_4px_0px_0px_#0F172A]">
                      <span className="font-black text-lg block">Claude 3.5</span>
                      <span className="text-xs font-extrabold">Artifacts Ready</span>
                    </div>

                    <div className="cartoon-card p-5 bg-blue-500 text-white border-slate-900 shadow-[6px_6px_0px_0px_#0F172A] text-center z-10">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-white text-blue-600 font-black text-xl flex items-center justify-center border-2 border-slate-900 mb-2">
                        🤖
                      </div>
                      <span className="font-black text-base block">Gemini Advanced</span>
                      <span className="text-xs font-bold text-blue-100">2TB Cloud Storage</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 3: Proses Cepat dan Praktis */}
            <div className="flex-[0_0_100%] min-w-0 relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-6 sm:p-10 md:p-12 overflow-hidden flex items-center">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full relative z-10">
                <div className="md:col-span-7 space-y-4">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-300 text-emerald-950 font-extrabold text-xs px-3 py-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0F172A] uppercase tracking-wider">
                    ⚡ SERBA OTOMATIS
                  </span>

                  <h2 className="font-black text-2xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] text-white">
                    Proses Cepat & <br />
                    <span className="text-amber-300">Sangat Praktis</span>
                  </h2>

                  <p className="text-sm sm:text-base md:text-lg font-medium text-emerald-100 max-w-xl leading-relaxed">
                    Pilih produk, lakukan pembayaran via QRIS/E-Wallet, lalu langsung terima detail pesananmu dalam hitungan menit.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => onCtaClick('how-it-works')}
                      className="cartoon-button-accent px-6 py-3 text-sm sm:text-base flex items-center gap-2"
                    >
                      Cara Belanja <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="md:col-span-5 flex justify-center items-center">
                  <CartoonSpeedIllustration />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Button */}
        <button
          onClick={scrollPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 shadow-[3px_3px_0px_0px_#0F172A] hover:bg-slate-100 active:translate-x-[1px] active:translate-y-[1px] transition-all opacity-90 group-hover:opacity-100 z-20"
          aria-label="Slide sebelumnya"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next Button */}
        <button
          onClick={scrollNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 shadow-[3px_3px_0px_0px_#0F172A] hover:bg-slate-100 active:translate-x-[1px] active:translate-y-[1px] transition-all opacity-90 group-hover:opacity-100 z-20"
          aria-label="Slide berikutnya"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel Indicators / Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-slate-900/60 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/20">
          {PROMOTION_BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`h-3 rounded-full transition-all border border-slate-900 ${
                selectedIndex === idx
                  ? 'w-8 bg-amber-400'
                  : 'w-3 bg-white/70 hover:bg-white'
              }`}
              aria-label={`Ke slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
