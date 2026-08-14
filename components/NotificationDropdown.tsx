import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle2, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface NotificationDropdownProps {
  userName?: string;
}

export function NotificationDropdown({ userName }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userName) return;

    // Fetch latest 5 orders as notifications
    const fetchNotifications = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select('id, order_number, status, created_at, grand_total')
        .eq('recipient_email', user.email)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setNotifications(data);
        // We simulate unread count by checking if any order was created in the last 24h
        const recent = data.filter(d => (new Date().getTime() - new Date(d.created_at).getTime()) < 24 * 60 * 60 * 1000);
        setUnreadCount(recent.length);
      }
    };

    fetchNotifications();
  }, [userName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'paid':
        return { icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, text: 'Pesanan telah dibayar', color: 'bg-emerald-50 border-emerald-200' };
      case 'pending_payment':
        return { icon: <Clock className="w-4 h-4 text-amber-500" />, text: 'Menunggu pembayaran', color: 'bg-amber-50 border-amber-200' };
      case 'cancelled':
        return { icon: <AlertCircle className="w-4 h-4 text-rose-500" />, text: 'Pesanan dibatalkan', color: 'bg-rose-50 border-rose-200' };
      case 'expired':
        return { icon: <AlertCircle className="w-4 h-4 text-slate-500" />, text: 'Pesanan kedaluwarsa', color: 'bg-slate-50 border-slate-200' };
      default:
        return { icon: <Bell className="w-4 h-4 text-blue-500" />, text: 'Update pesanan', color: 'bg-blue-50 border-blue-200' };
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setUnreadCount(0);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="icon"
        size="icon-sm"
        onClick={handleToggle}
        className="touch-target min-h-[38px] min-w-[38px] sm:min-h-[40px] sm:min-w-[40px] relative"
        title="Notifikasi"
        aria-label="Notifikasi"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-[var(--card)]"></span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border-2 border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 overflow-hidden cartoon-card">
          <div className="p-3 border-b-2 border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-black text-sm text-slate-900">Notifikasi</h3>
            <span className="text-xs font-bold text-blue-600 cursor-pointer" onClick={() => setUnreadCount(0)}>Tandai dibaca</span>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm font-bold">Belum ada notifikasi</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notif) => {
                  const info = getStatusInfo(notif.status);
                  return (
                    <Link href={`/pesanan/${notif.order_number}`} key={notif.id} className="block border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <div className={`p-3 border-l-4 ${info.color} flex gap-3 items-start`}>
                        <div className="shrink-0 mt-0.5">
                          {info.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-extrabold text-slate-900 truncate">
                            {info.text}
                          </p>
                          <p className="text-[11px] font-medium text-slate-600 truncate mt-0.5">
                            Pesanan #{notif.order_number} sebesar Rp{notif.grand_total.toLocaleString('id-ID')}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 mt-1">
                            {new Date(notif.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          <div className="p-2 border-t-2 border-slate-100 bg-slate-50 text-center">
            <Link href="/riwayat-pesanan" className="text-xs font-bold text-blue-600 flex items-center justify-center gap-1 hover:text-blue-700">
              Lihat semua pesanan <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
