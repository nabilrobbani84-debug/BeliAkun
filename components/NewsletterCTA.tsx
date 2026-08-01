import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PageContainer, SectionContainer } from '@/components/patterns/page-container';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
  };

  return (
    <SectionContainer className="py-6 sm:py-8 md:py-10">
      <PageContainer>
        <Card variant="promotion" className="p-5 sm:p-8 md:p-10 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            <div className="md:col-span-7 space-y-2 text-center md:text-left">
              <Badge variant="bestseller" className="uppercase tracking-wider">
                🎁 INFO VOUCHER TERBARU
              </Badge>
              <h2 className="font-black text-xl sm:text-3xl md:text-4xl text-white leading-tight">
                Jangan Sampai Ketinggalan Promo!
              </h2>
              <p className="text-xs sm:text-sm font-medium text-blue-100 max-w-lg mx-auto md:mx-0 leading-relaxed">
                Dapatkan informasi produk baru, voucher diskon kejutan, dan penawaran spesial langsung di email kamu.
              </p>
            </div>

            <div className="md:col-span-5">
              {isSubmitted ? (
                <Card className="p-4 bg-emerald-400 text-slate-950 border-slate-900 text-center space-y-1">
                  <CheckCircle2 className="w-8 h-8 mx-auto" />
                  <h4 className="font-extrabold text-sm">Terima Kasih Telah Mendaftar!</h4>
                  <p className="text-xs font-semibold">
                    Kami akan mengirimkan voucher diskon kejutan ke email kamu.
                  </p>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Masukkan alamat email kamu..."
                      leftIcon={<Mail className="w-4 h-4" />}
                      className="bg-[var(--card)] text-[var(--foreground)]"
                    />

                    <Button
                      type="submit"
                      variant="accent"
                      className="px-5 py-3 text-xs sm:text-sm font-extrabold shrink-0 gap-1.5 w-full sm:w-auto min-h-[44px]"
                    >
                      Daftar <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-[11px] text-blue-200 font-medium text-center sm:text-left">
                    🔒 Bebas spam. Kamu bisa membatalkan langganan kapan saja.
                  </p>
                </form>
              )}
            </div>
          </div>
        </Card>
      </PageContainer>
    </SectionContainer>
  );
}
