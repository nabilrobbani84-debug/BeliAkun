import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQS } from '@/data/mockData';

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-300">
          <HelpCircle className="w-3.5 h-3.5" /> JAWABAN CEPAT
        </span>
        <h2 className="font-black text-2xl sm:text-3xl text-slate-900 mt-2">
          Pertanyaan Sering Diajukan (FAQ)
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
          Punya pertanyaan sebelum membeli? Temukan jawabannya di bawah ini.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`cartoon-card overflow-hidden transition-all ${
                isOpen ? 'bg-white border-blue-600 ring-2 ring-blue-600' : 'bg-white border-slate-900'
              }`}
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full p-4 sm:p-5 text-left font-extrabold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-3 focus:outline-none"
              >
                <span>{faq.question}</span>
                <div
                  className={`p-1.5 rounded-xl border-2 border-slate-900 transition-transform ${
                    isOpen ? 'bg-amber-400 rotate-180' : 'bg-slate-100'
                  }`}
                >
                  <ChevronDown className="w-4 h-4 text-slate-900" />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
