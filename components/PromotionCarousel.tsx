import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
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
    <section id="hero" className="w-full max-w-[1600px] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 pt-3 sm:pt-4 pb-6 sm:pb-8">
      <div className="relative group">
        {/* Carousel Container */}
        <div className="overflow-hidden rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-[var(--border)] shadow-[4px_4px_0px_0px_var(--cartoon-shadow)] sm:shadow-[6px_6px_0px_0px_var(--cartoon-shadow)] bg-blue-600" ref={emblaRef}>
          <div className="flex">
            {/* Slide 1: Akun Premium, Harga Lebih Santai */}
            <div className="flex-[0_0_100%] min-w-0 relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-5 sm:p-8 md:p-10 lg:p-12 overflow-hidden flex items-center">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center w-full relative z-10">
                <div className="lg:col-span-7 space-y-3 sm:space-y-4 text-center lg:text-left">
                  <span className="inline-flex items-center gap-1.5 bg-amber-300 text-slate-950 font-extrabold text-[11px] sm:text-xs px-3 py-1 rounded-full border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0F172A] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" /> PROMO MINGGU INI
                  </span>

                  <h1 className="font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.15] text-white">
                    Akun Premium, <br />
                    <span className="text-amber-300 underline decoration-amber-400 decoration-wavy decoration-2">
                      Harga Lebih Santai.
                    </span>
                  </h1>

                  <p className="text-xs sm:text-base md:text-lg font-medium text-blue-100 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    Nikmati aplikasi favorit tanpa bikin dompet panik. Akses ChatGPT Plus, Gemini, Claude, Canva Pro & Streaming murah, cepat & bergaransi.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                    <button
                      onClick={() => onCtaClick('all')}
                      className="cartoon-button-accent touch-target px-5 sm:px-6 py-3 text-xs sm:text-base flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      Belanja Sekarang <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="hidden xs:flex items-center gap-2 text-xs font-bold text-amber-200 bg-blue-900/40 px-3 py-2 rounded-xl border border-blue-400/40">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>100% Bergaransi & Legal</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex justify-center items-center">
                  <CartoonAiHeroIllustration className="max-w-[240px] sm:max-w-[320px] md:max-w-[360px]" />
                </div>
              </div>
            </div>

            {/* Slide 2: ChatGPT, Gemini dan Claude Tersedia */}
            <div className="flex-[0_0_100%] min-w-0 relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-5 sm:p-8 md:p-10 lg:p-12 overflow-hidden flex items-center">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center w-full relative z-10">
                <div className="lg:col-span-7 space-y-3 sm:space-y-4 text-center lg:text-left">
                  <span className="inline-flex items-center gap-1.5 bg-indigo-300 text-indigo-950 font-extrabold text-[11px] sm:text-xs px-3 py-1 rounded-full border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0F172A] uppercase tracking-wider">
                    ⚡ AI POWER PACK
                  </span>

                  <h2 className="font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.15] text-white">
                    ChatGPT, Gemini & <br />
                    <span className="text-emerald-300">Claude Pro Tersedia</span>
                  </h2>

                  <p className="text-xs sm:text-base md:text-lg font-medium text-indigo-100 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    Pilihan akun AI premium terbaik untuk belajar, bekerja, coding, dan berkarya tanpa batasan limit.
                  </p>

                  <div className="pt-2 flex justify-center lg:justify-start">
                    <button
                      onClick={() => onCtaClick('ai')}
                      className="cartoon-button-primary bg-emerald-400 hover:bg-emerald-500 text-slate-950 touch-target px-5 sm:px-6 py-3 text-xs sm:text-base flex items-center justify-center gap-2 border-slate-900 w-full sm:w-auto"
                    >
                      Lihat Produk AI <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 flex justify-center items-center">
                  <div className="relative w-full max-w-[280px] sm:max-w-[320px] h-[180px] sm:h-[220px] flex items-center justify-center">
                    <div className="absolute top-1 left-1 cartoon-card p-3 sm:p-4 bg-emerald-400 text-slate-950 border-slate-900 rotate-[-6deg] shadow-[3px_3px_0px_0px_#0F172A]">
                      <span className="font-black text-sm sm:text-lg block">GPT-4o</span>
                      <span className="text-[10px] sm:text-xs font-extrabold">Advanced Voice</span>
                    </div>

                    <div className="absolute bottom-1 right-1 cartoon-card p-3 sm:p-4 bg-amber-400 text-slate-950 border-slate-900 rotate-[8deg] shadow-[3px_3px_0px_0px_#0F172A]">
                      <span className="font-black text-sm sm:text-lg block">Claude 3.5</span>
                      <span className="text-[10px] sm:text-xs font-extrabold">Artifacts Ready</span>
                    </div>

                    <div className="cartoon-card p-4 sm:p-5 bg-blue-500 text-white border-slate-900 shadow-[5px_5px_0px_0px_#0F172A] text-center z-10">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-2xl bg-white text-blue-600 font-black text-lg sm:text-xl flex items-center justify-center border-2 border-slate-900 mb-1 sm:mb-2">
                        🤖
                      </div>
                      <span className="font-black text-xs sm:text-base block">Gemini Advanced</span>
                      <span className="text-[10px] sm:text-xs font-bold text-blue-100">2TB Cloud Storage</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 3: Proses Cepat dan Praktis */}
            <div className="flex-[0_0_100%] min-w-0 relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-5 sm:p-8 md:p-10 lg:p-12 overflow-hidden flex items-center">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center w-full relative z-10">
                <div className="lg:col-span-7 space-y-3 sm:space-y-4 text-center lg:text-left">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-300 text-emerald-950 font-extrabold text-[11px] sm:text-xs px-3 py-1 rounded-full border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0F172A] uppercase tracking-wider">
                    ⚡ SERBA OTOMATIS
                  </span>

                  <h2 className="font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.15] text-white">
                    Proses Cepat & <br />
                    <span className="text-amber-300">Sangat Praktis</span>
                  </h2>

                  <p className="text-xs sm:text-base md:text-lg font-medium text-emerald-100 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    Pilih produk, lakukan pembayaran via QRIS/E-Wallet, lalu langsung terima detail pesananmu dalam hitungan menit.
                  </p>

                  <div className="pt-2 flex justify-center lg:justify-start">
                    <button
                      onClick={() => onCtaClick('how-it-works')}
                      className="cartoon-button-accent touch-target px-5 sm:px-6 py-3 text-xs sm:text-base flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      Cara Belanja <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 flex justify-center items-center">
                  <CartoonSpeedIllustration className="max-w-[240px] sm:max-w-[320px] md:max-w-[360px]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Button - Hidden on mobile to avoid text/CTA overlap */}
        <button
          onClick={scrollPrev}
          className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 cartoon-button-secondary touch-target p-2.5 text-[var(--foreground)] opacity-90 group-hover:opacity-100 z-20 cursor-pointer"
          aria-label="Slide sebelumnya"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next Button - Hidden on mobile to avoid text/CTA overlap */}
        <button
          onClick={scrollNext}
          className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 cartoon-button-secondary touch-target p-2.5 text-[var(--foreground)] opacity-90 group-hover:opacity-100 z-20 cursor-pointer"
          aria-label="Slide berikutnya"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel Indicators / Dots */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20 bg-slate-900/60 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
          {PROMOTION_BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`h-2.5 sm:h-3 rounded-full transition-[width,background-color] duration-200 border border-slate-900 ${
                selectedIndex === idx
                  ? 'w-6 sm:w-8 bg-amber-400'
                  : 'w-2.5 sm:w-3 bg-white/70 hover:bg-white'
              }`}
              aria-label={`Ke slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
