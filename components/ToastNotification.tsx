import React from 'react';
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
    <div className="fixed bottom-4 sm:bottom-5 right-3 sm:right-5 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-1.5rem)] pointer-events-none pb-safe">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto cartoon-card p-3.5 sm:p-4 flex items-start gap-2.5 sm:gap-3 relative ${
              toast.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/90 border-[var(--border)]'
                : toast.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/90 border-[var(--border)]'
                : 'bg-blue-50 dark:bg-blue-950/90 border-[var(--border)]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <div className="p-1 sm:p-1.5 rounded-xl bg-emerald-400 text-slate-950 border border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000]">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              )}
              {toast.type === 'error' && (
                <div className="p-1 sm:p-1.5 rounded-xl bg-rose-400 text-slate-950 border border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000]">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              )}
              {toast.type === 'info' && (
                <div className="p-1 sm:p-1.5 rounded-xl bg-blue-400 text-slate-950 border border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000]">
                  <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pr-5 sm:pr-6">
              <h4 className="font-extrabold text-xs sm:text-sm text-[var(--foreground)] truncate">{toast.title}</h4>
              <p className="text-[11px] sm:text-xs text-[var(--foreground)] mt-0.5 font-medium leading-snug">{toast.message}</p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="absolute top-2.5 right-2.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded-lg transition-colors touch-target"
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
