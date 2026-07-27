import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto cartoon-card p-4 flex items-start gap-3 relative ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-slate-900'
                : toast.type === 'error'
                ? 'bg-rose-50 border-slate-900'
                : 'bg-blue-50 border-slate-900'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <div className="p-1.5 rounded-xl bg-emerald-400 text-slate-950 border border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0F172A]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              {toast.type === 'error' && (
                <div className="p-1.5 rounded-xl bg-rose-400 text-slate-950 border border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0F172A]">
                  <AlertCircle className="w-5 h-5" />
                </div>
              )}
              {toast.type === 'info' && (
                <div className="p-1.5 rounded-xl bg-blue-400 text-slate-950 border border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0F172A]">
                  <Info className="w-5 h-5" />
                </div>
              )}
            </div>

            <div className="flex-1 pr-6">
              <h4 className="font-extrabold text-sm text-slate-900">{toast.title}</h4>
              <p className="text-xs text-slate-700 mt-0.5 font-medium">{toast.message}</p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-900 p-1 rounded-lg transition-colors"
              aria-label="Tutup pemberitahuan"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
